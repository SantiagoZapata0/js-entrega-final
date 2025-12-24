// Simulador de E-Commerce de productos tecnologicos.

function inicializarFormularioUsuario() {
    const formulario = document.getElementById("form-usuario");
    if (!formulario) return;

    formulario.addEventListener("submit", manejarSubmitFormulario);
}

async function manejarSubmitFormulario (e) {
    e.preventDefault();
    
    const nombre = document.getElementById("username").value.trim(); 
    const edad = parseInt(document.getElementById("edad").value);
    const email = document.getElementById("email").value.trim();
    
    if (!nombre || !edad || !email) {
        Swal.fire({
            icon: "error",
            title: "Lo sentimos.",
            text: "Todos los campos son obligatorios!",
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }
    
    if (edad < 18) {
        Swal.fire({
            icon: "error",
            title: "Lo sentimos.",
            text: "Debes ser mayor de 18 años para ingresar.",
            showConfirmButton: false,
            timer: 1000
        })
        return;
    }
    
    if (!email.includes("@")) {
        Swal.fire({
            icon: "error",
            title: "Lo sentimos.",
            text: "El email no tiene un formato válido (debe contener '@').",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }
    
    const datosUsuario = {
        username: nombre,
        edad: edad,
        email: email
    };
    
    sessionStorage.setItem('usuarioRegistrado', JSON.stringify(datosUsuario));
    
    await Swal.fire({
    icon: "success",
    iconColor: "#2c7bd4ff",
    title: `Bienvenido ${datosUsuario.username}!`,
    text: "Lo estabamos esperando!",
    showConfirmButton: false,
    timer: 2000
    });
        window.location.href = 'pages/home.html';
}

inicializarFormularioUsuario();

function cargarDatosUser (){
    const datos = sessionStorage.getItem('usuarioRegistrado')
    if(!datos) return;
    
    const usuario = JSON.parse(datos);
    
    const usernameHome = document.getElementById("username-home");
    const usernameAcc = document.getElementById("username-acc")
    const ageAcc = document.getElementById("age-acc");
    const emailAcc = document.getElementById("email-acc");

    if (usernameHome) usernameHome.innerText = usuario.username;
    if (usernameAcc) usernameAcc.innerText = `Nombre de usuario: ${usuario.username}`;
    if(ageAcc) ageAcc.innerText = `Edad: ${usuario.edad} años`;
    if(emailAcc) emailAcc.innerText = `Correo electronico: ${usuario.email}`
}

cargarDatosUser();

class Producto {
    constructor (id, marca, modelo, precio, img) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.imagen = img;
    }
}

let productos = []

async function cargarMostrarProductos () {
    try{
        const response = await fetch("../data/productos.json");
        const data = await response.json();

        productos = data.map(prod =>
            new Producto(prod.id, prod.marca, prod.modelo, prod.precio, prod.imagen)
        );
        renderizarInterfaz();
    } catch (error) {
        console.error("Ocurrio un error al cargar los productos:", error)
    }
}

function renderizarInterfaz(){
    for (let i = 0; i < productos.length; i++){
        const idProducto = `product${i + 1}`
        const idPrecio = `product${i + 1}-price`
        const idImg = `product${i + 1}-img`
    
        let elementoProducto = document.getElementById(idProducto);
        let elementoPrecio = document.getElementById(idPrecio);
        let elementoImagen = document.getElementById(idImg);
    
        if (elementoProducto && elementoPrecio && elementoImagen){
            elementoProducto.innerText = `${productos[i].marca} ${productos[i].modelo}`
            elementoPrecio.innerText = `$${productos[i].precio}`;
            elementoImagen.src = productos[i].imagen;
            elementoImagen.alt = `Tarjeta grafica ${productos[i].modelo}`
        }
    }
}

cargarMostrarProductos();
cargarMetodosPago();

let miCarrito = JSON.parse(sessionStorage.getItem("miCarrito")) || [];
const contenedorCarrito = document.getElementById("shopping-cart");
const carritoTotal = document.getElementById("shopping-cart-total");
const contadorCarrito = document.getElementById("contador-carrito");
const mensajeVacio = document.getElementById("shopping-cart-message");
const tituloCarrito = document.getElementById("shopping-cart-title");
const botones = document.querySelectorAll(".product-button");

function agregarAlCarrito(producto){
    miCarrito.push(producto);
    sessionStorage.setItem("miCarrito", JSON.stringify(miCarrito));

    if (contenedorCarrito) {
        actualizarCarrito();
    }
    contadorCarrito.innerText = miCarrito.length;
};

botones.forEach((boton, index) => {
    boton.addEventListener("click", () => {
    Toastify({
        text: `${productos[index].marca} ${productos[index].modelo} ha sido agregado al carrito.`,
        duration: 3000,
        destination:"../pages/micarrito.html",
        gravity: "bottom",
        position: "right",
        style:{
            background: "linear-gradient(to right, #0000a2, #0000ff)",
            borderRadius: "1rem"
        }
    }).showToast();
        agregarAlCarrito(productos[index]);
        contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
    });
});

function activarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".botonEliminar")
    const botonEliminarTodo = document.getElementById("shopping-cart-button-delete");
    
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const index = boton.getAttribute("data-index");
            eliminardelCarrito(index);
            contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
        })
    })

    botonEliminarTodo.addEventListener("click", async () => {
        const result = await Swal.fire({
            title: "Estas seguro que quieres vaciar el carrito?",
            icon: "warning",
            iconColor: "#0000a2",
            showCancelButton: true,
            confirmButtonColor: "#0000a2",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, vaciar",
            cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                await Swal.fire({
                    title: "Has vaciado el carrito.",
                    icon: "success",
                    iconColor: "#2c7bd4ff",
                    showConfirmButton: false,
                    timer: 1500,
                });
                miCarrito = [];
                sessionStorage.removeItem ("miCarrito");
                actualizarCarrito();
                if (contadorCarrito) contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
        };
    });
}
function eliminardelCarrito(index) {
    const productoEliminado = miCarrito[index]
    miCarrito.splice(index, 1);
    console.log(eliminardelCarrito);
    
    Toastify({
                text: `Has eliminado ${productoEliminado.marca} ${productoEliminado.modelo} del carrito.`,
                duration: 3000,
                direction:"../pages/micarrito.html",
                gravity: "bottom",
                position: "right",
                style:{
                    background: "linear-gradient(to right, #0000a2, #0000ff)",
                    borderRadius: "1rem"
        }
    }).showToast();
    sessionStorage.setItem("miCarrito", JSON.stringify(miCarrito));
    actualizarCarrito();
}

class MetodoPago {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

let metodosPago = [];

async function cargarMetodosPago () {
    try{
        const response = await fetch ("../data/metodosDePago.json")
        const data = await response.json();
        metodosPago = data.map(m => new MetodoPago (m.id, m.nombre));
    } catch (error){
        console.error("Error al cargar los metodos de pago", error)
    }
}

function renderizarMetodosPago () {
    const metodosPagoDiv = document.createElement("div");
    metodosPagoDiv.classList.add("shopping-cart-add-mp");

    metodosPagoDiv.innerHTML = "<h3>Metodos de pago:</h3>";

    metodosPago.forEach(metodo => {
        metodosPagoDiv.innerHTML += `
            <label>
                <input type="radio" name="pago" value="${metodo.id}">
                ${metodo.nombre}
            </label>
        `;
    });
    return metodosPagoDiv;
};

async function actualizarCarrito(){
    contenedorCarrito.innerHTML = `
    <h2 class="shopping-cart-title" id="shopping-cart-title">Tu carrito</h2>
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
        <button class="botonEliminar" data-index ="${index}"><i class="fa-solid fa-trash"></i></button>
        `;
        contenedorCarrito.appendChild(item);
    });
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("shopping-cart-total");
    
    const total = miCarrito.reduce((acc, prod) => acc + prod.precio, 0);
    
    totalDiv.innerHTML = `
    <div class="shopping-cart-finish">
    <h3 class="shopping-cart-total" id="shopping-cart-total">Total: $${total}</h3>
    <button class="shopping-cart-button-delete" id="shopping-cart-button-delete">Vaciar carrito</button>
    <button class="shopping-cart-button" id="shopping-cart-button">Finalizar compra</button>
    </div>`;

    if (metodosPago.length === 0){
        await cargarMetodosPago();
    }

    const metodosPagoDiv = renderizarMetodosPago();
    contenedorCarrito.appendChild(metodosPagoDiv);

    contenedorCarrito.appendChild(totalDiv);
    const botonFinalizar = document.getElementById("shopping-cart-button")
    if (botonFinalizar){
        botonFinalizar.addEventListener("click", finalizarCompra);
    }
    activarBotonesEliminar();
}

if (contenedorCarrito) {
    actualizarCarrito();
    contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
} else {
    contadorCarrito.innerText = `Mi carrito(${miCarrito.length})`;
}

const procesoDePago = () => {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            const exito = Math.random() > 0.2;
            if(exito){
                resolve ({estado: "Aprobado", transaccionId: Math.floor (Math.random() * 1000000)});
            } else {
                reject(new Error ("Fondos insuficientes o error de conexion."))
            }
        }, 2500);
    })
}

function obtenerMetodoPago() {
    const metodo = document.querySelector('input[name="pago"]:checked');
    return metodo ? metodo.value : null;
}

async function finalizarCompra () {
    
    if (miCarrito.length === 0){
        Swal.fire("Carrito vacio","Agrega algo antes de comprar", "warning");
        return;
    }

    const metodoPago = obtenerMetodoPago();

    if (!metodoPago){
        Swal.fire({
            icon: "warning",
            iconColor: "#ff0000",
            title: "Selecciona un metodo de pago",
            text: "Para continuar elegi como pagar.",
            showConfirmButton: false,
            timer: 2000
        })
        return;
    }

    const {isConfirmed} = await Swal.fire({
        title: "Confirmar pedido?",
        text: `Metodo: ${metodoPago.toUpperCase()} | Total: $${miCarrito.reduce((acc,p) => acc + p.precio, 0)}`,
        icon: "question",
        iconColor: "#0000a2",
        showCancelButton: true,
        confirmButtonText: "Si, pagar ahora",
        confirmButtonColor: "#0000a2",
        cancelButtonText: "Volver atras",
        cancelButtonColor: "#d33"
    });

    if (!isConfirmed) return;

    try {
        Swal.fire({
            title: "Procesando pago...",
            text: "Estamos validando con tu banco, no cierres la ventana.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const resultado = await procesoDePago(miCarrito);
        console.log("Respuesta del servidor:", resultado);

        await Swal.fire ({
            icon: "success",
            iconColor: "#2c7bd4ff",
            title: "Compra realizada!",
            text: `Tu numero de ticket es: ${resultado.transaccionId}`,
            confirmButtonText: "Volver a la tienda",
            confirmButtonColor: "#0000a2",
        });

        miCarrito = [];
        sessionStorage.removeItem ("miCarrito");
        actualizarCarrito();
        contadorCarrito.innerText = `Mi carrito (0)`
    } catch (error) {
        console.error("Falla en la compra: ", error.message);
        Swal.fire({
            icon: "error",
            title: "Pago rechazado",
            text: error.message,
            confirmButtonText: "Volver a pagar",
            confirmButtonColor: "#0000a2",
        })
    }
}