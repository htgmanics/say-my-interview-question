import styled from 'styled-components';

const ThemedControls = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	padding: 1rem;
	justify-self: flex-end;
	z-index: 100;
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

export default function Controls({onPrevButtonClick, onNextButtonClick}) {
	return (
		<ThemedControls>
			<PrevButton onClick={onPrevButtonClick}>\\ Prev</PrevButton>
			<NextButton onClick={onNextButtonClick}>Next //</NextButton>
		</ThemedControls>
	);
}
