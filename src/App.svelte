<script>
	import { onMount } from 'svelte';
	import FreshInstall from './FreshInstall.svelte';
	import Home from './Home.svelte';
	import Nav from './Nav.svelte'
	import { profile } from './profile'
	import ProfileManager from './ProfileManager.svelte'
	import { nav } from './nav'
import EditProfile from './EditProfile.svelte';

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
		<Home />
	{:else if $nav == "edit-profile"}
		<EditProfile />
	{/if}
</main>

<style>
	.container {
		max-width: 80rem;
		padding-top: 2rem;
	}
</style>