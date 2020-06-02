<script>
	import { onMount } from "svelte";
	import FreshInstall from "./FreshInstall.svelte";
	import Home from "./Home.svelte";
	import Nav from "./Nav.svelte";
	import { profile } from "./profile";
	import ProfileManager from "./ProfileManager.svelte";
	import { nav } from "./nav";
	import EditProfile from "./EditProfile.svelte";
	import Practice from "./Practice.svelte";

	import { fly } from "svelte/transition";
	import AddUser from "./AddUser.svelte";

	onMount(() => {
		if (!$profile) {
			nav.navigate("fresh-install");
		} else {
			nav.navigate("home");
		}
	});
</script>

<div class="root">
	<Nav />
	<main >
		{#each [$nav.page] as _ ($nav.page)}
			<div class="wrap" transition:fly={{ x: -200, y: 0 }}>
				<div class="page container">
					{#if $nav.page == 'fresh-install'}
						<FreshInstall />
					{:else if $nav.page == 'home'}
						<Home />
					{:else if $nav.page == 'edit-profile'}
						<EditProfile />
					{:else if $nav.page == 'practice'}
						<Practice {...$nav.props} />
					{:else if $nav.page == 'select-profile'}
						<ProfileManager />
					{:else if $nav.page == 'add-user'}
						<AddUser />
					{/if}
				</div>
			</div>
		{/each}
	</main>
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		user-select: none;
	}
	.container {
		max-width: 80rem;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: safe center;
		align-content: safe center;
	}

	main {
		width: 100%;
		height: 100%;
		flex: 1;
		position:relative;
		overflow: auto;
	}

	.wrap {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}
</style>
