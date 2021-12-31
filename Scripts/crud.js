//variable
var nuevoId;
var db= openDatabase("itemDB", "1.0", "itemDB", 65535);

//limpiar los inputs
function limpiar() {
    document.getElementById("item").value="";
    document.getElementById("precio").value="";   
}


//Eliminar un registro de la tabla
function eliminarRegistro() {
$(document).one('click', 'button[type ="button"]', function(event){
    let id=this.id;
    var lista=[];
    $("#listaProductos").each(function(){
        var celda=$(this).find('tr.Reg_'+id);
        celda.each(function(){
            var registro=$(this).find('span.mid');
            registro.each(function(){
                lista.push($(this).html())
            })
        })
    })
    nuevoId = lista[0].substr(1);
    db.transaction(function(transaction){
        var sql  = "DELETE FROM productos WHERE id="+nuevoId+";";
        transaction.executeSql(sql, undefined, function(){
            alert("Registro borrado satisfactoriamente. Por favor actualica la tabla");
        }, function(transaction, err){
            alert(err.message)
        })
    })
})   
}

//Editar un registro
function editar() {
    $(document).one('click', 'button[type ="button"]', function(event){
        let id=this.id;
        var lista=[];
        $("#listaProductos").each(function(){
            var celda=$(this).find('tr.Reg_'+id);
            celda.each(function(){
                var registro=$(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
                })
            })
        })
        document.getElementById("item").value=lista[1];
        document.getElementById("precio").value=lista[2].slice(0,-5);
        nuevoId=lista[0].substr(1);   
    })
}

$(function(){

    //crear la tabla de los productos
    $("#crear").click(function(){
        db.transaction(function(transaction){
            var sql = "CREATE TABLE productos" +
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "item VARCHAR(100) NOT NULL," + 
            "precio DECIMAL(5,2) NOT NULL )";
            transaction.executeSql(sql, undefined, function(){
                alert("tabla creada satisfactoriamente");
            },function(transaction, err){
                alert(err.message);
            } )
        })
    })

    //cargar los datos de la tabla
    $("#listar").click(function(){
        cargarDatos();
    })

    function cargarDatos() {
        $("#listaProductos").children().remove();
        db.transaction(function(transaction){
            var sql= "SELECT * FROM productos ORDER BY id DESC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    $("#listaProductos").append('<tr><th>Código</th><th>Producto</th> <th>Precio</th><th></th><th></th></tr>')
                    for(i = 0; i< result.rows.length; i++){
                        var row =result.rows.item(i);
                        var item = row.item;
                        var id = row.id;
                        var precio = row.precio;
                        $("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
                        id+'</span></td><td><span>'+item+'</span></td><td><span>'+
                        precio+' USD$</span></td><td><button class="btn btn-success" type = "button" id="A'+id
                        +'" onclick = "editar()"><img src="/imagenes/Editar.png"></button></td><td><button type="button" id="A'+
                        id+'" class="btn btn-danger" onclick ="eliminarRegistro()"><img src="/imagenes/eliminar.png"></button></td></tr>');
                    } 
                }
                else{
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existen registro de productos</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message)
            })
        })
        
    }

    //insertar datos a la tabla
    $("#insertar").click(function(){
        var item = $("#item").val();
        var precio = $("#precio").val();
        db.transaction(function(transaction){
            var sql ="INSERT INTO productos (item, precio) VALUES (?, ?)";
            transaction.executeSql(sql,[item, precio], function(){

            }, function(transaction, err){
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })


    //modifica el registro de la tabla
    $("#modificar").click(function(){
        var nprod = $("#item").val();
        var nprecio = $("#precio").val();

        db.transaction(function(transaction){
            var sql = "UPDATE productos SET item='"+nprod+"', precio='"+nprecio+"' WHERE id="+nuevoId+";"
            transaction.executeSql(sql,undefined, function(){
                cargarDatos();
                limpiar()
            },function(transaction, err){
                alert(err.message)
            })
        })     
    })

    //borrar toda la tabla
    $("#borrarTodo").click(function(){
        if(!confirm("¿Esta seguro que deseas borrar la tabla?, los datos se perderan"))
        return;
        db.transaction(function(transaction){
            var sql = "DROP TABLE productos";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla borrada satisfactoriamente")
                cargarDatos();
            },function(transaction, err){
                alert(err.message);
            })
        })
    })



})