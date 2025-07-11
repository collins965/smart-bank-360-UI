## Smart Bank 360 – Frontend

This is the **React-based frontend** for the [Smart Bank 360](https://github.com/collins965/smart-bank-360-UI.git) project — a modern digital banking platform for the Kenyan market.

Built with **React + Vite + TailwindCSS**, it connects to a Django REST API backend and provides users with a responsive, intuitive interface for managing money, viewing investments, applying for loans, and much more.

## Tech Stack

- React (with Hooks + Router)
- Vite (blazing-fast dev server)
- TailwindCSS (utility-first styling)
- Axios (API calls)
- React Router (multi-page layout)

---

## Project Structure
frontend/
├── public/
├── src/
│ ├── assets/ # Images, logos, etc.
│ ├── components/ # Reusable UI (Navbar, Sidebar, Cards)
│ ├── pages/ # Route-based pages (Dashboard, Login, Loans, etc.)
│ ├── api/ # Axios base and endpoints
│ ├── contexts/ # Auth, Theme, Notifications
│ ├── utils/ # Formatters, validators, helpers
│ ├── App.jsx # App layout and routes
│ ├── main.jsx # Entry point
│ └── index.css # Tailwind base styles
