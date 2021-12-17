<template>
	<nav>
		<a href="#">
			<img src="@/assets/logo.svg" alt="MusicBox logo" width="145" />
		</a>

		<h3>Music Library</h3>
		
		<ul>
			<li>
				<a href="#albums">
					<BaseIcon icon="library_music" color="#3470A2" />
					<span>Albums</span>
				</a>
			</li>
			<li>
				<a href="#artists">
					<BaseIcon icon="mic" color="#3470A2" />
					<span>Artists</span>
				</a>
			</li>
			<li>
				<a href="#favorites">
					<BaseIcon icon="favorite" color="#3470A2" />
					<span>Favorites</span>
				</a>
			</li>
		</ul>

		<h3>Playlists</h3>
		
		<ul>
			<li>
				<a href="#">
					<BaseIcon icon="queue_music" color="#3470A2" />
					<span>Air</span>
				</a>
			</li>
			<li>
				<a href="#">
					<BaseIcon icon="queue_music" color="#3470A2" />
					<span>Another Late Night</span>
				</a>
			</li>
			<li>
				<a href="#">
					<BaseIcon icon="queue_music" color="#3470A2" />
					<span>Blues Jukebox</span>
				</a>
			</li>
			<li>
				<a href="#">
					<BaseIcon icon="queue_music" color="#3470A2" />
					<span>Code Monkey</span>
				</a>
			</li>
			<li>
				<a href="#">
					<BaseIcon icon="queue_music" color="#3470A2" />
					<span>Dinner Party</span>
				</a>
			</li>
		</ul>

		<BaseButton icon="playlist_add">New Playlist</BaseButton>
	</nav>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';

export default {
	components: {
		BaseButton,
		BaseIcon,
	},
};
</script>

<style lang="scss" scoped>

nav {
	margin-right: 24px;
	width: 168px;

	h3 {
		color: #3470A2;
		font-weight: 600;
		margin: 32px 0 8px;
	}

	svg {
		margin-right: 8px;
	}

	ul a {
		align-items: center;
		display: flex;
		line-height: 32px;
		padding: 0 10px;

		&:hover {
			background: white;
			border-radius: 8px;
		}
	}
}
</style>