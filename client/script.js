import bot from './assets/bot.svg'; // imports bot icon
import user from './assets/user.svg'; // imports user icon

const form = document.querySelector('form'); // selects the form element
const chatContainer = document.querySelector('#chat_container'); // selects the chat container element

let loadInterval; // variable to store the loader interval

// Function to generate a unique ID for chat messages
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000000);

  return `id-${timestamp}-${randomNumber}`;
}

// Function to display a loader while waiting for the bot's response
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

// Function to type out text in the chat message
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
/**
 * Returns a chat stripe based on whether it's from the AI or the user
 * isAi - True if the chat stripe is from the AI, false otherwise
 * value - The text content of the chat stripe
 * uniqueId - A unique identifier for the chat stripe
 * The HTML string for the chat stripe
 */
function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}"/>
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

/**
 * Handles the form submission and the response from the AI server
 * @param {Event} e - The submit event
 */
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Add user's chatstripe to the chat container
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Add bot's chatstripe to the chat container
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Show the loader animation in the bot's chatstripe
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // Send a request to the AI server with the user's input
  const response = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  // Remove the loader animation and set the bot's chatstripe content to the response from the AI server
  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  if (response.ok) {
    // If the response is successful, type out the response from the AI server
    const data = await response.json();
    const parsedData = data.bot.trim() // Trims any trailing spaces/'\n' 

    typeText(messageDiv, parsedData, uniqueId)
  } else {
    // If the response is not successful, display an error message
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong"
    alert(err)
  }
}

// Add event listeners to the form
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})