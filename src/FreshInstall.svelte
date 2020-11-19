<script lang="typescript">
	import Profile from "./Profile.svelte";
	import ProfileForm from "./ProfileForm.svelte";
	import { profile, profiles } from "./profile";
	import { nav } from "./nav";

	function addProfile({ name, color }) {
		$profile = profiles.create(name, color);
		nav.navigate("home");
	}
</script>

<div class="vert-center">
	<div>
		<h1>Welcome</h1>
		<p>Please start by creating a profile</p>
	</div>
</div>

<ProfileForm buttonText={'Create Profile'} onSave={(p) => addProfile(p)} />
