const pantalla = document.getElementById("pantalla");

const botonesBilletes = document.querySelectorAll(".billete");
const botonesOperacion = document.querySelectorAll(".operacion");
const botonesNumero = document.querySelectorAll(".numero");

const botonIgual = document.getElementById("igual");
const botonBorrar = document.getElementById("borrar");
const botonBorrarUno = document.getElementById("borrarUno");

let operacion = "";
let pantallaIniciada = false;
let numeroActual = "";

// Guardamos cada elemento de la operación
let elementos = [];


/* =========================
   ACTUALIZAR OPERACIÓN
========================= */

function actualizarOperacion() {

    operacion = "";

    elementos.forEach(elemento => {
        operacion += elemento.valor;
    });

}


/* =========================
   MOSTRAR PANTALLA
========================= */

function mostrarPantalla() {

    pantalla.innerHTML = "";

    elementos.forEach(elemento => {

        // BILLETE
        if (elemento.tipo === "billete") {

            const imagen = document.createElement("img");

            imagen.src = elemento.imagen;
            imagen.alt = elemento.alt;

            imagen.classList.add("billete-pantalla");

            pantalla.appendChild(imagen);
        }


        // SIGNO
        if (elemento.tipo === "signo") {

            const signoElemento = document.createElement("span");

            signoElemento.textContent =
                elemento.valor === "*" ? " × " :
                elemento.valor === "/" ? " ÷ " :
                ` ${elemento.valor} `;

            signoElemento.classList.add("signo-pantalla");

            pantalla.appendChild(signoElemento);
        }


        // NÚMERO
        if (elemento.tipo === "numero") {

            const numeroElemento = document.createElement("span");

            numeroElemento.textContent = elemento.valor;

            numeroElemento.classList.add("numero-pantalla");

            pantalla.appendChild(numeroElemento);
        }

    });

}


/* =========================
   BILLETES
========================= */

botonesBilletes.forEach(boton => {

    boton.addEventListener("click", () => {

        const valor = boton.dataset.valor;

        if (!pantallaIniciada) {

            pantalla.innerHTML = "";

            pantallaIniciada = true;
        }

        const imagenOriginal = boton.querySelector("img");

        elementos.push({

            tipo: "billete",

            valor: valor,

            imagen: imagenOriginal.src,

            alt: imagenOriginal.alt

        });

        actualizarOperacion();

        mostrarPantalla();

    });

});


/* =========================
   OPERACIONES
========================= */

botonesOperacion.forEach(boton => {

    boton.addEventListener("click", () => {

        const signo = boton.dataset.operacion;

        // Si el último elemento ya es un signo,
        // reemplazamos ese signo por el nuevo.
        if (
            elementos.length > 0 &&
            elementos[elementos.length - 1].tipo === "signo"
        ) {

            elementos[elementos.length - 1].valor = signo;

        } else {

            elementos.push({

                tipo: "signo",

                valor: signo

            });

        }

        numeroActual = "";

        actualizarOperacion();

        mostrarPantalla();

    });

});


/* =========================
   TECLADO NUMÉRICO
========================= */

botonesNumero.forEach(boton => {

    boton.addEventListener("click", () => {

        const numero = boton.textContent;

        pantallaIniciada = true;

        // Si ya estamos escribiendo un número,
        // agregamos el nuevo dígito.
        if (
            elementos.length > 0 &&
            elementos[elementos.length - 1].tipo === "numero"
        ) {

            elementos[elementos.length - 1].valor += numero;

        } else {

            elementos.push({

                tipo: "numero",

                valor: numero

            });

        }

        numeroActual =
            elementos[elementos.length - 1].tipo === "numero"
                ? elementos[elementos.length - 1].valor
                : "";

        actualizarOperacion();

        mostrarPantalla();

    });

});


/* =========================
   IGUAL
========================= */

botonIgual.addEventListener("click", () => {

    try {

        const resultado = eval(operacion);

        pantalla.innerHTML = "";

        const resultadoTexto = document.createElement("div");

        resultadoTexto.classList.add("resultado");

        resultadoTexto.textContent = resultado;

        pantalla.appendChild(resultadoTexto);

        operacion = resultado.toString();

        numeroActual = "";

        // Guardamos el resultado como número
        elementos = [

            {
                tipo: "numero",
                valor: resultado.toString()
            }

        ];

    } catch {

        pantalla.innerHTML = "";

       const error = document.createElement("div");

error.classList.add("mensaje-error");

error.textContent = "🚫 ERROR 🚫";

pantalla.appendChild(error);

        operacion = "";

        numeroActual = "";

        elementos = [];

    }

});


/* =========================
   BORRAR TODO
========================= */

botonBorrar.addEventListener("click", () => {

    operacion = "";

    numeroActual = "";

    elementos = [];

    pantalla.innerHTML = "Elegí los billetes";

    pantallaIniciada = false;

});


/* =========================
   BORRAR UNO
========================= */

botonBorrarUno.addEventListener("click", () => {

    if (elementos.length === 0) {
        return;
    }

    const ultimo = elementos[elementos.length - 1];


    // Si el último elemento es un número
    // borramos solamente su último dígito.
    if (ultimo.tipo === "numero") {

        ultimo.valor = ultimo.valor.slice(0, -1);

        numeroActual = ultimo.valor;

        if (ultimo.valor === "") {

            elementos.pop();

            numeroActual = "";

        }

    }

    // Si es un billete o un signo,
    // eliminamos el elemento completo.
    else {

        elementos.pop();

        numeroActual = "";

    }


    actualizarOperacion();

    mostrarPantalla();


    // Si no queda nada, volvemos al mensaje inicial.
    if (elementos.length === 0) {

        pantalla.innerHTML = "0";

        pantallaIniciada = false;

    }

});