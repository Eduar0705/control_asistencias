const conectar = require("mysql");

//Conexion WEB
const conexion = conectar.createConnection({
    host: "mysql-convivir.alwaysdata.net",
    database: "convivir_asistencias",
    user: "convivir",
    password: "31466704"
});

//Conexion Local
const conexion1 = conectar.createConnection({
    host: "localhost",
    database: "asistencias_bd",
    user: "root",
    password: ""
});

conexion.connect(function(err){
    if (err) {
        throw err;
    }else{
        console.log("Conexión exitosa a la base de datos");
    }
});

module.exports = conexion;