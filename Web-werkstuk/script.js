document.querySelectorAll(".btn-element").forEach(e => e.onclick = buttonClick)
document.querySelectorAll(".btn-previous").forEach(e => e.onclick = previousPage)
document.querySelectorAll(".btn-skip").forEach(e => e.onclick = nextPage)
let dogOptions = 
{
    size: {
        min: 0,
        max: Infinity
    },
    properties: []
}

async function buttonClick(e){
    let btnText = e.target.innerText
    disableActiveButtons()
    e.target.classList.add("btn-active")
    if (currentPageIndex == 1){
        if (btnText === "Small"){
            dogOptions.size = {min: 0, max:40}
        }
        else if (btnText === "Medium"){
            dogOptions.size = {min: 40, max:70}
        }
        else if (btnText === "Large"){
            dogOptions.size = {min: 70, max:Infinity}
        }
    }
    else if (currentPageIndex == 2 || currentPageIndex == 3){
        dogOptions.properties.push(btnText)
    }
    nextPage()
    if (currentPageIndex == 4){
        await load()
    }
    else if (currentPageIndex == 2){
        if (dogOptions.properties.length > 0) dogOptions.properties = []
        setCategories(categories)
    }
    else if (currentPageIndex == 3){
        if (dogOptions.properties.length > 1){
            dogOptions.properties = dogOptions.properties.slice(1)
        }
        setCategories(categories)
    }
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
    document.getElementById("step4").style.display = "none"
    let error = document.getElementById("error")
    error.style.display = "flex"
}

function fillModal(breed){
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

