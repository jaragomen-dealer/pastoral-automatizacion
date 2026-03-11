# Ejemplo de Workflow en n8n

## Workflow: Automatización Pastoral Diaria

Este workflow ejecuta la automatización pastoral todos los días a las 9:00 AM.

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Schedule   │─────▶│ HTTP Request │─────▶│     IF       │
│  (Cron Job)  │      │ (Call Agent) │      │ (Check Result)│
└──────────────┘      └──────────────┘      └──────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────┐
                    │                               │                           │
                    ▼                               ▼                           ▼
           ┌──────────────┐               ┌──────────────┐            ┌──────────────┐
           │    Notify    │               │    Notify    │            │    Log      │
 │ (Success w/ count)│    │(No celebrations)│            │(Error log)   │
           └──────────────┘               └──────────────┘            └──────────────┘
```

## Configuración de Nodos

### 1. Nodo Schedule (Cron Job)

**Nombre:** Ejecutar diariamente a las 9 AM

**Configuración:**
- **Trigger Interval:** Every Day
- **Hour:** 9
- **Minute:** 0
- **Weekdays Only:** No (opcional)

### 2. Nodo HTTP Request

**Nombre:** Ejecutar Automatización Pastoral

**Configuración:**
- **Method:** POST
- **URL:** `https://tu-app-en-railway.railway.app/run-automatizacion`
- **Authentication:** None
- **Response Format:** JSON

**Opciones avanzadas:**
- **Timeout:** 30000 ms (30 segundos)
- **Retry On Fail:** Yes (3 reintentos)

### 3. Nodo IF

**Nombre:** Verificar Resultado

**Condiciones:**
- **Field:** `{{ $json.mensajes_enviados }}`
- **Operation:** Exists
- **Valor:** (cualquiera)

**Ramificaciones:**
- **TRUE (Si hay mensajes_enviados):** → Nodo de éxito
- **FALSE (Si no hay mensajes_enviados):** → Nodo de "no hay celebraciones"
- **ERROR (Si status = "error"):** → Nodo de error

### 4. Nodo Notify (Éxito)

**Nombre:** Notificar Éxito

**Tipo:** Send Email, Slack, o Discord (según tu preferencia)

**Mensaje:**
```
✅ Automatización Pastoral Ejecutada

📅 Fecha: {{ $now.toISO() }}
📱 Mensajes enviados: {{ $json.mensajes_enviados }}

El proceso se completó exitosamente.
```

### 5. Nodo Notify (Sin celebraciones)

**Nombre:** Notificar Sin Celebraciones

**Tipo:** Send Email, Slack, o Discord

**Mensaje:**
```
ℹ️ Automatización Pastoral

📅 Fecha: {{ $now.toISO() }}
ℹ️  No hay celebraciones hoy

No se enviaron mensajes.
```

### 6. Nodo Log (Error)

**Nombre:** Notificar Error

**Tipo:** Send Email, Slack, o Discord

**Mensaje:**
```
❌ Error en Automatización Pastoral

📅 Fecha: {{ $now.toISO() }}
❌ Error: {{ $json.mensaje }}

Por favor revisar los logs en Railway.
```

## Ejemplo de Workflow JSON

Copia y pega este JSON en n8n:

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
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://tu-app-en-railway.railway.app/run-automatizacion",
        "options": {}
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.status }}",
              "operation": "equals",
              "value2": "ok"
            }
          ]
        }
      },
      "name": "Check Status",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.mensajes_enviados }}",
              "operation": "exists"
            }
          ]
        }
      },
      "name": "Check Messages",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [850, 200]
    },
    {
      "parameters": {
        "content": "✅ Automatización Pastoral Ejecutada\n\n📅 Fecha: {{ $now.toISO() }}\n📱 Mensajes enviados: {{ $json.mensajes_enviados }}",
        "channel": "#automatizaciones"
      },
      "name": "Slack Success",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1050, 100]
    },
    {
      "parameters": {
        "content": "ℹ️ Automatización Pastoral\n\n📅 Fecha: {{ $now.toISO() }}\nℹ️ No hay celebraciones hoy",
        "channel": "#automatizaciones"
      },
      "name": "Slack No Messages",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "content": "❌ Error en Automatización Pastoral\n\n📅 Fecha: {{ $now.toISO() }}\n❌ Error: {{ $json.mensaje }}",
        "channel": "#automatizaciones"
      },
      "name": "Slack Error",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [850, 500]
    }
  ],
  "connections": {
    "Schedule": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    },
    "HTTP Request": {
      "main": [[{"node": "Check Status", "type": "main", "index": 0}]]
    },
    "Check Status": {
      "main": [
        [{"node": "Check Messages", "type": "main", "index": 0}],
        [{"node": "Slack Error", "type": "main", "index": 0}]
      ]
    },
    "Check Messages": {
      "main": [
        [{"node": "Slack Success", "type": "main", "index": 0}],
        [{"node": "Slack No Messages", "type": "main", "index": 0}]
      ]
    }
  }
}
```

## Cron Expression Avanzado

Si prefieres usar una expresión cron personalizada:

```
# Todos los días a las 9:00 AM
0 9 * * *

# Solo días de semana a las 9:00 AM
0 9 * * 1-5

# Domingo a las 10:00 AM
0 10 * * 0

# Primer día de cada mes a las 9:00 AM
0 9 1 * *
```

## Webhook Alternativo

Si prefieres que Railway llame a n8n (webhook approach):

1. **En n8n:** Crea un workflow con nodo **Webhook**
2. **Copia la URL del webhook:** `https://tu-n8n-instancia.com/webhook/pastoral`
3. **En Railway:** Modifica `server.js` para hacer un callback al webhook

## Recursos Adicionales

- [Documentación de n8n](https://docs.n8n.io/)
- [n8n Cloud](https://n8n.io/cloud)
- [Railway Documentation](https://docs.railway.app/)
