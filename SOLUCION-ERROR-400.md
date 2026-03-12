# ❌ Error 400 en Google Sheets - SOLUCIÓN

## El Error:
```
Request failed with status code 400
```

## Causas Probables:

### 1. **SHEET_ID Incorrecto** (Más probable)
- Verifica que el SHEET_ID en Railway sea correcto
- Debe ser el ID largo de la URL del Google Sheet
- Ejemplo: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

### 2. **Nombre de Hoja Incorrecto**
- El código ahora usa: `'Configuración de Google Sheet para Base de Datos'!A:K`
- Verifica que tu hoja se llame EXACTAMENTE: "Configuración de Google Sheet para Base de Datos"
- Si tiene otro nombre, cámbialo en el código

### 3. **Service Account Sin Permiso**
- El email del service account debe tener acceso al Google Sheet
- Ve a tu Sheet → Share → Agrega el email del service account como Editor

## Pasos para Solucionar:

### ✅ Paso 1: Verificar SHEET_ID
1. Abre tu Google Sheet
2. Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
   ```
3. En Railway, verifica que `SHEET_ID` tenga ese valor

### ✅ Paso 2: Verificar Nombre de Hoja
1. Abre tu Google Sheet
2. Mira el nombre de la hoja en la parte inferior
3. Debe decir EXACTAMENTE: "Configuración de Google Sheet para Base de Datos"
4. Si no, cópialo y cámbialo en el código

### ✅ Paso 3: Dar Permiso al Service Account
1. Ve a Google Cloud Console
2. IAM & Admin → Service Accounts
3. Copia el email (algo como `xxx@xxx.iam.gserviceaccount.com`)
4. Ve a tu Google Sheet
5. Share → Pega el email
6. Dale permiso de **Editor**

### ✅ Paso 4: Verificar GOOGLE_CREDENTIALS
1. En Railway, verifica que `GOOGLE_CREDENTIALS` sea un JSON válido
2. Debe tener este formato:
   ```json
   {
     "type": "service_account",
     "project_id": "...",
     "private_key_id": "...",
     "private_key": "...",
     "client_email": "...",
     "client_id": "..."
   }
   ```

## Cambios Realizados:

He actualizado el código para:
- ✅ Usar el rango completo: `'Configuración de Google Sheet para Base de Datos'!A:K`
- ✅ Agregar logs de debug para ver SHEET_ID y RANGE
- ✅ Mostrar detalles completos del error

## Prueba de Nuevo:

Después de verificar los pasos anteriores, Railway hará redeploy automático.

Revisa los logs en Railway para ver:
```
SHEET_ID: [tu ID]
RANGE: 'Configuración de Google Sheet para Base de Datos'!A:K
```

Si el SHEET_ID o el nombre de hoja son incorrectos, cámbialos en Railway.

## Solución Rápida:

Si el nombre de tu hoja es diferente, cámbialo en el código:

Ejemplo si tu hoja se llama "Hoja 1":
```javascript
range: "'Hoja 1'!A:K",
```

O si no tiene espacios:
```javascript
range: "Hoja1!A:K",
```
