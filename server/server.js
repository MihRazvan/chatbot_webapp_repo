import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';


dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello there!',
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}`,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
