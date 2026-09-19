# BLINDSHOT Assistant — Website

Sitio web oficial del bot de Discord **BLINDSHOT Assistant**. HTML, CSS y JavaScript vanilla, sin dependencias ni frameworks.

```
blindshot-website/
├── index.html      Página principal
├── commands.html   Lista de comandos con buscador y modal
├── privacy.html    Política de privacidad
├── terms.html      Condiciones del servicio
├── style.css       Estilos de todo el sitio
├── script.js       Configuración + lógica de todas las páginas
└── assets/
    ├── favicon.svg
    └── logo.svg
```

## Qué editar

Todo lo configurable está al principio de `script.js`:

- `BOT.inviteUrl` — enlace de invitación (ya apunta a tu Application ID).
- `BOT.stats.servers` / `users` / `commands` — cifras mostradas. `null` muestra `—`, y `commands: null` cuenta sola los comandos de la lista.
- `BOT.status` — `"online"` u `"offline"`.
- `COMMANDS` — la lista de comandos. Añadir uno es añadir un objeto.
- `[CONTACT EMAIL]` — sustitúyelo por tu correo real en `privacy.html` y `terms.html`.

**Nunca** pongas el token del bot en estos archivos. Todo lo que hay aquí es público.

## Abrir la web en local con VS Code

1. Abre VS Code → **Archivo → Abrir carpeta…** → selecciona `blindshot-website`.
2. Instala la extensión **Live Server** (Ritwick Dey) desde el panel de extensiones.
3. Clic derecho sobre `index.html` → **Open with Live Server**. Se abrirá en `http://127.0.0.1:5500` y se recargará sola al guardar.

Sin extensión también funciona: doble clic en `index.html`. La única diferencia es que no hay recarga automática.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `blindshot-website`), público.
2. Sube los archivos. Desde la terminal, dentro de la carpeta:

```bash
git init
git add .
git commit -m "Primera versión de la web"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/blindshot-website.git
git push -u origin main
```

3. En GitHub: **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
4. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/blindshot-website/`.

> Importante: `index.html` debe estar en la raíz del repositorio, no dentro de una subcarpeta.

## URLs para el portal de Discord

En [Discord Developer Portal](https://discord.com/developers/applications) → tu aplicación → **General Information**:

- **Terms of Service URL**: `https://TU-USUARIO.github.io/blindshot-website/terms.html`
- **Privacy Policy URL**: `https://TU-USUARIO.github.io/blindshot-website/privacy.html`

## Preparado para el futuro

- **Estadísticas en tiempo real**: pon la URL de tu backend en `BOT.statsEndpoint`. Debe devolver `{ "servers": 2, "users": 120, "commands": 27, "status": "online" }` y la web se actualizará sola.
- **Discord OAuth2 / dashboard**: el flujo de OAuth necesita un servidor propio (el *client secret* jamás va en el frontend). Cuando lo tengas, añade `dashboard.html` y reutiliza `style.css`.
- **Vinculación con Roblox**: la verificación se hace desde el bot; la web solo necesita enlazar a ella.
