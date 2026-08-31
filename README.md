# Laboratorio 3.2 — Playwright MCP y pruebas E2E

Implementación del laboratorio de DevOps sobre Model Context Protocol (MCP), exploración web asistida por GitHub Copilot CLI y automatización E2E con Playwright.

## ¿Qué es MCP?

Model Context Protocol es un estándar abierto que permite que un asistente de IA descubra e invoque herramientas y fuentes de contexto externas mediante una interfaz común. En este laboratorio, Copilot actúa como cliente MCP y `@playwright/mcp` expone acciones de navegador como navegación, inspección, escritura y clic.

## Configuración

- VS Code: `.vscode/mcp.json` usa la clave `servers`.
- Claude Code: `.mcp.json` usa la clave `mcpServers`.
- Copilot CLI: servidor de usuario agregado con `copilot mcp add` y verificado mediante `copilot mcp list`.

Los tres clientes ejecutan el mismo servidor:

```text
npx -y @playwright/mcp@latest
```

## Sitio y selectores descubiertos

- URL: `https://practice.expandtesting.com/login`
- Usuario: `#username`
- Contraseña: `#password`
- Enviar: `#submit-login`
- Mensaje: `#flash`
- Logout: `a[href="/logout"]`

Credenciales válidas: `practice` / `SuperSecretPassword!`.

## Hallazgo de exploración

La documentación visible de la página anuncia `Invalid username.` para un usuario incorrecto. Sin embargo, el flujo real ejecutado con Playwright MCP devuelve `Your password is invalid!`, incluso cuando la contraseña válida acompaña a `wrongUser`. La prueba conserva el comportamiento observado y deja documentada la discrepancia.

## Pruebas

La suite contiene cuatro casos:

1. Inicio de sesión exitoso y redirección a `/secure`.
2. Usuario inválido, permanencia en `/login` y mensaje real del sitio.
3. Contraseña inválida y mensaje de error.
4. Cierre de sesión y retorno a `/login`.

Ejecutar:

```bash
npm install
npx playwright install chromium
npx playwright test
```

Resultado validado: `4 passed`.

Las capturas de cada flujo y de la configuración se encuentran en `output/evidencias/`. Los reportes exportados de Copilot CLI (`exploracion-*.md`) registran las invocaciones reales a Playwright MCP.

## Autor

Aarón Timaná
