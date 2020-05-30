<script lang="typescript">
	import { profile } from './profile'
	import { tweened } from 'svelte/motion'
	import { linear } from 'svelte/easing'
	import colorConvert from 'color-convert'
	export let facts = [];

	type State = "intro" | "practice" | "results";

	let state: State = "intro";

	function shuffle(inp) {
		// https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
		let out = inp.slice();
		for (let i=0; i < inp.length; i++) {
			let swapWith = Math.floor(Math.random() * inp.length);
			let tmp = out[swapWith]
			out[swapWith] = out[i]
			out[i] = tmp;
		}
		return out;
	}

	let profileHue = 0;
	$: if($profile) { 
		profileHue = colorConvert.hex.hsl($profile.color)[0];
	}

	let questions = []
	let attempts = []

	let questionCount =  0;
	let questionNumber = 0;

	let question;

	function start() {
		state = "practice"
		
		// build the question list
		questionCount = Math.max(facts.length, 12);
		questions = [];
		while (questions.length < questionCount) {
			questions = questions.concat(facts);
		}

		questions = shuffle(questions.slice(0, questionCount));
		
		nextQuestion()
	}

	let questionSaturation = tweened(100, {
			delay: 3000,
			duration: 7000,
			easing: linear
	} )

	let answers = []

	async function nextQuestion() {
		questionNumber += 1;
		question = questions[questionNumber]
		
		for (let j = 0; j < 4; j++) {
			answers[j] = question.first * question.second;
		}	
		for (let j = 0; j < 3; j++) {
			answers[j] = answers[j] + Math.floor(Math.random() * 24) - 10
		}
		
		answers = shuffle(answers)

		await questionSaturation.set(100, { delay: 0, duration:0 });
		questionSaturation.set(0,{});


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
		<div class="question">
			<h4>Q {questionNumber}</h4>
			<h1 style="color: hsl({profileHue}, {$questionSaturation}%, 50% );">{question.first} x {question.second}</h1>
			<div class="answers">
				{#each answers as answer}
					<h3 on:click={() => nextQuestion()}>{answer}</h3>
				{/each}
			</div>
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
	.question {
		text-align: center;
	}

	.question h1 {
		padding: 2rem 4rem;
		font-size: 10rem;
		font-weight: bold;
	}
	
	.answers {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.answers h3 {
		font-size: 5rem;
		margin: 2.5rem;
		padding: 0 2rem;
	}
	
</style>
