<script lang="typescript">
import { nav } from './nav';

	import Profile from './Profile.svelte';
	import { getStatus, updateStatus, percentFromStatus, addAttemptToStatus } from './facts';
	import { profile } from './profile'
	import { tweened } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { linear } from 'svelte/easing'
	
	import colorConvert from 'color-convert'
import Feather from './Feather.svelte';
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
		questionCount = Math.max(facts.length, 1);
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
	let questionStart;
	let correctAnswer;
	let answered = null;

	async function nextQuestion() {
		questionNumber += 1;

		if (questionNumber > questions.length) {
			state = "results";
			showResults();
			return;
		}

		answered = null;
		question = questions[questionNumber-1]
		
		correctAnswer = question.first * question.second;

		let answerSet = new Set()	

		answerSet.add(correctAnswer);
		
		while (answerSet.size < 4) {
			let fudge = [-3 -2,-1, 1, 2, 3]
			let wrongAnswer = correctAnswer 
							+ (Math.random() > 0.5 ? question.first : question.second)
							* fudge[Math.floor(Math.random() * fudge.length) + 1]
		
			if (wrongAnswer > 0) {
				answerSet.add(wrongAnswer);
			}
		}
		
		answers = shuffle([...answerSet.values()])
		questionStart = Date.now()
		await questionSaturation.set(100, { delay: 0, duration:0 });
		questionSaturation.set(0,{});
	}

	let prevPercents = null;
	let newPercents = null;
	let newPercent = 0;
	let prevPercent = 0;

	function showResults() {
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

	function delay(msec) {
		return new Promise(resolve => setTimeout(resolve, msec))
	}

	async function answerQuestion(ans) {
		if (answered) return;
		//get current percent
		let timeToAnswer = Date.now() - questionStart;
		
		answered = ans;
		
		let isCorrect = ans == correctAnswer;
		if (!isCorrect) {
			attempts.push(60000);
			await delay(2000);
			nextQuestion()
		}

		if (isCorrect) {
			attempts.push(timeToAnswer);
			//stop the fade to grey
			questionSaturation.update((target, current) => current, {delay: 0, duration: 0})
			await delay(1000);
			nextQuestion()
		}
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
		<div class="question" >
			<h4>Q {questionNumber}</h4>
			<h1 style="color: hsl({profileHue}, {$questionSaturation}%, 50% );">{question.first} x {question.second}</h1>
			<div class="answers">
				{#each answers as answer}
					<div class="answer">
					<h3 on:click={() => answerQuestion(answer)}>{answer}</h3>
						{#if answered}
							{#if answered == answer && answer != correctAnswer}
								<span class="incorrect"><Feather icon="x" /></span> 
							{/if}
							{#if answer == correctAnswer}
								<span class="correct"><Feather icon="check" /></span> 
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		</div>
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
	.question {
		text-align: center;
	}

	.question h1 {
		padding: 2rem 4rem;
		font-size: 10rem;
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

	.answer {
		position: relative;
	}

	.answer .correct,
	.answer .incorrect {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%) scale(1.5);
	}

	.answer .correct {
		color: green;
	}

	.answer .incorrect {
		color: red
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
