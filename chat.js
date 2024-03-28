function addUser(){
    userName = document.getElementById("userName").value;
    localStorage.setItem("userName", userName);
    window.location = "chatRoom.html";
}

function handleKeyPress(event) {
    
    if (event.keyCode === 13) {
        addUser(); 
    }
}