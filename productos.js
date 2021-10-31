//me falta comprobar mejor los form, es re facil romper todo



//inicializo mis arrays
const productos = []
const proveedores = []
const pedidos = []
const historialVentas = []
const productosLs = JSON.parse(localStorage.getItem("productos"))
const proveedoresLs = JSON.parse(localStorage.getItem("proveedores"))
const pedidosLs = JSON.parse(localStorage.getItem("pedidos"))
const historialVentasLs = JSON.parse(localStorage.getItem("historial-ventas"))

//agrego clases p tener sus metodos
const render = new Render()
const tool = new Tool()

//modal
const modalContainer = document.getElementById("modal-container")
const mostrarModal = () => {
  modalContainer.classList.toggle("mostrar")
}

//veo si el usuario ya tiene guardado algo en localstorage y si tiene los pusheo a mis arrays
if (productosLs) {
  for (const prod of productosLs) productos.push(new Producto(prod))
}
if (proveedoresLs) {
  for (const prov of proveedoresLs) proveedores.push(new Proveedor(prov))
}
if (pedidosLs) {
  for (const ped of pedidosLs) pedidos.push(new Pedido(ped))
}
if (historialVentasLs) {
  for (const hist of historialVentasLs) historialVentas.push(new HistorialVenta(hist))
}


//boton nuevo producto que llama a altaproducto()

const btnNuevoProd = document.querySelector("#nuevo-producto")
btnNuevoProd.addEventListener("click", () => altaProducto())
const altaProducto = () => {
  mostrarModal()
  //renderizo el form 
  modalContainer.innerHTML = render.formAltaProducto()


  const inputProv = document.querySelector('#input-prov')
  const divResultadoProv = document.querySelector('#resultado-busqueda-prov')


  inputProv.addEventListener('input', () => {
    //limpio el resultado de la busqueda y lo hago visible
    divResultadoProv.innerHTML = ''
    divResultadoProv.style.visibility = 'visible'
    //busco lo q tipea el user y lo tiro en el resultado de la busqueda
    const busqueda = tool.buscarProveedor(inputProv.value)
    
    if (!proveedores.length) {
      divResultadoProv.innerHTML += `<option value="sin-proveedor">No existen proveedores</option>`
    } else if (inputProv.value !== '') {
      busqueda.forEach((prov) => {
        divResultadoProv.innerHTML += `<option value="${prov.id}">${prov.nombre}</option>`
      })}
      
      //agarro las opciones que filtra la busqueda del usuario
      const options = Array.from(document.querySelectorAll('#resultado-busqueda-prov option'))
      
    //agrego un eventlistener a cada option, para hacerlos clickeables sin el onclick del html
    //al hacer click, lo pongo como valor del input
    options.forEach((option) => {
      option.addEventListener('click', () => {
        //las oculto para que no molesten
        divResultadoProv.style.visibility = 'hidden'
        //declaro proveedor
        const proveedor = proveedores.find((prov) => prov.id == option.value)

        //pongo el proveedor como valor del input y lo hago readonly
        inputProv.value = proveedor.nombre
        // inputProv.readOnly = true
  
      })
    })
  })


  inputProv.ondblclick = () => {
    //limpio el resultado de la busqueda y lo hago visible
    divResultadoProv.innerHTML = ''
    divResultadoProv.style.visibility = 'visible'
    

    if (!proveedores.length) {
      divResultadoProv.innerHTML += `<option value="sin-proveedor">No existen proveedores</option>`
      divResultadoProv.innerHTML += `<input type="button" value="Ir a Proveedores" onclick="window.location.href='./proveedores.html'">`

    } else {
      proveedores.forEach((prov) => {
        divResultadoProv.innerHTML += `<option value="${prov.id}">${prov.nombre}</option>`
      })
      
      divResultadoProv.innerHTML += `<input type="button" value="Ir a Proveedores" onclick="window.location.href='./proveedores.html'">`
      
    
    }

 
  //agrego un eventlistener a cada option, para hacerlos clickeables sin el onclick del html  
  const options = Array.from(document.querySelectorAll('#resultado-busqueda-prov option'))
  options.forEach((option) => {
    option.addEventListener('click', () => {
      //las oculto para que no molesten
      divResultadoProv.style.visibility = 'hidden'
      //declaro proveedor
      const proveedor = proveedores.find((prov) => prov.id == option.value)

      //pongo el proveedor como valor del input y lo hago readonly
      inputProv.value = proveedor.nombre
      inputProv.setAttribute('datavalue', proveedor.id)
      // inputProv.readOnly = true

    })
  })
 
 }
 


  //agrego categorías al listado
  const categorias = []
  productos.forEach((prod) => {
    categorias.push(prod.datos.categoria)
  })
  //filtro los duplicados
  const categoriasSinDuplicado = categorias.filter(
    (v, i) => categorias.indexOf(v) === i
  )

  //muestro las categorías

  if (!categoriasSinDuplicado.length) {
    const catSelect = document.querySelector("#categorias")
    catSelect.innerHTML += `<option value="sin-categoria">Se tiene que poder crear categorias :(</option>`

  } else {

  categoriasSinDuplicado.forEach((cat) => {
    const catSelect = document.querySelector("#categorias")
    catSelect.innerHTML += `<option value="${cat}">${cat}</option>`
  })
  }

  //capturo campos
  let costo = document.querySelector("#costo")
  let iva = document.querySelector("#iva")
  let rentabilidad = document.querySelector("#rentabilidad")
  let precioFinal = document.querySelector("#precio-final")

  //muestro precio final según rentabilidad solo si ya completaste costo e iva (tengo que hacer que se actualice cuando cambio el costo, pero no se aplicaría a la realidad tampoco)
  //tiene algunos errores al mostrar el NaN
  rentabilidad.addEventListener("input", () => {
    if (costo.value && iva.value != undefined) {
      precioFinal.innerHTML = "$"
      precioFinal.innerHTML += parseInt(
        tool.calcularPrecioFinal(
          parseFloat(costo.value),
          parseFloat(iva.value),
          parseFloat(rentabilidad.value))
      )
    }
  })
  //envío el form
  const btnGuardar = document.querySelector("#btn-guardar")
  const btnCancelar = document.querySelector("#btn-cancelar")
  //al apretar cancelar
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault()

    //al cancelar tengo que verificar si puse datos en el form. si hay datos, preguntar para evitar que se borren sin querer
    let nombre = document.querySelector("#nombre-producto")
    let sku = document.querySelector("#sku")
    let descripcion = document.querySelector("#descripcion")

    //si están vacios, oculto modal
    if (
      nombre.value == "" &&
      sku.value == "" &&
      descripcion.value == "" &&
      costo.value == "" &&
      rentabilidad.value == "" &&
      iva.value == ""
    ) {
      modalContainer.classList.toggle("mostrar")
    } else if (confirm("¿Seguro?")) {
      e.preventDefault()
      modalContainer.classList.toggle("mostrar")
    }
  })

  //al guardar valido datos y voy tirando lo que falta en el div de validación
  btnGuardar.addEventListener("click", (e) => {
    let validacionDiv = document.querySelector("#validacion-div")
    e.preventDefault()
    validacionDiv.innerText = ""

    let nombre = document.querySelector("#nombre-producto")
    let sku = document.querySelector("#sku")
    let categoria = document.querySelector("#categorias")
    let proveedor = document.querySelector("#input-prov")
    let descripcion = document.querySelector("#descripcion")
    let stock = document.querySelector("#stock-producto")

    
    if (!nombre.value || !sku.value || !proveedor.value) {
      e.preventDefault()
      validacionDiv.innerText = "Te falta algún dato del producto"
    } else if (!iva.value) {
      e.preventDefault()
      validacionDiv.innerText = "Necesitas indicar el % de IVA."
    } else if (!costo.value) {
      e.preventDefault()
      validacionDiv.innerText = "No podes dar de alta un producto sin costo."
    } else if (tool.buscarDuplicado(sku.value)) {
      e.preventDefault()
      validacionDiv.innerText = "Ya existe un producto con ese SKU."
    } else {
      e.preventDefault()

    const nuevoProducto = new Producto({
        datos: {
          nombre: nombre.value,
          categoria: categoria.value,
          proveedor: proveedor.value,
          descripcion: descripcion.value,
        },
        sku: sku.value,
        costo: parseFloat(costo.value),
        rentabilidad: !rentabilidad.value ? 1 : parseFloat(rentabilidad.value), //si la rentabilidad del form está en blanco, va rentabilidad 1
        iva: parseFloat(iva.value),
        stock: !stock.value ? 0 : parseInt(stock.value), //si el stock en el form está en blanco, va stock 0
        vendidos: 0,
      })

      //confirmo con el usuario
      if (
        confirm(
          `Estás dando de alta ${nuevoProducto.datos.nombre} con ${nuevoProducto.stock} unidades`
        )
      ) {
        //si va: pusheo, guardo en ls, vuelvo a mostrar la tabla y oculto el modal
        productos.push(nuevoProducto)
        tool.guardarLs("productos", productos)
        mostrarArray(productos)
        modalContainer.classList.toggle("mostrar")
      }
    }
  })
}

//ordenar tabla productos
const ordenarSelect = document.querySelector("#ordenar-productos")
ordenarSelect.addEventListener("change", () => {
  mostrarArray(tool.ordenar(productos))
})


//despliega los productos en la tabla según el array que le pase
const mostrarArray = (array) => {
  let tBody = document.getElementById("tbody-mostrar")

  //para arrancar veo q esté vacía, sino, la limpio
  if (tBody != undefined) {
    tBody.innerHTML = ""
  }
  //paso html x cada elemento del array
  array.forEach((producto) => {
    let tr = document.createElement("tr")
    let clase = producto.bajoStock ?  "bajo-stock" : ""

    tBody.appendChild(tr)
    tr.innerHTML += `
        <td>${producto.id}</td>
        <td class="td-data">${producto.datos.nombre}<br>
        SKU: ${producto.sku}</td>
        <td>${producto.costo}</td>
        <td>${producto.iva}</td>
        <td class="${clase}">${producto.stock}</td>
        <td>$ ${producto.precioFinal()}</td>
        <td>${producto.vendidos}</td>
        <td><button title="Vender unidades" onclick="venderById(${producto.id})">
        <i class="fas fa-shopping-cart"></i></button>
        <button title="Comprar a proveedor" onclick="comprarById(${producto.id})">
        <i class="fa fa-plus-square"></i></button>
        <button title="Ver más" onclick="verMas(${producto.id})">
        <i class="fas fa-info"></i></button></td>
        `
  })
}

//muestro los productos
mostrarArray(productos)

const verMas = (itemId) => {

  const producto = productos.find((prod) => prod.id === itemId)
  const arribos = producto.fechaLlegada()
  
  const fechaArribos = arribos.map((arribo) => {
    
    return tool.formatoDate(arribo)
    
  })
  mostrarModal()
  if (!arribos.length) {
    

    modalContainer.innerHTML = ` <div id="modal" class="modal">
        <h2>${producto.datos.nombre}</h2> 
        
        <h4>No tenes próximos pedidos</h4>  
        <button id="btn-salir">Salir</button>
        `
  } else {
    

    modalContainer.innerHTML = ` <div id="modal" class="modal">
        <h2>${producto.datos.nombre}</h2> 
        
        <h4>Faltan ${producto.fechaLlegada('dias')} días para que ingrese</h4>  
       
        <h3>Próximos arribos:</h3>
          <p>${fechaArribos}</p>
                  
                  
                  <button id="btn-salir">Salir</button>
    
      </div>`

  }
  // const divHistorial = document.querySelector('#historial-venta')
  // historial.forEach((hist) => {
  //   divHistorial.innerHTML += `
  //   <p>Fecha: ${hist.fecha} Cantidad: ${hist.cantidad}</p>
  //   `
  // })
      const salir = document.getElementById("btn-salir")
      salir.addEventListener("click", () => {
        modalContainer.classList.toggle("mostrar")
      })
  
}

const venderById = (itemId) => {
  //busco el producto según id
  const producto = productos.find((prod) => prod.id === itemId)
  mostrarModal()
  render.vender(producto)

  //boton cancelar intercambia clases para cerrar modal
  const cancelar = document.getElementById("btn-cancelar")
  cancelar.addEventListener("click", () => {
    modalContainer.classList.toggle("mostrar")
  })

  let inputCantidad = document.getElementById("input-cantidad")
  let btnAceptar = document.getElementById("btn-aceptar")

  //focus al input
  inputCantidad.focus()

  //llamo al método vender del objeto producto con la cantidad del input
  btnAceptar.addEventListener("click", () => {
    let cantidad = parseInt(inputCantidad.value)
    tool.venderProducto(producto, inputCantidad, cantidad)
  })
}



const comprarById = (itemId) => {
  let producto = productos.find((prod) => prod.id === itemId)
  let proveedor = proveedores.find(
    (prov) => prov.nombre === producto.datos.proveedor
  )

  mostrarModal()
  modalContainer.innerHTML = render.comprar(producto)

  let inputCantidad = document.getElementById("input-cantidad")
  let btnAceptar = document.getElementById("btn-aceptar")
  let btnCancelar = document.getElementById("btn-cancelar")

  btnCancelar.addEventListener("click", () => {
    modalContainer.classList.toggle("mostrar")
  })

  //focus al input
  inputCantidad.focus()

  btnAceptar.addEventListener("click", () => {
    let cantidad = parseInt(inputCantidad.value)
    proveedor.comprar(producto.id, cantidad)
    modalContainer.classList.toggle("mostrar")
    mostrarArray(productos)
    tool.guardarLs("productos", productos)
  })
}

//esto todavía no funciona
const editarById = (itemId) => {
  let producto = productos.find((prod) => prod.id === itemId)

  mostrarModal()

  modalContainer.innerHTML = `
  <div id="modal" class="modal">
  <h2>Editar</h2>
  <form id="form-editar" action="">
            <label for="nombre">Nombre</label>
                    <input type="text" id="nombre-producto" value="${
                      producto.datos.nombre
                    }">
            <label for="sku">SKU</label>
                    <input type="text" id="sku-producto" value="${
                      producto.sku
                    }">
            <label for="categoria">Categoría</label>
                    <select name="categoria" id="categoria-producto" >
                          <option value="${producto.datos.categoria}">${
    producto.datos.categoria
  }</option>
            </select>
            <label for="proveedor">Proveedor</label>
                    <select name="proveedor" id="proveedor-producto">
                          <option value="${producto.datos.proveedor}">${
    producto.datos.proveedor
  }</option>
            </select><br>
            <label for="descripcion">Descripción</label>

                    <input type="text" id="descripcion-producto" value="${
                      producto.datos.descripcion
                    }">
            <label for="precio-final">Precio Final</label>
                    <p>$${producto.precioFinal()}</p>
            <label for="rentabilidad">Rentabilidad</label> 
                    <input type="number" id="rentabilidad-producto" value="${
                      producto.rentabilidad
                    }">
            <label for="iva">IVA</label> 
                    <input type="number" id="iva-producto" value="${
                      producto.iva
                    }">
            <label for="stock">Stock Actual</label> 
                    <p id="producto-stock">${producto.stock}</p>
            <label for="vendidos">Vendidos</label> 
                    <p>${producto.vendidos}</p>
            <button id="btn-guardar">Guardar</button>
            <button id="btn-cancelar">Cancelar</button>
  </form>
</div>`

  let nombre = document.querySelector("#nombre-producto").value
  let categoria = document.querySelector("#categoria-producto").value
  let proveedor = document.querySelector("#proveedor-producto").value
  let descripcion = document.querySelector("#descripcion-producto").value
  let sku = document.querySelector("#sku-producto").value
  let iva = document.querySelector("#iva-producto").value
  let stock = document.querySelector("#producto-stock").value



  const btnGuardar = document.getElementById("btn-guardar")
  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault()
    producto.datos.nombre = nombre
    producto.datos.categoria = categoria
    producto.datos.proveedor = proveedor
    producto.datos.descripcion = descripcion
    producto.sku = sku
    producto.iva = iva
    producto.stock = stock


  })

  const btnCancelar = document.getElementById("btn-cancelar")
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault()
    modalContainer.classList.toggle("mostrar")
  })
}

const buscar = (busqueda) => {
  return productos.filter((prod) =>
    prod.datos.nombre.toLowerCase().includes(busqueda)
  )
}

//renderiza la busqueda debajo del buscador
const listaBusqueda = document.querySelector('#busqueda-productos')
const mostrarBusqueda = (busqueda) => {
  listaBusqueda.innerHTML = ''
  busqueda.forEach((prod) => {
    listaBusqueda.innerHTML += `<div class="resultado-busqueda">
    <h3>${prod.datos.nombre}<br></h3>
    <h4>SKU: ${prod.sku}</h>
    <p>Stock: ${prod.stock}</p>
    <p>Precio: $${prod.precioFinal()}</p>
  </div>`
  })
}

//event listener del input de busqueda. a medida que escribis llama a mostrarBusqueda()
const inputBuscador = $("#input-busqueda")
inputBuscador.on('focus', () => inputBuscador.animate({'width': '50%'}, 250)) 

inputBuscador.on('blur', () => {
  if(inputBuscador.val() === '') {inputBuscador.animate({'width': '10%'}, 100)}
})

inputBuscador.on("input", () => {
  if (inputBuscador.val() === "") {
    listaBusqueda.innerHTML = ''
  } else {
    const busqueda = inputBuscador.val().trim().toLowerCase()

    mostrarBusqueda(buscar(busqueda))
    //mostrarArray(buscar(busqueda))
  }
})

//para buscar también podes hacer click en la lupita y mostrar tu busqueda en la tabla
const btnBuscador = document.querySelector("#btn-buscar")
btnBuscador.addEventListener("click", () => {
  const busqueda = buscar(inputBuscador.value)
  listaBusqueda.html('')
  inputBuscador.value = ""
  mostrarArray(busqueda)
})

