# 🎯 CÓDIGO PARA N8N - COPIAR Y PEGAR

## 📋 VERSIÓN SIMPLE (Solo 2 nodos)

### Paso 1: Copia este JSON

```json
{
  "name": "Automatización Pastoral",
  "nodes": [
    {
      "parameters": {
        "rule": {"interval": [{"field": "hours", "hoursInterval": 24}]}
      },
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://tu-app-en-railway.railway.app/run-automatizacion"
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Schedule": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    }
  }
}
```

### Paso 2: Importar en n8n

1. Abre **n8n**
2. Clic en **"Add workflow"** (nuevo workflow)
3. Clic en el menú de **3 puntos (⋮)** → **"Import from File"**
4. Selecciona **"Copy & Paste JSON"**
5. **Pega el JSON de arriba**
6. Clic en **"Import"**

### Paso 3: Configurar tu URL

⚠️ **MUY IMPORTANTE**: Reemplaza la URL con tu URL de Railway:

```javascript
// CAMBIA ESTO:
https://tu-app-en-railway.railway.app/run-automatizacion

// POR TU URL REAL (ejemplo):
https://pastoral-automatizacion-production.up.railway.app/run-automatizacion
```

### Paso 4: Activar

1. Clic en **"Save"**
2. Activa el **toggle "Active"**
3. ¡Listo! ✅

---

## 🔧 OPCIÓN MANUAL (Sin importar JSON)

Si prefieres crear el workflow manualmente:

### Nodo 1: Schedule

1. **Add node** → Busca **"Schedule"**
2. Configura:
   - Trigger Interval: **Every Day**
   - Hour: **9**
   - Minute: **0**

### Nodo 2: HTTP Request

1. **Add node** → Busca **"HTTP Request"**
2. Conecta Schedule → HTTP Request
3. Configura:
   - Method: **POST**
   - URL: `https://tu-app-en-railway.railway.app/run-automatizacion`
   - Authentication: **None**

---

## 📱 Respuestas del Endpoint

### ✅ Con mensajes enviados:
```json
{
  "status": "ok",
  "mensajes_enviados": 3
}
```

### ℹ️ Sin celebraciones:
```json
{
  "status": "ok",
  "mensaje": "No hay celebraciones hoy"
}
```

### ❌ Con error:
```json
{
  "status": "error",
  "mensaje": "Error al obtener datos"
}
```

---

## 📁 Archivos Disponibles:

1. **COPIAR-ESTE-JSON-PARA-N8N.json** - JSON simple para importar
2. **n8n-workflow.json** - JSON completo con notificaciones
3. **INSTRUCCIONES-N8N.md** - Instrucciones detalladas
4. **COMO-USAR-EN-N8N.md** - Este archivo

---

## 🚀 Checklist:

- [ ] Desplegué el código en Railway
- [ ] Copié mi URL de Railway
- [ ] Reemplacé la URL en el JSON de n8n
- [ ] Importé el JSON en n8n
- [ ] Activé el workflow
- [ ] Probé manualmente con "Execute Workflow"

---

## ⚡ Probar Manualmente

Antes de activar el schedule, prueba el workflow:

1. En n8n, clic en **"Execute Workflow"**
2. Verifica que recibas una respuesta
3. Si funciona, activa el schedule

---

## 🎉 ¡Listo!

Tu automatización se ejecutará todos los días a las 9:00 AM y enviará felicitaciones por WhatsApp automáticamente.

**Archivos creados:**
- ✅ `COPIAR-ESTE-JSON-PARA-N8N.json`
- ✅ `n8n-workflow.json`
- ✅ `INSTRUCCIONES-N8N.md`
- ✅ `COMO-USAR-EN-N8N.md`

Elige el que más te guste y cópialo en n8n! 🚀
