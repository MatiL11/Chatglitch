const socket = io();


const swal = async () => {
  const chatBox = document.getElementById("chatBox");

  try {
    const result = await Swal.fire({
      title: "Ingresa el nombre de usuario",
      input: "text",
      text: "Este nombre será visible para todos los usuarios",
      inputValidator: (value) => {
        return !value && "Debes ingresar un nombre de usuario";
      },
      allowOutsideClick: false,
    })

    const user = result.value;

    socket.emit("newUser", user);
    socket.on("userConnected", user => {
      Swal.fire({
        text: `${user} se ha conectado`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: "success",
      })
    });

    chatBox.addEventListener("keyup", evt => {
      if (evt.key === "Enter") {
        if (chatBox.value.trim().length>0){
          socket.emit("message", { user, message: chatBox.value });
          chatBox.value = "";
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};



socket.on("messageLogs", data => {
  const log = document.getElementById("messageLogs");
  let messages = "";

  data.forEach(message => {
    messages = messages + `${message.user}: ${message.message}</br>`;
  });

  log.innerHTML = messages;
});

swal();