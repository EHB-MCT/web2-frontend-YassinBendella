document.getElementById("modal-close").onclick = hideModal

function showModal(){
    document.getElementById("modal").style.display = "inline-block"
}

function hideModal(){
    document.getElementById("modal").style.display = "none"
}

function setModalContent(content){
    document.getElementById("modal-body").appendChild(content)
}

function clearModalContent(){
    document.getElementById("modal-body").innerHTML = ""
}
