//IMPORTAR LIBRERIAS
const express = require('express');
const session = require('express-session');
const app = express();

//CONFIGURACION PARA LAS PAGUINAS DINAMICAS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//MANEJO DE SESION
app.use(session({
    secret:"tu_clave",
    resave: false,
    saveUninitialized: false
}));

//RUTAS ESTATICAS
app.use(express.static('public'));
app.use(require('./routers/login'));
app.use(require('./routers/logininit'));

//ADMINISTRACION
app.use(require('./routers/admin'));
app.use(require('./routers/Asistencias'));

//PUERTO DEL SERVIDOR
const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=>{
    if(PORT === 3002){
        console.log('http://localhost:3002');
    }else{
        console.log(PORT);
    }
})