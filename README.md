# AiBuddy - AI Chatbot Web App

## Video Demo:  <URL HERE>

### Description:
This is a simple AI chatbot web app that uses OpenAI API to generate AI responses to user prompts. The app is built with HTML, CSS, and JavaScript and is deployed using Netlify.

#### Prerequisites
To run this app locally, you will need the following:

Node.js
NPM
OpenAI API key

#### Installation
To install and run the app locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/MihRazvan/chatbot_webapp_repo.git
```

2. Navigate to the project directory:
```
cd chatbot_webapp_repo
```

3. Install the required dependencies:
```
npm install
```

4. Set your OpenAI API key as an environment variable:
```
export OPENAI_API_KEY=<your_openai_api_key>
```

5. Start the server:
```
cd server
npm run server
cd ..
cd client
npm run dev
```
6. Open the app in your web browser at http://localhost:5000.

#### Usage
To use the app, simply type a prompt in the input field and hit Enter or click the Submit button. The app will send the prompt to the OpenAI API and display the AI response in the chat window.

#### Code description
The client-side script script.js is responsible for the chat interface and the communication with the server-side script server.js, which implements the chatbot's functionality using the OpenAI API.

The script.js file does the following:

Imports two image files (bot.svg and user.svg) that are used as avatars for the bot and the user.
Selects the form and #chat_container elements from the HTML document.
Defines two helper functions:
generateUniqueId(): generates a unique ID for chat messages.
loader(): displays a loader animation in the bot's chat stripe while waiting for a response from the server.
Defines the chatStripe() function, which generates the HTML markup for a chat stripe.
Defines the handleSubmit() function, which handles the form submission event and communicates with the server to get the bot's response to the user's prompt.
Adds event listeners to the form for submit and keyup events.
The server.js file does the following:

Imports the necessary modules and initializes the OpenAI API with the API key stored in the .env file.
Creates an instance of an Express application, sets up CORS, and parses incoming requests with JSON payloads.
Defines a GET route for the root endpoint that sends a simple JSON message as a response.
Defines a POST route for the chatbot that reads the user's prompt from the request body, sends it to the OpenAI API to generate a completion, and sends the generated completion back to the client as a JSON response. If an error occurs, it logs the error to the console and sends an error response back to the client.


