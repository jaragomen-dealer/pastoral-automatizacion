require('dotenv').config();
const axios = require('axios');
const { google } = require('googleapis');

/**
 * Script de Automatización Pastoral
 * Envía felicitaciones por WhatsApp basado en datos de Google Sheets
 */

// Configuración desde variables de entorno
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

/**
 * Obtiene los datos del Google Sheet
 * @returns {Promise<Array>} Array de objetos con los datos de las familias
 */
async function obtenerDatosSheet() {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: "'Configuración de Google Sheet para Base de Datos'!A:Z",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
        console.log('No se encontraron datos en la hoja');
        return [];
    }

    // La primera fila contiene los encabezados
    const headers = rows[0];

    // Convertir las filas restantes en objetos
    const datos = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        return obj;
    });

    return datos;
}

/**
 * Verifica si una fecha coincide con el día y mes actual
 * @param {string} fechaStr - Fecha en formato DD/MM/YYYY o similar
 * @returns {boolean} True si es hoy
 */
function esHoy(fechaStr) {
    if (!fechaStr) return false;

    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth() + 1; // Los meses en JS van de 0 a 11

    // Intentar parsear la fecha en diferentes formatos
    const partes = fechaStr.split('/');
    if (partes.length >= 2) {
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);

        return dia === diaHoy && mes === mesHoy;
    }

    return false;
}

/**
 * Detecta las celebraciones del día
 * @param {Array} datos - Array de objetos con los datos de las familias
 * @returns {Array} Array de objetos con las celebraciones detectadas
 */
function detectarCelebraciones(datos) {
    const celebraciones = [];

    datos.forEach(familia => {
        // Verificar aniversario
        if (familia['Aniversario'] && esHoy(familia['Aniversario'])) {
            celebraciones.push({
                tipo: 'aniversario',
                nombre: familia['Esposos'],
                telefono: familia['WhatsApp'],
                mensaje: generarMensajeAniversario(familia['Esposos'])
            });
        }

        // Verificar cumpleaños de hijos
        for (let i = 1; i <= 4; i++) {
            const nombreHijo = familia[`Hijo${i}`];
            const fechaNacimiento = familia[`FechaNacimiento${i}`];

            if (nombreHijo && fechaNacimiento && esHoy(fechaNacimiento)) {
                celebraciones.push({
                    tipo: 'cumpleaños',
                    nombre: nombreHijo,
                    telefono: familia['WhatsApp'],
                    mensaje: generarMensajeCumpleaños(nombreHijo)
                });
            }
        }
    });

    return celebraciones;
}

/**
 * Genera mensaje de felicitación de cumpleaños
 * @param {string} nombre - Nombre del cumpleañero
 * @returns {string} Mensaje formateado
 */
function generarMensajeCumpleaños(nombre) {
    return `🎉 Feliz cumpleaños ${nombre}. La Pastoral Familiar ora por ti 🙏`;
}

/**
 * Genera mensaje de felicitación de aniversario
 * @param {string} esposos - Nombres de los esposos
 * @returns {string} Mensaje formateado
 */
function generarMensajeAniversario(esposos) {
    return `💍 Feliz aniversario ${esposos}. Dios bendiga su hogar 🙏`;
}

/**
 * Envía un mensaje por WhatsApp usando la Cloud API
 * @param {string} telefono - Número de teléfono (con código de país)
 * @param {string} mensaje - Texto del mensaje
 * @returns {Promise<boolean>} True si se envió correctamente
 */
async function enviarWhatsApp(telefono, mensaje) {
    try {
        // Limpiar y formatear el número de teléfono
        let telefonoFormateado = telefono.replace(/\D/g, ''); // Eliminar caracteres no numéricos

        // Asegurar que tenga el código de país (ejemplo: +52 para México)
        if (!telefonoFormateado.startsWith('+')) {
            telefonoFormateado = '+' + telefonoFormateado;
        }

        const url = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: telefonoFormateado,
            type: 'text',
            text: {
                body: mensaje
            }
        };

        const headers = {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(url, payload, { headers });

        console.log(`✅ Mensaje enviado a ${telefonoFormateado}: ${mensaje}`);
        return true;

    } catch (error) {
        console.error(`❌ Error al enviar mensaje a ${telefono}:`, error.response?.data || error.message);
        return false;
    }
}

/**
 * Función principal que orquesta todo el proceso
 */
async function main() {
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
            return;
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

    } catch (error) {
        console.error('❌ Error en el proceso principal:', error.message);
        process.exit(1);
    }
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = {
    main,
    detectarCelebraciones,
    enviarWhatsApp,
    obtenerDatosSheet,
    generarMensajeCumpleaños,
    generarMensajeAniversario
};
