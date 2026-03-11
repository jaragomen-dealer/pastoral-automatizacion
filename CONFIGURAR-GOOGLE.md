# Configurar Google Cloud Credentials

## Pasos para obtener GOOGLE_CREDENTIALS

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente

### 2. Habilitar la Google Sheets API

1. En el menú, ve a **APIs & Services** → **Library**
2. Busca "Google Sheets API"
3. Clic en **Enable**

### 3. Crear una Cuenta de Servicio

1. Ve a **APIs & Services** → **Credentials**
2. Clic en **Create Credentials** → **Service Account**
3. Nombre: `automatizacion-pastoral`
4. Clic en **Create and Continue**

### 4. Crear Clave JSON

1. En la página de Service Accounts, encuentra tu cuenta creada
2. Clic en ella
3. Ve a la pestaña **Keys**
4. Clic en **Add Key** → **Create New Key**
5. Selecciona **JSON**
6. Clic en **Create** - Se descargará un archivo JSON

### 5. Configurar Variables de Entorno

El archivo JSON descargado tiene este formato:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

#### En Railway:

1. Copia TODO el contenido del archivo JSON
2. En Railway, ve a **Variables**
3. Agrega una variable llamada `GOOGLE_CREDENTIALS`
4. Pega el contenido del JSON como valor

#### En Local (.env):

1. Abre el archivo `.env`
2. Agrega esta línea con el contenido del JSON:

```env
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}
```

⚠️ **IMPORTANTE**: El JSON debe estar en una sola línea. Si tienes saltos de línea, elimínalos.

### 6. Dar Permiso al Service Account en el Google Sheet

1. Abre tu Google Sheet
2. Clic en **Share** (Compartir)
3. Copia el `client_email` del archivo JSON (algo como `automatizacion-pastorial@project-id.iam.gserviceaccount.com`)
4. Pega el email en el campo de compartir
5. Dale permiso de **Editor**

### 7. Configurar SHEET_ID

1. Abre tu Google Sheet
2. Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID/edit
                                    ^^^^^^^
   ```
3. En Railway o .env, agrega:
   ```env
   SHEET_ID=1NKpVT-u2h0ZVlZ-gqW8qmnd84Ijsu2Q-LEf_RH7UBwM
   ```

## Verificar Configuración

### En Local:

```bash
npm install
npm start
```

### En Railway:

1. Verifica que las variables estén configuradas
2. Revisa los logs del deployment
3. Haz un POST al endpoint `/run-automatizacion`

## Solución de Problemas

### Error: "Could not read the credentials file"

- Verifica que `GOOGLE_CREDENTIALS` sea un JSON válido
- Asegúrate de que no haya saltos de línea en el valor

### Error: "The caller does not have permission"

- El service account no tiene permiso en el Google Sheet
- Verifica que compartiste el sheet con el `client_email`

### Error: "Requested entity not found"

- El `SHEET_ID` es incorrecto
- Verifica que el ID sea correcto

## Variables de Entorno Finales

```
PORT=3000
WHATSAPP_TOKEN=tu_token_whatsapp
PHONE_ID=tu_phone_id
SHEET_ID=tu_sheet_id
GOOGLE_CREDENTIALS={"type":"service_account",...}
```
