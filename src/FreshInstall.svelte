<script>
  import Profile from "./Profile.svelte";

  let new_name = "";
  let new_color = "#777777";

  $: preview = { id: null, name: new_name || "Your Name", color: new_color };
</script>

<style>
  .preview {
    margin-left: 3rem;
  }

  .profile {
    margin: 1rem 3rem 2rem 3rem;
  }
  
</style>

<h1>Welcome</h1>
<p>Please start by creating a profile</p>

<form>
  <fieldset>
    <label for="nameField">Name</label>
    <input
      type="text"
      placeholder="Your Name"
      id="nameField"
      bind:value={new_name} />
    <label for="colorField">Icon Colour</label>
    <input type="color" bind:value={new_color} />
    <div>
        <label>Preview</label>
        <div class="profile">
          <Profile profile={preview} />
        </div>
      <input class="button-primary" type="submit" value="Create Profile" />
    </div>
  </fieldset>
</form>
