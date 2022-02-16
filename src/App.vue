<!--
thanks to
https://muhammadatt.medium.com/building-an-mp3-audio-player-in-vue-js-c5884207251c
-->
<template>
	<main class="rounded--all drop-shadow">
		<div id="media-library">
			<BaseNav />
			<MainPanel @playlistTrackNumber="loadTrack($event)" />
		</div>

		<Player />
	</main>
</template>

<script>
import BaseNav from "@/components/BaseNav.vue";
import MainPanel from "@/components/MainPanel.vue";
import Player from "@/components/Player.vue";

export default {
	components: {
		BaseNav,
		MainPanel,
		Player
	}
};
</script>

<style lang="scss">
</style>
