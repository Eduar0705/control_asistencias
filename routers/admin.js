const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conxion_bd');

router.get("/admin", function(req, res) {
    if (!req.session || !req.session.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión.", link });
    }

    // Consulta 1: Contar usuarios con cargo = 2
    const countQuery = "SELECT COUNT(*) AS totalUsuariosCargo2 FROM usuarios WHERE cargo = 2";
    
    // Consulta 2: Obtener todos los usuarios con los campos requeridos
    const usersQuery = `
        SELECT 
            nombre, 
            email, 
            clave, 
            cedula, 
            puesto, 
            faltas, 
            asistencias, 
            Activo, 
            cargo 
        FROM usuarios
    `;

    // Ejecutamos ambas consultas en paralelo (mejor rendimiento)
    Promise.all([
        new Promise((resolve, reject) => {
            conexion.query(countQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results[0].totalUsuariosCargo2);
            });
        }),
        new Promise((resolve, reject) => {
            conexion.query(usersQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        })
    ])
    .then(([totalUsuariosCargo2, usuarios]) => {
        res.render("admin", { 
            datos: req.session,
            totalUsuariosCargo2,
            usuarios,  // Lista completa de usuarios
            link
        });
    })
    .catch(err => {
        console.error('Error en las consultas:', err);
        res.status(500).send('Error en el servidor');
    });
});

module.exports = router;