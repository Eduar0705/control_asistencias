//logininit.js
const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conxion_bd');

router.post('/logininit', (req, res)=>{
    const {email, password} = req.body;

    let mensaje;
    if(!email || !password){
        mensaje = 'Credenciales incorrectas';
        return res.render('login', { mensaje, link });
    }

    const validar = `SELECT * FROM usuarios WHERE email = ? AND clave = ?`;
    conexion.query(validar, [email, password], (err, rows) =>{
        if(err){
            console.log('Error en la conexion a base de datos',err);
            return res.status(500).send('Error en el servidor');
        }
        if(rows.length <= 0){
            mensaje = 'Correo o clave son incorrectas';
            return res.render('login', { mensaje, link });
        }
        const users = rows[0];

        //ALMACEN DE SESION
        req.session.login = true;
        req.session.userId = users.id;
        req.session.nombre = users.nombre;
        req.session.email = users.email;
        console.log(req.session);

        const contador = `SELECT COUNT(*) AS total FROM usuarios`;
        conexion.query(contador, (error, resul) =>{
            if(error){
                console.log('Error al contar los usuarios',error);
                return res.status(500).send("Error al contar usuarios");
            }
            req.session.totalUsuarios = resul[0].total;
            console.log("Total de usuarios registrados:", req.session.totalUsuarios);

            if(users.cargo === 1){
                return res.redirect('/admin');
            }else if(users.cargo === 2){
                return res.redirect('/user');
            }else{
                mensaje = 'Cargo no encontrado';
                return res.render('login', { mensaje, link });
            }
        });
    });
});
module.exports = router;