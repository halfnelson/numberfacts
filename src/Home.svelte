<script>import App from "./App.svelte";

	import Grid from "./Grid.svelte";
	import { allFacts, getStatus, percentFromStatus } from './facts'
	import { nav } from "./nav";
	import { profile } from './profile'

	let want_test = false;
	let selected = [];
	function startPractice() {
		let practice_set = selected;
		if (practice_set.length == 0) {
			let perf = allFacts.map(f => getStatus(f, $profile.status))
			perf.sort((a,b) => {
				let astatus =percentFromStatus(a.status);
				let bstatus = percentFromStatus(b.status);
				if (astatus == bstatus) return 0;
				return astatus > bstatus ? 1 : -1;
			});
			practice_set = perf.map(x=>x.fact).slice(0, 12);
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
