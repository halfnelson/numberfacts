<script lang="typescript">
	import { shuffle } from "./util";
	import Feather from "./Feather.svelte";
	import { tweened } from "svelte/motion";
	import { linear } from "svelte/easing";
	import { PERFECT_TIME } from "./facts";

	export let profileHue = 10;
	export let questionList = [];
	export let answerCount = 4;
	export let onComplete: (attempts: number[]) => unknown = () => {};

	let questionCount: number;
	$: questionCount = questionList.length;

	let attempts = [];
	let questionNumber = 0;
	let question;

	function delay(msec) {
		return new Promise((resolve) => setTimeout(resolve, msec));
	}

	async function answerQuestion(ans) {
		if (answered) return;
		//get current percent
		let timeToAnswer = Date.now() - questionStart;

		answered = ans;

		let isCorrect = ans == correctAnswer;
		if (!isCorrect) {
			attempts.push(60000);
			await delay(1000);
			nextQuestion();
		}

		if (isCorrect) {
			attempts.push(timeToAnswer);
			//stop the fade to grey
			questionSaturation.update((target, current) => current, {
				delay: 0,
				duration: 0,
			});
			await delay(1000);
			nextQuestion();
		}
	}

	let questionSaturation = tweened(100, {
		delay: PERFECT_TIME * 1000,
		duration: 7000,
		easing: linear,
	});

	let answers = [];
	let questionStart;
	let correctAnswer;
	let answered = null;

	function genAnswers(question, count) {
		correctAnswer = question.first * question.second;

		let answerSet = new Set();

		let fudgeTimes = [-2, -1, 1, 2];
		let fudgeAdd = [-2, -1, 0, 1, 2];
		for (let t = 0; t < fudgeTimes.length; t++) {
			for (let a = 0; a < fudgeAdd.length; a++) {
				let wrongAnswer =
					correctAnswer +
					(Math.random() > 0.5 ? question.first : question.second) *
                    fudgeTimes[t] +
					fudgeAdd[a];

				if (wrongAnswer > 0 && wrongAnswer != correctAnswer) {
					answerSet.add(wrongAnswer);
				}
			}
		}

		let wrongAnswers = shuffle([...answerSet]).slice(0, count-1);
		let answers = shuffle([...wrongAnswers, correctAnswer]);

		return answers;
	}


	async function nextQuestion() {
		questionNumber += 1;

		if (questionNumber > questionList.length) {
			onComplete(attempts);
			return;
		}

		answered = null;
		question = questionList[questionNumber - 1];
		
		answers = genAnswers(question, answerCount);
		questionStart = Date.now();
		await questionSaturation.set(100, { delay: 0, duration: 0 });
		questionSaturation.set(0, {});
	}
	//kick it off
	nextQuestion();
</script>

<div class="question">
	<h4>Q {questionNumber}</h4>
	<h1 style="color: hsl({profileHue}, {$questionSaturation}%, 50% );">
		{question.first} x {question.second}
	</h1>
	<div class="answers" class:incorrect={answered && answered != correctAnswer}>
		{#each answers as answer}
			<div class="answer">
				<h3 class:selected={answered === answer}  on:click={() => answerQuestion(answer)} on:touchstart|preventDefault={() => answerQuestion(answer)}>{answer}</h3>
				{#if answered}
					{#if answered == answer && answer != correctAnswer}
						<span class="incorrect">
							<Feather icon="x" />
						</span>
					{/if}
					{#if answer == correctAnswer}
						<span class="correct">
							<Feather icon="check" />
						</span>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
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
		flex-wrap: wrap;
	}

	.answers > * {
		margin: auto;
	}

	.answers.incorrect {
		animation: shake 0.4s ease-in-out;
	}

	.answers h3 {
		font-size: 5rem;
		margin: 2.25rem;
		padding: 0 2rem;
		border-radius: 90%;
	}

	.answers h3.selected {
		animation: clicked 1.0s ease-out;
	}

	.answer {
		position: relative;
		flex: 1 1 25%;
	}

	.answer .correct,
	.answer .incorrect {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%) scale(1.5);
		animation: popup 0.1s ease-out;
	}

	

	.answer .correct {
		color: green;
	}

	.answer .incorrect {
		color: red;
	}

	@keyframes clicked {
		from {
			background-color: rgba(228,228,228,1)
		}
		to {
			background-color: rgba(228,228,228,0)
		}
	}

	@keyframes popup {
		from {
			transform: translate(-50%, -20%) scale(1.0);
			opacity: 0;
		}
		90% {
			transform: translate(-50%, -60%) scale(2.0);
		}
		to {
			transform: translate(-50%, -50%) scale(1.5);
			opacity: 1;
		}
	}

	@keyframes shake {
		from {
			transform: translate(0, 0);
		}
		20% {
			transform: translate(-10px,0);
		}
		40% {
			transform: translate(+10px,0);
		}
		60% {
			transform: translate(-10px,0);
		}
		80% {
			transform: translate(+10px,0);
		}
		to {
			transform: translate(0, 0);
		}
		
	}
</style>
