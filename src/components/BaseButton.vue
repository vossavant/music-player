<template>
	<button
		class="button"
		:class="btnClass"
		type="button"
	>
		<BaseIcon v-if="icon" :icon="icon" color="#ffffff" />
		<span>
			<slot></slot>
		</span>
	</button>
</template>

<script>
import BaseIcon from "@/components/BaseIcon.vue";

export default {
	components: {
		BaseIcon,
	},

	props: {
		btnClass: {
			type: String,
		},

		icon: {
			type: String,
		}
	},
};
</script>

<style lang="scss" scoped>
.button {
	align-items: center;
	background: #3470a2;
	border: 0;
	border-radius: 8px;
	color: white;
	cursor: pointer;
	display: flex;
	font: 600 12px Mulish, sans-serif;
	height: 32px;
	justify-content: center;
	width: 100%;

	&.state {
		display: flex;
		justify-content: center;
		padding: 8px 0;

		&.success {
			box-shadow: none;
			cursor: not-allowed;
			min-width: 0;
			padding: 8px;
		}

		// &.waiting span {
		// 	animation: spin 1.3s linear infinite;
		// 	background-image: url("../assets/waiting.svg");
		// }

		// &.success span {
		// 	background-image: url("../assets/checkmark.svg");
		// }

		span {
			background-position: center !important;
			background-repeat: no-repeat !important;
			display: inline-block;
			height: 0;
			overflow: hidden;
			padding-top: 24px;
			width: 24px;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
}
</style>