class Producto {
  constructor(obj) {
    this.id = productos.length + 1
    this.datos = {
      nombre: obj.datos.nombre,
      categoria: obj.datos.categoria,
      proveedor: obj.datos.proveedor,
      descripcion: obj.datos.descripcion,
    }
    this.sku = obj.sku
    this.costo = parseFloat(obj.costo)
    this.rentabilidad = obj.rentabilidad
    this.iva = parseFloat(obj.iva)
    this.stock = parseInt(obj.stock)
    this.vendidos = obj.vendidos
    //booleano que indica si hay stock bajo o no
    this.bajoStock = this.stock <= 5
  }
  precioFinal() {
    let total = this.costo + (this.costo * this.iva) / 100
    let precioFinal = total + (total * this.rentabilidad) / 100
    return precioFinal.toFixed(2)
  }
  vender(cantidad) {
      this.stock -= cantidad
      this.vendidos += cantidad
      const historial = {itemId: this.id, cantidad: cantidad, fecha: new Date()}
      historialVentas.push(new HistorialVenta(historial))
      tool.guardarLs("historial-ventas", historialVentas)

      console.log(`Vendiste ${cantidad} ${this.datos.nombre}`)
  }
  
  //devuelve array con las fechas de llegada del producto según los pedidos
  fechaLlegada(dias) {
    //inicio mi array
    const fechas = []
    //declaro el momento para hacer las comparaciones
    const hoy = new Date()
    //por cada pedido pusheo la fecha en MS al array fechas
    pedidos.forEach((pedido) => {
      pedido.productos.find((prod) => { 
        

        const arribo = new Date(pedido.arribo).getTime()
        if (prod.productoId === this.id) { fechas.push(arribo) }
      })
    })  
 
  //como está en MS puedo ordenarlo así se cual es la más próxima
  //y así el indice 0 siempre va a ser el más próximo
  fechas.sort((a,b) => a - b)

  //filtro y devuelvo solo un array con las próximas fechas,
  //ya que armé la clase sabien que necesito poder ver los pedidos que ya ingresaron
  const fechasFiltradas = fechas.filter((fecha) => {
    const arribo = new Date(fecha)
    if(arribo > hoy){
      return arribo
    }
  })

  //si le paso el string "dias" como param a la funcion me devuelve la cantidad de días que faltan
    if(dias === "dias"){
      //item 0 del array es la fecha más próxima
      const arribo = new Date(fechasFiltradas[0])
      const diasLeft = (arribo.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
      
      return diasLeft.toFixed()

  }
  return fechasFiltradas
  }

}

class Proveedor {
  constructor(obj) {
    this.id = proveedores.length + 1
    this.nombre = obj.nombre
    this.productos = []
    this.pedidos = []
  }
  listarProductos() {
    let listado = productos.filter(
      (producto) => producto.datos.proveedor === this.nombre
    )

    return listado
  }
  comprar(id, cantidad) {
    let listado = this.listarProductos()
    let producto = listado.find((prod) => prod.id === id)
    producto.stock = producto.stock + cantidad
    console.log(
      `compraste ${cantidad} unidades de ${producto.datos.nombre} a ${
        producto.costo * cantidad
      }`
    )
  }
}

class Pedido {
  constructor(obj) {
    this.id = pedidos.length + 1
    this.codigo = obj.codigo
    this.proveedor = obj.proveedor
    this.origen = obj.origen
    this.arribo = obj.arribo
    this.productos = obj.productos
    this.observaciones = obj.observaciones
  }
  diasFaltan() {
    const arribo = new Date(this.arribo)
    const hoy = new Date()
    const diasLeft = (arribo.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
    return Math.round(diasLeft)
  }
}


//todavía no implementado :(
class HistorialVenta {
  constructor(obj){
    this.itemId = obj.itemId
    this.cantidad = obj.cantidad
    this.fecha = obj.fecha
  }
  //la idea es agregar métodos que faciliten la visualizacion
}