<template>
	<section id="now-playing" class="bg--white rounded--all rounded--small">
		<h1>Now Playing</h1>

		<article>
			<audio
				controls
				id="player"
				ref="player"
				preload="metadata"
				:src="playlist[activeTrack]"
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

		<PlayerMenu 
			:activeTrack="activeTrack"
			:isPlaying="isPlaying"
			:playlistSize="playlistSize"
			:repeatOn="repeatOn"
			:shuffleOn="shuffleOn"
			@activeTrack="skipTrack($event)" 
			@playbackTime="adjustPlaybackTime($event)"
			@togglePlay="togglePlay()"
			@toggleRepeat="toggleRepeat()"
			@toggleShuffle="toggleShuffle()"
		/>

		<input
			v-model="playbackTime"
			type="range"
			min="0"
			:max="audioDuration"
			id="playback-position"
			name="position"
		/>
		<p 
			@click="toggleElapsedTimeDisplay" 
			id="elapsed-time"
			title="Toggle time display" 
		>
			{{ elapsedTime() }}
		</p>
	</section>
</template>

<script>
import PlayerMenu from '@/components/PlayerMenu.vue';

export default {
	components: {
		PlayerMenu,
	},

	props: {
		activeTrack: {
			type: Number,
			default: 0
		},
	},

	data() {
		return {
			audioDuration: 0,
			audioLoaded: false,
			elapsedTimeIsCountingDown: false,
			isPlaying: false,
			playbackTime: 0,
			playlist: [
				"http://localhost:8080/test.flac",
				"http://localhost:8080/test-2.flac",
				"http://localhost:8080/test-3.flac",
			],
			repeatOn: false,
			shuffleOn: false,
			trackType: null,
			trackAlbum: null,
			trackArtist: null,
			trackTitle: null,
			trackPicture: null
		};
	},

	computed: {
		playlistSize() {
			return this.playlist.length
		}
	},

	methods: {
		initProgressBar() {
			let player = this.$refs.player;
			if (player) {
				this.audioDuration = Math.round(player.duration);
			}
		},

		getID3tags() {
			var jsmediatags = require("jsmediatags");
			let self = this;

			jsmediatags.read(this.playlist[this.activeTrack], {
				onSuccess: function (result) {
					console.log(result);
					self.trackType = result.type;
					self.trackAlbum = result.tags.album;
					self.trackArtist = result.tags.artist;
					self.trackTitle = result.tags.title;

					if (result.tags.picture) {
						const { data, format } = result.tags.picture;
						let base64String = "";
						for (let i = 0; i < data.length; i++) {
							base64String += String.fromCharCode(data[i]);
						}
						self.trackPicture = `data:${data.format};base64,${window.btoa(
							base64String
						)}`;
					} else {
						self.trackPicture = require("@/assets/missing.svg")
					}
				},
				onError: function (error) {
					console.log(":(", error.type, error.info);
				},
			});
		},

		adjustPlaybackTime(seconds) {
			this.playbackTime += seconds;
		},

		skipTrack(n) {
			console.log('track skipped... playing? ' + this.isPlaying);
			this.playbackTime = 0;
			this.activeTrack += n;

			if (this.activeTrack < 0) {
				this.activeTrack = 0;
			}

			if (this.activeTrack > (this.playlistSize - 1)) {
				this.activeTrack = this.playlistSize - 1
			}
		},

		togglePlay() {
			let player = this.$refs.player;

			if (this.isPlaying) {
				player.pause();
			} else {
				player.play();
			}
			
			this.isPlaying = !this.isPlaying;
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

		convertTimeToMinsSecs(seconds) {
			const FORMAT = (val) => `0${Math.floor(val)}`.slice(-2);
			let minutes = (seconds % 3600) / 60;

			return [minutes, seconds % 60].map(FORMAT).join(":");
		},

		elapsedTime() {
			let player = this.$refs.player;

			if (player) {
				if (this.elapsedTimeIsCountingDown) {
					return "-" + this.convertTimeToMinsSecs(player.duration - player.currentTime);
				} else {
					return this.convertTimeToMinsSecs(player.currentTime);
				}
			} else {
				return "00:00";
			}
		},

		toggleElapsedTimeDisplay() {
			this.elapsedTimeIsCountingDown = !this.elapsedTimeIsCountingDown;
		},

		playbackListener() {
			this.playbackTime = this.$refs.player.currentTime;
		},

		pauseListener() {
			console.log('playback paused');
			this.isPlaying = false;
			this.cleanupListeners();
		},

		// when playback ends
		endListener() {
			console.log('playback ended');
			this.isPlaying = false;
			this.cleanupListeners();
			player.removeEventListener("ended", this.endListener);
		},

		// remove listeners after audio play stops
		cleanupListeners() {
			let player = this.$refs.player;
			player.removeEventListener("freqtimeupdate", this.playbackListener);
			player.removeEventListener("pause", this.pauseListener);
		},

		totalTime() {
			let player = this.$refs.player;

			if (player) {
				return this.convertTimeToMinsSecs(player.duration);
			} else {
				return "00:00";
			}
		},
	},

	watch: {
		playbackTime(newValue, oldValue) {
			// update current audio position when user drags progress slider or seeks
			let player = this.$refs.player;
			let diff = Math.abs(this.playbackTime - player.currentTime);

			// throttle sync to prevent infinite loop between playback listener and this watcher
			if (diff > 0.01) {
				player.currentTime = this.playbackTime;
			}
		}
	},

	mounted: function () {
		/**
		 * nextTick code will run only after the entire view has been rendered
		 * https://vuejs.org/v2/api/#mounted
		 */
		// 
		this.$nextTick(function () {
			let player = this.$refs.player;

			player.onloadedmetadata = function() {
				console.log('>> audio meta loaded');
				this.getID3tags();
				this.initProgressBar();
			}.bind(this);

			player.oncanplay = function() {
				console.log('>> audio can play');
				this.audioLoaded = true;
				if (this.isPlaying) {
					player.play();
				}
			}.bind(this);

			player.onplay = function() {
				console.log('>> playback started');
				player.addEventListener("freqtimeupdate",this.playbackListener);
				player.addEventListener("ended", this.endListener);
				player.addEventListener("pause", this.pauseListener);
			}.bind(this);

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
	height: $albumArtWidth;
	width: $albumArtWidth;
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

section {
	align-items: center;
	display: flex;
	justify-content: space-between;
	margin-top: 24px;
	min-height: $albumArtWidth;
	position: relative;
}

#elapsed-time {
	color: #3470A2;
	cursor: pointer;
	font-size: 24px;
	font-variation-settings: 'wght' 300;
	margin-right: 24px;
}
</style>