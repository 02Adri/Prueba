document.getElementById("loginButton").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (username === "admin" && password === "adminlaw") {
      window.location.href = "documents.html";
    } else {
      alert("Usuario o contraseña incorrectos,intente de nuevo");
    }
  });
  