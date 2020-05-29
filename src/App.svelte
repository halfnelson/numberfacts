<script>
	import { onMount } from 'svelte';
	import FreshInstall from './FreshInstall.svelte';
	import Home from './Home.svelte';
	import Nav from './Nav.svelte'
	import { profile } from './profile'
	import ProfileManager from './ProfileManager.svelte'
	import { nav } from './nav'
	import EditProfile from './EditProfile.svelte';
	import Practice from './Practice.svelte';

	onMount(() => {
		if (!$profile) {
			nav.navigate("fresh-install")
		} else {
			nav.navigate("home");
		}
	});


</script>
<div class="root">
	<Nav />
	<main class="container">
		
		{#if $nav.page == "fresh-install"}
			<FreshInstall />
		{:else if $nav.page == "home"}
			<Home />
		{:else if $nav.page == "edit-profile"}
			<EditProfile />
		{:else if $nav.page == "practice"}
			<Practice {...$nav.props} />
		{/if}

	</main>
</div>
<style>

	.root {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.container {
		max-width: 80rem;
	}

	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>