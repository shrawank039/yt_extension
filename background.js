
import OpenAI from 'openai';
import Gemini from 'gemini-api';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new Gemini({ apiKey: process.env.GEMINI_API_KEY });

import { config } from './config.js';

const openaiApiKey = config.OPENAI_API_KEY;
const geminiApiKey = config.GEMINI_API_KEY;

async function generateKeywords(instructions, model) {
  let completion;
  if (model === 'openai') {
    completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { "role": "system", "content": "You are a helpful assistant for generating YouTube search keywords. Keep it short and concise." },
        { "role": "user", "content": `Generate 3 search keywords related to "${instructions}".` }
      ]
    });
  } else if (model === 'gemini') {
    completion = await gemini.chat.completions.create({
      model: "gemini-pro",
      messages: [
        { "role": "system", "content": "You are a helpful assistant for generating YouTube search keywords. Keep it short and concise." },
        { "role": "user", "content": `Generate 3 search keywords related to "${instructions}".` }
      ]
    });
  } else {
    throw new Error(`Invalid model: ${model}`);
  }

  console.log(completion.choices[0]);
  return completion.choices[0].message.content.trim().split('\n');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runAutomation") {

    var instructions = request.instructions;
    const model = request.model || 'gemini';

    // const finalInstructions = [
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Tom and Jerry'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Mickey Mouse Clubhouse'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    //   { command: 'fill', params: ['#search.ytd-searchbox', 'Paw Patrol'] },
    //   { command: 'click', params: ['#search-icon-legacy'] },
    // ];

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //       chrome.tabs.sendMessage(tabs[0].id, { action: "execute", instructions: finalInstructions });
    //     });

    generateKeywords(instructions, model)
      .then(keywords => {
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