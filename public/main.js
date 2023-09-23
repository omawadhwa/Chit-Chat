const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageSentTone = new Audio("/unitone.mp3");
const messageRecievedTone = new Audio("/tritone.mp3");

messageForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    sendMessage();
});
function sendMessage(){
    if(messageInput.value=== "") return
    // console.log(messageInput.value);
    const data={
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit("message", data)
    messageSentTone.play();
    addMessageToUI(true, data);
    messageInput.value = "";
}

socket.on("chat-message", (data)=>{
    // console.log(data);
    messageRecievedTone.play();
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback();
    const element = 
    `<li class="${isOwnMessage ? "message-right":"message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name} ✔ ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`

    messageContainer.innerHTML +=element;
    scrollToBottom();
}

socket.on("clients-total", (data) => {
    clientsTotal.innerText = `People Online : ${data}`;
})

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener("focus", (event)=>{
    socket.emit("feedback", {
        feedback:`✍🏻 ${nameInput.value} is typing a message...`
    })
})
messageInput.addEventListener("keypress", (event)=>{
    socket.emit("feedback", {
        feedback:`✍🏻 ${nameInput.value} is typing a message...`
    })
})
messageInput.addEventListener("blur", (event)=>{
    socket.emit("feedback", {
        feedback: ""
    })
})

socket.on("feedback", (data)=>{
    clearFeedback();
    const element = 
    `
    <li class="message-feedback">
       <p class="feedback" id="feedback">
            ${data.feedback}
        </p>
    </li>
    `
    messageContainer.innerHTML +=element;
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(element=>{
        element.parentNode.removeChild(element)
    })
}

