// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Retrieve the API key from the secrets file
const apiKey = await (await fetch('/secrets/apiKey')).text();

async function main() {
  // Send a POST request to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', // We are POST-ing data to the API
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
    },
    // Send model details and system message
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: 'What are some cheap ways to travel around Europe?'}
      ]
    })
  });
  // Parse and store the response data
  const result = await response.json();
  // Log result to the console
  console.log(result.choices[0].message.content);
};