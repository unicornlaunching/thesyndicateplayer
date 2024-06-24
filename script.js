document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');

    let audioContext;
    let analyser;
    let source;
    let bufferLength;
    let dataArray;

    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = 'Pause';
                console.log('Audio is playing');
                if (!audioContext) {
                    initAudioContext();
                }
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            audio.pause();
            playBtn.textContent = 'Play';
            console.log('Audio is paused');
        }
    });

    function initAudioContext() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            console.log('Audio context initialized');
            drawVisualizer();
        } catch (error) {
            console.error('Error initializing audio context:', error);
        }
    }

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const red = barHeight + 25 * (i / bufferLength);
            const green = 250 * (i / bufferLength);
            const blue = 50;
            canvasCtx.fillStyle = `rgb(${red},${green},${blue})`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    }

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
