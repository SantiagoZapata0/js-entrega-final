// Simulador de E-Commerce de productos tecnologicos.

const formulario = document.getElementById("form-usuario");

if(formulario){
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        let nombre = document.getElementById("username").value.trim(); 
        let edad = parseInt(document.getElementById("edad").value);
        let email = document.getElementById("email").value.trim();
    
        if (!nombre || !edad || !email) {
            Swal.fire({
                icon: "error",
                title: "Lo sentimos.",
                text: "Todos los campos son obligatorios!",
                showConfirmButton: false,
                timer: 1000
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
        title: `Bienvenido ${datosUsuario.username}!`,
        text: "Lo estabamos esperando!",
        showConfirmButton: true,
        confirmButton: "Continuar"
        });
            window.location.href = 'pages/home.html';
    });
}

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
        direction:"../pages/micarrito.html",
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
    console.log(eliminardelCarrito);
    
    Toastify({
                text: `Has eliminado ${productos[index].marca} ${productos[index].modelo} del carrito.`,
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
    const botonFinalizar = document.getElementById("shopping-cart-button")
    if (botonFinalizar){
        botonFinalizar.addEventListener("click", finalizarCompra)
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
            const exito = Math.random() > 0.5;
            if(exito){
                resolve ({estado: "aprobado", transaccionId: "TX-12345"});
            } else {
                reject(new Error ("Fondos insuficientes o error de conexion."))
            }
        }, 2500);
    })
}

async function finalizarCompra () {
    if (miCarrito.length === 0){
        Swal.fire("Carrito vacio","Agrega algo antes de comprar", "warning");
        return;
    }

    const {isConfirmed} = await Swal.fire({
        title: "Confirmar pedido?",
        text: `Estas por pagar un total de $${miCarrito.reduce((acc,p) => acc + p.precio, 0)}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, pagar ahora",
        cancelButtonText: "Seguir comprando"
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
            title: "Compra realizada!",
            text: `Tu numero de ticket es: ${resultado.transaccionId}`
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
        })
    }
}
