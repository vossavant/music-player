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
				<tr @click="loadTrack(0)">
					<th>1</th>
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
				<tr @click="loadTrack(1)">
					<th>2</th>
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
				<tr @click="loadTrack(2)">
					<th>3</th>
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
export default {
	components: {
		BaseIcon,
	},

	methods: {
		loadTrack(track) {
			this.$emit('playlistTrackNumber', track);
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
		vertical-align: middle;
	}

	th {
		font-size: 14px;
	}

	tr {
		cursor: pointer;

		&:hover td,
		&:hover th {
			background: #E5F3FF;
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