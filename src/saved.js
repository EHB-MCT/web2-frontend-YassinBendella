import { deleteDog, getDogs, updateDog } from "./backend.js";
import { renderSavedBreeds } from "./html.js";

let username = '';
const loginbutton = document.getElementById('login')
loginbutton.onclick = login;
window.onload = setup;

function setup(){
    renderSavedBreeds([]);
}

async function updateCallback(breed, newName){
    console.log("updating")
    const oldname = breed.dogName;
    breed.dogName = newName;
    await updateDog(breed,oldname,username);
    await loadDogs();
}

async function deleteCallback(breed){
    console.log("deleting");
    await deleteDog(breed,username);
    await loadDogs();
}

async function loadDogs(){
    const dogs = await getDogs(username);
    console.log(dogs)
    renderSavedBreeds(dogs, updateCallback, deleteCallback);
}

async function login(){
    const usernameinput = document.getElementById('username');
    username = usernameinput.value;
    await loadDogs();
}