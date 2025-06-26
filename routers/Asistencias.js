const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conxion_bd');

// Mostrar página de asistencias
router.get("/admin/asistencias", function (req, res) {
    if (!req.session || !req.session.login) {
        return res.redirect("/login", { mensaje: "Por favor, inicia sesión.", link });
    }

    // Consulta para obtener solo estudiantes (cargo = 2)
    const estudiantesQuery = `
        SELECT id_usuario, nombre, email, cedula, asistencias, faltas, departamento 
        FROM usuarios 
        WHERE cargo = 2
        ORDER BY nombre
    `;

    conexion.query(estudiantesQuery, (err, estudiantes) => {
        if (err) {
            console.error('Error al cargar estudiantes:', err);
            return res.status(500).send('Error al cargar estudiantes');
        }
        
        res.render("admin/asistencias", { 
            datos: req.session,
            estudiantes: estudiantes,
            link
        });
    });
});

// Guardar asistencias masivas del día
router.post('/admin/asistencias/guardar', async (req, res) => {
    const { asistencias, fecha } = req.body;

    // Validación de datos
    if (!asistencias || typeof asistencias !== 'object') {
        return res.status(400).json({ 
            success: false,
            message: 'Datos de asistencias no proporcionados o formato incorrecto' 
        });
    }

    try {
        // Crear arrays de usuarios presentes y ausentes
        const sumarAsistencias = [];
        const sumarFaltas = [];
        
        Object.entries(asistencias).forEach(([id_usuario, presente]) => {
            // Convertir a booleano por si viene como string
            const estaPresente = presente === 'true' || presente === true;
            
            if (estaPresente) {
                sumarAsistencias.push(id_usuario);
            } else {
                sumarFaltas.push(id_usuario);
            }
        });

        // Ejecutar actualizaciones en lotes
        if (sumarAsistencias.length > 0) {
            await conexion.query(
                'UPDATE usuarios SET asistencias = asistencias + 1 WHERE id_usuario IN (?)',
                [sumarAsistencias]
            );
        }

        if (sumarFaltas.length > 0) {
            await conexion.query(
                'UPDATE usuarios SET faltas = faltas + 1 WHERE id_usuario IN (?)',
                [sumarFaltas]
            );
        }

        // Mensaje de éxito en sesión
        req.session.message = {
            type: 'success',
            text: 'Asistencias actualizadas correctamente'
        };
        
        res.redirect('/admin/asistencias');
    } catch (err) {
        console.error('Error al guardar asistencias:', err);
        
        // Mensaje de error en sesión
        req.session.message = {
            type: 'danger',
            text: 'Error al actualizar asistencias'
        };
        
        res.redirect('/admin/asistencias');
    }
});

// Editar asistencias individuales
router.post('/admin/asistencias/editar/:id', (req, res) => {
    const { id } = req.params;
    const { asistencias, faltas } = req.body;

    const updateQuery = `
        UPDATE usuarios 
        SET asistencias = ?, faltas = ? 
        WHERE id_usuario = ?
    `;

    conexion.query(updateQuery, [asistencias, faltas, id], (err, result) => {
        if (err) {
            console.error('Error al editar asistencias:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Error al editar asistencias' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Estudiante no encontrado' 
            });
        }
        
        req.session.message = {
            type: 'success',
            text: 'Asistencias editadas correctamente'
        };
        res.redirect('/admin/asistencias');
    });
});

// Ruta para obtener datos de un estudiante específico (para el modal de edición)
router.get('/admin/asistencias/estudiante/:id', (req, res) => {
    const { id } = req.params;
    
    conexion.query(
        'SELECT id_usuario, nombre, asistencias, faltas FROM usuarios WHERE id_usuario = ?',
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener datos' });
            }
            
            if (result.length === 0) {
                return res.status(404).json({ error: 'Estudiante no encontrado' });
            }
            
            res.json(result[0]);
        }
    );
});

module.exports = router;