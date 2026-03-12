# ❌ Error 400 en Railway - SOLUCIÓN DEFINITIVA

## El Error:
```
failed to stat /tmp/railpack-build-386214445/secrets/GOOGLE_CREDENTIALS: no such file or directory
```

## Causa:
Railway está intentando montar `GOOGLE_CREDENTIALS` como un archivo secreto pero no lo encuentra.

## ✅ SOLUCIÓN: Usar variable de entorno en lugar de archivo

### Paso 1: En tu Google Sheet
Abre tu Google Sheet y copia el ID de la URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit
                                    ^^^^^^^
```

### Paso 2: En Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. IAM & Admin → Service Accounts
3. Crea o selecciona tu service account
4. Ve a Keys → Add Key → Create New Key → JSON
5. Se descargará un archivo JSON

### Paso 3: Convertir JSON a una línea
Abre el archivo JSON descargado y elimina todos los saltos de línea:

**Original (con saltos de línea):**
```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "key123",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "xxx@xxx.iam.gserviceaccount.com",
  "client_id": "123456789"
}
```

**Convertido (una sola línea):**
```json
{"type":"service_account","project_id":"my-project","private_key_id":"key123","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"xxx@xxx.iam.gserviceaccount.com","client_id":"123456789"}
```

### Paso 4: En Railway
1. Ve a tu proyecto en Railway
2. Variables → New Variable
3. Nombre: `GOOGLE_CREDENTIALS`
4. Valor: Pega el JSON de una sola línea
5. Nombre: `SHEET_ID`
6. Valor: Pega el ID del Google Sheet (solo la parte larga)

### Paso 5: Dar permiso al Service Account
1. Copia el `client_email` del JSON (ej: `xxx@xxx.iam.gserviceaccount.com`)
2. Ve a tu Google Sheet
3. Share → Pega el email
4. Dale permiso de **Editor**

## Código Actualizado

El código ahora maneja automáticamente:
- Variables de entorno (`GOOGLE_CREDENTIALS`)
- Archivos de credenciales (`GOOGLE_CREDENTIALS_PATH`)

```javascript
let credentials;

if (process.env.GOOGLE_CREDENTIALS) {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} else if (process.env.GOOGLE_CREDENTIALS_PATH) {
  const fs = require('fs');
  credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, 'utf8'));
} else {
  throw new Error('GOOGLE_CREDENTIALS o GOOGLE_CREDENTIALS_PATH debe estar definido');
}
```

## Variables de Entorno Requeridas

```env
PORT=3000
WHATSAPP_TOKEN=tu_token_whatsapp
PHONE_ID=tu_phone_id
SHEET_ID=tu_sheet_id
GOOGLE_CREDENTIALS={"type":"service_account",...}
```

## Verificar

Después de configurar, Railway hará redeploy automático. Revisa los logs para ver:
```
📊 Obteniendo datos del Google Sheet...
✅ Filas: X
```

Si ves "Filas: undefined" o un error 400, verifica:
1. El SHEET_ID sea correcto
2. El JSON de GOOGLE_CREDENTIALS sea válido
3. El service account tenga permiso de Editor en el Sheet
