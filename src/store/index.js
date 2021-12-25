import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentTrack: 0,
		isPlaying: false,
		playlistSize: 0
	},

	mutations: {
		changeTrack(state, n) {
			state.currentTrack += n;

			if (state.currentTrack < 0) {
				state.currentTrack = 0;
			}

			if (state.currentTrack > (state.playlistSize - 1)) {
				state.currentTrack = state.playlistSize - 1
			}
		},

		setPlaylistSize(state, size) {
			state.playlistSize = size
		},

		togglePlay(state, n) {
			state.isPlaying = !state.isPlaying;
		}
	},
	actions: {},
	modules: {},
});
