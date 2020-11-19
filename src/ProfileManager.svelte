<div class="vert-center">
<div class="userEditor">
<h3>Users</h3>

{#each $profiles as profile} 
    <dl class="profile-list">
        <dt on:click={()=>selectUser(profile)} ><Profile profile={profile} size={4} /></dt>
    </dl>
{/each}

<button class="add-user" on:click={() => nav.navigate("add-user")}><Feather icon="user-plus" size="2rem" />New User</button>

</div>
</div>

<script>
    import Feather from './Feather.svelte';
    import { profiles, profile } from './profile';
    import Profile from './Profile.svelte';
    import { nav } from './nav'


    function selectUser(p) {
        $profile = p;
        nav.navigate("home")
    }

</script>

<style>
    .userEditor {
        align-self: center;
        text-align: center;
    }

    button.add-user {
        margin-top: 3rem;
    }
    button.add-user :global(svg) {
        vertical-align: middle;
        margin-right: 1rem;
        margin-top: -0.5rem;
    }

    .profile-list dt {
        display: flex;
        flex-direction: row;
    }


</style>