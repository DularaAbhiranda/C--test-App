# Conduit — RealWorld Full-Stack Application

A fully functional Medium-like blogging platform built with **ASP.NET Core** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## Project Structure

```
csharp-test-app/
├── aspnetcore-realworld-example-app/   # Backend — ASP.NET Core Web API
├── conduit-frontend/                   # Frontend — React + Vite + Tailwind CSS
└── run-conduit.ps1                     # One-click launcher script
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| HTTP Client | Axios (with JWT auto-injection) |
| Backend | ASP.NET Core (.NET 10), MediatR (CQRS) |
| Validation | FluentValidation |
| ORM | Entity Framework Core |
| Database | SQLite |
| Auth | JWT Bearer tokens |
| Logging | Serilog |
| API Docs | Swagger / OpenAPI |
| Tests | xUnit (integration tests) |

---

## Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 16+](https://nodejs.org/)

### Run the Application

**Option 1 — One script (Windows PowerShell):**
```powershell
cd C:\path\to\csharp-test-app
.\run-conduit.ps1
```

**Option 2 — Two terminals manually:**
```powershell
# Terminal 1 — Backend
cd aspnetcore-realworld-example-app
dotnet run --project src/Conduit

# Terminal 2 — Frontend
cd conduit-frontend
npm run dev
```

Then open:
- **App** → http://localhost:3000
- **Swagger** → http://localhost:5000/swagger

---

## Features

- Register / Login with JWT authentication
- Global article feed with tag filtering
- Personal feed from followed authors
- Create, edit, and delete articles (Markdown supported)
- Favorite articles
- Follow / unfollow users
- Comment on articles
- User profile pages
- Update profile settings

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/users` | Register |
| POST | `/users/login` | Login |
| GET/PUT | `/user` | Get / update current user |
| GET | `/articles` | List articles (filterable) |
| GET | `/articles/feed` | Personal feed |
| POST | `/articles` | Create article |
| PUT/DELETE | `/articles/:slug` | Edit / delete article |
| POST/DELETE | `/articles/:slug/favorite` | Favorite toggle |
| GET/POST/DELETE | `/articles/:slug/comments` | Comments |
| GET | `/profiles/:username` | User profile |
| POST/DELETE | `/profiles/:username/follow` | Follow toggle |
| GET | `/tags` | All tags |

---

## Backend Architecture

The backend follows a **vertical slice / CQRS** pattern:

```
Request → Controller → MediatR → Handler
                           ↓
                   Pipeline Behaviors
                  (Validation + Transactions)
                           ↓
                   Entity Framework Core
                           ↓
                       SQLite DB
```

Each feature (Articles, Users, Comments, etc.) is self-contained in its own folder under `src/Conduit/Features/`.
