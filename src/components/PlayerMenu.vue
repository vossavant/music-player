<template>
	<menu>
		<li>
			<button :class="{ off: !shuffleOn }" @click="toggleShuffle">
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
			<button @click="skipNext">
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

export default {
	components: {
		BaseIcon,
	},

	props: {
		isPlaying: {
			type: Boolean,
			default: false
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

	methods: {
		forwardAudio() {
			this.$emit('playbackTime', 10);
		},

		rewindAudio() {
			this.$emit('playbackTime', -10);
		},
		
		skipNext() {
			this.$emit('activeTrack', 1);
		},

		skipPrev() {
			this.$emit('activeTrack', -1);
		},

		togglePlay() {
			this.$emit('togglePlay');
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

		&.off {
			opacity: 0.2;
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