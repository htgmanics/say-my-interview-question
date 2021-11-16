import { useRef, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import questionData from '../data/data.json';
import client from '../api/client';

const shuffledArray = (array) => array.sort(() => 0.5 - Math.random());
const Container = styled.div`background-color: #ffe156;`;

const Main = styled.main`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1rem;
	height: 100%;
	overflow: hidden;
`;
const Facade = styled.div`
	// position: relative;
	flex: 2;
	height: 100%;
`;
const Number = styled.div`
	position: relative;
	margin-top: -3.5rem;
	margin-left: 0.75rem;
	font-size: 10rem;
	line-height: 1;
	&:before {
		content: 'Question';
		position: absolute;
		top: 3rem;
		left: -1.25rem;
		font-size: 0.75rem;
		color: #333;
	}
`;
const Question = styled.h1`
	opacity: ${({ show }) => (show ? '1.0' : '0.0')};
	${({ show }) => show && `transition: opacity 5.0s ease-out`};
	height: 60%;
	overflow-y: auto;
`;
const Controls = styled.div`
	display: flex;
	width: 100%;
	padding: 1rem;
	justify-self: flex-end;
`;
const ReplayButton = styled.a`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-self: center;
	justify-content: center;
	z-index: 10;
	visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
	pointer-events: ${({ hide }) => (hide ? 'none' : 'auto')};
	span {
		font-size: 1.25rem;
		align-self: center;
		transition: all 0.3s ease-out;
		&:nth-child(2) {
			margin-top: 0.25rem;
		}
	}
	sub,
	sup {
		font-size: 0.5em;
	}
	&:active {
		> span:first-child {
			transform: scale(0.95);
		}
	}
	@media (hover: hover) {
		&:hover {
			> span:first-child {
				transform: scale(0.95);
			}
		}
		&:active {
			> span:first-child {
				transform: scale(0.90);
			}
		}
	}
`;

const ButtonBase = styled.button`
	position: absolute;
	bottom: -4rem;
	width: 30vh;
	height: 30vh;
	font-size: 2rem;
	border-radius: 50%;
	background-color: #fff;
	border: 0;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
	transform: scale(1.0);
	will-change: transform;
	transition: all 0.3s ease-in-out;
	&:active {
		background-color: #333;
		color: #fff;
		transform: scale(1.5);
	}
	@media (hover: hover) {
		&:hover {
			background-color: #333;
			color: #fff;
			transform: scale(1.5);
		}
	}
`;
const PrevButton = styled(ButtonBase)`
  left: -4rem;
`;
const NextButton = styled(ButtonBase)`
  right: -4rem;
`;

export default function Home({ questions }) {
	const audioRef = useRef();
	const [ currentIndex, setCurrentIndex ] = useState(0);
	const [ currentQuestion, setCurrentQuestion ] = useState(questions[0]);
	const [ replayTime, setReplayTime ] = useState(-1);
	const MAX_NUM_REPLAY = 3;
	// console.log(styles);
	const playAudio = (e) => {
		audioRef.current.play();
	};
	const pauseAudio = (e) => {
		audioRef.current.pause();
	};
	const stopAudio = (e) => {
		pauseAudio();
		audioRef.current.currentTime = 0;
	};
	const replayQuestion = (e) => {
		stopAudio();
		playAudio();
		setReplayTime((time) => (time < MAX_NUM_REPLAY ? time + 1 : MAX_NUM_REPLAY));
	};
	const nextQuestion = (e) => {
		setCurrentIndex((index) => (index < questions.length - 1 ? index + 1 : 0));
	};
	const prevQuestion = (e) => {
		setCurrentIndex((index) => (index > 0 ? index - 1 : questions.length - 1));
	};

	useEffect(() => {
		const appHeight = () => {
			const doc = document.documentElement;
			doc.style.setProperty('--vh', `${(window.innerHeight * 0.01).toFixed(2)}px`);
		};
		window.addEventListener('resize', appHeight);
		appHeight();

		return () => {
			window.removeEventListener('resize', appHeight);
		};
	}, []);

	useEffect(
		() => {
			pauseAudio();
			setReplayTime(-1);
			setCurrentQuestion(questions[currentIndex]);
		},
		[ currentIndex ]
	);

	useEffect(
		() => {
			playAudio();
		},
		[ currentQuestion ]
	);

	return (
		<Container>
			<Head>
				<title>Say My Interview Questions</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
				<link
					href="//fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<Main>
				<Facade>
					<Number>/{currentQuestion.number}</Number>
					<Question show={replayTime >= MAX_NUM_REPLAY}>{currentQuestion.title}</Question>
					{replayTime < MAX_NUM_REPLAY && (
						<ReplayButton hide={false} onClick={replayQuestion}>
							<Image src="/play.svg" height={100} width={100} />
							<span>{replayTime === -1 ? `play` : `replayed`}</span>
							<span>
								<sup>{replayTime + 1} time</sup>
							</span>
						</ReplayButton>
					)}
				</Facade>
				<Controls>
					<PrevButton onClick={prevQuestion}>\\ Prev</PrevButton>
					<NextButton onClick={nextQuestion}>Next //</NextButton>
				</Controls>
				{/* <audio ref={audioRef} src={`/audios/question-${currentQuestion.id}.mp3`} /> */}
				<audio ref={audioRef} src={currentQuestion.file} />
			</Main>
		</Container>
	);
}

export async function getStaticProps() {
	const query = `
		*[_type == "post"]{
			"id": _id,
			"slug": slug.current,
			"file": manuscript.asset->url,
			"title": description
		}
	`;
	const fetchedQuestions = await client.fetch(query);
	const fetchedQuestionsWithNumber = fetchedQuestions.map((q, i) => ({ ...q, number: q.slug.split('-')[1]  }));
	console.log(fetchedQuestionsWithNumber);

	return {
		props: {
			questions: shuffledArray(fetchedQuestionsWithNumber) // questionData.data)
		}
	};
}
