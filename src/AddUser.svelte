<script lang="typescript">
	import Profile from "./Profile.svelte";
	import ProfileForm from "./ProfileForm.svelte";
	import { profile, profiles } from "./profile";
	import { nav } from "./nav";

	function addProfile({ name, color }) {
		profiles.create(name, color);
		nav.navigate("select-profile");
	}
</script>

<h1>Add New User</h1>

<ProfileForm buttonText={'Create Profile'} onSave={(p) => addProfile(p)} />
