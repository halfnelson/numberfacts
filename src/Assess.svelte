<script lang="typescript">
	import { shuffle } from './util';
	import { nav } from './nav';
	import Profile from './Profile.svelte';
	import { getStatus, updateStatus, percentFromStatus, addAttemptToStatus, allFacts, percentFromTime } from './facts';
	import { profile } from './profile'
	import { tweened } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { linear } from 'svelte/easing'
	
	import colorConvert from 'color-convert'
	import Feather from './Feather.svelte';
	import Quiz from './Quiz.svelte';


	type State = "intro" | "assess" | "results";

	let state: State = "intro";
    let facts = allFacts.slice();
    let profileHue = 0;
    
   	$: if($profile) { 
		profileHue = colorConvert.hex.hsl($profile.color)[0];
	}

	let questions = []

	function start() {
		questions = shuffle(facts);
		state = "assess"
	}

    let newPercents = new Map();
	let newPercent = 0;

    let streak = 0;
    let previousResults = [];
	function showResults(attempts) {
        state="results"
        let results = $profile.lastResults ?? [];
        previousResults = results.slice();
		//update the status
		for (let i = 0; i < attempts.length; i++) {
			let oldstatus = getStatus(questions[i], $profile.status)
			addAttemptToStatus(oldstatus.status, Math.ceil(attempts[i]/1000) )
			updateStatus(oldstatus, $profile.status)
		}
		
        questions.map((q,i) => newPercents.set(q, percentFromTime(attempts[i]/1000)));
        newPercent = attempts.reduce((p, c) => p + percentFromTime(c/1000), 0) / questions.length;
        newPercent = Math.floor(newPercent * 10)/10;
        results.push(newPercent);
        $profile.lastResults = results.slice(-3);
        profile.set($profile); //store it

        for (let j = 0; j < $profile.lastResults.length; j++) {
            if ($profile.lastResults[j] != 100) break;
            streak++;
        }
	}

</script>

<div class="assess">
	{#if state == 'intro'}
		<div class="intro">
			<h2>Assessment</h2>
			<p>Try to get all the answers correct before the color starts to fade</p>
			<button on:click={()=>start()}>Start</button>
		</div>
	{/if}
	{#if state == 'assess'}
		<Quiz profileHue={profileHue} questionList={questions} answerCount={8} onComplete={(attempts) => showResults(attempts)}  />
	{/if}
	{#if state == 'results'}
		<div class="results">
			<h1>{newPercent}%</h1>
            {#if newPercent == 100}
                <h3>😎 Perfect!</h3>
            {/if}
            {#if newPercent > 95 && newPercent < 100}
                <h3>😲 Almost Had It!</h3>
            {/if}
            {#if newPercent > 90 && newPercent <= 95}
                <h3>😻 Great!</h3>
            {/if}
            {#if newPercent <= 90}
                <h3>😥 Keep practising!</h3>
            {/if}

			<div class="percent">
				{#each facts as fact}
					<span class="fact" style="background-color: hsl({profileHue}, {newPercents.get(fact)}%, 50%)">{fact.first}x{fact.second}</span>
				{/each}
			</div>
            {#if previousResults.length > 0}
            <div class="previous">
                <h5>Previous results</h5>
                <div class="previous-result-items">
                    {#each previousResults as result}
                        <span>{result}%</span>
                    {/each}
                </div>
            </div>
            {/if}

			<button on:click={() => nav.navigate("home")}>Home</button>
		</div>
	{/if}
</div>


<style>
	.assess {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.intro {
		text-align: center;
	}

    .previous {
        text-align: center;
    }
    .previous-result-items {
        text-align: center;
        font-size: 2.5rem;
    }

    .previous-result-items > * {
        margin: 1rem;
    }
    
    .results {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
	}

	.results h5 {
		margin-top: 2rem;
		margin-bottom: 0.5rem;
	}
	.percent {
		text-align: center;
	}

	.percent .fact {
		display: inline-block;
		padding: 0.1rem;
		color: white;
		width: 5.5rem;
		text-align: center;
		margin: 0.2rem;
	}

	.results button {
		margin-top: 1.5rem;
	}

	
</style>
