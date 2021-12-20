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
				<button :class="{ 'off' : !shuffleOn }" @click="toggleShuffle">
					<BaseIcon icon="shuffle" color="#000000" size="24" />
				</button>
			</li>
			<li>
				<button @click="skipPrev">
					<BaseIcon icon="skip_previous" color="#000000" size="24" />
				</button>
			</li>
			<li>
				<button @click="rewindAudio">
					<BaseIcon icon="fast_rewind" color="#000000" size="24" />
				</button>
			</li>
			<li>
				<button @click="toggleAudio">
					<BaseIcon v-if="isPlaying" icon="pause_circle_outline" color="#000000" size="36" />
					<BaseIcon v-else icon="play_circle_outline" color="#000000" size="36" />
				</button>
			</li>
			<li>
				<button @click="forwardAudio">
					<BaseIcon icon="fast_forward" color="#000000" size="24" />
				</button>
			</li>
			<li>
				<button @click="skipNext">
					<BaseIcon icon="skip_next" color="#000000" size="24" />
				</button>
			</li>
			<li>
				<button :class="{ 'off' : repeatOn === false }" @click="toggleRepeat">
					<BaseIcon v-if="repeatOn !== 'track'" icon="repeat" color="#000000" size="24" />
					<BaseIcon v-if="repeatOn === 'track'" icon="repeat_one" color="#000000" size="24" />
				</button>
				<input
					v-model="playbackTime"
					type="range"
					min="0"
					:max="audioDuration"
					id="playback-position"
					name="position"
				/>
			</li>
		</menu>
		<p id="elapsed-time">{{ elapsedTime() }}</p>
	</section>
</template>

<script>
import BaseIcon from '@/components/BaseIcon.vue';

export default {
	components: {
		BaseIcon,
	},

	data() {
		return {
			audioDuration: 100,
			audioLoaded: false,
			audioFile: "http://localhost:8080/test.flac",
			isPlaying: false,
			playbackTime: 0,
			repeatOn: false,
			shuffleOn: false,
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

		// runs every 100ms while audio is playing
		playbackListener() {
			let player = this.$refs.player;
			//Sync local 'playbackTime' var to player.currentTime and update global state
			this.playbackTime = player.currentTime;

			//console.log("update: " + player.currentTime);
			player.addEventListener("ended", this.endListener);
			player.addEventListener("pause", this.pauseListener);
		},

		pauseListener() {
			this.isPlaying = false;
			this.listenerActive = false;
			this.cleanupListeners();
		},

		rewindAudio() {
			this.playbackTime -= 10
		},

		forwardAudio() {
			this.playbackTime += 10
		},
		
		skipNext() {
			alert('skip to next...');
		},

		skipPrev() {
			alert('skip to prev...');
		},
		
		toggleRepeat() {
			if (this.repeatOn === false) {
				this.repeatOn = true
			} else if (this.repeatOn === 'track') {
				this.repeatOn = false;
			} else {
				this.repeatOn = 'track';
			}
		},
		
		toggleShuffle() {
			if (this.shuffleOn === false) {
				this.shuffleOn = true
			} else {
				this.shuffleOn = false;
			}
		},

		// when playback ends
		endListener() {
			this.isPlaying = false;
			this.listenerActive = false;
			this.cleanupListeners();
		},

		// remove listeners after audio play stops
		cleanupListeners() {
			let player = this.$refs.player;
			player.removeEventListener("freqtimeupdate", this.playbackListener);
			player.removeEventListener("ended", this.endListener);
			player.removeEventListener("pause", this.pauseListener);
		},

		toggleAudio() {
			let player = this.$refs.player;

			if (player.paused) {
				this.isPlaying = true;
				player.play();
			} else {
				this.isPlaying = false;
				player.pause();
			}
		},

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

menu {
	align-items: center;
	display: flex;

	button {
		appearance: none;
		background: transparent;
		border: 0;
		padding: 0 6px;

		&.off {
			opacity: 0.2;
		}
	}

	// seek/progress bar
	input {
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

	li:first-child {
		margin-right: 12px;
	}

	li:last-child {
		margin-left: 12px;
	}
}

section {
	align-items: center;
	display: flex;
	justify-content: space-between;
	margin-top: 24px;
	position: relative;
}

#elapsed-time {
	color: #3470A2;
	font-size: 24px;
	font-variation-settings: 'wght' 300;
	margin-right: 24px;
}
</style>