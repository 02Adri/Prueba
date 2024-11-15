
document.addEventListener("DOMContentLoaded",function(){
    //Comprobamos si estamos en la pagina de visualizacion
    if(document.getElementById("documents-list")){
         loadDocuments()//Cargar documentos si estamos en la pagina correcta     
    }
})
//Asegurarnos de los que los elementos existan
 const authForm=document.getElementById("auth-form")
 const uploadForm=document.getElementById("upload-form")
  //funcion para validacion de autenticacion
  if(authForm){
  authForm.addEventListener("submit",function(event) {
    event.preventDefault()

    //Evaluamos el usuario y la contraseña
    const username=document.getElementById("username").value
    const password=document.getElementById("password").value

    //Realizamos un condicional el cual permitira que al momento de ser correcta te envie a la seccion de subir
    if(username === "admin" && password === "adminlaw")
    {
        alert("¡Su validación ha sido exitosa!...")
        document.getElementById("upload-section").style.display="block"
        document.getElementById("auth-form").style.display="none"
    }
})
}

  

//Seccion para el manejo de subir documentos
if(uploadForm){
uploadForm.addEventListener("submit",function(event){
    event.preventDefault()
    //llamamos a nuestro input de formato text
    const fileInput=document.getElementById("file-input")
    const file= fileInput.files[0]
    if(file && file.type ==="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ){
        alert("El documento se subió Correctamente")
        const reader= new FileReader()
        reader.onload=function(e){
            const arrayBuffer=e.target.result
            //libreria de js que te permite gestionar archivos word
            mammoth.convertToHtml({arrayBuffer:arrayBuffer})
            .then(function(result){
                const htmlContent=result.value
                const uploadDate=new Date().toLocaleString()
                //Funcion que almacena en el localStorage
                saveDocumentData(file.name,htmlContent,uploadDate)
                window.location.href="documents.html"//redirige a la pagina de visualizacion
            })
            .catch(function(err){
                console.error("Error al leer el archivo de word", err)
            })
        }
        reader.readAsArrayBuffer(file)
    }else{
        alert("Por favor, sube un archivo word en (.docx)")
    }
})
}

//Funcion para guardar en localStorage

function saveDocumentData(name,content,date){
    let documents=JSON.parse(localStorage.getItem("documents")) || []
    documents.unshift({name,content,date})
    localStorage.setItem("documents",JSON.stringify(documents))
}


//Funcion para cargar los documentos en la pagina de visualizacion

function loadDocuments(){
    const documentsList=document.getElementById("documents-list")
    const documents=JSON.parse(localStorage.getItem("documents")) || []
    documentsList.innerHTML=""//limpia la lista al momento de cargar la pagina
    

    documents.forEach(function(doc){
        const documentElement=document.createElement("div")
        documentElement.classList.add("document")
        documentElement.innerHTML=doc.content

        //Seccion para añadir la fecha de cuando se subio el archivo
        const dateElement=document.createElement("p")
        dateElement.textContent=`Subido el:${doc.date}`
        documentElement.appendChild(dateElement)
        

        documentsList.appendChild(documentElement)
    })
}


//Funcion para buscar y eliminar documentos
function searchAndDeleteDocument(){
    const deleteName=document.getElementById("delete-name").value
    if(!deleteName){
        alert("Ingresa el nombre del archivo a eliminar")
        return
    }
    let documents=JSON.parse(localStorage.getItem("documents")) || []
    const updateDocuments=documents.filter(doc=>doc.name !== deleteName)

    if(updateDocuments.length === documents.length){
        alert("Documento no encontrado en este almacenamiento")
    }else{
        localStorage.setItem("documents",JSON.stringify(updateDocuments))
        alert("Documento eliminado exitosamente")
    }
}

/*//Cargar los documentos cuando se abre la pagina de visualizacion
if(window.location.pathname.includes("documents.html")){
    document.addEventListener("DOMContentLoaded",loadDocuments)
}
*/

