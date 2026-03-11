require('dotenv').config();
const express = require('express');
const {
    obtenerDatosSheet,
    detectarCelebraciones,
    enviarWhatsApp
} = require('./index');

/**
 * Agente HTTP de Automatización Pastoral
 * Expone endpoint POST /run-automatización para ejecutar el proceso
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

/**
 * Endpoint principal: Ejecuta la automatización pastoral
 * POST /run-automatizacion
 */
app.post('/run-automatizacion', async (req, res) => {
    console.log('🔄 Iniciando automatización pastoral...');
    console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-ES')}`);
    console.log('');

    try {
        // 1. Obtener datos del Google Sheet
        console.log('📊 Obteniendo datos del Google Sheet...');
        const datos = await obtenerDatosSheet();
        console.log(`   ✅ Se obtuvieron ${datos.length} registros`);
        console.log('');

        // 2. Detectar celebraciones del día
        console.log('🔍 Buscando celebraciones de hoy...');
        const celebraciones = detectarCelebraciones(datos);

        if (celebraciones.length === 0) {
            console.log('   ℹ️  No hay celebraciones hoy');
            return res.json({
                status: 'ok',
                mensaje: 'No hay celebraciones hoy'
            });
        }

        console.log(`   ✅ Se encontraron ${celebraciones.length} celebraciones:`);
        celebraciones.forEach((celebracion, index) => {
            console.log(`   ${index + 1}. ${celebracion.tipo}: ${celebracion.nombre} (${celebracion.telefono})`);
        });
        console.log('');

        // 3. Enviar mensajes por WhatsApp
        console.log('📱 Enviando mensajes por WhatsApp...');
        let enviados = 0;
        let fallidos = 0;

        for (const celebracion of celebraciones) {
            const exito = await enviarWhatsApp(celebracion.telefono, celebracion.mensaje);
            if (exito) {
                enviados++;
            } else {
                fallidos++;
            }

            // Pequeña pausa entre mensajes para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('');
        console.log('📊 Resumen:');
        console.log(`   ✅ Enviados: ${enviados}`);
        console.log(`   ❌ Fallidos: ${fallidos}`);
        console.log('');
        console.log('✨ Proceso completado');

        // Respuesta exitosa con mensajes enviados
        return res.json({
            status: 'ok',
            mensajes_enviados: enviados
        });

    } catch (error) {
        console.error('❌ Error en el proceso:', error.message);
        return res.status(500).json({
            status: 'error',
            mensaje: error.message
        });
    }
});

/**
 * Endpoint de health check
 * GET /health
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        servicio: 'Automatización Pastoral',
        timestamp: new Date().toISOString()
    });
});

/**
 * Endpoint de información
 * GET /
 */
app.get('/', (req, res) => {
    res.json({
        servicio: 'Agente HTTP de Automatización Pastoral',
        version: '1.0.0',
        endpoints: {
            'POST /run-automatizacion': 'Ejecuta el proceso de envío de felicitaciones',
            'GET /health': 'Health check del servicio'
        }
    });
});

/**
 * Manejador de rutas no encontradas
 */
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        mensaje: 'Endpoint no encontrado'
    });
});

/**
 * Manejador de errores globales
 */
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);
    res.status(500).json({
        status: 'error',
        mensaje: 'Error interno del servidor'
    });
});

/**
 * Iniciar el servidor
 */
app.listen(PORT, "0.0.0.0", () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   🙏 Automatización Pastoral - Agente HTTP   ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('');
    console.log('📌 Endpoints disponibles:');
    console.log(`   POST http://localhost:${PORT}/run-automatizacion`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log('');
    console.log('⏳ Esperando solicitudes...');
    console.log('');
});

module.exports = app;
