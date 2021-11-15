const productos = []
const proveedores = []
const productosLs = JSON.parse(localStorage.getItem("productos"))
const proveedoresLs = JSON.parse(localStorage.getItem("proveedores"))

const tool = new Tool()

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
const btnImportarProd = document.querySelector('#importar-prod')
const btnImportarProv = document.querySelector('#importar-prov')
btnImportarProd.addEventListener('click', () => importarProductos() )
btnImportarProv.addEventListener('click', () => importarProveedores() )

function importarProductos() {
  productosDemo.forEach((prod) => productos.push(new Producto(prod)))
  tool.guardarLs('productos', productos)
  mostrarModal()
  modalContainer.innerHTML = `<div id="modal" class="modal">
                                <h3>Productos Importados</h3>
                                <button id="btn-aceptar">Aceptar</button>

                              </div>`
  const btnAceptar = document.querySelector('#btn-aceptar')
  btnAceptar.addEventListener('click', (e) => {
    e.preventDefault()
    mostrarModal()
  } )
}

function importarProveedores() {
  proveedoresDemo.forEach((prov) => proveedores.push(new Proveedor(prov)))
  tool.guardarLs('proveedores', proveedores)
  mostrarModal()
  modalContainer.innerHTML = `<div id="modal" class="modal">
                                <h3>Proveedores Importados</h3>
                                <button id="btn-aceptar">Aceptar</button>

                              </div>`
  const btnAceptar = document.querySelector('#btn-aceptar')
  btnAceptar.addEventListener('click', (e) => {
    e.preventDefault()
    mostrarModal()
  } )

}



