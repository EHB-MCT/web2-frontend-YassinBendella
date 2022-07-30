import { getMatchingBreeds, getCategories } from './api.js';
import { insertDog } from './backend.js';
import { createBotMessage, createUserMessage, createBotResponses, clearMessages } from './html.js'

const sendButton = document.getElementById('send');
const inputField = document.getElementById('input-field');
window.onload = setup;
sendButton.onclick = sendMessage

let categories = [];
let botMessages = []
let messageIndex = 0;

async function setup(){
    categories = await getCategories();
    messageIndex = 0;
    botMessages = [
        {
            id: 'name',
            message: 'What is your  name ? *WOOF*',
            accept: [],
            answer: ''
        },
        {
            id: 'size',
            message: 'What size do you prefer ?',
            accept: ['small','medium','large'],
            answer: ''
        },
        {
            id: 'characteristic',
            message: 'What first characteristic does your dog have ?',
            accept: categories,
            answer: ''
        },
        {
            id: 'characteristic',
            message: 'What second characteristic does your dog have ? *WOOF*',
            accept: categories,
            answer: ''
        },
    ]
    createBotMessage(botMessages[messageIndex],answerCallback);
}

function answerCallback(answer){
    botMessages[messageIndex].answer = answer;
    nextBotMessage();
}

function nextBotMessage(){
    if (messageIndex == botMessages.length - 1){
        handleRequest();
    }else{
        messageIndex += 1;
        createBotMessage(botMessages[messageIndex],answerCallback);
    }
}

async function handleRequest(){
    let name = botMessages.filter(element => element.id == 'name').map(element => element.answer)[0];
    let size = botMessages.filter(element => element.id == 'size').map(element => element.answer)[0];
    let characteristics = botMessages.filter(element => element.id == 'characteristic').map(element => element.answer);
    const matchingBreeds = await getMatchingBreeds({
        size,
        characteristics
    });
    showMatchingBreeds(matchingBreeds,name);
}


function showMatchingBreeds(breeds,username){
    createBotMessage({message: "I'm looking for the best match *WOOF*", accept: []});
    if (breeds.length == 0){
        createBotMessage({
            message: "*WOOF* (angry), looks like I couldn't find you any friends, maybe try again with other options",
            accept: ["retry"]
        },(answer) =>{
            if (answer == 'retry'){
                clearMessages();
                setup();
            }
        })
    }else{
        createBotResponses(breeds,addDog)
    }

    async function addDog(dogname,breed){
        breed.dogName = dogname;
        await insertDog(breed,username);
    }
}

function sendMessage(){
    const message = inputField.value
    if (valid(message)){
        createUserMessage(message);
        inputField.value = ''
        botMessages[messageIndex].answer = message;
        nextBotMessage();
    }else {
        createBotMessage({message: 'Sorry I didn\'t quite understand that, could you repeat that for me please ?', accept: []});
    }
}

function valid(message){
    return message != '';
}