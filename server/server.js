import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config() // loads environment variables from .env file

// Configuration object to pass OpenAI API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // reads API key from environment variables
});

const openai = new OpenAIApi(configuration); // instance of OpenAI API

const app = express() // creates an instance of Express application
app.use(cors()) // enables Cross-Origin Resource Sharing (CORS) for the app
app.use(express.json()) // parses incoming requests with JSON payloads

// GET route for the root endpoint
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello there!'
    })
})

// POST route for the chatbot
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt; // reads the user's prompt from the request body

        // Calls the OpenAI API to generate a completion for the prompt
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });

        // Sends the generated completion back to the client
        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
// Starts the server on port 5000 and logs a message to the console