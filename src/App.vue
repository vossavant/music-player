<!--
thanks to
https://muhammadatt.medium.com/building-an-mp3-audio-player-in-vue-js-c5884207251c
-->
<template>
	<div id="app">
		<div class="player">
			<img src="@/assets/logo.svg" alt="MusicBox logo" width="145">
			<nav>
				<h3>Music Library</h3>
				<ul>
					<li>
						<a href="#albums">Albums</a>
					</li>
					<li>
						<a href="#artists">Artists</a>
					</li>
					<li>
						<a href="#favorites">Favorites</a>
					</li>
				</ul>

				<h3>Playlists</h3>
				<ul>
					<li>
						<a href="#">Air</a>
					</li>
					<li>
						<a href="#">Another Late Night</a>
					</li>
					<li>
						<a href="#">Blues Jukebox</a>
					</li>
					<li>
						<a href="#">Code Monkey</a>
					</li>
					<li>
						<a href="#">Dinner Party</a>
					</li>
					<li>
						<a href="#">Globetrotter</a>
					</li>
				</ul>

				<button>New Playlist</button>
			</nav>

			<main>
				<header>
					<h1>Another Late Night</h1>
					<p>70 songs (5:32:14)</p>
				</header>

				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Album</th>
							<th>Last Played</th>
							<th>Duration</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>1</th>
							<td>Hard to Stay Cool</td>
							<td>Hard to Stay Cool</td>
							<td>Dec 11, 2021</td>
							<td>5:34</td>
						</tr>
					</tbody>
				</table>
			</main>

			<!-- now playing -->
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
					<img v-if="trackPicture" :src="trackPicture" :alt="trackAlbum + ' cover art'">
					<figcaption>{{ trackAlbum }}</figcaption>
				</figure>
				<header>
					<h1>{{ trackTitle }}</h1>
					<h2>{{ trackArtist }}</h2>
				</header>
			</article>
			
			<div class="player__controls">
				<button @click="toggleAudio">{{ playButtonText }}</button>
				<input
					v-model="playbackTime"
					type="range"
					min="0"
					:max="audioDuration"
					id="position"
					name="position"
				/>
				<span>{{ elapsedTime() }}</span>
				<span>{{ totalTime() }}</span>
				{{ trackType }}
			</div>
		</div>
	</div>
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
