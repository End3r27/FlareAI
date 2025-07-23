// Basic sentiment analysis (a very simplified example)
const positiveWords = ['happy', 'joy', 'good', 'great', 'love', 'like'];
const negativeWords = ['sad', 'angry', 'bad', 'hate', 'dislike'];

function getEmotion(text) {
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    for (const word of words) {
        if (positiveWords.includes(word)) {
            score++;
        } else if (negativeWords.includes(word)) {
            score--;
        }
    }

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

module.exports = { getEmotion };
