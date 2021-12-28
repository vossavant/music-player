import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentTrack: 1,
		isPlaying: false,
		playlistSize: 0
	},

	mutations: {
		loadTrack(state, n) {
			state.currentTrack = n
		},

		skipTrack(state, n) {
			state.currentTrack += n;

			if (state.currentTrack < 0) {
				state.currentTrack = 0;
			}

			if (state.currentTrack > state.playlistSize) {
				state.currentTrack = state.playlistSize
			}
		},

		setPlaylistSize(state, size) {
			state.playlistSize = size
		},

		togglePlay(state, n) {
			if (n) {
				state.isPlaying = n
			} else {
				state.isPlaying = !state.isPlaying;
			}
		}
	},
	actions: {},
	modules: {},
});
