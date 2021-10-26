//utilidad para tirar los form y no tenerlos en cada función re molesto
class Render {
    constructor() {}
    formAltaProducto() {
       
        return `
    <div id="modal" class="modal">
    <h2>Nuevo Producto</h2>
    <form id="form-crear" action="">
              <label for="nombre">Nombre</label>
                      <input type="text" id="nombre-producto">
              <label for="sku">SKU</label>
                      <input type="text" id="sku" value="">
              <label for="categorias">Categoría</label>
              <input type="text" list="categorias" />
              <datalist id="categorias">
               
              </datalist>
              </select>
              <label for="proveedores">Proveedor</label>
              <input type="text" list="proveedores" />
              <datalist id="proveedores">
               
              </datalist><br>
              <label for="descripcion">Descripción</label>
                      <input type="text" id="descripcion"><br>
              <label for="precio-final">Precio Final</label>
                      <p id="precio-final">$</p>
              <label for="costo">Costo</label> 
                      <input type="number" id="costo" value="">        
              <label for="iva">IVA</label> 
                      <input type="number" id="iva" value="">
              <label for="rentabilidad">Rentabilidad</label> 
                      <input type="number" id="rentabilidad" value="">
              <label for="stock">Stock</label> 
                      <input type="number" id="stock-producto"><br>
              <div id="validacion-div"></div>
              <button id="btn-guardar">Guardar</button>
              <button id="btn-cancelar">Cancelar</button>
    </form>
  </div>`
  
    }
    formNuevoPedido() {

        return `
        <div id="modal" class="modal">
        <form id="form-pedido">
                        <label for="proveedores">Proveedor</label>
                        <div class="dropdown">
                        <input type="text" autocomplete="off" placeholder="Buscar..." id="input-prov">
                        <div id="resultado-busqueda-prov">
                        
                        
                        </div>
                      </div>
                       
                        <label for="codigo">Codigo</label>
                                <input type="text" id="codigo-pedido"><br>
                        <label for="origen">Origen</label>
                        <input type="text" id="origen-pedido"><br>
                        <label for="cantidad-producto">Cantidad</label>
                        <input type="number" id="cantidad">
                        
                        <label for="productos">Producto</label>
                        <div class="dropdown">
                        <input type="text" autocomplete="off" placeholder="Buscar..." id="input-prod">
                        <div id="resultado-busqueda-prod">
                        
                        
                        </div>
                      </div>
                      <br>
                        <button id="btn-agregar">Agregar</button>
                        <button id="btn-borrar">Borrar</button>
                        <div id="productos-agregados">
                          <table id="tabla-productos">
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Cantidad</th>
                                      <th>Producto</th>
                                  </tr>
                              </thead>
                                  
                          </table>
                        </div>
                
                        <label for="arribo">Fecha estimada de arribo:</label> 
                                <input type="date" id="fecha-arribo"><br>
                        <label for="observaciones">Observaciones</label><br>
                                <textarea id="observaciones" rows="10" cols="50"></textarea><br>
                        <div id="validacion-div"></div>
                        <button id="btn-guardar">Guardar</button>
                        <button id="btn-cancelar">Cancelar</button>
                </form>
                </div>
                `
    }
    formNuevoProveedor() {
        return `
        <div id="modal" class="modal">
        <h2>Alta Proveedor</h2>
        <form id="alta-proveedor" action="">
                  <label for="nombre">Nombre</label>
                          <input type="text" id="nombre-proveedor" placeholder="Nombre sin espacios">
                 
                  <div id="validacion-div"></div>
                  <button id="btn-guardar">Guardar</button>
                  <button id="btn-cancelar">Cancelar</button>
        </form>
      </div>`
    }
    comprar(producto) {
        return `
        <div id="modal" class="modal">
          <h2>Comprar</h2>
          <span>${producto.datos.nombre}</span><br>
          <span>Proveedor: ${producto.datos.proveedor}</span><br>
          <label for="input-cantidad">Cantidad:</label>
          <input type="number" id="input-cantidad">
          <button id="btn-aceptar">Aceptar</button><button id="btn-cancelar">Cancelar</button>
        </div>`
    }
    vender(producto) {
        let controlStock =
        producto.stock === 0
          ? "No hay más stock"
          : `Quedan ${producto.stock} unidades`
      modalContainer.innerHTML = `
      <div id="modal" class="modal">
        <h2>Vender</h2>
        <span>${producto.datos.nombre}</span>
        <input type="name" id="input-cantidad" placeholder="${controlStock}">
        <button id="btn-aceptar">Aceptar</button><button id="btn-cancelar">Cancelar</button>
      </div>`
    }  
    
}

class Tool {
    constructor() {}
    
    guardarLs(key, array) {
        localStorage.setItem(key, JSON.stringify(array))
      }
    //funcion calcula precio final para ir mostrandolo
    calcularPrecioFinal(costo, iva, rentabilidad) {
        let total = costo + (costo * iva) / 100
        console.log(total)
        let precioFinal = total + (total * rentabilidad) / 100
        return precioFinal.toFixed(2)
      }

    buscarDuplicado = (sku) => {
        return productos.find((prod) => prod.sku === sku)
      }

    ordenar = (array) => {
        if (ordenarSelect.value === "nombre") {
          array.sort((a, b) => {
            if (a.datos.nombre < b.datos.nombre) {
              return -1
            }
            if (a.datos.nombre > b.datos.nombre) {
              return 1
            }
            return 0
          })
        } else if (ordenarSelect.value === "precio") {
          array.sort((a, b) => b.precioFinal() - a.precioFinal())
        } else if (ordenarSelect.value === "id") {
          array.sort((a, b) => a.id - b.id)
        } else if (ordenarSelect.value === "stock") {
          array.sort((a, b) => b.stock - a.stock)
        }
        return array
      }

    venderProducto(producto, inputCantidad, cantidad) {
        if (producto.stock === 0) {
          inputCantidad.value = ""
          inputCantidad.placeholder = "No hay más stock :("
        } else if (producto.stock < cantidad) {
          inputCantidad.value = ""
          inputCantidad.placeholder = `¡Solo quedan ${producto.stock}!`
        } else {
          producto.vender(cantidad)
          modalContainer.classList.toggle("mostrar")
          mostrarArray(productos)
          this.guardarLs("productos", productos)
        }
      }
    buscarProducto(busqueda) {
          return productos.filter((prod) => prod.datos.nombre.toLowerCase().includes(busqueda))
      }
    buscarProveedor(busqueda) {
        return proveedores.filter((prov) => prov.nombre.toLowerCase().includes(busqueda))
      }
    
    formatoDate(date) {
    const fecha = new Date(date)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    return dia + '/' + mes + '/' + anio 
    }
    dolar() {

      
      const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales'
      
      mostrarModal()  
      const modalContainer = document.querySelector('#modal-container')
      modalContainer.innerHTML = ''
      const div = document.createElement('div')
      div.className = 'modal'
      modalContainer.appendChild(div)

      //llamado a la api 
      $.ajax({
        type: 'GET',
        url: url,
        success: (data) => {
          const dolar = data[0].casa.venta
          div.innerHTML = ` 
          <h2>La cotización oficial del dolar hoy es $ ${dolar}</h2>
          <button id="btn-salir">Salir</button>
          `
          const salir = document.querySelector("#btn-salir")
          salir.addEventListener("click", () => {
            modalContainer.classList.toggle("mostrar")
            
          })
        },
      });
            
    }

//
}