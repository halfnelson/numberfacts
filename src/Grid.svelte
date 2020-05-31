<script lang="typescript">
	import { percentFromStatus, factFor } from "./facts";

	import { profile } from "./profile";
	import convert from "color-convert";
	import { allFacts, getStatus } from "./facts";

	$: status = $profile.status;

	$: color_hsl = convert.hex.hsl($profile.color);

	type Fact = {
		first: number;
		second: number;
	};

	export let selected: Fact[] = [];

	let selected_groups = [];

	function findSelected(selected, first, second) {
		return selected.find((s) => s.first == first && s.second == second);
	}

	function toggleSelected(first, second) {
		let existing = findSelected(selected, first, second);
		if (!existing) {
			selected.push({ first, second });
			selected = selected;
		} else {
			selected = selected.filter((s) => s != existing);
		}
	}

	function toggleGroup(num) {
		if (selected_groups.includes(num)) {
			selected_groups = selected_groups.filter((s) => s != num);
			for (let j = 1; j <= 12; j++) {
				let current =
					j < num
						? findSelected(selected, num, j)
						: findSelected(selected, j, num);
				if (current) {
					if (!selected_groups.includes(j)) {
						selected = selected.filter((s) => s != current);
					}
				}
			}
		} else {
			selected_groups.push(num);
			selected_groups = selected_groups;
			for (let j = 1; j <= 12; j++) {
				let current =
					j < num
						? findSelected(selected, num, j)
						: findSelected(selected, j, num);
				if (!current) {
					selected.push(
						j < num
							? { first: num, second: j }
							: { first: j, second: num }
					);
				}
			}
			selected = selected;
		}
	}

	function saturationFromStatus(status) {
		return percentFromStatus(status);
	}
</script>


	<div class="status-grid" style="--profile-color: {$profile.color}">
		{#each allFacts as fact}
				<div
					class="status-item"
					class:selected={findSelected(selected, fact.first, fact.second )}
					on:click={() => toggleSelected(fact.first, fact.second)}
					style="grid-column: {fact.second}; grid-row: {fact.first};
					background-color: hsl({color_hsl[0]}, {saturationFromStatus(getStatus(fact, $profile.status).status)}%,
					50% )">
					{fact.first}x{fact.second}
				</div>
		{/each}
		{#each Array(12).fill(0) as _, i}
			<div
				class="set-item"
				class:selected={selected_groups.includes(i + 1)}
				on:click={() => toggleGroup(i + 1)}
				style="grid-column: {i + 1}; grid-row: {13};">
				{i + 1}x
			</div>
		{/each}
	</div>


<style>
	.status-grid {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-rows: 1fr;
		grid-gap: 0.5rem;
	}
	.status-item {
		text-align: center;
		color: white;
		padding: 0 0.4rem;
	}

	.set-item {
		border: 1px solid #777;
		text-align: center;
	}

	.status-item.selected {
		background-color: #333 !important;
	}

	.set-item.selected {
		background-color: #333;
		color: white;
	}
</style>
