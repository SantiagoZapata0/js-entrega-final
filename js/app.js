let formulario = document.getElementById("form-usuario");

if(formulario){
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
    
        let nombre = document.getElementById("username").value.trim(); 
        let edad = parseInt(document.getElementById("edad").value);
        let email = document.getElementById("email").value.trim();
    
        if (!nombre || !edad || !email) {
            alert("¡Error! Todos los campos son obligatorios.");
            return;
        }
    
        if (edad < 18) {
            alert("Debes ser mayor de 18 años para registrarte.");
            return;
        }
    
        if (!email.includes("@")) {
            alert("El email no tiene un formato válido (debe contener '@').");
            return;
        }
    
        const datosUsuario = {
            username: nombre,
            edad: edad,
            email: email
        };
    
        sessionStorage.setItem('usuarioRegistrado', JSON.stringify(datosUsuario));
    
        alert("Registro exitoso! Bienvenido/a!.");
    
        window.location.href = 'pages/home.html';
    });
}

let usuarioRecuperado = null;

let usernameHome = document.getElementById("username-home");
if(usernameHome){
    usuarioRecuperado = JSON.parse(sessionStorage.getItem('usuarioRegistrado'))
}

if (usuarioRecuperado){
    const {username, edad, email} = usuarioRecuperado;
    usernameHome.innerText = `${usuarioRecuperado.username}` 
}

let usernameAcc = document.getElementById("username-acc")
if(usernameAcc){
    usernameAcc.innerText = `Nombre de usuario: ${usuarioRecuperado.username}`
}

let ageAcc = document.getElementById("age-acc");
if(ageAcc){
    ageAcc.innerText = `Edad: ${usuarioRecuperado.edad} años`;
}

let emailAcc = document.getElementById("email-acc");
if(emailAcc){
    emailAcc.innerText = `Correo electronico: ${usuarioRecuperado.email}`
}

class Producto {
    constructor (id, marca, modelo, precio, img) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.imagen = img;
    }
}

const productos = [
new Producto (1, "MSI", " NVIDIA RTX 3050", 250000, "../assets/MSI RTX 3050.jpg"),
new Producto (2, "Gygabite", " NVIDIA RTX 3060", 350000, "../assets/Gygabite RTX 3060.jpg"),
new Producto (3, "Gygabite", " NVIDIA RTX 3070 TI", 420000, "../assets/Gygabite RTX 3070 TI.jpg"),
new Producto (4, "Palit", "NVIDIA RTX 4060", 450000, "../assets/PALIT RTX 4060.png"),
new Producto (5, "Galax", "NVIDIA RTX 4080", 520000, "../assets/Galax RTX 4080.png" ),
new Producto (6, "ZOTAC", " NVIDIA RTX 5060", 650000, "../assets/ZOTAC RTX 5060.jpg")
]

for (let i = 0; i < productos.length; i++){
    const idProducto = `product${i + 1}`
    const idPrecio = `product${i + 1}-price`
    const idImg = `product${i + 1}-img`

    let elementoProducto = document.getElementById(idProducto);
    let elementoPrecio = document.getElementById(idPrecio);
    let elementoImagen = document.getElementById(idImg);

    if(elementoProducto && elementoPrecio && elementoImagen){
        elementoProducto.innerText = `${productos[i].marca} ${productos[i].modelo}`
        elementoPrecio.innerText = `$${productos[i].precio}`;
        elementoImagen.src = productos[i].imagen;
        elementoImagen.alt = `Tarjeta grafica ${productos[i].modelo}`
    }
}

let miCarrito = JSON.parse(sessionStorage.getItem("miCarrito")) || [];

const contenedorCarrito = document.getElementById("shopping-cart");
const carritoTotal = document.getElementById("shopping-cart-total");
const contadorCarrito = document.getElementById("contador-carrito");
const mensajeVacio = document.getElementById("shopping-cart-message");
const tituloCarrito = document.getElementById("shopping-cart-title");

function agregarAlCarrito(producto){
    miCarrito.push(producto);
    sessionStorage.setItem("miCarrito", JSON.stringify(miCarrito));

    if (contenedorCarrito) {
        actualizarCarrito();
    }
    contadorCarrito.innerText = miCarrito.length;
};

const botones = document.querySelectorAll(".product-button");

botones.forEach((boton, index) => {
    boton.addEventListener("click", () => {
        agregarAlCarrito(productos[index]);
        contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
    });
});

function activarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".botonEliminar")
    
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const index = boton.getAttribute("data-index");

            eliminardelCarrito(index);
            contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
        })
    })
}
function eliminardelCarrito(index) {
    miCarrito.splice(index, 1);
    sessionStorage.setItem("miCarrito", JSON.stringify(miCarrito));
    actualizarCarrito();
}

function actualizarCarrito(){
    contenedorCarrito.innerHTML = `
    <h2 class="shopping-cart-title" id="shopping-cart-title">Productos agregados</h2>
    <h3 class="shopping-cart-message" id="shopping-cart-message">Los productos que agregues se van a mostrar aca.</h3>`;
    if (miCarrito.length === 0) {
        mensajeVacio.style.display = "block";
        tituloCarrito.style.display = "none";
        carritoTotal.innerText = "Total: $0";
        return;
    }
    
    mensajeVacio.style.display = "none";
    tituloCarrito.style.display = "block";
    
    miCarrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("shopping-cart-item");
        item.innerHTML = `
        <img class ="shopping-cart-image" src="${producto.imagen}">
        <h3>${producto.marca} ${producto.modelo} - $${producto.precio}</h3>
        <button class="botonEliminar" data-index ="${index}">X</button>
        `;
        contenedorCarrito.appendChild(item);
    });
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("shopping-cart-total");
    
    const total = miCarrito.reduce((acc, p) => acc + p.precio, 0);
    
    totalDiv.innerHTML = `
    <div class="shopping-cart-finish">
    <h3 class="shopping-cart-total" id="shopping-cart-total">Total: $${total}</h3>
    <button class="shopping-cart-button" id="shopping-cart-button">Finalizar compra</button>
    </div>`;
    
    contenedorCarrito.appendChild(totalDiv);
    activarBotonesEliminar();
}

if (contenedorCarrito) {
    actualizarCarrito();
    contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
}