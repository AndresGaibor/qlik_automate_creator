# Agent Navigation Guide for Qlik REST APIs & Toolkits

Welcome! This directory contains the complete offline specification of Qlik Cloud REST APIs and Toolkits located at:
`/Users/andresgaibor/code/javascript/qlik_automate_creator/docs`

## 📂 Directory Structure

```
docs/
├── AGENTS_GUIDE.md            # Agent navigation guide
├── INDEX.md                   # Complete Table of Contents
├── NAVIGATION.json            # Machine-readable JSON manifest
├── SUMMARY.md                 # Categorized stats
├── overview/                  # Auth, Rate Limiting, CSRF, Pagination, Namespaces
├── endpoints/                 # REST Resource Endpoint Specs (Apps, Automations, Spaces, Reloads, etc.)
├── toolkits/                  # Qlik Toolkits (qlik-api, qlik-cli, enigma.js, platform-sdk, no-code)
└── org-rest/                  # Organization REST APIs
```

## 🔍 Search & Execution Guidelines for AI Agents

1. **REST API Endpoint Specifications**: Look into `docs/endpoints/` or search `docs/INDEX.md`.
2. **Toolkits & SDKs**: Check `docs/toolkits/` for `qlik-api`, `qlik-cli`, `enigma.js`, `platform-sdk`, `no-code`.
3. **Route & HTTP Method Lookup**: Query `docs/NAVIGATION.json`.

## Configuración de automatizaciones por modo

Para configurar plantillas de automatizaciones por modo y copiar `MOTOR_SECRETOS_JSON`, consultar `docs/desarrollo/puesta-en-marcha.md`.

Los valores secretos de las conexiones origen se conservan si se envía el campo vacío y solo se muestran mediante el endpoint admin `/conexiones-origen/contexto-secretos`.
