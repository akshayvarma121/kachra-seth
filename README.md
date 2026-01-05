# Kachra Seth – Smart City Waste Operations Console

Kachra Seth is a React + FastAPI web application that gives city teams and citizens a unified view of ward‑level waste operations. It focuses on visibility, gamification, and guidance rather than raw data dumps.

## 🚀 Features

- 📊 **Operations dashboard**  
  Ward‑wise snapshot with today’s collections, fuel saved, and active citizen usage, plus a simple waste density heatmap by sub‑zone.

- 🧹 **QR-based bin verification (simulated)**  
  “Scan” a bin ID to fetch its status, fill level, last collection time, and health state (healthy / warning / overflow / not registered).

- 🏆 **Leaderboards for wards and citizens**  
  Neighbourhood green scores (segregation, participation, complaint‑free days) and a Top Citizens table that highlights the logged‑in user.

- ♻️ **Waste classification guidance**  
  Simple AI-style classification API that maps common items (plastic bottle, banana peel, used syringe, etc.) to category, bin colour, confidence, and disposal tips.

- 💠 **Floating glass navigation UI**  
  Modern glassmorphism navigation bar with emoji tabs for Dashboard, QR Scan, Leaderboard, and Classify, tuned for both desktop and mobile layouts.

## 🧱 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, custom floating navigation components  
- **Backend:** Python, FastAPI (planned integration through `src/api/index.js`)  
- **Architecture:**  
  - `src/pages/*` for main screens (Dashboard, QR Scan, Leaderboard, Classify)  
  - `src/components/LoginCard.jsx` for authentication shell  
  - `src/api/index.js` as a single API layer for future FastAPI endpoints

## 📂 Project Structure (frontend)

```text
frontend/
  src/
    api/
      index.js          # getDashboardSummary, getBinById, leaderboards, classification
    components/
      LoginCard.jsx
    pages/
      DashboardPage.jsx
      QrScanPage.jsx
      LeaderboardPage.jsx
      ClassifyPage.jsx
    App.jsx             # Login + floating nav + tab routing
    main.jsx
  index.html
  package.json



A similar backend/ folder can host the FastAPI services that power these UI calls.

🧑‍💻 Getting Started (Frontend)
Install dependencies:

bash
cd frontend
npm install
Run the dev server:

bash
npm run dev
Open the app in your browser (default):

text
http://localhost:5173
Log in via the LoginCard (local stub) to see the full dashboard and navigation.

🔌 Backend Integration (FastAPI – planned)
The UI already calls an abstracted API layer:

getDashboardSummary(currentUser)

getBinById(binId)

getNeighbourhoodLeaderboard()

getUserLeaderboard()

classifyWasteItem(key)

You can implement these in a FastAPI backend and point the frontend to it via environment variables (e.g. VITE_API_URL) and src/api/index.js.

🌱 Future Enhancements
Real sensor and GPS integration for live bin fill levels and routing fuel savings.

Historical trend charts for ward performance and citizen participation.

Stronger AI classification model (images + text) for waste items.

Role-based access: admin (city), ward manager, and citizen views.
