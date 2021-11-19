import styled from 'styled-components';
import Image from 'next/image';

const ThemedFacade = styled.div`
	// position: relative;
	flex: 2;
	height: 100%;
`;
const Background = styled.div.attrs(({ amplitude = 0 }) => ({
	style: {
		backgroundColor: `rgb(255, ${amplitude}, 86)`
	}
}))`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`;

const Number = styled.div`
	position: relative;
	margin-top: -3.5rem;
	margin-left: 0.75rem;
	font-size: 10rem;
	line-height: 1;
	z-index: 25;
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
	position: relative;
	opacity: ${({ show }) => (show ? '1.0' : '0.0')};
	${({ show }) => show && `transition: opacity 5.0s ease-out`};
	height: 60%;
	overflow-y: auto;
	z-index: 50;
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
	z-index: 100;
	visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
	pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
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

const MAX_NUM_REPLAY = 2;

export default function Facade({
	currentQuestion: { number, title },
	amplitude,
	replayTime,
	onReplayButtonClick,
	isReplayLimitReached
}) {
	return (
		<ThemedFacade>
			<Background amplitude={amplitude} />
			<Number>/{number}</Number>
			<Question show={isReplayLimitReached}>{title}</Question>
			<ReplayButton show={!isReplayLimitReached} onClick={onReplayButtonClick}>
				<Image src="/play.svg" height={100} width={100} />
				<span>{replayTime === -1 ? `play` : `replayed`}</span>
				<span>
					<sup>{replayTime + 1} time</sup>
				</span>
			</ReplayButton>
		</ThemedFacade>
	);
}
