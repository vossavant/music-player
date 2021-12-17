<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		:fill="color"
		preserveAspectRatio="none"
	>
		<use :xlink:href="href"></use>
		<defs>
			<symbol id="favorite" viewBox="0 0 24 24">
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</symbol>
			<symbol id="library_music" viewBox="0 0 24 24">
				<path
					d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7.5-1c1.38 0 2.5-1.12 2.5-2.5V7h3V5h-4v5.51c-.42-.32-.93-.51-1.5-.51-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"
				/>
			</symbol>
			<symbol id="mic" viewBox="0 0 24 24">
				<path d="M12,14c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3S9,3.34,9,5v6C9,12.66,10.34,14,12,14z" />
				<path d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5H5c0,3.53,2.61,6.43,6,6.92V21h2v-3.08c3.39-0.49,6-3.39,6-6.92H17z" />
			</symbol>
			<symbol id="playlist_add" viewBox="0 0 24 24">
				<path d="M13 10H3c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm0-4H3c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm5 8v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3zM3 16h6c.55 0 1-.45 1-1s-.45-1-1-1H3c-.55 0-1 .45-1 1s.45 1 1 1z" />
			</symbol>
			<symbol id="queue_music" viewBox="0 0 24 24">
				<path d="M22,6h-5v8.18C16.69,14.07,16.35,14,16,14c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3V8h3V6z M15,6H3v2h12V6z M15,10H3v2h12 V10z M11,14H3v2h8V14z" />
			</symbol>
		</defs>
	</svg>
</template>

<script>
export default {
	name: "icon",

	props: {
		color: {
			type: String,
			default: '#000000'
		},
		icon: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default: "16",
		},
	},

	computed: {		
		href() {
			return `#${this.icon}`;
		},

		viewbox() {
			return "0 0 " + this.size + " " + this.size;
		},
	},
};
</script>