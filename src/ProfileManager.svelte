<h3>Users</h3>
<div class="profile-add-button">
    <span class="add-icon" ><Feather icon="user-plus" /><span><span class="name">New User</span>
</div>
{#each $profiles as profile} 
    <ul class="profile-list">
        <li><Profile profile={profile} /><span class="remove-button"><Feather icon="trash" /></span></li>
    </ul>
{/each}


<script>
    import Feather from './Feather.svelte';
    import { profiles } from './profile';
    import Profile from './Profile.svelte';

</script>