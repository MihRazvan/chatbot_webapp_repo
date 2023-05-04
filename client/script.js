import userIcon from './assets/user.svg';
import botIcon from './assets/bot.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000000);

  return `id-${timestamp}-${randomNumber}`;
}

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text, uniqueId) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }

  }, 20)
}

function createChatStripe(isAi, value, uniqueId) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  if (isAi) wrapper.classList.add('ai');

  const chat = document.createElement('div');
  chat.classList.add('chat');

  const profile = document.createElement('div');
  profile.classList.add('profile');

  const img = document.createElement('img');
  img.setAttribute('src', isAi ? botIcon : userIcon);

  const message = document.createElement('div');
  message.classList.add('message');
  message.setAttribute('id', uniqueId);
  message.textContent = value;

  profile.appendChild(img);
  chat.appendChild(profile);
  chat.appendChild(message);
  wrapper.appendChild(chat);

  return wrapper;
}

async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe
  chatContainer.appendChild(createChatStripe(false, data.get('prompt')));

  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.appendChild(createChatStripe(true, " ", uniqueId));

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  try {
    const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = " ";

    if (response.ok) {
      const { bot } = await response.json();
      const parsedData = bot.trim();

      typeText(messageDiv, parsedData, uniqueId);
    } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }
  } catch (error) {
    console.error(error);
    messageDiv.innerHTML = "Something went wrong";
    alert(error);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});