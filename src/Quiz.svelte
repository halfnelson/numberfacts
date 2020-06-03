<script lang="typescript">
	import { shuffle } from "./util";
	import Feather from "./Feather.svelte";
	import { tweened } from "svelte/motion";
	import { linear } from "svelte/easing";

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
			await delay(2000);
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
		delay: 3000,
		duration: 7000,
		easing: linear,
	});

	let answers = [];
	let questionStart;
	let correctAnswer;
	let answered = null;

	async function nextQuestion() {
		questionNumber += 1;

		if (questionNumber > questionList.length) {
			onComplete(attempts);
			return;
		}

		answered = null;
		question = questionList[questionNumber - 1];

		correctAnswer = question.first * question.second;

		let answerSet = new Set();

		answerSet.add(correctAnswer);

		let fudgeTimes = [-4, -3, -2, -1, 1, 2, 3, 4];
		let fudgeAdd = [-1, 0, 1];
		for (let t = 0; t < fudgeTimes.length; t++) {
			for (let a = 0; a < fudgeAdd.length; a++) {
				let wrongAnswer =
					correctAnswer +
					(Math.random() > 0.5 ? question.first : question.second) *
                    fudgeTimes[t] +
					fudgeAdd[a];

				if (wrongAnswer > 0) {
					answerSet.add(wrongAnswer);
				}
			}
		}

		answers = shuffle([...answerSet.values()].slice(0, answerCount));
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
	<div class="answers">
		{#each answers as answer}
			<div class="answer">
				<h3 on:click={() => answerQuestion(answer)}>{answer}</h3>
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
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
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
		color: red;
	}
</style>
