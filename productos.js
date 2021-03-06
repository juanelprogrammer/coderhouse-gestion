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
 


 
 //muestro las categor??as
 const categorias = tool.getCategorias()

  if (!categorias.length) {
    const catSelect = document.querySelector("#categorias")
    catSelect.innerHTML += `<option value="sin-categoria">No existen categor??as</option>`

  } else {

  categorias.forEach((cat) => {
    const catSelect = document.querySelector("#categorias")
    catSelect.innerHTML += `<option value="${cat}">${cat}</option>`
  })
  }
  
  //nueva categoria
  const btnNuevaCat = document.querySelector('#btn-nueva-categoria')
    btnNuevaCat.addEventListener('click', (e) => {
      e.preventDefault()
    const divNuevaCat = document.querySelector('#div-nueva-categoria')
    // creo el boton. creandolo con createelement en vez de escribirlo se ve mas lindo para llamarlo 
    // que creandolo con innerHTML y despues buscarlo con queryselector
    const btn = document.createElement('button')
    btn.innerHTML = 'Crear categor??a'
    divNuevaCat.innerHTML = `<input type="text" id="input-nueva-categoria">`
    divNuevaCat.appendChild(btn)
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const inputNuevaCat = document.querySelector('#input-nueva-categoria')
      if(!inputNuevaCat.value) return
      const catSelect = document.querySelector("#categorias")
      const option = document.createElement('option')
      option.value = inputNuevaCat.value
      option.innerHTML = inputNuevaCat.value
      catSelect.appendChild(option)
      catSelect.value = inputNuevaCat.value
      //vacio el div una vez "creada la cate" (en realidad nunca se crea, solo se asigna al prod y luego al listar las cat aparece)
      divNuevaCat.innerHTML = ''
    })
  

  })


  //capturo campos
  let costo = document.querySelector("#costo")
  let iva = document.querySelector("#iva")
  let rentabilidad = document.querySelector("#rentabilidad")
  let precioFinal = document.querySelector("#precio-final")

  //muestro precio final seg??n rentabilidad solo si ya completaste costo e iva (tengo que hacer que se actualice cuando cambio el costo, pero no se aplicar??a a la realidad tampoco)
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
  //env??o el form
  const btnGuardar = document.querySelector("#btn-guardar")
  const btnCancelar = document.querySelector("#btn-cancelar")
  
  //al cancelar tengo que verificar si puse datos en el form. si hay datos, preguntar para evitar que se borren sin querer
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault()

    let nombre = document.querySelector("#nombre-producto")
    let sku = document.querySelector("#sku")
    let descripcion = document.querySelector("#descripcion")

    //si est??n vacios, oculto modal
    if (
      nombre.value == "" &&
      sku.value == "" &&
      descripcion.value == "" &&
      costo.value == "" &&
      rentabilidad.value == "" &&
      iva.value == ""
    ) {
      modalContainer.classList.toggle("mostrar")
    } else if (confirm("??Seguro?")) {
      e.preventDefault()
      modalContainer.classList.toggle("mostrar")
    }
  })

  //al guardar valido datos y voy tirando lo que falta en el div de validaci??n
  btnGuardar.addEventListener("click", (e) => {
    const validacionDiv = document.querySelector("#validacion-div")
    e.preventDefault()
    validacionDiv.innerText = ""

    
    let proveedor = proveedores.find(prov => prov.nombre === inputProv.value)

    

    let nombre = document.querySelector("#nombre-producto")
    let sku = document.querySelector("#sku")
    let categoria = document.querySelector("#categorias")
    let descripcion = document.querySelector("#descripcion")
    let stock = document.querySelector("#stock-producto")

    
    if (!nombre.value || !sku.value || !proveedor) {
      e.preventDefault()
      validacionDiv.innerText = "Te falta alg??n dato del producto"
    } else if (!iva.value) {
      e.preventDefault()
      validacionDiv.innerText = "Necesitas indicar el % de IVA."
    } else if (!costo.value) {
      e.preventDefault()
      validacionDiv.innerText = "No podes dar de alta un producto sin costo."
    } else if (tool.buscarDuplicado(undefined,sku.value)) {
      e.preventDefault()
      validacionDiv.innerText = "Ya existe un producto con ese SKU."
    } else {
      e.preventDefault()

    const nuevoProducto = new Producto({
        datos: {
          nombre: nombre.value,
          categoria: categoria.value,
          proveedor: proveedor.id,
          descripcion: descripcion.value,
        },
        sku: sku.value,
        costo: parseFloat(costo.value),
        rentabilidad: !rentabilidad.value ? 1 : parseFloat(rentabilidad.value), //si la rentabilidad del form est?? en blanco, va rentabilidad 1
        iva: parseFloat(iva.value),
        stock: !stock.value ? 0 : parseInt(stock.value), //si el stock en el form est?? en blanco, va stock 0
        vendidos: 0,
      })

      //confirmo con el usuario
      if (confirm(`Est??s dando de alta ${nuevoProducto.datos.nombre} con ${nuevoProducto.stock} unidades`)) {
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


//despliega los productos en la tabla seg??n el array que le pase
const mostrarArray = (array) => {
  let tBody = document.getElementById("tbody-mostrar")

  //para arrancar veo q est?? vac??a, sino, la limpio
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
        <td>$ ${producto.precioFinal().toFixed(2)}</td>
        <td>${producto.vendidos}</td>
        <td><button title="Vender unidades" onclick="venderById(${producto.id})">
        <i class="fas fa-shopping-cart"></i></button>
        <button title="Ver m??s" onclick="verMas(${producto.id})">
        <i class="fas fa-info"></i></button>
        <button title="Editar" onclick="editarById(${producto.id})">
        <i class="fas fa-edit"></i></button>
        <button title="Eliminar" onclick="eliminarById(${producto.id})">
        <i class="fas fa-trash"></i></button></td>
        `
  })
}

//muestro los productos
mostrarArray(productos)

//el ver m??s me muestra info de llegada
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
    
    <h4>No tenes pr??ximos pedidos</h4>  
    
    <button class="btn-ir" onclick="window.location.href='./pedidos.html'">Ir a pedidos</button>
        
    <button id="btn-salir">Salir</button>
    `
  } else {
    
    
    modalContainer.innerHTML = ` <div id="modal" class="modal">
    <h2>${producto.datos.nombre}</h2> 
    
    <h3>Faltan ${producto.fechaLlegada('dias')} d??as para que ingrese</h4>  
    
    <h3>Pr??ximos arribos:</h3>
    <p>${fechaArribos}</p>
    
                  
                  <button id="btn-salir">Salir</button>
                  
                  </div>`

  }
                
                const salir = document.getElementById("btn-salir")
                salir.addEventListener("click", () => {
        modalContainer.classList.toggle("mostrar")
      })
  
}

//esto es solo para simular proceso de venta. 
const venderById = (itemId) => {
  //busco el producto seg??n id
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

  //llamo al m??todo vender del objeto producto con la cantidad del input
  btnAceptar.addEventListener("click", () => {
    let cantidad = parseInt(inputCantidad.value)
    tool.venderProducto(producto, inputCantidad, cantidad)
  })
}

//simulo proceso de compra a proveedor. ya est?? inutil, tiene que vincularse con la fecha de llegada del pedido
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


const editarById = (itemId) => {``
  const producto = productos.find((prod) => prod.id === itemId)

  mostrarModal()

  modalContainer.innerHTML = render.formEditarProducto(producto)


  //listo todos los proveedores 
  const provSelect = document.querySelector('#proveedor-producto')
  proveedores.forEach((prov) => {
    if(prov.id == producto.datos.proveedor) return
    provSelect.innerHTML += `<option value="${prov.id}">${prov.nombre}</option>`
  })




  //muestro las categor??as
  const categorias = tool.getCategorias()
  if (!categorias.length) {
    const catSelect = document.querySelector("#categoria-producto")
    catSelect.innerHTML += `<option value="sin-categoria">No existen categor??as</option>`

  } else {

  categorias.forEach((cat) => {
    const catSelect = document.querySelector("#categoria-producto")
    if(cat == producto.datos.categoria) return
    catSelect.innerHTML += `<option value="${cat}">${cat}</option>`
  })
  }
  
  //nueva categoria
  const btnNuevaCat = document.querySelector('#btn-nueva-categoria')
    btnNuevaCat.addEventListener('click', (e) => {
      e.preventDefault()
    const divNuevaCat = document.querySelector('#div-nueva-categoria')
    // creo el boton. creandolo con createelement en vez de escribirlo se ve mas lindo para llamarlo 
    // que creandolo con innerHTML y despues buscarlo con queryselector
    const btn = document.createElement('button')
    btn.innerHTML = 'Crear categor??a'
    divNuevaCat.innerHTML = `<input type="text" id="input-nueva-categoria">`
    divNuevaCat.appendChild(btn)
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const inputNuevaCat = document.querySelector('#input-nueva-categoria')
      if(!inputNuevaCat.value) return
      const catSelect = document.querySelector("#categoria-producto")
      const option = document.createElement('option')
      option.value = inputNuevaCat.value
      option.innerHTML = inputNuevaCat.value
      catSelect.appendChild(option)
      catSelect.value = inputNuevaCat.value
      //vacio el div una vez "creada la cate" (en realidad nunca se crea, solo se asigna al prod y luego al listar las cat aparece)
      divNuevaCat.innerHTML = ''
    })
  

  })


  const rentabilidadInput = document.querySelector('#rentabilidad-producto')
  const costoInput = document.querySelector('#costo-producto')
  const ivaInput = document.querySelector('#iva-producto')
  const precioFinal = document.querySelector('#producto-preciofinal')

  //controladores de los input asoaciados al precio final
  rentabilidadInput.addEventListener("input", () => {
    
    const rentabilidad = rentabilidadInput.value
    const iva = ivaInput.value
    const costo = costoInput.value

    if (costo && iva != undefined) {
      precioFinal.innerHTML = "$"
      precioFinal.innerHTML += parseFloat(
        tool.calcularPrecioFinal(
          parseFloat(costo),
          parseFloat(iva),
          parseFloat(rentabilidad))
      ).toFixed(2)
    }
  })
  costoInput.addEventListener("input", () => {
    
    const rentabilidad = rentabilidadInput.value
    const iva = ivaInput.value
    const costo = costoInput.value
   
    if (rentabilidad && iva != undefined) {
      precioFinal.innerHTML = "$"
      precioFinal.innerHTML += parseFloat(
        tool.calcularPrecioFinal(
          parseFloat(costo),
          parseFloat(iva),
          parseFloat(rentabilidad))
      ).toFixed(2)
    }
  })
  ivaInput.addEventListener("input", () => {
    
    const rentabilidad = rentabilidadInput.value
    const iva = ivaInput.value
    const costo = costoInput.value

    if (rentabilidad && costo != undefined) {
      precioFinal.innerHTML = "$"
      precioFinal.innerHTML += parseFloat(
        tool.calcularPrecioFinal(
          parseFloat(costo),
          parseFloat(iva),
          parseFloat(rentabilidad))
      ).toFixed(2)
    }
  })


  const btnGuardar = document.getElementById("btn-guardar")
  btnGuardar.addEventListener("click", (e) => {
    const validacionDiv = document.querySelector("#validacion-div")

    const prodIndex = productos.findIndex((prod) => prod.id === producto.id)

    const nombre = document.querySelector("#nombre-producto").value
    const categoria = document.querySelector("#categoria-producto").value
    const proveedor = document.querySelector("#proveedor-producto").value
    const descripcion = document.querySelector("#descripcion-producto").value
    const sku = document.querySelector("#sku-producto").value
    const iva = document.querySelector("#iva-producto").value
    const costo = document.querySelector('#costo-producto').value
    const rentabilidad = document.querySelector('#rentabilidad-producto')
    
    const duplicado = tool.buscarDuplicado(producto, sku)
    
    
    
    e.preventDefault()
    if (!nombre || !sku || !proveedor) {
      e.preventDefault()
      validacionDiv.innerText = "Te falta alg??n dato del producto"
    } else if (!iva) {
      e.preventDefault()
      validacionDiv.innerText = "Necesitas indicar el % de IVA."
    } else if (!costo) {
      e.preventDefault()
      validacionDiv.innerText = "No podes dar de alta un producto sin costo."
    } else if (duplicado) {
      e.preventDefault()
      validacionDiv.innerText = "Ya existe un producto con ese SKU."
    } else {
    e.preventDefault()
    
    producto.datos.nombre = nombre
    producto.datos.categoria = categoria
    producto.datos.proveedor = parseInt(proveedor)
    producto.datos.descripcion = descripcion
    
    producto.sku = sku
    
    producto.iva = parseFloat(iva)
    producto.costo = parseFloat(costo)
    producto.rentabilidad = parseFloat(rentabilidad.value)

    productos.splice(prodIndex, 1, producto)
    tool.guardarLs('productos', productos)
    modalContainer.classList.toggle("mostrar")
    mostrarArray(productos)
    }
  })

  const btnCancelar = document.getElementById("btn-cancelar")
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault()
    modalContainer.classList.toggle("mostrar")
  })
}

const eliminarById = (productoId) => {
  const productoIndex = productos.findIndex((prod) => prod.id == productoId)
  mostrarModal()

  modalContainer.innerHTML = render.confirmEliminar()
  
  const btnAceptar = document.querySelector('#btn-aceptar')
  const btnCancelar = document.querySelector('#btn-cancelar')
  
  btnAceptar.addEventListener('click', (e) => {
    e.preventDefault()
    productos.splice(productoIndex,1)
    tool.guardarLs('productos', productos)
    modalContainer.classList.toggle("mostrar")
    mostrarArray(productos)
  
  })
  
  btnCancelar.addEventListener('click', (e) => {
    e.preventDefault()
    modalContainer.classList.toggle("mostrar")
  
  })
  
  
}



//renderiza la busqueda debajo del buscador
const listaBusqueda = document.querySelector('#busqueda-productos')
const mostrarBusqueda = (busqueda) => {
  listaBusqueda.innerHTML = ''
  busqueda.forEach((prod) => {
    listaBusqueda.innerHTML += `<a href="#" title="Click para editar" onclick="editarById(${prod.id})"><div class="resultado-busqueda">
    <h3>${prod.datos.nombre}</h3>
    
    <h4>SKU: ${prod.sku}</h>
    <p>Stock: ${prod.stock}</p>
    <p>Precio: $${prod.precioFinal().toFixed(2)}</p>
  </div></a>`
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

    mostrarBusqueda(tool.buscarProd(busqueda))
    
  }
})

//para buscar tambi??n podes hacer click en la lupita y mostrar tu busqueda en la tabla
const btnBuscador = document.querySelector("#btn-buscar")
btnBuscador.addEventListener("click", () => {
  const busqueda = tool.buscarProd(inputBuscador.value)
  listaBusqueda.html('')
  inputBuscador.value = ""
  mostrarArray(busqueda)
})
