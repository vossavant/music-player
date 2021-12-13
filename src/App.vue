<!--
thanks to
https://muhammadatt.medium.com/building-an-mp3-audio-player-in-vue-js-c5884207251c
-->
<template>
	<div id="app">
		<audio
			controls
			id="player"
			ref="player"
			src="https://www.ryanburney.com/assets/carla-bruni---il-vecchio-e-il-bambino.flac"
		>
			Your browser does not support the <code>audio</code> element.
		</audio>
		<button @click="toggleAudio">{{ playButtonText }}</button>

		<div id="progress-bar">
			<input
				v-model="playbackTime"
				type="range"
				min="0"
				:max="audioDuration"
				id="position"
				name="position"
			/>
			<span v-html="elapsedTime()">00:00</span>
			<span v-html="totalTime()">00:00</span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			playbackTime: 0,
			audioDuration: 100,
			audioLoaded: false,
			isPlaying: false,
			playButtonText: "Play",
		};
	},

	methods: {
		// Set the range slider max value equal to audio duration
		initSlider() {
			let audio = this.$refs.player;
			if (audio) {
				this.audioDuration = Math.round(audio.duration);
			}
		},

		//Convert audio current time from seconds to min:sec display
		convertTime(seconds) {
			const format = (val) => `0${Math.floor(val)}`.slice(-2);
			// var hours = seconds / 3600;
			var minutes = (seconds % 3600) / 60;
			return [minutes, seconds % 60].map(format).join(":");
		},

		elapsedTime() {
			var audio = this.$refs.player;
			if (audio) {
				var seconds = audio.currentTime;
				return this.convertTime(seconds);
			} else {
				return "00:00";
			}
		},

		//Playback listener function runs every 100ms while audio is playing
		playbackListener() {
			var audio = this.$refs.player;
			//Sync local 'playbackTime' var to audio.currentTime and update global state
			this.playbackTime = audio.currentTime;

			//console.log("update: " + audio.currentTime);
			//Add listeners for audio pause and audio end events
			audio.addEventListener("ended", this.endListener);
			audio.addEventListener("pause", this.pauseListener);
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
			var audio = this.$refs.player;
			audio.removeEventListener("timeupdate", this.playbackListener);
			audio.removeEventListener("ended", this.endListener);
			audio.removeEventListener("pause", this.pauseListener);
			//console.log("All cleaned up!");
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
			var audio = this.$refs.player;
			if (audio) {
				var seconds = audio.duration;
				return this.convertTime(seconds);
			} else {
				return "00:00";
			}
		},
	},

	mounted: function () {
		// nextTick code will run only after the entire view has been rendered
		this.$nextTick(function () {
			var audio = this.$refs.player;
			//Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
			// "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
			audio.addEventListener(
				"loadedmetadata",
				function () {
					this.initSlider();
				}.bind(this)
			);
			// "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
			audio.addEventListener(
				"canplay",
				function () {
					this.audioLoaded = true;
				}.bind(this)
			);
			//Wait for audio to begin play, then start playback listener function
			this.$watch("isPlaying", function () {
				if (this.isPlaying) {
					var audio = this.$refs.player;
					this.initSlider();
					//console.log("Audio playback started.");
					//prevent starting multiple listeners at the same time
					if (!this.listenerActive) {
						this.listenerActive = true;
						//for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
						audio.addEventListener(
							"timeupdate",
							this.playbackListener
						);
					}
				}
			});
			//Update current audio position when user drags progress slider
			this.$watch("playbackTime", function () {
				var audio = this.$refs.player;
				var diff = Math.abs(
					this.playbackTime - audio.currentTime
				);

				//Throttle synchronization to prevent infinite loop between playback listener and this watcher
				if (diff > 0.01) {
					audio.currentTime = this.playbackTime;
				}
			});
		});
	},
	// data() {
	// 	return {
	// 		audio: null,
	// 		circleLeft: null,
	// 		barWidth: null,
	// 		duration: null,
	// 		currentTime: null,
	// 		isTimerPlaying: false,
	// 		tracks: [
	// 			{
	// 				name: "Mekanın Sahibi",
	// 				artist: "Norm Ender",
	// 				cover: "https://upload.wikimedia.org/wikipedia/en/1/14/Comme_si_de_rien_n%27%C3%A9tait.jpg",
	// 				source: "https://www.ryanburney.com/assets/carla-bruni---il-vecchio-e-il-bambino.flac",
	// 				url: "https://www.youtube.com/watch?v=z3wAjJXbYzA",
	// 				favorited: false,
	// 			},
	// 			{
	// 				name: "Everybody Knows",
	// 				artist: "Leonard Cohen",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
	// 				url: "https://www.youtube.com/watch?v=Lin-a2lTelg",
	// 				favorited: true,
	// 			},
	// 			{
	// 				name: "Extreme Ways",
	// 				artist: "Moby",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3",
	// 				url: "https://www.youtube.com/watch?v=ICjyAe9S54c",
	// 				favorited: false,
	// 			},
	// 			{
	// 				name: "Butterflies",
	// 				artist: "Sia",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3",
	// 				url: "https://www.youtube.com/watch?v=kYgGwWYOd9Y",
	// 				favorited: false,
	// 			},
	// 			{
	// 				name: "The Final Victory",
	// 				artist: "Haggard",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/5.mp3",
	// 				url: "https://www.youtube.com/watch?v=0WlpALnQdN8",
	// 				favorited: true,
	// 			},
	// 			{
	// 				name: "Genius ft. Sia, Diplo, Labrinth",
	// 				artist: "LSD",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/6.mp3",
	// 				url: "https://www.youtube.com/watch?v=HhoATZ1Imtw",
	// 				favorited: false,
	// 			},
	// 			{
	// 				name: "The Comeback Kid",
	// 				artist: "Lindi Ortega",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3",
	// 				url: "https://www.youtube.com/watch?v=me6aoX0wCV8",
	// 				favorited: true,
	// 			},
	// 			{
	// 				name: "Overdose",
	// 				artist: "Grandson",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3",
	// 				url: "https://www.youtube.com/watch?v=00-Rl3Jlx-o",
	// 				favorited: false,
	// 			},
	// 			{
	// 				name: "Rag'n'Bone Man",
	// 				artist: "Human",
	// 				cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg",
	// 				source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/9.mp3",
	// 				url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
	// 				favorited: false,
	// 			},
	// 		],
	// 		currentTrack: null,
	// 		currentTrackIndex: 0,
	// 		transitionName: null,
	// 	};
	// },
	// methods: {
	// 	play() {
	// 		if (this.audio.paused) {
	// 			this.audio.play();
	// 			this.isTimerPlaying = true;
	// 		} else {
	// 			this.audio.pause();
	// 			this.isTimerPlaying = false;
	// 		}
	// 	},
	// 	generateTime() {
	// 		let width = (100 / this.audio.duration) * this.audio.currentTime;
	// 		this.barWidth = width + "%";
	// 		this.circleLeft = width + "%";
	// 		let durmin = Math.floor(this.audio.duration / 60);
	// 		let dursec = Math.floor(this.audio.duration - durmin * 60);
	// 		let curmin = Math.floor(this.audio.currentTime / 60);
	// 		let cursec = Math.floor(this.audio.currentTime - curmin * 60);
	// 		if (durmin < 10) {
	// 			durmin = "0" + durmin;
	// 		}
	// 		if (dursec < 10) {
	// 			dursec = "0" + dursec;
	// 		}
	// 		if (curmin < 10) {
	// 			curmin = "0" + curmin;
	// 		}
	// 		if (cursec < 10) {
	// 			cursec = "0" + cursec;
	// 		}
	// 		this.duration = durmin + ":" + dursec;
	// 		this.currentTime = curmin + ":" + cursec;
	// 	},
	// 	updateBar(x) {
	// 		let progress = this.$refs.progress;
	// 		let maxduration = this.audio.duration;
	// 		let position = x - progress.offsetLeft;
	// 		let percentage = (100 * position) / progress.offsetWidth;
	// 		if (percentage > 100) {
	// 			percentage = 100;
	// 		}
	// 		if (percentage < 0) {
	// 			percentage = 0;
	// 		}
	// 		this.barWidth = percentage + "%";
	// 		this.circleLeft = percentage + "%";
	// 		this.audio.currentTime = (maxduration * percentage) / 100;
	// 		this.audio.play();
	// 	},
	// 	clickProgress(e) {
	// 		this.isTimerPlaying = true;
	// 		this.audio.pause();
	// 		this.updateBar(e.pageX);
	// 	},
	// 	prevTrack() {
	// 		this.transitionName = "scale-in";
	// 		this.isShowCover = false;
	// 		if (this.currentTrackIndex > 0) {
	// 			this.currentTrackIndex--;
	// 		} else {
	// 			this.currentTrackIndex = this.tracks.length - 1;
	// 		}
	// 		this.currentTrack = this.tracks[this.currentTrackIndex];
	// 		this.resetPlayer();
	// 	},
	// 	nextTrack() {
	// 		this.transitionName = "scale-out";
	// 		this.isShowCover = false;
	// 		if (this.currentTrackIndex < this.tracks.length - 1) {
	// 			this.currentTrackIndex++;
	// 		} else {
	// 			this.currentTrackIndex = 0;
	// 		}
	// 		this.currentTrack = this.tracks[this.currentTrackIndex];
	// 		this.resetPlayer();
	// 	},
	// 	resetPlayer() {
	// 		this.barWidth = 0;
	// 		this.circleLeft = 0;
	// 		this.audio.currentTime = 0;
	// 		this.audio.src = this.currentTrack.source;
	// 		setTimeout(() => {
	// 			if (this.isTimerPlaying) {
	// 				this.audio.play();
	// 			} else {
	// 				this.audio.pause();
	// 			}
	// 		}, 300);
	// 	},
	// 	favorite() {
	// 		this.tracks[this.currentTrackIndex].favorited =
	// 			!this.tracks[this.currentTrackIndex].favorited;
	// 	},
	// },
	// created() {
	// 	let vm = this;
	// 	this.currentTrack = this.tracks[0];
	// 	this.audio = new Audio();
	// 	this.audio.src = this.currentTrack.source;
	// 	this.audio.ontimeupdate = function () {
	// 		vm.generateTime();
	// 	};
	// 	this.audio.onloadedmetadata = function () {
	// 		vm.generateTime();
	// 	};
	// 	this.audio.onended = function () {
	// 		vm.nextTrack();
	// 		this.isTimerPlaying = true;
	// 	};
	// 	// this is optional (for preload covers)
	// 	for (let index = 0; index < this.tracks.length; index++) {
	// 		const element = this.tracks[index];
	// 		let link = document.createElement("link");
	// 		link.rel = "prefetch";
	// 		link.href = element.cover;
	// 		link.as = "image";
	// 		document.head.appendChild(link);
	// 	}
	// },
};
</script>

<style lang="scss">
</style>
