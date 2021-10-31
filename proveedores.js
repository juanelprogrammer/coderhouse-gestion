//inicializo mis arrays
const productos = []
const proveedores = []
const productosLs = JSON.parse(localStorage.getItem("productos"))
const proveedoresLs = JSON.parse(localStorage.getItem("proveedores"))


//veo si el usuario ya tiene guardado algo en localstorage y si tiene los pusheo a mis arrays
if (productosLs) {
  for (const prod of productosLs) productos.push(new Producto(prod))
}
if (proveedoresLs) {
  for (const prov of proveedoresLs) proveedores.push(new Proveedor(prov))
}

const render = new Render
const tool = new Tool

//modal
const modalContainer = document.getElementById("modal-container")
const mostrarModal = () => {
  modalContainer.classList.toggle("mostrar")
}



const mostrarArray = (array) => {
  const tBody = $("#tbody-mostrar")

  //para arrancar veo q esté vacía, sino, la limpio
  if (tBody != undefined) {
    tBody.html("")
  }

  //paso html x cada elemento del array
  array.forEach((proveedor) => {
    let tr = document.createElement("tr")
    tBody.append(tr)

    //muestro en un select los productos me parece lo más sencillo y luego me va a servir para realizar acciones con la option que elija
    tr.innerHTML += `<td>${proveedor.id}</td>
      <td>${proveedor.nombre}</td>
      <td><div id="productos-${proveedor.id}"></div></td>
      `
    let productosProveedor = proveedor.listarProductos()
    const selectProductos = $(`#productos-${proveedor.id}`)

    //si no hay productos, muestro que no hay
    if (!productosProveedor.length) {
      selectProductos.html('No hay productos')

      //si tiene más de 1 producto, muestro solo el primero y "mostrar más"
    } else if (productosProveedor.length > 1) { 
      selectProductos.append(`${productosProveedor[0].datos.nombre}  $${productosProveedor[0].costo} ... <span onclick="mostrarMas(${proveedor.id})">Mostrar más</span> <br>`)
      
      
      //al hacer click en mostrar más muestro todos los productos del proveedor en la celda
      const mostrarMas = $(`#mostrar-mas-${proveedor.id}`)
      mostrarMas.click( () => {
        selectProductos.html('')
        productosProveedor.forEach((prod) => {
          selectProductos.append(`${prod.datos.nombre} $${prod.costo} <br>`)
        })
      })
      //si la lista de productos del proveedor no está vacía y NO tiene más de 1 (o sea que solo tiene 1 producto) muestro ese producto
    } else {
        selectProductos.append(`${productosProveedor[0].datos.nombre} $${productosProveedor[0].costo}`)
    
    }   
  })
}

//función que muestra los productos y agrega botón "mostrar menos" para ocultar
function mostrarMas(id) {

const proveedor = proveedores.find((prov) => id === prov.id)

productosProveedor = proveedor.listarProductos()


const divProductos = $(`#productos-${id}`)
divProductos.html('')


productosProveedor.forEach((prod) => {
  divProductos.append(`${prod.datos.nombre} $${prod.costo} <br>`)
})

divProductos.append(`<span id="mostrar-menos-${proveedor.id}">Mostrar menos</span>`)

const mostrarMenos = $(`#mostrar-menos-${proveedor.id}`)

mostrarMenos.click(() => {
          
  divProductos.html(`${productosProveedor[0].datos.nombre}  $${productosProveedor[0].costo} ... <span onclick="mostrarMas(${proveedor.id})">Mostrar más</span> <br>`)
})

}


mostrarArray(proveedores)

const buscar = (busqueda) => {
  return proveedores.filter((prov) =>
    prov.nombre.toLowerCase().includes(busqueda)
  )
}

//renderiza la busqueda debajo del buscador
const listaBusqueda = document.querySelector("#busqueda-productos")
const mostrarBusqueda = (busqueda) => {
  listaBusqueda.innerHTML = ""

  busqueda.forEach((prov) => {
    listaBusqueda.innerHTML += `<div class="resultado-busqueda">
      <h3>${prov.nombre}</h3>
     <select name="productos-proveedor" id="productos-${prov.nombre}">
      </select>
    </div>`
    let productosProveedor = prov.listarProductos()
    const selectProductos = document.querySelector(`#productos-${prov.nombre}`)
    if (!productosProveedor.length) {
      selectProductos.innerHTML = '<option value="">No hay productos</option>'
    }
    productosProveedor.forEach((prod) => {
      selectProductos.innerHTML += `<option value="">${prod.datos.nombre}  $ ${prod.costo}</option>`
    })
  })
}

//event listener del input de busqueda. a medida que escribis llama a mostrarBusqueda()
const inputBuscador = document.querySelector("#input-busqueda")
inputBuscador.addEventListener("input", () => {
  if (inputBuscador.value === "") {
    listaBusqueda.innerHTML = ""
  } else {
    const busqueda = inputBuscador.value.trim().toLowerCase()

    mostrarBusqueda(buscar(busqueda))
  }
})

const altaProveedor = () => {
  mostrarModal()
  // renderizo el form
  modalContainer.innerHTML = render.formNuevoProveedor()

  const btnGuardar = document.querySelector("#btn-guardar")
  const btnCancelar = document.querySelector("#btn-cancelar")
  const validacionDiv = document.querySelector("#validacion-div")

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault()
    const inputNombre = document.querySelector("#nombre-proveedor").value

    if (!inputNombre) {
      e.preventDefault()
      validacionDiv.innerText = "No elegiste un nombre para el proveedor"
    } else {
      e.preventDefault()

      let nuevoProveedor = new Proveedor({ nombre: inputNombre })

      proveedores.push(nuevoProveedor)
      guardarLs("proveedores", proveedores)
      modalContainer.classList.toggle("mostrar")
      mostrarArray(proveedores)
    }
  })
}

const btnNuevoProv = document.querySelector("#nuevo-proveedor")
btnNuevoProv.addEventListener("click", () => altaProveedor())

function guardarLs(key, array) {
  localStorage.setItem(key, JSON.stringify(array))
}
