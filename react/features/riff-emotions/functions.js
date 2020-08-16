// eslint-disable-next-line require-jsdoc
export function getEmotionColor(emotion) {
    const colors = {
        'Anger': '#d50203cd',
        'Disgust': '#df00dfcd',
        'Fear': '#029702cd',
        'Happiness': '#fee953cd',
        'Neutral': '#c0c0c0cd',
        'Sadness': '#1101c9cd',
        'Surprise': '#008ae0cd',
        'Trust': '#54ff52cd', // added by me
        'Anticipation': '#ff7e02' // added by me
    };

    if (colors[emotion]) {
        return colors[emotion];
    }

    return 'black';
}
