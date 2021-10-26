//inicializo mis arrays
const productos = []
const proveedores = []
const pedidos = []
const productosLs = JSON.parse(localStorage.getItem("productos"))
const proveedoresLs = JSON.parse(localStorage.getItem("proveedores"))
const pedidosLs = JSON.parse(localStorage.getItem("pedidos"))
if (productosLs) {
    for (const prod of productosLs) productos.push(new Producto(prod))
  }
if (proveedoresLs) {
    for (const prov of proveedoresLs) proveedores.push(new Proveedor(prov))
  }
if (pedidosLs) {
    for (const ped of pedidosLs) pedidos.push(new Pedido(ped))
  }

const render = new Render
const tool = new Tool

const modalContainer = document.getElementById("modal-container")
const mostrarModal = () => {
    modalContainer.classList.toggle("mostrar")
  }


const btnNuevoPed = document.querySelector("#nuevo-pedido")
btnNuevoPed.addEventListener("click", () => nuevoPedido())

const nuevoPedido = () => {
  
  //array donde van a ir los productos del pedido
  const prodPedidos = []
  mostrarModal()
  modalContainer.innerHTML = render.formNuevoPedido()
  
  //selecciono los elementos
  
const validacionDiv = document.querySelector("#validacion-div")
const btnAgregar = document.querySelector("#btn-agregar")
const btnBorrar = document.querySelector("#btn-borrar")

const inputProd = document.querySelector('#input-prod')
const inputProv = document.querySelector('#input-prov')

const divResultadoProv = document.querySelector('#resultado-busqueda-prov')
const divResultadoProd = document.querySelector('#resultado-busqueda-prod')



// inputProv.onfocus = () => {
//   if (!inputProv.readOnly) {
//     divResultadoProv.style.display = 'block'
//     }
// }

// inputProd.onfocus = () => {
//   if (!inputProd.readOnly) {
//   divResultadoProd.style.display = 'block'
//   }
// }


//cuando tecleo en el input del proveedor me va mostrando el resultado
const productosFiltrados = []
inputProv.addEventListener('input', () => {
  divResultadoProv.innerHTML = ''
  const busqueda = tool.buscarProveedor(inputProv.value)
  if (inputProv.value !== '') {
    busqueda.forEach((prov) => {
      divResultadoProv.innerHTML += `<option value="${prov.id}">${prov.nombre}</option>`
    })}
    
    //agarro las opciones que filtra la busqueda del usuario
    const options = Array.from(document.querySelectorAll('#resultado-busqueda-prov option'))
    
    //declaro un array donde van a ir los productos del proveedor

  //agrego un eventlistener a cada option, para hacerlos clickeables sin el onclick del html
  //al hacer click, lo pongo como valor del input y filtro un array con solo los productos del proveedor
  options.forEach((option) => {
    option.addEventListener('click', () => {
      divResultadoProv.style.display = 'none'
      const proveedor = proveedores.find((prov) => prov.id == option.value)
      const productos = proveedor.listarProductos()
      productos.map((prod) => productosFiltrados.push(prod))
      //seteo el atributo datavalue para poder guardar el id del proveedor en el input y rescatarlo mas tarde
      inputProd.setAttribute('datavalue', option.value)
      //pongo el proveedor como valor del input y lo hago readonly
      inputProv.value = option.innerText
      inputProv.readOnly = true

    })
  })
})

inputProd.addEventListener('input', () => {
  
  divResultadoProd.innerHTML = ''
  const busqueda = productosFiltrados.filter((prod) => prod.datos.nombre.toLowerCase().includes(inputProd.value.toLowerCase()))
  
  if (inputProd.value !== '') {
    busqueda.forEach((prod) => {
      divResultadoProd.innerHTML += `<option value="${prod.id}">${prod.datos.nombre}</option>`
    })}


    //agrego un eventlistener a cada option, para hacerlos clickeables sin el onclick del html
  const options = Array.from(document.querySelectorAll('#resultado-busqueda-prod option'))
  options.forEach((option) => {
    option.addEventListener('click', () => {
      //pongo el producto como opción
      inputProd.value = option.innerText
      //pongo el atributo datavalue al input para guardar el prodID que está en el value del option
      inputProd.setAttribute('datavalue', option.value)
      
      //oculto el listado de resultados y lo hago readonly así no se puede modificar
      inputProd.readOnly = true
      divResultadoProd.style.display = 'none'
    })    
  })
})

//boton para borrar la seleccion del producto
btnBorrar.addEventListener('click', (e) => {
  e.preventDefault()
  //le saco el readonly y lo vacio
  inputProd.readOnly = false
  inputProd.value = ''
  document.querySelector('#cantidad').value = ''
  inputProd.focus()
})


//boton agregar producto al pedido y a la tabla
btnAgregar.addEventListener('click', (e) => {
e.preventDefault()

//selecciono inputs
const cantidad = document.querySelector('#cantidad')
const prodId = document.querySelector('#input-prod').getAttribute('datavalue')


//busco proveedor y producto según los input
const proveedor = proveedores.find((prov) => prov.id === parseInt(document.querySelector('#input-prov').getAttribute('datavalue')))
const producto = productos.find((prod) => prod.id === parseInt(prodId) )

//si faltó elegir el producto o la cantidad devuelvo el focus al input que corresponda
if(!inputProd.value) {
  return inputProd.focus()
} else if (cantidad.value < 1 || !cantidad.value) {
  return cantidad.focus()
} 

//para ver si ya está el producto en el pedido. si ya está, se modifica la cantidad según el input
const productoEnPedido = prodPedidos.find((ped) => ped.productoId === producto.id)
if (productoEnPedido) {
  //si ya está, le asigno la nueva cantidad y borro los input para cargar otro producto
  productoEnPedido.cantidad = cantidad.value
  inputProd.readOnly = false
  inputProd.value = ''
  cantidad.value = ''

  mostrarProductosPedido(prodPedidos)


} else {

  //pusheo el producto
prodPedidos.push({
    productoId: producto.id,
    nombre: producto.datos.nombre,
    sku: producto.sku,
    cantidad: parseInt(cantidad.value)})

inputProd.readOnly = false
inputProd.value = ''
cantidad.value = ''
divResultadoProd.innerHTML = ''
divResultadoProd.style.display = 'block'
mostrarProductosPedido(prodPedidos)
}
})


//guardar pedido
const btnGuardar = document.querySelector('#btn-guardar')
btnGuardar.addEventListener('click', (e) => {

e.preventDefault()

//colecto los input
const fechaArribo = document.querySelector('#fecha-arribo')
const codigo = document.querySelector('#codigo-pedido')
const observaciones = document.querySelector('#observaciones')
const proveedor = proveedores.find((prov) => prov.nombre === inputProv.value)
const origen = document.querySelector('#origen-pedido')

const dateArribo = new Date(fechaArribo.value)
const dateHoy = new Date()

console.log(dateArribo.getTime(), dateHoy.getTime())


//valido el form
validacionDiv.innerText = ""
if(!prodPedidos.length) {
  validacionDiv.innerText = 'No elegiste ningún producto'
} else if (!fechaArribo.value) {
  validacionDiv.innerText = 'Te falta elegir fecha estimada de arribo'
} else if (dateArribo.getTime() < dateHoy.getTime()) {
  validacionDiv.innerText = 'La fecha de arribo debe ser posterior a hoy'
 } else {

  console.log(proveedor)
  //si está todo bien
const pedido = new Pedido({
                          codigo: codigo.value,
                          proveedor: proveedor.id,
                          origen: origen.value,
                          arribo: dateArribo,
                          productos: prodPedidos,
                          observaciones: observaciones.value
                        })

pedidos.push(pedido)
tool.guardarLs('pedidos', pedidos)
modalContainer.classList.toggle("mostrar")
mostrarArray(pedidos)

}
})

//fin función
}

function mostrarProductosPedido(array) {
  
  
  const divProductos = document.querySelector('#productos-agregados')
  divProductos.innerHTML = `<table id="tabla-productos">
  <thead>
      <tr>
          <th>ID</th>
          <th>Cantidad</th>
          <th>Producto</th>
      </tr>
  </thead>
      
</table>`

  array.forEach((prod) => {
    const tabla = document.querySelector('#tabla-productos')
    const tr = document.createElement('tr')
    tabla.appendChild(tr)
    tr.innerHTML = `
            <td>${prod.productoId}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.nombre}</td>
     `
     
  })

}

const mostrarArray = (array) => {
  let tBody = document.getElementById("tbody-mostrar")

  //para arrancar veo q esté vacía, sino, la limpio
  if (tBody != undefined) {
    tBody.innerHTML = ""
  }
  //paso html x cada elemento del array
  array.forEach((pedido) => {
    let arribo = tool.formatoDate(new Date(pedido.arribo))
    
    let tr = document.createElement("tr")

    tBody.appendChild(tr)
    tr.innerHTML += `
        <td>${pedido.codigo}</td>
        <td>${pedido.proveedor}</td>
        <td>${pedido.origen}</td>
        <td>${arribo}</td>    
        <td><button title="Ver más" onclick="verMas(${pedido.id})">
        <i class="fas fa-info"></i></button></td> 
        `
  })
}

const verMas = (pedidoId) => {
  const pedido = pedidos.find((pedido) => pedido.id === pedidoId)
  
  mostrarModal()
  modalContainer.innerHTML = ` <div id="modal" class="modal">
        <h2>Pedido: ${pedido.codigo}</h2> 
        
        <h3>Faltan ${pedido.diasFaltan()} días para que ingrese</h3>  
                         
                  
                  <button id="btn-salir">Salir</button>
    
      </div>`

  
  
      const salir = document.getElementById("btn-salir")
      salir.addEventListener("click", () => {
        modalContainer.classList.toggle("mostrar")
      })
  
}

mostrarArray(pedidos)

// const pedidoMidiflux = {
//     codigo: "ZT011T",
//     proveedor: "Midiflux",
//     origen: "Taiwan",
//     arribo: [new Date("2022-11-19")],
//     productos: [productos[4],productos[5]]
// }

// const pedidoMidiflux2 = {
//   codigo: "ZT011T",
//   proveedor: "Midiflux",
//   origen: "Taiwan",
//   arribo: [new Date("2030-11-19")],
//   productos: [productos[4],productos[5]]
// }

// const pedidoTuSynth = {
//     codigo: "TU023C",
//     proveedor: "tuSynth",
//     origen: "China",
//     arribo: [new Date("2021-12-10")],
//     productos: [productos[2],productos[3]]

// }

// const pedido = new Pedido(pedidoMidiflux)
// pedidos.push(pedido)
// const pedido2 = new Pedido(pedidoTuSynth)
// pedidos.push(pedido2)
// const pedido3 = new Pedido(pedidoMidiflux2)
// pedidos.push(pedido3)
