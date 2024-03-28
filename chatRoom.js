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
  
  userName = localStorage.getItem("userName");
  console.log("userName");
  
  document.getElementById("userName").innerHTML = "Bem-vindo(a), " + userName + "!";
  
  function addRoom() {
    roomName = document.getElementById("roomName").value;
  
    
    Swal.fire({
      title: 'Criar Sala',
      text: 'Você deseja criar uma sala privada?',
      iconHtml: '<i class="fa-solid fa-lock"></i>',
      showCancelButton: true,
      confirmButtonText: 'Sim, privada',
      cancelButtonText: 'Não, pública'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: 'Digite a senha da sala:',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: (password) => {
            
            console.log(password);
            senha = password;
            
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            });
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            
            firebase.database().ref("/").child(roomName).update({
              purpose: "adicionar nome da sala",
              private: true, 
              password: senha
            });
  
            localStorage.setItem("roomName", roomName);
            window.location = "chatPage.html";
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
        firebase.database().ref("/").child(roomName).update({
          purpose: "adicionar nome da sala",
          private: false 
        });
  
        localStorage.setItem("roomName", roomName);
        window.location = "chatPage.html";
      }
    });
  }

  function handleKeyPress(event) {
    
    if (event.keyCode === 13) {
        addRoom(); 
    }
}
  
  function getData() {
    firebase.database().ref("/").on('value', function(snapshot) {
      document.getElementById("output").innerHTML = "";
      snapshot.forEach(function(childSnapshot) {
        childKey = childSnapshot.key;
        RoomNames = childKey;
        console.log("Nome da Sala - " + RoomNames);
        row = "<div class='roomName' id=" + RoomNames + " onclick='redirectToRoomName(this.id)' >#" + RoomNames + "</div><hr>";
        document.getElementById("output").innerHTML += row;
      });
    });
  }
  
  getData();
  
  function redirectToRoomName(name) {
    console.log(name);
    localStorage.setItem("roomName", name);
  
    
    firebase.database().ref("/" + name).once('value', function(snapshot) {
      const roomData = snapshot.val();
      if (roomData && roomData.private) {
        
        Swal.fire({
          title: 'Digite a senha da sala:',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Entrar',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: (password) => {
            
            return new Promise((resolve) => {
              if (password === roomData.password) {
                resolve();
              } else {
                Swal.showValidationMessage('Senha incorreta!');
              }
            });
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {

            window.location = "chatPage.html";
          }
        });
      } else {
        
        window.location = "chatPage.html";
      }
    });
  }

  
  function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("roomName");
    window.location = "index.html";
  }
  