# Jobbin — Frontend

Aplikasi web untuk tracking job application, dibangun dengan React + TypeScript + Tailwind CSS (Neobrutalism design).

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS (custom neobrutalism theme)
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Drag & Drop:** dnd-kit
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Deploy:** Azure Container Apps + nginx + Docker

## Production

| Service | URL |
|---------|-----|
| Frontend | https://www.jobbin.site |
| API | https://api.jobbin.site/api/v1 |

## Setup Local

### Prerequisites

- Node.js 20+
- npm

### 1. Clone repo

```bash
git clone https://github.com/ghanisiapfullstack/Jobbin-frontend.git
cd Jobbin-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup env

```bash
cp .env.example .env
```

Isi `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Jalankan dev server

```bash
npm run dev
```

App berjalan di `http://localhost:5173`

---

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npx tsc --noEmit   # TypeScript check
```

---

## Fitur

| Fitur | Deskripsi |
|-------|-----------|
| Auth | Register, login, email verifikasi, logout |
| Kanban Board | 5 kolom: Wishlist, Applied, Interview, Offer, Rejected |
| Drag & Drop | Pindah card antar kolom + reorder dalam kolom |
| Application CRUD | Tambah, edit, hapus lamaran |
| Archive | Arsipkan lamaran + halaman Archived + restore |
| Reminder | Badge di card (TODAY/TOMORROW) + notification bell |
| Profile | Edit nama + ganti password |
| Responsive | Mobile 375px + tablet 768px + desktop 1280px |
| Loading Skeleton | Skeleton saat fetch data |
| Empty State | Tampil saat board kosong |

---

## Project Structure

```
jobbin-frontend/
├── src/
│   ├── api/                 # Axios instance + API calls
│   │   ├── axios.ts         # Base axios config + interceptors
│   │   ├── auth.ts          # Auth API
│   │   ├── applications.ts  # Applications API
│   │   └── reminders.ts     # Reminders API
│   ├── components/
│   │   ├── board/           # Kanban components
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── ApplicationModal.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   └── PasswordToggle.tsx
│   │   ├── Navbar.tsx
│   │   └── ReminderBell.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── VerifyEmailPage.tsx
│   │   ├── BoardPage.tsx
│   │   ├── ArchivedPage.tsx
│   │   └── ProfilePage.tsx
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── applicationsStore.ts
│   │   └── remindersStore.ts
│   ├── utils/
│   │   └── date.ts          # Date formatting helpers
│   ├── App.tsx              # Routes + Toaster
│   └── main.tsx
├── public/
├── Dockerfile
├── nginx.conf               # SPA routing + security headers
├── .env                     # Local env (tidak di-commit)
├── .env.production          # Production env
└── .github/workflows/       # GitHub Actions CI/CD
```

---

## Environment Variables

| Key | Local | Production |
|-----|-------|------------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | `https://api.jobbin.site/api/v1` |

---

## Design System

Jobbin menggunakan **Neobrutalism** design — bold borders, hard shadows, primary yellow.

### Colors

| Token | Value | Digunakan untuk |
|-------|-------|-----------------|
| `primary` | `#FFD600` | Background utama, badge |
| `dark` | `#1a1a1a` | Text, border |
| `gray-neo` | `#6b6b6b` | Secondary text |
| `wishlist` | `#E3F2FD` | Status badge |
| `applied` | `#E8F5E9` | Status badge |
| `interview` | `#FFF9C4` | Status badge |
| `offer` | `#E8F5E9` | Status badge |
| `rejected` | `#FFEBEE` | Status badge |

### Custom Classes (Tailwind)

```css
.card-neo        /* Card dengan border + hard shadow */
.btn-dark        /* Button hitam primary */
.btn-outline     /* Button outline */
.input-neo       /* Input field dengan border */
.label-neo       /* Form label */
.badge           /* Status badge kecil */
.shadow-neo-sm   /* Shadow 2px 2px */
.shadow-neo-lg   /* Shadow 6px 6px */
```

---

## Deploy ke Azure

### Prerequisites

- Docker Desktop
- Azure CLI (`az login`)
- Akses ke `jobbinregistry.azurecr.io`

### Steps

```bash
# 1. Login ke ACR
az acr login --name jobbinregistry

# 2. Build image (gunakan .env.production otomatis)
docker build -t jobbinregistry.azurecr.io/jobbin-frontend:latest .

# 3. Push ke ACR
docker push jobbinregistry.azurecr.io/jobbin-frontend:latest

# 4. Deploy ke Container Apps
az containerapp update \
  --name jobbin-frontend \
  --resource-group jobbin-rg \
  --image jobbinregistry.azurecr.io/jobbin-frontend:latest
```

> Atau jalankan script: `.\update-frontend.ps1` dari PowerShell

---

## Azure Resources

| Resource | Name | Notes |
|----------|------|-------|
| Resource Group | `jobbin-rg` | Southeast Asia |
| Container Registry | `jobbinregistry.azurecr.io` | Basic tier |
| Container Apps Env | `jobbin-env` | Shared dengan backend |
| Frontend App | `jobbin-frontend` | min-replicas: 0 |
| Backend App | `jobbin-backend` | min-replicas: 0 |

---

## Known Issues & Backlog

| ID | Issue | Priority |
|----|-------|----------|
| BL-02 | Polish UI — Dribbble/Refero referensi | Low |
| BL-04 | GitHub Actions CD ke Azure | Medium |
| BL-13 | Cold start ~2.5s (scale-to-zero) | Low |
