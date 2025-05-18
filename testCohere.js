require('dotenv').config();
const axios = require('axios');

const testSummarize = async () => {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: `Artificial Intelligence (AI) is not just a buzzword — it's a transformative force across industries.
From healthcare to agriculture, AI is helping automate mundane tasks, analyze large datasets quickly,
and even make decisions that traditionally required human expertise. In the medical field, for example,
AI algorithms assist doctors in diagnosing diseases more accurately and quickly. In education,
personalized learning platforms adapt in real-time to each student's needs. AI also plays a critical role
in climate modeling, helping scientists better understand and predict environmental changes.
While its benefits are massive, concerns like data privacy, job displacement, and algorithmic bias
must be addressed to ensure ethical use. Overall, AI promises a smarter, more efficient, and
interconnected future if used responsibly.`,

        length: 'short',
        format: 'paragraph',
        model: 'summarize-xlarge'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("✅ API Key is working. Summary:");
    console.log(response.data.summary);
  } catch (error) {
    console.error("❌ API Key test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data.message || error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testSummarize();
