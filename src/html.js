const chatbox = document.getElementById('chatbox');
const right_arrow = document.getElementById('right-arrow');
const left_arrow = document.getElementById('left-arrow');
const input = document.getElementById('input-field');
let optionIndex = 0;
let maximumOptionIndex = 0;

function createUserMessage(message){
    createMessage(message,'message message-user', './assets/profile.png');
}

function createBotMessage(message, answerCallback){
    createMessage(message.message,'message message-bot', './assets/dog-profile.jpg');
    if (message.accept.length > 0){
        input.readOnly = true;
        createOptions(message.accept, answerCallback);
    }
}

function renderBreed(breed,currentIndex,breeds, saveCallback){
    const breedsHtml = document.getElementById('breeds');
    console.log(breed)
    const html = `
    <div class="breed">
        <div class="arrow" id="prev-dog">
            <img src="./assets/left-arrow.png" >
        </div>
        <div>
            <img src="${breed.image.url}" alt="">
            <div class="breed-info">
                <p>I present you ${breed.name}</p>
                <p>He/She is between ${breed.height.metric} cm in height, and has the following characteristics: ${breed.temperament.split(', ').slice(0,2)}</p>
            </div>
            <div class="breed-save">
                <div>
                    <label for="name">Name</label>
                    <input type="text" id="name">
                </div>
                <button id="save">Save</button>
            </div>
        </div>
        <div class="arrow" id="next-dog">
            <img src="./assets/right-arrow.png" >
        </div>
    </div>
    `
    breedsHtml.innerHTML = html;
    const prevDog = document.getElementById('prev-dog');
    prevDog.onclick = function(){
        if (currentIndex > 0){
            currentIndex--;
            renderBreed(breeds[currentIndex],currentIndex,breeds,saveCallback);
        }else{
            console.log("no more breeds to show")
        }
    };
    const nextDog = document.getElementById('next-dog');
    nextDog.onclick = function(){
        if (currentIndex < breeds.length - 1){
            currentIndex ++;
            renderBreed(breeds[currentIndex],currentIndex,breeds,saveCallback);
        }
    }
    
    const saveButton = document.getElementById('save');
    saveButton.onclick = async function(){
        const currentBreed = breeds[currentIndex];
        const nameInput = document.getElementById('name');
        const name = nameInput.value;
        console.log(`${name} - ${currentBreed.name}`);
        saveCallback(name,currentBreed);
    }
}

function createBotResponses(breeds, saveCallback){
    let breedIndex = 0;
    let breed = breeds[breedIndex];
    renderBreed(breed,0,breeds, saveCallback);
}

// [1,2,3,4,5,6,7,8,9,10,11,12] => [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]
// [0,0,0,0] => 0 -> [1,2,3]

function createGroups(array, groupSize){
    const numberOfArrays = Math.ceil(array.length / groupSize);
    return new Array(numberOfArrays).fill(0).map((e,i) => array.slice(i * groupSize, (i+1) * groupSize)).filter(array => array.length > 0);
}

function renderOptionGroup(options,answerCallback){
    const optionsHtml = document.getElementById('options');
    console.log(options)
    for (let option of options){
        const div = document.createElement('div');
        const optionHtml = document.createElement('p');
        optionHtml.innerText = option;
        div.appendChild(optionHtml);
        div.classList = 'option'
        div.onclick = function(){
            createUserMessage(option);
            clearOptions();
            document.querySelectorAll('.arrow').forEach(element => element.style.display = 'none')
            input.readOnly = false;
            answerCallback(option)
        }
        optionsHtml.appendChild(div);
    }
}

function createOptions(options, answerCallback){
    const optionGroups = createGroups(options,9);
    maximumOptionIndex = optionGroups.length - 1;
    optionIndex = 0;
    options = optionGroups[optionIndex];
    renderOptionGroup(options,answerCallback);
    if (maximumOptionIndex > 0){
        console.log('displaying arrows')
        document.querySelectorAll('.arrow').forEach(element => {
            element.style.display = 'block'
            // element.classList = 'arrow arrow-white'
        });
    }
    right_arrow.onclick = function(){
        if (optionIndex == maximumOptionIndex){
            console.log("no more options")
        }else{
            clearOptions();
            optionIndex++;
            renderOptionGroup(optionGroups[optionIndex],answerCallback);
            document.querySelectorAll('.arrow').forEach(element => element.style.display = 'block')
        }
    }
    left_arrow.onclick = function(){
        if (optionIndex == 0){
            console.log("no more options")
        }else{
            clearOptions();
            optionIndex--;
            renderOptionGroup(optionGroups[optionIndex],answerCallback);
            document.querySelectorAll('.arrow').forEach(element => element.style.display = 'block')
        }
    }
}

function createMessage(message, classlist, imgSrc){
    const div = document.createElement('div');
    const messageHtml = document.createElement('p');
    const img = document.createElement('img');
    messageHtml.innerText = message;
    div.classList = classlist;
    img.src = imgSrc
    img.classList = 'profile-img';
    div.appendChild(img);
    div.appendChild(messageHtml);

    chatbox.appendChild(div);
}

function clearOptions(){
    const optionsHtml = document.getElementById('options');
    optionsHtml.innerHTML = '';
}

function getSavedBreedNode(breed, updateCallback, deleteCallback){
    const html = `
        <div>
            <h2>${breed.dogName}</h2>
            <img src="${breed.image.url}" alt="">
            <div class="breed-info">
                <p>I present you ${breed.name}</p>
                <p>He/She is between ${breed.height.metric} cm in height, and has the following characteristics: ${breed.temperament.split(', ').slice(0,2)}</p>
            </div>
            <div class="update-info">
                <div>
                    <label>Name</label>
                    <input type="text" class="name">
                </div>
                <button class="save">Save</button>
                <button class="delete">Delete</button>
            </div>
        </div>
    `
    // const node = new DOMParser().parseFromString(html, 'text/html');
    const node = document.createElement('div');
    node.classList = 'dog-card dog-card-active';
    node.innerHTML += html;
    const saveButton = node.querySelector('.save');
    const input = node.querySelector('.name');
    const deleteButton = node.querySelector('.delete');
    saveButton.onclick = async function(){
        console.log("updating")
        if (input.value != ''){
            await updateCallback(breed,input.value);
        }
    }
    deleteButton.onclick = async function(){
        console.log("deleting")
        await deleteCallback(breed);
    }
    // saveButton.click();
    return node;
}

function renderPageOfBreeds(breeds, updateCallback,deleteCallback){
    console.log(breeds);
    let toPad = 10 - breeds.length;
    console.log(`to pad: ${toPad}`);
    const dogs = document.getElementById('dogs');
    dogs.innerHTML = '';
    for (let breed of breeds){
        const node = getSavedBreedNode(breed, updateCallback,deleteCallback);
        dogs.appendChild(node);
    }
    for (let i = 0; i<toPad; i++){
        const node = document.createElement('div');
        node.classList = 'dog-card';
        dogs.appendChild(node);
    }
}

function renderSavedBreeds(breeds, updateCallback,deleteCallback){
    console.log(breeds);
    const pagesOfBreeds = createGroups(breeds,10);
    console.log(pagesOfBreeds);
    let pageBreedIndex = 0;
    console.log(pagesOfBreeds.length)
    if (pagesOfBreeds.length > 1){
        document.querySelectorAll('.arrow').forEach(element => element.style.display = "block");
        const prev_page = document.getElementById('prev-page');
        const next_page = document.getElementById('next-page');
        prev_page.onclick = function(){
            if (pageBreedIndex > 0){
                pageBreedIndex --;
                renderPageOfBreeds(pagesOfBreeds[pageBreedIndex],updateCallback,deleteCallback);
            }
        };
        next_page.onclick = function(){
            if (pageBreedIndex < pagesOfBreeds.length - 1){
                pageBreedIndex++;
                renderPageOfBreeds(pagesOfBreeds[pageBreedIndex],updateCallback,deleteCallback);
            }
        }
        renderPageOfBreeds(pagesOfBreeds[pageBreedIndex], updateCallback, deleteCallback)
    }else{
        document.querySelectorAll('.arrow').forEach(element => element.style.display = "none");
        console.log(pagesOfBreeds[pageBreedIndex]);
        renderPageOfBreeds(pagesOfBreeds[pageBreedIndex] || [],updateCallback,deleteCallback);
    }
}

function clearMessages(){
    chatbox.innerHTML = '';
}


export {
    createBotMessage,
    createUserMessage,
    createBotResponses,
    renderSavedBreeds,
    clearMessages
}