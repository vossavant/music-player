<template>
	<section class="bg--white rounded--all">
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
					<th title="Track Duration">
						<BaseIcon icon="clock" color="#3470A2" />
					</th>
				</tr>
			</thead>
			<tbody>
				<tr :class="{ current: currentTrack === 1, playing : isPlaying && currentTrack === 1 }" @click="loadTrack(1)">
					<th>
						<BaseIcon icon="bar_chart" color="#3470A2" />
						<span>1</span>
					</th>
					<td>
						<span>
							Vecchio e il bambino
						</span>
						<span>
							Carla Bruni
						</span>
					</td>
					<td>Comme si de rien n'etait</td>
					<td>Dec 11, 2021</td>
					<td>3:24</td>
				</tr>
				<tr :class="{ current: currentTrack === 2, playing : isPlaying && currentTrack === 2 }" @click="loadTrack(2)">
					<th>
						<BaseIcon icon="bar_chart" color="#3470A2" />
						<span>2</span>
					</th>
					<td>
						<span>
							Rococo
						</span>
						<span>
							Arcade Fire
						</span>
					</td>
					<td>The Suburbs</td>
					<td>Dec 11, 2021</td>
					<td>3:56</td>
				</tr>
				<tr :class="{ current: currentTrack === 3, playing : isPlaying && currentTrack === 3 }" @click="loadTrack(3)">
					<th>
						<BaseIcon icon="bar_chart" color="#3470A2" />
						<span>3</span>
					</th>
					<td>
						<span>
							Benny and the Jets
						</span>
						<span>
							Elton John
						</span>
					</td>
					<td>Greatest Hits 1970-2002 [Disc 1]</td>
					<td>Dec 11, 2021</td>
					<td>5:09</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
import BaseIcon from '@/components/BaseIcon.vue';
import { mapState } from 'vuex';

export default {
	components: {
		BaseIcon,
	},

	computed: {
		...mapState(['currentTrack', 'isPlaying'])
	},

	methods: {
		loadTrack(track) {
			this.$store.commit('loadTrack', track);
		}
	},
};
</script>

<style lang="scss" scoped>
header {
	margin-bottom: 24px;

	p {
		font-variation-settings: 'wght' 300;
	}
} 

h1 {
	font-size: 20px;
	font-variation-settings: 'wght' 800;
	line-height: normal;
	margin-bottom: 4px;
}

section {
	flex-grow: 1;
	padding: 32px;
}

table {
	border-collapse: collapse;
	width: 100%;
}

th {
	font-variation-settings: 'wght' 500;
	text-align: left;

	&:first-of-type {
		padding-left: 10px;
	}
}

tbody {
	td:first-of-type {
		span:first-child {
			display: block;
			font-variation-settings: 'wght' 600;
		}

		span:last-child {
			font-size: 10px;
			font-variation-settings: 'wght' 300;
		}
	}

	td,
	th {
		padding: 8px 0;
		transition: background 200ms ease-in-out;
		vertical-align: middle;
	}

	th {
		font-size: 14px;
		width: 45px;

		svg {
			display: none;
		}
	}

	tr {
		cursor: pointer;

		&:hover td,
		&:hover th {
			background: lighten(#E5F3FF, 3%);
		}

		&.current td,
		&.current th,
		&.playing td,
		&.playing th {
			background: #E5F3FF;
		}

		&.playing th span {
			display: none;
		}

		&.playing th svg {
			display: block;
		}
	}

	tr:first-child td,
	tr:first-child th {
		padding-top: 12px;
	}
} 

thead {
	td,
	th {
		border-bottom: 1px solid #eee;
		padding-bottom: 8px;
	}
	
	th {
		color: #3470A2;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
}
</style>