let categories = []
getAllCategories()
document.querySelectorAll(".input").forEach(e => e.oninput = search)
async function getAllCategories(){
    categories = []
    let result = await sendRequest()
    for (let breed of result){
        if (breed.temperament){
            categories = categories.concat(breed.temperament.split(", "))
        }
    }
    categories = categories.filter((e,index) => categories.indexOf(e) == index)
    categories.map(e => e.trim())
    setCategories(categories)
}

function search(e){
    let input = e.target.value
    let matches = categories.filter(e => e.toLowerCase().indexOf(input.toLowerCase()) !== -1)
    setCategories(matches)
}

function clearPreviousCategories(){
    let currentPage = document.getElementById(`step${currentPageIndex}`)
    if (currentPage){
        let characteristics = currentPage.getElementsByClassName("characteristics")[0]
        if (characteristics){
            let rows = characteristics.getElementsByClassName("buttons")
            for (let row of rows){
                row.innerHTML = ""
            }
        }
    }
}

function getRow(){
    let currentPage = document.getElementById(`step${currentPageIndex}`)
    if (currentPage){
        let characteristics = currentPage.getElementsByClassName("characteristics")[0]
        if (characteristics){
            let rows = characteristics.getElementsByClassName("buttons")
            for (let row of rows){
                if (row.children.length < 3) return row
            }
        }
    }
}

function createButton(match){
    let button = document.createElement("button")
    button.classList = "btn btn-element"
    button.innerText = match
    button.onclick = buttonClick
    return button
}
    

function setCategories(matches){
    let counter = 0
    clearPreviousCategories()
    for (let match of matches){
        if (counter < 9){
            let row = getRow()
            if (row){
                let button = createButton(match)
                row.appendChild(button)
            }
        }
        else{
            break;
        }
    }
}