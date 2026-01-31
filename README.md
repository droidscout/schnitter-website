Schnitter GbR Website – Mobile‑First Overlay Navigation

Overview
- Converted header/navigation to a mobile‑first, accessible overlay menu with a transparent background (no solid backdrop).
- Progressive enhancement via media queries at 640px (tablet) and 1024px (desktop).
- Fluid typography using CSS variables and clamp().

Key Files
- `src/components/Header.jsx`: Implements hamburger toggle, overlay navigation, a11y attributes, focus trap, and body scroll‑lock.
- `src/components/Header.css`: Mobile‑first styles, overlay transitions, sizing for touch targets, and desktop inline navigation.
- `src/index.css`: Global CSS variables, fluid type scale, container width, and `.no-scroll` scroll lock.

Architecture & Semantics
- Uses semantic HTML5: `header` + `nav role="navigation"` for both desktop and mobile overlay.
- Mobile‑first CSS: base styles apply to small screens; enhancements at `@media (min-width: 640px)` and `@media (min-width: 1024px)`.

Overlay Navigation (Mobile)
- Toggle button: `.nav-toggle` with `aria-controls="site-nav"`, `aria-expanded`, and `aria-label` that reflects state.
- Overlay container: `.nav-overlay` uses `position: fixed; inset: 0;` and centers links with CSS grid.
- Background remains non‑solid; uses transparent background with optional `backdrop-filter: blur(6px)` (and a text shadow for readability fallback).
- Touch targets: links have ≥44×44px target and font size `clamp(1rem, 2.8vw, 1.125rem)`.
- Animations: opacity and translate transitions; no layout shift.
- Scroll‑lock: `html.no-scroll { overflow: hidden; }` toggled by the component.
- Focus: focus trap inside overlay; Escape closes the menu and returns focus to toggle.

Desktop Behavior
- At `min-width: 1024px`, the hamburger is hidden and the inline `.header__nav` shows persistently; the overlay is disabled.

Breakpoints
- Base: mobile (no media query).
- `@media (min-width: 640px)`: spacing/comfort tweaks.
- `@media (min-width: 1024px)`: persistent horizontal navigation, overlay disabled.

Typography & Layout
- Base font size ~16px, line-height 1.5.
- `h1/h2/h3` use `clamp()` for responsive scale; container width is `min(92%, 72rem)` for comfortable reading.

Compatibility & Fallbacks
- Without `backdrop-filter`, overlay remains transparent; text uses `text-shadow` to maintain readability.

Known Notes
- Smooth scrolling with sticky header is handled in `src/main.jsx` and remains compatible with the overlay.


## Deployment & CI/CD
This project uses **GitHub Actions** for automated deployment to a Docker Swarm cluster. The workflow is defined in `.github/workflows/deploy.yml`.

### Workflow Steps
1.  **Trigger**: Pushes to `master` or `staging` branches.
2.  **Version Bump**: Automatically increments the version patch level in `package.json` (or via `scripts/bump_version.sh`).
3.  **Build & Push**: Builds Docker images for `api` and `web`, tagged with the new version, and pushes them to Docker Hub.
4.  **Git Commit**: Commits the version bump back to the repository.
5.  **Remote Deployment**: Connects to the Docker Swarm manager via SSH, updates the `.env` file with secrets, and redeploys the stack using `docker stack deploy`.

### Environment Variables & Secrets
The following secrets must be set in the GitHub Repository Settings for the workflow to function:

| Variable | Description |
| :--- | :--- |
| **Infrastructure** | |
| `SSH_HOST` | Hostname/IP of the Docker Swarm Manager |
| `SSH_USER` | SSH Username (e.g., `ralph`) |
| `SSH_PRIVATE_KEY` | SSH Private Key for passwordless access |
| `SSH_PORT` | SSH Port (default: 22) |
| `REMOTE_PROJECT_PATH` | Path on the remote server where the project is located |
| `STACK_NAME` | Name of the Docker Stack (e.g., `schnitter-web`) |
| **Docker** | |
| `DOCKER_USERNAME` | Docker Hub Username |
| `DOCKER_PASSWORD` | Docker Hub Access Token |
| **Application Config** | |
| `CONTACT_RECEIVER_EMAIL` | Email address receiving contact form submissions |
| `VITE_API_BASE_URL` | Base URL for the API (used in Frontend Build) |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA Site Key (Frontend) |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA Secret Key (Backend) |
| **SMTP (Email Sending)** | |
| `SMTP_HOST` | SMTP Server Hostname |
| `SMTP_PORT` | SMTP Port (e.g., 587) |
| `SMTP_SECURE` | `true` for SSL/TLS, `false` for STARTTLS |
| `SMTP_USER` | SMTP Username |
| `SMTP_PASS` | SMTP Password |
| `SMTP_AUTH_METHOD` | Auth method (default: `LOGIN`) |

### Local Development
To run the project locally:
1.  Copy `server/.env.example` to `server/.env` and fill in the values.
2.  Run `docker compose up -d --build`.
3.  Access the site at `http://localhost:8080`.
