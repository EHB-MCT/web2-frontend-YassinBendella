document.querySelectorAll(".btn-element").forEach(e => e.onclick = buttonClick)
document.querySelectorAll(".btn-home").forEach(e => e.onclick = homePage)
document.querySelectorAll(".btn-my-list").forEach(e => e.onclick = myList)
document.querySelectorAll(".btn-previous").forEach(e => e.onclick = previousPage)
document.querySelectorAll(".btn-skip").forEach(e => e.onclick = nextPage)
let userName = ""
let dogOptions = 
{
    size: {
        min: 0,
        max: Infinity
    },
    properties: []
}

async function myList(){
    myListPage()
    let dogs = await getDogs()
    createMyListPage(dogs)
}

async function buttonClick(e){
    // these functions are used to handle the click events, but since these function also further the page's we need to do some loading
    console.log(dogOptions.properties)
    
    if (isNamePage()){
        namePage()
    }
    else if (isSizePage()){
        sizePage(e)
    }
    else if (isCharacterPage()){
        characterPage(e)
    }
    
    // these functions handle the loading see other comment
    if (isCharacterPage()){
        setCategories(categories)
    }else if (isFinalPage()){
        await finalPage()
    }
    console.log(currentPageIndex)
}

function namePage(){
    dogOptions.properties = []
    let name = document.getElementById("naam").value
    if (name != undefined && name != ""){
        userName = name;
        nextPage()
    }else{
        alert("name cannot be empty")
    }
}

function sizePage(e){
    let btnText = e.target.innerText
    disableActiveButtons()
    e.target.classList.add("btn-active")
    if (btnText === "Small"){
        dogOptions.size = {min: 0, max:40}
    }
    else if (btnText === "Medium"){
        dogOptions.size = {min: 40, max:70}
    }
    else if (btnText === "Large"){
        dogOptions.size = {min: 70, max:Infinity}
    }
    nextPage()
}

function characterPage(e){
    if (isFirstCharacterPage()){
        if (dogOptions.properties.length > 0){
            dogOptions.properties = []
        }
    }else if (isSecondCharacterPage()){
        if (dogOptions.properties.length > 1){
            dogOptions.properties = dogOptions.properties.slice(1)
        }
    }
    setCategories(categories)
    let btnText = e.target.innerText
    disableActiveButtons()
    e.target.classList.add("btn-active")
    dogOptions.properties.push(btnText)
    nextPage()
}

async function finalPage(){
    await load(dogOptions)
}


function parseHeight(height){
    let heights = height.split(" - ")
    if (heights.length == 2){
        return {min: parseInt(heights[0]), max: parseInt(heights[1]) }
    }
    else{
        return {min: parseInt(heights[0]), max: parseInt(heights[0])}
    }
}

async function load(dogOptions){
    let response = await sendRequest(dogOptions)
    console.log(response)
    filteredBreeds = response.filter(filterFunction)
    if (filteredBreeds.length > 0){
        sortedBreeds = filteredBreeds.sort((a,b) => a.sortIndex - b.sortIndex)
        bestFitbreed = sortedBreeds.shift()
        bestFitHtml(bestFitbreed)
        otherHtml(sortedBreeds)
    }
    else{
        createErrorPage()
    }
}

async function sendRequest(){
    let url = "https://api.thedogapi.com/v1/breeds"
    let response = await fetch(url,
        {
            method: 'GET',
            headers: {
                'x-api-key': '12f0f4b9-66c7-4802-b2a0-8cf9f5a13bc5' 
            }
        })
    let result = await response.json()
    return result
}

async function getDogs(){
    let url = `https://daggoe.herokuapp.com/api/dogs/${userName}`
    let response = await fetch(url)
    let result = await response.json()
    return result
}

async function insertDog(dog){
    let url = "https://daggoe.herokuapp.com/api/insert"
    let response = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
    })
    let result = await response.json()
    return result
}

async function updateDog(dog){
    let url = "https://daggoe.herokuapp.com/api/update"
    await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
    })
}

async function deleteDog(dog){
    let url = "https://daggoe.herokuapp.com/api/delete"
    let response = await fetch(url,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
    })
    let result = await response.json()
    return result
}



function filterFunction(breed){
    let dogHeight = parseHeight(breed.height.metric)
    if (dogHeight.min < dogOptions.size.min || dogHeight.max > dogOptions.size.max) return false
    if (breed.temperament == undefined) return false
    let characteristics = breed.temperament.split(",")
    let intersection = dogOptions.properties.filter(p => characteristics.includes(p))
    if (intersection.length == 0) return false
    breed.sortIndex = intersection.length
    return true
}

function bestFitHtml(breed){
    let breedNameHTML = document.getElementById("breed-name")
    let breedInfoHTML = document.getElementById("breed-info")
    let breedImgHTML = document.getElementById("breed-img")
    let breedHeight = parseHeight(breed.height.metric)
    let characteristics = breed.temperament.split(",")
    let intersection = dogOptions.properties.filter(p => characteristics.includes(p))
    breedNameHTML.innerText = breed.name
    breedInfoHTML.innerText = `${breedHeight.min}cm - ${breedHeight.max}cm / ${intersection.join(" / ")}`
    breedImgHTML.src = breed.image.url

    let saveButton = document.getElementById("btn-save-best-fit")
    saveButton.onclick = function(){
        fillModal(breed)
    }
}

function otherHtml(breeds){
    const container = document.getElementById("other")
    container.innerHTML = ""
    for (let breed of breeds){
        let hond = hondHtml(breed)
        hond.classList.add("other-dogs")
        container.appendChild(hond)
    }
}

function hondHtml(breed){
    let container = document.createElement("div")
    let img = document.createElement("img")
    let nameHtml = document.createElement("p")
    img.src = breed.image.url
    img.height = 200
    img.width = 200
    nameHtml.innerText = breed.name
    container.appendChild(img)
    container.appendChild(nameHtml)
    container.onclick = () => {fillModal(breed)}
    return container
}

function createErrorPage(){
    document.getElementById("step5").style.display = "none"
    let error = document.getElementById("error")
    error.style.display = "flex"
}

function fillModal(breed){
    document.getElementById("dogName").value = ""
    let saveButton = document.getElementById("btn-save-modal")
    saveButton.onclick = function(){
        let input = document.getElementById("dogName").value
        if (input != undefined && input != ""){
            console.log(userName)
            breed.dogName = input
            insertDog({username: userName, dog: breed})
            hideModal()
        }
    }
    const imageWidth = 250
    console.log(breed)
    let infoContainer = document.createElement("div")
    let nameHtml = document.createElement("p")
    nameHtml.innerText = breed.name
    let image = document.createElement("img")
    image.src = breed.image.url
    image.width = imageWidth
    image.heaght = (breed.image.height / breed.image.width) * imageWidth
    let breedHeight = parseHeight(breed.height.metric)
    let infoHtml = document.createElement("p")
    let characteristics = breed.temperament.split(",")
    let intersection = dogOptions.properties.filter(p => characteristics.includes(p))
    infoHtml.innerText = `${breedHeight.min}cm - ${breedHeight.max}cm / ${intersection.join(" / ")}`
    infoContainer.appendChild(image)
    infoContainer.appendChild(nameHtml)
    infoContainer.appendChild(infoHtml)
    clearModalContent()
    setModalContent(infoContainer)
    showModal()
}

function createMyListPage(dogs){
    let container = document.getElementById("dogs")
    container.innerHTML = ""
    for (let dog of dogs){
        container.appendChild(createDog(dog))
    }
}

function createDog(dog){
    let image = document.createElement("img")
    const imageWidth = 200
    image.src = dog.image.url
    image.width = imageWidth
    image.heaght = (dog.image.height / dog.image.width) * imageWidth

    let breedName = document.createElement("h3")
    breedName.innerText = dog.name

    let dogName = document.createElement("p")
    dogName.innerText = dog.dogName
    
    let container = document.createElement("div")
    container.classList = "flex flex-column"
    container.appendChild(image)
    container.appendChild(breedName)
    container.appendChild(dogName)
    container.onclick = function(){
        fillMyListModal(dog)
    }
    return container
}

function fillMyListModal(breed){
    document.getElementById("dogName").value = ""
    let saveButton = document.getElementById("btn-save-modal")
    saveButton.onclick = async function(){
        let input = document.getElementById("dogName").value
        if (input != undefined && input != ""){
            console.log(userName)
            breed.dogName = input
            await updateDog({username: userName, dog: breed})
            hideModal()
            let dogs = await getDogs()
            createMyListPage(dogs)
        }
    }
    let deleteButton = document.createElement("button")
    deleteButton.classList = "far fa-trash-alt"
    deleteButton.onclick = async function(){
        await deleteDog({dogid: breed.id, username: userName})
        hideModal()
        let dogs = await getDogs()
        createMyListPage(dogs)
    }
    deleteButton.id = "btn-delete-modal"
    const imageWidth = 250
    console.log(breed)
    let infoContainer = document.createElement("div")
    let nameHtml = document.createElement("p")
    nameHtml.innerText = breed.name
    let image = document.createElement("img")
    image.src = breed.image.url
    image.width = imageWidth
    image.heaght = (breed.image.height / breed.image.width) * imageWidth
    let breedHeight = parseHeight(breed.height.metric)
    let infoHtml = document.createElement("p")
    let characteristics = breed.temperament.split(",")
    let intersection = dogOptions.properties.filter(p => characteristics.includes(p))
    infoHtml.innerText = `${breedHeight.min}cm - ${breedHeight.max}cm / ${intersection.join(" / ")}`
    infoContainer.appendChild(image)
    infoContainer.appendChild(nameHtml)
    infoContainer.appendChild(infoHtml)
    let saveInfo = document.getElementById("saveInfo")
    deleteButton.classList.add("btn")
    clearModalContent()
    saveInfo.appendChild(deleteButton)
    setModalContent(infoContainer)
    showModal()
}
