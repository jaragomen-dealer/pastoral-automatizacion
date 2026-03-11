# Guía de Configuración - Railway + n8n

## Resumen del Proyecto

Este proyecto ahora funciona como un **Agente HTTP** que puede ser llamado desde n8n para ejecutar la automatización pastoral.

## Archivo del Servidor

**[server.js](server.js)** - Servidor Express con endpoint POST `/run-automatizacion`

## Archivo de Lógica

**[index.js](index.js)** - Contiene toda la lógica reutilizable:
- `obtenerDatosSheet()` - Obtiene datos del Google Sheet
- `detectarCelebraciones(datos)` - Detecta celebraciones del día
- `enviarWhatsApp(telefono, mensaje)` - Envía mensajes por WhatsApp

## Estructura de Archivos

```
pastoral-automatizacion/
├── server.js           # 🆕 Servidor HTTP Express
├── index.js            # Lógica reutilizable (exporta funciones)
├── package.json        # 🔄 Actualizado con Express
├── .env.example        # 🔄 Actualizado con PORT
├── .gitignore          # Archivos ignorados por Git
└── README.md           # 🔄 Instrucciones actualizadas
```

## Variables de Entorno

El archivo `.env` debe contener:

```env
PORT=3000
WHATSAPP_TOKEN=tu_token_aqui
PHONE_ID=tu_phone_id_aqui
SHEET_ID=tu_sheet_id_aqui
GOOGLE_API_KEY=tu_api_key_aqui
```

## Instalación

```bash
# Instalar dependencias (incluye Express)
npm install
```

## Ejecución Local

```bash
# Iniciar servidor HTTP
npm start

# O ejecutar como script standalone (sin servidor)
npm run standalone
```

## Testing del Endpoint

```bash
# Health check
curl http://localhost:3000/health

# Ejecutar automatización
curl -X POST http://localhost:3000/run-automatizacion
```

## Respuestas del Endpoint

### Con mensajes enviados:
```json
{
  "status": "ok",
  "mensajes_enviados": 3
}
```

### Sin celebraciones:
```json
{
  "status": "ok",
  "mensaje": "No hay celebraciones hoy"
}
```

### Con error:
```json
{
  "status": "error",
  "mensaje": "Error al obtener datos del Sheet"
}
```

## Deployment en Railway

### 1. Preparar Repositorio

```bash
git init
git add .
git commit -m "Automatización Pastoral HTTP Agent"
git remote add origin https://github.com/TU_USUARIO/pastoral-automatizacion.git
git push -u origin main
```

### 2. Desplegar en Railway

1. Ve a [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repositorio
4. Railway detectará Node.js automáticamente

### 3. Configurar Variables en Railway

En la sección "Variables" de tu proyecto Railway:

```
PORT=3000
WHATSAPP_TOKEN=tu_token_real
PHONE_ID=tu_phone_id_real
SHEET_ID=tu_sheet_id_real
GOOGLE_API_KEY=tu_api_key_real
```

### 4. URL del Servicio

Railway te asignará una URL como:
```
https://pastoral-automatizacion-production.up.railway.app
```

Tu endpoint estará en:
```
https://pastoral-automatizacion-production.up.railway.app/run-automatizacion
```

## Integración con n8n

### Opción 1: HTTP Request en n8n

1. En n8n, crea un workflow
2. Agrega el nodo **HTTP Request**
3. Configura:
   - **Method**: POST
   - **URL**: `https://tu-app.railway.app/run-automatizacion`
   - **Authentication**: None
4. Conecta a un nodo **Schedule** para ejecutar automáticamente

### Opción 2: Webhook en n8n

Alternativamente, puedes hacer que Railway llame a un webhook de n8n:

1. En n8n, crea un workflow con nodo **Webhook**
2. Copia la URL del webhook
3. En Railway, puedes configurar que tu endpoint llame al webhook de n8n

## Cron Job en n8n

Para ejecutar diariamente a las 9:00 AM:

1. Agrega nodo **Schedule** al inicio
2. Configura:
   - **Trigger Interval**: Daily
   - **Hour**: 9
   - **Minute**: 0
3. Conecta al nodo **HTTP Request** que llama a tu endpoint de Railway

## Ventajas de esta Arquitectura

✅ **Reutilización de código**: La lógica está en `index.js` y se puede usar standalone o via HTTP
✅ **Sin duplicación**: `server.js` importa y reutiliza las funciones de `index.js`
✅ **Modularidad**: Fácil agregar nuevos endpoints sin modificar la lógica
✅ **Escalabilidad**: Railway maneja el hosting y scaling automáticamente
✅ **Integración**: n8n puede llamar al endpoint fácilmente
✅ **Logging**: Console logs visibles en Railway deployments
✅ **Health checks**: Endpoint `/health` para monitoreo

## Ejemplo de Flujo Completo

```
┌─────────────┐      POST /run-automatizacion      ┌──────────────┐
│     n8n     │ ──────────────────────────────────▶ │    Railway   │
│  (Schedule) │                                     │   (server.js) │
└─────────────┘                                     └──────────────┘
                                                           │
                                                           ▼
                                                    ┌──────────────┐
                                                    │   index.js   │
                                                    │  (lógica)    │
                                                    └──────────────┘
                                                           │
                                                           ▼
                                                    ┌──────────────┐
                                                    │  WhatsApp    │
                                                    │    +         │
                                                    │ Sheets API   │
                                                    └──────────────┘
```

## Logs y Monitoreo

En Railway:
1. Ve a tu proyecto
2. Haz click en "Deployments"
3. Selecciona el deployment activo
4. Verás los logs en tiempo real

Los logs incluyen:
- `📥 POST /run-automatizacion` - Solicitudes recibidas
- `📊 Obteniendo datos del Google Sheet...` - Progreso
- `✅ Mensaje enviado a...` - Mensajes enviados exitosamente
- `❌ Error al enviar...` - Errores de envío

## Solución de Problemas

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "Connection refused"
- Asegúrate de que el servidor está corriendo: `npm start`
- Verifica el puerto: `localhost:3000`

### Error: "Error al obtener datos del Sheet"
- Verifica que `SHEET_ID` y `GOOGLE_API_KEY` son correctos
- Verifica que el Sheet sea público o tenga permisos

### Error: "Error al enviar mensaje"
- Verifica que `WHATSAPP_TOKEN` y `PHONE_ID` son válidos
- Verifica que los números de teléfono tengan código de país

## Próximos Pasos

Una vez desplegado en Railway:

1. ✅ Prueba el endpoint manualmente con curl
2. ✅ Configura el cron job en n8n
3. ✅ Verifica los logs en Railway
4. ✅ Monitorea los primeros días de funcionamiento
