<template>
	<menu>
		<li>
			<button :class="{ off: !shuffleOn }" @click="toggleShuffle">
				<BaseIcon icon="shuffle" color="#000000" size="24" />
			</button>
		</li>
		<li>
			<button :disabled="isFirstTrack" @click="skipPrev">
				<BaseIcon icon="skip_previous" color="#000000" size="24" />
			</button>
		</li>
		<li>
			<button @click="rewindAudio">
				<BaseIcon icon="fast_rewind" color="#000000" size="24" />
			</button>
		</li>
		<li>
			<button @click="togglePlay">
				<BaseIcon
					v-if="isPlaying"
					icon="pause_circle_outline"
					color="#000000"
					size="36"
				/>
				<BaseIcon
					v-else
					icon="play_circle_outline"
					color="#000000"
					size="36"
				/>
			</button>
		</li>
		<li>
			<button @click="forwardAudio">
				<BaseIcon icon="fast_forward" color="#000000" size="24" />
			</button>
		</li>
		<li>
			<button :disabled="isLastTrack && repeatOn !== true" @click="skipNext">
				<BaseIcon icon="skip_next" color="#000000" size="24" />
			</button>
		</li>
		<li>
			<button :class="{ off: repeatOn === false }" @click="toggleRepeat">
				<BaseIcon
					v-if="repeatOn !== 'track'"
					icon="repeat"
					color="#000000"
					size="24"
				/>
				<BaseIcon
					v-if="repeatOn === 'track'"
					icon="repeat_one"
					color="#000000"
					size="24"
				/>
			</button>
		</li>
	</menu>
</template>

<script>
import BaseIcon from '@/components/BaseIcon.vue';
import { mapState } from 'vuex';

export default {
	components: {
		BaseIcon,
	},

	props: {
		playbackTime: {
			type: [Number, String],
			default: 0
		},

		repeatOn: {
			type: [Boolean, String],
			default: false
		},

		shuffleOn: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {

		}
	},

	computed: {
		...mapState(['currentTrack', 'isPlaying', 'playlistSize']),

		isFirstTrack() {
			return this.currentTrack === 1
		},

		isLastTrack() {
			return this.playlistSize - this.currentTrack === 0
		}
	},

	methods: {
		forwardAudio() {
			this.$emit('playbackTime', 10);
		},

		rewindAudio() {
			this.$emit('playbackTime', -10);
		},
		
		skipNext() {
			this.$store.commit("skipTrack", 1);
			this.$emit('trackSkipped');
		},

		skipPrev() {
			// double tap to skip to prev track if current track has played for at least 1 second
			if (this.playbackTime > 1) {
				this.$emit('playbackTime', -10000);
			} else {
				this.$store.commit("skipTrack", -1);
				this.$emit('trackSkipped');
			}
		},

		togglePlay() {
			this.$store.commit("togglePlay");
		},
		
		toggleRepeat() {
			this.$emit('toggleRepeat');
		},
		
		toggleShuffle() {
			this.$emit('toggleShuffle');
		},
	},
};
</script>

<style lang="scss" scoped>
$albumArtWidth: 72px;

menu {
	align-items: center;
	display: flex;
	left: 50%;
	margin-left: -144px;
	position: absolute;

	button {
		appearance: none;
		background: transparent;
		border: 0;
		padding: 0 6px;

		&:disabled,
		&.off {
			opacity: 0.2;
		}

		&:disabled {
			cursor: not-allowed;
		}
	}

	li:first-child {
		margin-right: 12px;
	}

	li:last-child {
		margin-left: 12px;
	}
}
</style>