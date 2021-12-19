<template>
	<section id="now-playing" class="bg--white rounded--all rounded--small">
		<h1>Now Playing</h1>

		<article>
			<audio
				controls
				id="player"
				ref="player"
				preload="metadata"
				:src="audioFile"
			>
				Your browser does not support the <code>audio</code> element.
			</audio>
			<figure>
				<img
					class="rounded--small"
					v-if="trackPicture"
					:src="trackPicture"
					:alt="trackAlbum + ' cover art'"
				/>
				<figcaption>{{ trackAlbum }}</figcaption>
			</figure>
			<header>
				<h2>{{ trackTitle }}</h2>
				<h3>{{ trackArtist }}</h3>
			</header>
		</article>

		<menu>
			<li>
				<button @click="toggleAudio">{{ playButtonText }}</button>
			</li>
			<li>
				<input
					v-model="playbackTime"
					type="range"
					min="0"
					:max="audioDuration"
					id="playback-position"
					name="position"
				/>
			</li>
			<li>
				<span>{{ elapsedTime() }}</span>
				<span>{{ totalTime() }}</span>
			</li>
		</menu>
	</section>
</template>

<script>
export default {
	data() {
		return {
			audioDuration: 100,
			audioLoaded: false,
			audioFile: "http://localhost:8080/test.flac",
			isPlaying: false,
			playbackTime: 0,
			playButtonText: "Play",
			trackType: null,
			trackAlbum: null,
			trackArtist: null,
			trackTitle: null,
			trackPicture: null
		};
	},

	methods: {
		// Set the range slider max value equal to audio duration
		initSlider() {
			let player = this.$refs.player;
			if (player) {
				this.audioDuration = Math.round(player.duration);
			}
		},

		getID3tags() {
			var jsmediatags = require("jsmediatags");
			let self = this;

			jsmediatags.read(this.audioFile, {
				onSuccess: function (result) {
					console.log(result);
					self.trackType = result.type;
					self.trackAlbum = result.tags.album;
					self.trackArtist = result.tags.artist;
					self.trackTitle = result.tags.title;

					const { data, format } = result.tags.picture;
					let base64String = "";
					for (let i = 0; i < data.length; i++) {
						base64String += String.fromCharCode(data[i]);
					}
					self.trackPicture = `data:${data.format};base64,${window.btoa(
						base64String
					)}`;
				},
				onError: function (error) {
					console.log(":(", error.type, error.info);
				},
			});

			// new jsmediatags.Reader("http://localhost:8081/test.flac")
			// 	.setTagsToRead(["title", "artist"])
			// 	.read({
			// 		onSuccess: function (tag) {
			// 			console.log(tag);
			// 		},
			// 		onError: function (error) {
			// 			console.log(":(", error.type, error.info);
			// 		},
			// 	});
		},

		//Convert audio current time from seconds to min:sec display
		convertTime(seconds) {
			const FORMAT = (val) => `0${Math.floor(val)}`.slice(-2);
			let minutes = (seconds % 3600) / 60;

			return [minutes, seconds % 60].map(FORMAT).join(":");
		},

		elapsedTime() {
			let player = this.$refs.player;

			if (player) {
				return this.convertTime(player.currentTime);
			} else {
				return "00:00";
			}
		},

		//Playback listener function runs every 100ms while audio is playing
		playbackListener() {
			let player = this.$refs.player;
			//Sync local 'playbackTime' var to player.currentTime and update global state
			this.playbackTime = player.currentTime;

			//console.log("update: " + player.currentTime);
			//Add listeners for audio pause and audio end events
			player.addEventListener("ended", this.endListener);
			player.addEventListener("pause", this.pauseListener);
		},

		//Function to run when audio is paused by user
		pauseListener() {
			this.isPlaying = false;
			this.listenerActive = false;
			this.cleanupListeners();
		},

		//Function to run when audio play reaches the end of file
		endListener() {
			this.isPlaying = false;
			this.listenerActive = false;
			this.cleanupListeners();
		},

		//Remove listeners after audio play stops
		cleanupListeners() {
			let player = this.$refs.player;
			player.removeEventListener("freqtimeupdate", this.playbackListener);
			player.removeEventListener("ended", this.endListener);
			player.removeEventListener("pause", this.pauseListener);
		},

		toggleAudio() {
			// let player = document.getElementById('player');
			let player = this.$refs.player;

			if (player.paused) {
				this.playButtonText = "Pause";
				this.isPlaying = true;
				player.play();
			} else {
				this.playButtonText = "Play";
				this.isPlaying = false;
				player.pause();
			}
		},

		//Show the total duration of audio file
		totalTime() {
			let player = this.$refs.player;

			if (player) {
				return this.convertTime(player.duration);
			} else {
				return "00:00";
			}
		},
	},

	mounted: function () {
		// nextTick code will run only after the entire view has been rendered
		this.$nextTick(function () {
			var player = this.$refs.player;
			//Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
			// "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
			player.addEventListener(
				"loadedmetadata",
				function () {
					this.getID3tags();
					this.initSlider();
				}.bind(this)
			);
			// "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
			player.addEventListener(
				"canplay",
				function () {
					this.audioLoaded = true;
				}.bind(this)
			);

			//Wait for audio to begin play, then start playback listener function
			this.$watch("isPlaying", function () {
				if (this.isPlaying) {
					let player = this.$refs.player;
					this.initSlider();
					//console.log("Audio playback started.");
					//prevent starting multiple listeners at the same time
					if (!this.listenerActive) {
						this.listenerActive = true;
						player.addEventListener(
							"freqtimeupdate",
							this.playbackListener
						);
					}
				}
			});
			//Update current audio position when user drags progress slider
			this.$watch("playbackTime", function () {
				let player = this.$refs.player;
				let diff = Math.abs(this.playbackTime - player.currentTime);

				//Throttle synchronization to prevent infinite loop between playback listener and this watcher
				if (diff > 0.01) {
					player.currentTime = this.playbackTime;
				}
			});
		});
	},
};
</script>

<style lang="scss" scoped>
$albumArtWidth: 72px;

article {
	align-items: center;
	display: flex;

	header {
		margin-left: 24px;
	}
}

h1 {
	display: none;
}

h2 {
	font-size: 14px;
	font-variation-settings: 'wght' 700;
	line-height: normal;
}

h3 {
	font-variation-settings: 'wght' 300;
	line-height: normal;
}

img {
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	width: $albumArtWidth;
}

menu input {
	appearance: none;
	background: transparent;
	height: 9px;
	left: $albumArtWidth;
	margin: 0;
	position: absolute;
	right: 0;
	top: -3px;
	width: calc(100% - #{$albumArtWidth});

	&::-moz-range-thumb {
		background: #3470A2;
		border: 0;
		border-radius: 50%;
		cursor: col-resize;
		height: 9px;
		width: 9px;
	}

	&::-moz-range-track {
		background: #e5e5e5;
	}

	&::-moz-range-progress {
		background: #3470A2;
	}
}

section {
	align-items: center;
	display: flex;
	margin-top: 24px;
	position: relative;
}
</style>