<div class="profile">
    <span class="icon" style="background-color: {profile.color}" ><Feather icon="user" size="2rem" /></span><span class="name">{profile.name}</span>
</div>

<style>
    .profile {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }
    .icon {
        color: white;
        border-radius: 50%;
        overflow: hidden;  
        display: inline-block;
        line-height: 1;      
        padding: 0.5rem;
        margin-right: 1rem;
        height: 3rem;
    }

    .name {
        font-size: 2rem;
    }

</style>

<script lang="typescript">
    import Feather from './Feather.svelte'

    export let profile: { name: string, color: string };
</script>
