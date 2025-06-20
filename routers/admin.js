const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conxion_bd');

router.get("/admin", function (req, res) {
    if (!req.session || !req.session.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión.", link });
    }

    // OBTIENE A TODOS LOS ADMINISTRADORES O PROFESORES
    const adminQuery = `
        SELECT nombre, email, clave, cedula, puesto, faltas, asistencias, Activo, cargo 
        FROM usuarios 
        WHERE cargo = 1
    `;

    // OBTIENE A TODOS LOS ESTUDIANTES O USUARIOS
    const usersQuery = `
        SELECT nombre, email, clave, cedula, puesto, faltas, asistencias, Activo, cargo 
        FROM usuarios 
        WHERE cargo = 2
    `;

    // EJECUTA AMBAS CONSULTAS EN PARALELO
    Promise.all([
        new Promise((resolve, reject) => {
            conexion.query(adminQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            conexion.query(usersQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        })
    ])
    .then(([admins, usuarios]) => {
        // ASEGÚRATE DE QUE AMBAS VARIABLES EXISTAN
        res.render("admin", { 
            datos: req.session,
            admins: admins || [],      // Si admins es null/undefined, usa array vacío
            usuarios: usuarios || [],   // Si usuarios es null/undefined, usa array vacío
            link
        });
    })
    .catch(err => {
        console.error('Error en las consultas:', err);
        res.status(500).send('Error en el servidor');
    });
});

module.exports = router;