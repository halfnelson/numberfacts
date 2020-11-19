<script lang="typescript">
	import ProfileForm from "./ProfileForm.svelte";
	import type { Profile } from "./profile";
	import { profile, profiles } from "./profile";
	import { nav } from "./nav";

	function saveProfile(p: Partial<Profile>) {
		profile.set({ ...$profile, name: p.name, color: p.color });
		profiles.update($profile);
		nav.navigate("home");
	}

	function deleteProfile() {
		if (
			confirm(
				"Are you sure you wish to remove the profile: " + $profile.name
			)
		) {
			profiles.remove($profile);
			console.log("removing profile", $profiles);
			if ($profiles.length > 0) {
				profile.set($profiles[0]);
				nav.navigate("select-profile");
			} else {
				nav.navigate("fresh-install");
			}
		}
	}
</script>

<div class="vert-center">
	<div>
		<h1>Edit Profile</h1>
		<ProfileForm
			name={$profile.name}
			color={$profile.color}
			onSave={(p) => saveProfile(p)}
			onDelete={() => deleteProfile()} />
	</div>
</div>
