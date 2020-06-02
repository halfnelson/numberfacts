<nav class="navigation">
    <section class="container">
        <span class="nav-back-area">
        {#if $nav.page != "home"}<span transition:fly|local={{x: -100, y: 0}} class="back" on:click={() => nav.navigate("home") } ><Feather icon="chevron-left"/></span>{/if}
        </span>
       <span class="navigation-title" >Number Facts</span>
        
        <span class="navigation-item profile-nav" on:click={() => { if ($nav.page == "home") { showMenu = !showMenu } }}><ProfileNav />
            {#if showMenu}
            <div class="overlay" />
            <dl class="profile-menu">
                <dt on:click={() => { nav.navigate("edit-profile"); showMenu = false; }} >Edit Profile</dt>
                <dt on:click={() => { nav.navigate("select-profile"); showMenu = false; }} >Switch User</dt>
            </dl>
            {/if}
        <span>
    </section>
</nav>

<script>
    import ProfileNav from './ProfileNav.svelte'
    import { nav } from './nav'
    import Home from './Home.svelte';
    import Feather from './Feather.svelte';
    import { fly } from 'svelte/transition'

    let showMenu = false;
    

</script>

<style>
    .navigation .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        height: 5rem;
    }

    .navigation-title {
        flex: 1;
        font-size: 2.2rem;
    }

    .nav-back-area {
        min-width: 3rem;
        flex: 0;
    }
    .navigation-item {
        position: relative;
    }

    .back {
        display: block;
        padding: 1rem 1rem 1rem 0rem;
        margin-top: 0.5rem;
    }

    .profile-nav {
        position: relative;
    }

    .profile-menu {
        position: absolute;
        z-index: 10;
        top: 6rem;
        right: 0rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        box-shadow: 2px 2px 5px #CCC;
        background-color: white;
    }

    .profile-menu dt {
        padding: 1rem 2rem;
        white-space: nowrap;
        margin-bottom: 0;
    }

    .overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: rgba(0,0,0,0.1);
        z-index: 9;
    }

    .navigation {
        background-color: #f4f5f6;
        border-bottom: .1px solid #d1d1d1;
    }
</style>