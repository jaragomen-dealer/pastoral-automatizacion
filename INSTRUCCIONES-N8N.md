# CÓDIGO PARA N8N - COPIAR Y PEGAR

## OPCIÓN 1: Workflow Simplificado (Recomendado)

Este workflow tiene SOLO 2 nodos y es más fácil de configurar.

```json
{
  "name": "Automatización Pastoral",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 24}]
        }
      },
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://tu-app-en-railway.railway.app/run-automatizacion",
        "authentication": "none",
        "sendBody": false,
        "options": {"timeout": 30000}
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Schedule": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    }
  }
}
```

### Cómo usar este workflow en n8n:

1. Abre n8n
2. Clic en "Add workflow"
3. Clic en el menú de 3 puntos (⋮) → "Import from File" → "Copy & Paste JSON"
4. Copia el JSON de arriba y pégalo
5. **IMPORTANTE**: Reemplaza `https://tu-app-en-railway.railway.app` con tu URL real de Railway
6. Guarda y activa el workflow

---

## OPCIÓN 2: Crear Manualmente (Más Fácil)

### Paso 1: Agregar nodo Schedule

1. Clic en "Add node" → Buscar "Schedule"
2. Configura:
   - **Trigger Interval**: Every Day
   - **Hour**: 9 (o la hora que quieras)
   - **Minute**: 0

### Paso 2: Agregar nodo HTTP Request

1. Clic en "Add node" → Buscar "HTTP Request"
2. Conecta el nodo Schedule al nodo HTTP Request
3. Configura:
   - **Method**: `POST`
   - **URL**: `https://tu-app-en-railway.railway.app/run-automatizacion`
   - **Authentication**: `None`

### Paso 3: Guardar y Activar

1. Clic en "Save"
2. Clic en "Active" (toggle switch)
3. ¡Listo!

---

## OPCIÓN 3: Workflow Completo con Notificaciones

Si quieres recibir notificaciones, usa este JSON:

```json
{
  "name": "Automatización Pastoral con Notificaciones",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 24}]
        }
      },
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://tu-app-en-railway.railway.app/run-automatizacion",
        "authentication": "none",
        "options": {"timeout": 30000}
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{ $json.status }}",
            "operation": "equals",
            "value2": "ok"
          }]
        }
      },
      "name": "IF",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "content": "=✅ Automatización Pastoral\n\nFecha: {{ $now.toISO() }}\nMensajes enviados: {{ $json.mensajes_enviados }}",
        "chatId": "TU_CANAL_SLACK"
      },
      "name": "Slack Success",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.0,
      "position": [850, 200]
    },
    {
      "parameters": {
        "content": "=❌ Error en Automatización\n\nFecha: {{ $now.toISO() }}\nError: {{ $json.mensaje }}",
        "chatId": "TU_CANAL_SLACK"
      },
      "name": "Slack Error",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.0,
      "position": [850, 400]
    }
  ],
  "connections": {
    "Schedule": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    },
    "HTTP Request": {
      "main": [[{"node": "IF", "type": "main", "index": 0}]]
    },
    "IF": {
      "main": [
        [{"node": "Slack Success", "type": "main", "index": 0}],
        [{"node": "Slack Error", "type": "main", "index": 0}]
      ]
    }
  }
}
```

---

## CONFIGURACIÓN RÁPIDA - LO MÍNIMO NECESARIO

### Solo copia esto en el nodo HTTP Request:

```
Method: POST
URL: https://tu-app-en-railway.railway.app/run-automatizacion
Authentication: None
```

### Respuestas que recibirás:

**✅ Exitoso:**
```json
{
  "status": "ok",
  "mensajes_enviados": 3
}
```

**ℹ️ Sin celebraciones:**
```json
{
  "status": "ok",
  "mensaje": "No hay celebraciones hoy"
}
```

**❌ Error:**
```json
{
  "status": "error",
  "mensaje": "Descripción del error"
}
```

---

## CRON EXPRESSIONS (Horarios Personalizados)

Si quieres horarios personalizados, usa estas expresiones:

```
# Todos los días a las 9:00 AM
0 9 * * *

# Solo días de semana a las 9:00 AM
0 9 * * 1-5

# Todos los días a las 6:00 PM
0 18 * * *

# Domingo a las 10:00 AM
0 10 * * 0

# Primer día de cada mes a las 9:00 AM
0 9 1 * *
```

---

## ARCHIVOS CREADOS:

1. **n8n-workflow.json** - Workflow completo con todos los nodos
2. **INSTRUCCIONES-N8N.md** - Este archivo con instrucciones

## PRÓXIMOS PASOS:

1. Despliega tu código en Railway
2. Copia la URL que te da Railway
3. Reemplaza `https://tu-app-en-railway.railway.app` con tu URL real
4. Importa el JSON en n8n
5. Activa el workflow

¡Listo! 🎉
