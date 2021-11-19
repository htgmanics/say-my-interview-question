import React, { useEffect, useState, useCallback } from 'react';

export const useWebAudio = (audio, userTriggered) => {
	const [ amplitude, setAmplitude ] = useState(0);
	const [ audioCtx, setAudioCtx ] = useState();
	const [ source, setSource ] = useState();
	const [ analyser, setAnalyser ] = useState();

	useEffect(
		() => {
			if (!userTriggered) return;

			const newAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const newSource = newAudioCtx.createMediaElementSource(audio);
			const newAnalyser = newAudioCtx.createAnalyser();

			newAnalyser.fftSize = 64;
			newSource.connect(newAnalyser).connect(newAudioCtx.destination);

			setSource(newSource);
			setAnalyser(newAnalyser);
			setAudioCtx(newAudioCtx);

			return () => {
				if (audioCtx) {
					audioCtx.close();
					source.disconnect();
					setSource(null);
					setAnalyser(null);
					setAudioCtx(null);
				}
			};
		},
		[ userTriggered ]
	);

	const calculateAmplitude = useCallback(
		() => {
			if (!analyser) return;
			let tmpAmplitude = 0;
			let amplitudeArray = new Uint8Array(analyser.frequencyBinCount);

			analyser.getByteTimeDomainData(amplitudeArray);

			for (let i = 0; i < amplitudeArray.length; i++) {
				tmpAmplitude += amplitudeArray[i] * amplitudeArray[i];
			}

			tmpAmplitude /= amplitudeArray.length;
			tmpAmplitude = Math.sqrt(tmpAmplitude);

			setAmplitude(tmpAmplitude.toFixed(2));
		},
		[ analyser ]
	);

	return { amplitude, calculateAmplitude };
};

export default React.forwardRef(function Audio({ src }, ref) {
	return <audio ref={ref} src={src} crossOrigin="anonymous" />;
});
