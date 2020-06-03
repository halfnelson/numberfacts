<script lang="typescript">
	import { shuffle } from './util';
	import { nav } from './nav';
	import Profile from './Profile.svelte';
	import { getStatus, updateStatus, percentFromStatus, addAttemptToStatus } from './facts';
	import { profile } from './profile'
	import { tweened } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { linear } from 'svelte/easing'
	
	import colorConvert from 'color-convert'
	import Feather from './Feather.svelte';
	import Quiz from './Quiz.svelte';

	export let facts = [];

	type State = "intro" | "practice" | "results";

	let state: State = "intro";

	let profileHue = 0;
	$: if($profile) { 
		profileHue = colorConvert.hex.hsl($profile.color)[0];
	}

	let questions = []

	function start() {
		// build the question list
		let questionCount = Math.max(facts.length, 1);
		questions = [];
		while (questions.length < questionCount) {
			questions = questions.concat(facts);
		}

		questions = shuffle(questions.slice(0, questionCount));
		state = "practice"
	}


	let prevPercents = null;
	let newPercents = null;
	let newPercent = 0;
	let prevPercent = 0;

	function showResults(attempts) {
		state="results"
		prevPercents = facts.map(f => getStatus(f, $profile.status)).map( x => percentFromStatus(x.status))
		prevPercent = prevPercents.reduce((p,c)=> p+c, 0) / prevPercents.length;
		prevPercent = Math.floor(prevPercent)
		//update the status
		for (let i = 0; i < attempts.length; i++) {
			let oldstatus = getStatus(questions[i], $profile.status)
			addAttemptToStatus(oldstatus.status, Math.ceil(attempts[i]/1000) )
			updateStatus(oldstatus, $profile.status)
		}
		profile.set($profile); //store it

		newPercents	= facts.map(f => getStatus(f, $profile.status)).map( x => percentFromStatus(x.status))
		newPercent = newPercents.reduce((p,c)=> p+c, 0) / newPercents.length;
		newPercent = Math.floor(newPercent)
	}

	

</script>

<div class="practice">
	{#if state == 'intro'}
		<div class="intro">
			<h2>Practice Mode</h2>
			<p>Try to select the correct answer before the color has drained</p>
			<button on:click={()=>start()}>Start</button>
		</div>
	{/if}
	{#if state == 'practice'}
		<Quiz profileHue={profileHue} questionList={questions} answerCount={4} onComplete={(attempts) => showResults(attempts)}  />
	{/if}
	{#if state == 'results'}
		<div class="results">
			<h2>Results</h2>
			<h5>Before - {prevPercent}%</h5>
			<div class="percent" >
				{#each facts as fact, i}
					<span class="fact" style="background-color: hsl({profileHue}, {prevPercents[i]}%, 50%)">{fact.first}x{fact.second}</span>
				{/each}
			</div>
			<h5>After - {newPercent}%</h5>
			<div class="percent">
				{#each facts as fact, i}
					<span class="fact" style="background-color: hsl({profileHue}, {newPercents[i]}%, 50%)">{fact.first}x{fact.second}</span>
				{/each}
			</div>
			<button on:click={() => nav.navigate("home")}>Done</button>
		</div>
	{/if}
</div>


<style>
	.practice {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.intro {
		text-align: center;
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
		margin-top: 3rem;
	}

	
</style>
