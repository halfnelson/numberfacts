<script lang="typescript">
    import ProfileForm from './ProfileForm.svelte'
    import { profile } from './profile'
    import { nav } from './nav'

function saveProfile(p) {
    profile.set({...$profile, name: p.name, color: p.color})
    nav.navigate("home");
}

</script>


<h1>Edit Profile</h1>
<ProfileForm name={$profile.name} color={$profile.color} onSave={p => saveProfile(p)} />