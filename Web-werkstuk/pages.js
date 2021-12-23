currentPageIndex = 0
totalPages = document.getElementsByClassName("step").length
nextPage()
function nextPage(){
    if (currentPageIndex == totalPages) return
    if (currentPageIndex > 0 && currentPageIndex <= totalPages){
        let currentId = `step${currentPageIndex}`
        let currentPage = document.getElementById(currentId)
        currentPage.style.display = "none"
    }
    currentPageIndex += 1
    if (currentPageIndex <= totalPages){
        let nextId = `step${currentPageIndex}`
        let nextPage = document.getElementById(nextId)
        nextPage.style.display = "flex"
    }
}

function previousPage(){
    if (currentPageIndex == 1) return
    let errorPage = document.getElementById("error")
    if (errorPage != undefined) errorPage.style.display = "none"
    if (currentPageIndex > 0 && currentPageIndex <= totalPages){
        let currentId = `step${currentPageIndex}`
        let currentPage = document.getElementById(currentId)
        currentPage.style.display = "none"
    }
    currentPageIndex -= 1
    if (currentPageIndex <= totalPages){
        let nextId = `step${currentPageIndex}`
        let nextPage = document.getElementById(nextId)
        nextPage.style.display = "flex"
    }
}

function disableActiveButtons(){
    let currentPage = document.getElementById(`step${currentPageIndex}`)
    if (currentPage){
        currentPage.querySelectorAll(".btn").forEach(e => e.classList.remove("btn-active"))
    }
}

function homePage(){
    let currentPage = document.getElementById("my-list")
    currentPage.style.display = "none"
    currentPageIndex = 1
    let homepage = document.getElementById(`step${currentPageIndex}`)
    homepage.style.display = "flex"
}

function myListPage(){
    let currentId = `step${currentPageIndex}`
    let currentPage = document.getElementById(currentId)
    currentPage.style.display = "none"
    this.currentPageIndex = -1
    let myListPage = document.getElementById("my-list")
    myListPage.style.display = "flex"
}

function isNamePage(){
    return currentPageIndex == 1
}

function isSizePage(){
    return currentPageIndex == 2
}

function isFirstCharacterPage(){
    return currentPageIndex == 3;
}

function isSecondCharacterPage(){
    return currentPageIndex == 4;
}

function isCharacterPage(){
    return isFirstCharacterPage() || isSecondCharacterPage()
}

function isFinalPage(){
    return currentPageIndex == 5
}