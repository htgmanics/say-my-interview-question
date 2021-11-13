import { useRef, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import questionData from '../data/data.json';

const shuffledArray = (array) => array.sort(() => 0.5 - Math.random());
const Container = styled.div`
  background-color: #ffe156;
`;

const Main = styled.main`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1rem;
	height: 100vh;
	overflow-y: auto;
	overflow: hidden;
`;
const Facade = styled.div`
	position: relative;
	flex: 2;
`;
const Number = styled.div`
	margin-top: -3rem;
	font-size: 10rem;
	line-height: 1;
`;
const Question = styled.h1`
	opacity: ${({ show }) => (show ? '1.0' : '0.0')};
	${({ show }) => show && `transition: opacity 5.0s ease-out`};
	max-height: 60%;
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
	margin-top: 3rem;
	bottom: 25%;
	left: 50%;
	transform: translate(-50%, 0%);
	display: flex;
	flex-direction: column;
	align-self: center;
	justify-content: center;
	z-index: 10;
	span {
		font-size: 1.25rem;
		align-self: center;
    transition: all 0.3s ease-out;
	}
	sup {
		font-size: 0.5em;
	}
  &:hover {
		> span:first-child {
			transform: rotate(60deg);
		}
	}
`;

const ButtonBase = styled.button`
	position: absolute;
	bottom: -5rem;
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
	&:hover {
		transform: scale(1.5);
	}
	&:focus {
		background-color: #333;
		color: #fff;
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
	const [ replayTime, setReplayTime ] = useState(0);
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
		setReplayTime((time) => time + 1);
	};
	const nextQuestion = (e) => {
		setCurrentIndex((index) => (index < questions.length - 1 ? index + 1 : 0));
	};
	const prevQuestion = (e) => {
		setCurrentIndex((index) => (index > 0 ? index - 1 : questions.length - 1));
	};

	useEffect(
		() => {
			pauseAudio();
			setReplayTime(0);
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
					href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<Main>
				<Facade>
					<Number>/{currentQuestion.id}</Number>
					<Question show={replayTime > 3}>{currentQuestion.title}</Question>
					<ReplayButton onClick={replayQuestion}>
						<Image src="/replay.svg" height={125} width={125} />
						<span>
							<sup>{replayTime}</sup>replay?
						</span>
					</ReplayButton>
				</Facade>
				<Controls>
					<PrevButton onClick={prevQuestion}>\\ Prev</PrevButton>
					<NextButton onClick={nextQuestion}>Next //</NextButton>
				</Controls>
				<audio ref={audioRef} src={`/audios/question-${currentQuestion.id}.mp3`} />
			</Main>
		</Container>
	);
}

export async function getStaticProps() {
	return {
		props: {
			questions: shuffledArray(questionData.data)
		}
	};
}
