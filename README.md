# Automatización Pastoral

Script de Node.js para enviar felicitaciones automáticas por WhatsApp basado en datos de Google Sheets.

Ahora incluye **Agente HTTP** para ejecutar la automatización desde n8n o cualquier otro servicio.

## Características

- 🔍 Detecta automáticamente aniversarios de matrimonio y cumpleaños de hijos
- 📱 Envía mensajes personalizados por WhatsApp Cloud API
- 📊 Lee datos desde Google Sheets
- 🙏 Mensajes pastorales personalizados

## Instalación

1. **Instalar dependencias:**

```bash
npm install
```

## Configuración

1. **Copiar el archivo de variables de entorno:**

```bash
cp .env.example .env
```

2. **Configurar las variables de entorno en `.env`:**

### Obtener el WHATSAPP_TOKEN y PHONE_ID

1. Ve a [Meta for Developers](https://developers.facebook.com/apps/)
2. Crea una aplicación o selecciona una existente
3. Activa el producto WhatsApp
4. Obten el Token de acceso permanente (Permanent Access Token)
5. Copia el Phone ID de tu número de WhatsApp Business

### Obtener el SHEET_ID

1. Abre tu Google Sheet
2. Copia el ID de la URL (la parte larga entre `/d/` y `/edit`)
3. Ejemplo: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

### Obtener el GOOGLE_API_KEY

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets
4. Crea una credencial API Key
5. IMPORTANTE: Configura la API Key para permitir acceso a la API de Sheets

3. **Configurar el Google Sheet:**

Asegúrate de que tu hoja de cálculo tenga las siguientes columnas:
- Esposos
- WhatsApp
- Aniversario
- Hijo1
- FechaNacimiento1
- Hijo2
- FechaNacimiento2
- Hijo3
- FechaNacimiento3
- Hijo4
- FechaNacimiento4

El nombre de la hoja debe ser "familias".

**Formato de fechas:** DD/MM/YYYY (ejemplo: 15/06/2024)

## Uso

### Modo 1: Ejecutar como script standalone

```bash
npm run standalone
```

### Modo 2: Ejecutar como servidor HTTP (Recomendado para n8n/Railway)

```bash
npm start
```

El servidor se iniciará en el puerto especificado (por defecto 3000).

#### Endpoints disponibles:

**POST /run-automatizacion**
- Ejecuta el proceso completo de automatización
- Respuestas:
  - `{"status": "ok", "mensajes_enviados": N}` - Si envió mensajes
  - `{"status": "ok", "mensaje": "No hay celebraciones hoy"}` - Si no hubo celebraciones
  - `{"status": "error", "mensaje": "..."}` - Si ocurrió un error

**GET /health**
- Health check del servicio
- Respuesta: `{"status": "ok", "servicio": "Automatización Pastoral", "timestamp": "..."}`

**GET /**
- Información del servicio y endpoints disponibles

#### Ejemplo de uso con curl:

```bash
curl -X POST http://localhost:3000/run-automatizacion
```

#### Ejemplo de uso con n8n:

En n8n, usa el nodo **HTTP Request**:
- Método: POST
- URL: `https://tu-app-en-railway.railway.app/run-automatizacion`

### Programar ejecución automática (Windows - Task Scheduler):

1. Abre el Programador de tareas de Windows
2. Crea una tarea básica
3. Configura para que se ejecute diariamente a una hora específica
4. Acción: Iniciar un programa
   - Programa: `node`
   - Argumentos: `index.js`
   - Iniciar en: `C:\Users\Administrador\OneDrive\Desktop\pastoral-automatizacion`

### Programar ejecución automática (Linux/Mac - Cron):

```bash
# Abrir crontab
crontab -e

# Agregar esta línea para ejecutar todos los días a las 9:00 AM
0 9 * * * cd /ruta/a/pastoral-automatizacion && node index.js
```

## Mensajes

El script envía los siguientes mensajes automáticamente:

- **Cumpleaños:** `🎉 Feliz cumpleaños {nombre}. La Pastoral Familiar ora por ti 🙏`
- **Aniversario:** `💍 Feliz aniversario {esposos}. Dios bendiga su hogar 🙏`

## Solución de problemas

### Error: "No se encontraron datos en la hoja"
- Verifica que el SHEET_ID sea correcto
- Verifica que la hoja se llame "familias"
- Verifica que el GOOGLE_API_KEY tenga acceso a la API de Sheets

### Error: "Error al enviar mensaje"
- Verifica que el WHATSAPP_TOKEN sea válido
- Verifica que el PHONE_ID sea correcto
- Verifica que el número de teléfono tenga el formato correcto (incluya código de país)
- Verifica que el WhatsApp Business API esté configurado correctamente

### Los mensajes no se envían
- Revisa que la fecha en el Sheet esté en formato DD/MM/YYYY
- Verifica que los números de teléfono incluyan código de país
- Revisa la consola para ver mensajes de error específicos

## Estructura del Proyecto

```
pastoral-automatizacion/
├── index.js           # Script principal
├── package.json       # Dependencias del proyecto
├── .env.example       # Plantilla de variables de entorno
├── .env               # Variables de entorno (crear desde .env.example)
└── README.md          # Este archivo
```

## Dependencias

- **axios:** Cliente HTTP para hacer peticiones a las APIs
- **dotenv:** Manejo de variables de entorno

## Seguridad

⚠️ **IMPORTANTE:** Nunca compartas tu archivo `.env` ya que contiene credenciales sensibles. Asegúrate de que `.env` esté en tu archivo `.gitignore` si usas control de versiones.

---

## Deployment en Railway

### Pasos para desplegar en Railway:

1. **Preparar el repositorio:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Automatización Pastoral HTTP Agent"
   ```

2. **Subir a GitHub:**
   ```bash
   # Crear repositorio en GitHub primero
   git remote add origin https://github.com/tu-usuario/pastoral-automatizacion.git
   git branch -M main
   git push -u origin main
   ```

3. **Desplegar en Railway:**
   - Ve a [railway.app](https://railway.app/)
   - Clic en "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Railway detectará automáticamente que es un proyecto Node.js

4. **Configurar variables de entorno en Railway:**
   - En tu proyecto de Railway, ve a la sección "Variables"
   - Agrega las siguientes variables:
     - `PORT=3000`
     - `WHATSAPP_TOKEN=tu_token_aqui`
     - `PHONE_ID=tu_phone_id_aqui`
     - `SHEET_ID=tu_sheet_id_aqui`
     - `GOOGLE_API_KEY=tu_api_key_aqui`

5. **Obtener la URL de tu servicio:**
   - Railway te dará una URL como: `https://tu-app-en-railway.railway.app`
   - Tu endpoint estará disponible en: `https://tu-app-en-railway.railway.app/run-automatizacion`

6. **Probar el deployment:**
   ```bash
   curl -X POST https://tu-app-en-railway.railway.app/run-automatizacion
   ```

7. **Configurar en n8n:**
   - Usa el nodo **HTTP Request** en n8n
   - Configura:
     - Método: POST
     - URL: `https://tu-app-en-railway.railway.app/run-automatizacion`
   - Puedes agregar este flujo en un cron job de n8n para ejecutarlo automáticamente a una hora específica

### Configurar dominio personalizado en Railway (Opcional):

1. En Railway, ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Railway
4. Actualiza la URL en n8n

### Monitoreo y logs:

- Railway muestra logs en tiempo real en la pestaña "Deployments"
- Puedes ver las ejecuciones de tu automatización allí
- Los mensajes de consola del script aparecerán en los logs

### Ventajas de usar Railway:

✅ Hosting gratuito para proyectos pequeños
✅ Deploy automático desde GitHub
✅ Variables de entorno configurables
✅ Logs en tiempo real
✅ HTTPS automático
✅ Escalado automático
✅ Ideal para integración con n8n
