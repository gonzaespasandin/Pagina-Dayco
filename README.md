<h1 align="center">
  <br>
  Dayco Gaming
  <br>
</h1>

<p align="center">
  Sitio web institucional y panel de administración para una empresa argentina de soluciones integrales para casinos y salones de entretenimiento.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-F7B731?style=for-the-badge&logo=jsonwebtokens&logoColor=black" />
</p>

---

## Descripción

**Dayco Gaming** es una plataforma full-stack que combina un sitio web institucional con un panel de administración privado. Permite gestionar el catálogo de productos, estadísticas y casinos clientes directamente desde el panel admin, sin necesidad de tocar código.

## Funcionalidades

### Sitio Público
- 🎰 Catálogo de productos con página de detalle
- 📊 Sección "Nosotros" con estadísticas animadas
- 🏢 Galería de casinos clientes
- 🔧 Sección de reacondicionamiento de equipos
- 📬 Sección de contacto
- 📱 Diseño responsive mobile-first
- ⚡ Code splitting con React.lazy para carga rápida
- 🔍 SEO completo (Open Graph, JSON-LD, sitemap, robots.txt)

### Panel de Administración
- 🔐 Login seguro con JWT y rate limiting
- 📦 CRUD de productos con subida de imágenes
- 📈 CRUD de estadísticas
- 🏆 CRUD de casinos clientes
- ✂️ Recortador de imágenes integrado
- 🖼️ Conversión automática a WebP con Sharp

---

## Tech Stack

| Capa | Tecnologías |
|------|------------|
| **Frontend** | React 19, Vite, React Router, Framer Motion, Axios |
| **Backend** | Express 5, Node.js, ES Modules |
| **Base de datos** | MySQL / MariaDB |
| **Autenticación** | JWT + bcryptjs |
| **Imágenes** | Multer + Sharp (→ WebP) |
| **Seguridad** | CORS, express-rate-limit |

---

## Estructura del proyecto

```
Pagina-Dayco/
├── dayco-front/               # Cliente React + Vite
│   └── src/
│       ├── api/               # Instancia de Axios con interceptores JWT
│       ├── components/        # Componentes del sitio público y admin
│       │   └── admin/         # ProductForm, StatForm, CasinoForm, etc.
│       └── pages/             # Home, ProductoDetalle, Admin, Login
│
└── dayco-back/                # Servidor Express
    └── src/
        ├── config/            # Conexión a MySQL
        ├── middleware/        # Verificación JWT, upload de imágenes
        └── routes/            # auth, productos, contenido, casinos
```

---

## Instalación y desarrollo local

### Prerrequisitos
- Node.js 18+
- MySQL 8+

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd Pagina-Dayco
```

### 2. Configurar el backend
```bash
cd dayco-back
cp .env.example .env
npm install
```

Completar el `.env`:
```env
PORT=3000
JWT_SECRET=tu_secreto_super_seguro
ADMIN_USER=admin
ADMIN_PASSWORD=tu_contraseña
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dayco
```

### 3. Configurar la base de datos

```sql
CREATE DATABASE dayco;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  imagen_url VARCHAR(500),
  subtitulo VARCHAR(255),
  descripcion_larga TEXT,
  features_hero JSON,
  caracteristicas JSON,
  galeria JSON,
  especificaciones JSON,
  variantes JSON,
  aplicaciones JSON
);

CREATE TABLE nosotros_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  valor VARCHAR(100)
);

CREATE TABLE casinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  logo_url VARCHAR(500),
  orden INT DEFAULT 0
);
```

### 4. Configurar el frontend
```bash
cd ../dayco-front
cp .env.example .env
npm install
```

Completar el `.env`:
```env
VITE_API_URL=http://127.0.0.1:3000/api
VITE_BASE_URL=http://127.0.0.1:3000
```

### 5. Levantar los servidores

```bash
# Terminal 1 — Backend
cd dayco-back && npm run dev

# Terminal 2 — Frontend
cd dayco-front && npm run dev
```

Accedé a `http://localhost:5173` para el sitio público y a `http://localhost:5173/login` para el panel admin.

---

## API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login → retorna JWT |
| GET | `/api/auth/verify` | Verifica validez del token |

### Productos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/productos` | — | Listar todos |
| GET | `/api/productos/:id` | — | Obtener por ID |
| POST | `/api/productos` | ✓ | Crear |
| PUT | `/api/productos/:id` | ✓ | Actualizar |
| DELETE | `/api/productos/:id` | ✓ | Eliminar |
| POST | `/api/productos/upload-imagen` | ✓ | Subir imagen → WebP |

### Estadísticas
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/contenido` | — | Listar stats |
| POST | `/api/contenido` | ✓ | Crear |
| PUT | `/api/contenido/:id` | ✓ | Actualizar |
| DELETE | `/api/contenido/:id` | ✓ | Eliminar |

### Casinos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/casinos` | — | Listar (ordenados) |
| POST | `/api/casinos` | ✓ | Crear |
| PUT | `/api/casinos/:id` | ✓ | Actualizar |
| DELETE | `/api/casinos/:id` | ✓ | Eliminar |

> Los endpoints protegidos requieren header `Authorization: Bearer <token>`

---

## Scripts disponibles

### Frontend
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # ESLint
```

### Backend
```bash
npm run dev       # Desarrollo con hot reload (nodemon)
npm start         # Producción
```
