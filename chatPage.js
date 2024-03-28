const firebaseConfig = {
    apiKey: "AIzaSyAsvSDYEXuPOJFOz9sF7wwnwsHEEBQjVok",
    authDomain: "meuchat-f231b.firebaseapp.com",
    databaseURL: "https://meuchat-f231b-default-rtdb.firebaseio.com",
    projectId: "meuchat-f231b",
    storageBucket: "meuchat-f231b.appspot.com",
    messagingSenderId: "998815370485",
    appId: "1:998815370485:web:0f697420c66b274f1789bc"
};


firebase.initializeApp(firebaseConfig);

let roomName = localStorage.getItem("roomName");
let userName = localStorage.getItem("userName");
document.getElementById("welcomeUser").innerHTML = "Bem-vindo(a) a sala " + roomName + ", "+ userName + "!";

function send() {
    let msg = document.getElementById("msg").value.trim(); 

   
    if (msg !== "") {
        firebase.database().ref(roomName + "/messages").push({
            sender: userName,
            message: msg,
            like: 0
        });
        document.getElementById("msg").value = "";

        
        let outputDiv = document.getElementById("output-container");
        outputDiv.scrollTop = outputDiv.scrollHeight - outputDiv.clientHeight;
    } else {
        
        alert("Por favor, insira uma mensagem antes de enviar.");
    }
}



function handleKeyPress(event) {
    
    if (event.keyCode === 13) {
        send(); 
    }
}


function getData() {
    firebase.database().ref(roomName + "/messages").on('value', function(snapshot) { 
        document.getElementById("output").innerHTML = ""; 
        snapshot.forEach(function(messageSnapshot) {
            let messageData = messageSnapshot.val();
            let sender = messageData.sender;
            let message = messageData.message;
            let like = messageData.like;
            let messageKey = messageSnapshot.key; 

            let nameWithTag;
            if (sender === userName) {
                nameWithTag = "<h4 class='message-sent'> " + sender + " <i class='fa-solid fa-user'></i></h4>";
            } else {
                nameWithTag = "<h4 class='message-received'> " + sender + " <i class='fa-solid fa-user'></i></h4>";
            }
            let messageWithTag = "<h4 class='message_h4'>" + message + "</h4>";
            let likeButton = "<button class='btn btn-outline-danger' id='" + messageKey + "' onclick='updateLike(this.id)'>";
            let spanWithTag = "<span><i class='fa-solid fa-heart'></i> Like: " + like + "</span></button><hr>";

            let row = nameWithTag + messageWithTag + likeButton + spanWithTag;
            document.getElementById("output").innerHTML += row;
        });
    });
}


getData();


function updateLike(messageId) {
    console.log("Clicou no botão curtir - " + messageId);
    
    firebase.database().ref(roomName + "/messages/" + messageId).once('value', function(snapshot) {
        let likes = snapshot.val().like || 0; 
        let updatedLikes = likes + 1;
        console.log("Likes atualizados: " + updatedLikes);

        
        
        firebase.database().ref(roomName + "/messages/" + messageId).update({
            like: updatedLikes  
        });
    });
}

function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("roomName");
    window.location.replace("index.html");
}

