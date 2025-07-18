// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Array to store conversation history
let conversationHistory = [
  { role: 'system', content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. If a user's query is unrelated to budget travel, respond by stating that you do not know.` }
];

// Add event listener to handle form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get the user's input from the form
  const userMessage = userInput.value;
  
  // Clear the input field
  userInput.value = '';
  
  // Add user message to conversation history
  conversationHistory.push({ role: 'user', content: userMessage });
  
  // Show loading message while waiting for response
  responseContainer.textContent = 'I\'M THINKING HOLD ON';
  
  // Retrieve the API key from the secrets file
  const apiKey = await (await fetch('/secrets/apiKey')).text();
  
  // Send a POST request to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', // We are POST-ing data to the API
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
    },
    // Send model details and full conversation history
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: conversationHistory,
      max_completion_tokens: 200,
      temperature: 0.7 // Set the temperature for response variability

    })
  });
  
  // Check if the response was successful
  if (!response.ok) {
    console.error('API request failed:', response.status, response.statusText);
    responseContainer.textContent = 'Sorry, I\'m having trouble connecting to the travel planning service. Please try again later.';
    return;
  }
  
  // Parse and store the response data
  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    responseContainer.textContent = 'Sorry, I received an invalid response. Please try again.';
    return;
  }
  
  // Check if the response has the expected structure
  if (!result.choices || !result.choices[0] || !result.choices[0].message) {
    console.error('Unexpected response structure:', result);
    responseContainer.textContent = 'Sorry, I received an unexpected response. Please try asking your question again.';
    return;
  }
  
  // Get the AI's response content
  const aiResponse = result.choices[0].message.content;
  
  // Add AI response to conversation history
  conversationHistory.push({ role: 'assistant', content: aiResponse });
  
  // Display the AI response on the page (preserves line breaks)
  responseContainer.textContent = aiResponse;
});