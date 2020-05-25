<script>
	import { onMount } from 'svelte';
	import FreshInstall from './FreshInstall.svelte';

	import Nav from './Nav.svelte'
	import { profile } from './profile'
	import ProfileManager from './ProfileManager.svelte'
	import { nav } from './nav'

	onMount(() => {
		if (!$profile) {
			nav.navigate("fresh-install")
		} else {
			nav.navigate("home");
		}
	});


</script>

<Nav />
<main class="container">
	{#if $nav == "fresh-install"}
		<FreshInstall />
	{:else if $nav == "home"}
		<h1> Select an activity </h1>
	{/if}
</main>

<style>
	.container {
		max-width: 80rem;
		padding-top: 2rem;
	}
</style>