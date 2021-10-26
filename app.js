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

const importarProductos = () => {
  productosDemo.forEach((prod) => productos.push(new Producto(prod)))
  guardarLs('productos', productos)
}

const importarProveedores = () => {
  proveedoresDemo.forEach((prov) => proveedores.push(new Proveedor(prov)))
  guardarLs('proveedores', proveedores)
}

function guardarLs(key, array) {
  localStorage.setItem(key, JSON.stringify(array))
}

const btnImportarProd = document.querySelector('#importar-prod')
const btnImportarProv = document.querySelector('#importar-prov')
btnImportarProd.addEventListener('click', () => importarProductos() )
btnImportarProv.addEventListener('click', () => importarProveedores() )