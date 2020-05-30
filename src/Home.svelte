<script>
	import Grid from "./Grid.svelte";
	import { nav } from "./nav";
	let want_test = false;
	let selected = [];
	function startPractice() {
		let practice_set = selected;
		if (practice_set.length == 0) {
		}

		nav.navigate("practice", { facts: practice_set });
	}
</script>

<div class="vert-center">
	<h1>Select Facts to Study</h1>
	<Grid bind:selected />

	<div class="practice">
		<button on:click={() => startPractice()}>Start practice</button>
		<button class="button-outline">Assess Me!</button>
	</div>
</div>

<style>


	.practice {
		margin-top: 2rem;
		text-align: center;
	}

	.vert-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
