<nav class="navigation">
    <section class="container">
        <span class="navigation-title">Number Facts</span>
        
        <span class="navigation-item float-right"><ProfileNav /><span>
    </section>
</nav>

<script>
    import ProfileNav from './ProfileNav.svelte'


</script>

<style>
    .navigation-title {
        display: inline;
        font-size: 1.6rem;
        line-height: 5.2rem;
        padding: 0;
        color: #606c76;
    }

    .navigation-item {
        position: relative;
    }

    .navigation {
        background-color: #f4f5f6;
        border-bottom: .1px solid #d1d1d1;
    }
</style>