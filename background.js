require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateKeywords(instructions) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { "role": "system", "content": "You are a helpful assistant for generating YouTube search keywords. Keep it short and concise." },
      { "role": "user", "content": `Generate 3 search keywords related to "${instructions}".` }
    ]
  });

  console.log(completion.choices[0]);
  return completion.choices[0].message.content.trim().split('\n');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runAutomation") {

    var instructions = request.instructions;

    // const finalInstructions = [
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Tom and Jerry'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Mickey Mouse Clubhouse'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Paw Patrol'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    // ];

    generateKeywords(instructions)
      .then(keywords => {
        // Construct finalInstructions using generated keywords
        const finalInstructions = keywords.map(keyword => ({
          command: 'fill',
          params: ['#search.ytd-searchbox', keyword]
        })).concat({
          command: 'click',
          params: ['#search-icon-legacy']
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "execute", instructions: finalInstructions });
        });
      })
      .catch(error => {
        console.error('Error fetching OpenAI response:', error);
      });
  }
});