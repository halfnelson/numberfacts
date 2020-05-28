<script lang="typescript">
import Profile from "./Profile.svelte";
import convert from 'color-convert'
import Feather from "./Feather.svelte";

export let name;
export let color;
export let buttonText = 'Save Profile'

export let onSave: (newval: {color: string, name: string}) => void  = () => {}

let hues = new Array(32).fill(0).map((_,i) => Math.floor((i/32) * 360));


$: new_name = name;
$: new_hue = Math.floor(convert.hex.hsl(color)[0] / 32) * 32
$: new_color = "#"+convert.hsl.hex(new_hue, 100, 50); 
$: preview = { id: null, name: new_name || "Your Name", color: new_color };

</script>
<style>
  .preview {
    margin-left: 3rem;
  }

  .profile {
    margin: 1rem 3rem 2rem 3rem;
  }

  .color-picker {
      display: grid;
      grid-template-columns: repeat(16, 3rem);
      grid-auto-rows: 3rem;
      margin-bottom: 1rem;
      grid-gap:0.2rem;
  }

  .color {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
  }

</style>



  <fieldset>
    <label for="nameField">Name</label>
    <input
      type="text"
      placeholder="Your Name"
      id="nameField"
      bind:value={new_name} />
    <label for="colorField">Colour</label>
    <div class="color-picker">
        {#each hues as hue}
            <div class="color" on:click={()=> new_hue = hue}  style="background-color: hsl({hue}, 100%, 50%)">
                {#if hue == new_hue}
                    <Feather icon={"check"} />
                {/if}
            </div>
        {/each}
    </div>
    <div>
        <label>Preview</label>
        <div class="profile">
          <Profile profile={preview} />
        </div>
      <input class="button-primary" type="submit" value="{buttonText}" on:click={() => onSave({ name: new_name, color: new_color})}/>
    </div>
  </fieldset>
