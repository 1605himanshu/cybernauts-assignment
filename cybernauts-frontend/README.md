# 🌐 Cybernauts Development Assignment

An **Interactive User Relationship & Hobby Network** built using **Node.js, Express, MongoDB, TypeScript, and React Flow**.  
This full-stack project visualizes users and their friendships dynamically as a graph, where each node represents a user and each connection represents a relationship.

---

## 🚀 Overview

The goal of this project is to design and implement a full-stack system that:
- Manages users with CRUD operations.
- Connects users through friendships (relationships).
- Computes a **popularity score** based on user connections and shared hobbies.
- Displays the entire user network visually using **React Flow**.

---

## 🧩 Key Features

✅ **User Management (CRUD)** – Create, update, and delete users.  
✅ **Friendship Linking** – Connect users as friends, prevent duplicates or circular relationships.  
✅ **Popularity Score Calculation** –  

popularityScore = number of unique friends + (shared hobbies × 0.5)

✅ **Dynamic Graph Visualization** – Using **React Flow** for interactive UI.  
✅ **Live Updates** – Nodes and edges update instantly when users or hobbies change.  
✅ **Validation Rules** – Prevent deletion of linked users and ensure data integrity.  
✅ **Modern UI** – Built with React + TypeScript + Tailwind CSS.  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript + React Flow + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB (Atlas) |
| **State Management** | Context API / Redux Toolkit |
| **HTTP Client** | Axios |

---

## ⚙️ Environment Configuration

Create a `.env` file inside your **backend** directory and add the following variables:

```env
PORT=5000
DB_URL=mongodb+srv://<your_mongodb_user>:<your_password>@<cluster>.mongodb.net/?appName=Database

⚠️ Important: Replace credentials with your own MongoDB connection string.
Never commit your real database credentials to GitHub.

🧰 Running the Project
Backend Setup
cd backend
npm install
npm run dev
Runs the backend on http://localhost:5000

Frontend Setup
cd frontend
npm install
npm run dev
Runs the frontend on http://localhost:5173

API Endpoints
| Method | Endpoint                | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/api/users`            | Fetch all users                              |
| POST   | `/api/users`            | Create a new user                            |
| PUT    | `/api/users/:id`        | Update user details                          |
| DELETE | `/api/users/:id`        | Delete a user (if unlinked)                  |
| POST   | `/api/users/:id/link`   | Link a user (create friendship)              |
| DELETE | `/api/users/:id/unlink` | Unlink friendship                            |
| GET    | `/api/users/graph/all`  | Get all users and relationships (graph data) |

🧮 Business Logic Rules

Popularity Score Formula:
popularityScore = uniqueFriends + (sharedHobbies × 0.5)
Circular Friendships: Prevents duplicate mutual links (A ↔ B stored once).

Deletion Rule: A user cannot be deleted until unlinked from all friends.

Error Handling:

400 → Validation Error

404 → Not Found

409 → Conflict (e.g., existing relationship)

500 → Internal Server Error

🧠 Frontend Features
🕸️ Graph Visualization (React Flow)

Displays all users as nodes and friendships as edges.

Node size or color reflects popularity score.

Smooth transitions when data updates.

🎨 Sidebar

Displays all hobbies.

(Bonus) Supports drag-and-drop hobby addition to users.

Popularity scores update dynamically after hobby changes.

🧭 User Management Panel

Add or edit users via form.

Toast notifications for success/error.

Confirmation before deleting a user.

📂 Folder Structure
cybernauts-assignment/
 ┣ 📁 backend/
 ┃ ┣ 📁 src/
 ┃ ┣ 📄 package.json
 ┃ ┣ 📄 tsconfig.json
 ┃ ┣ 📄 .env.example
 ┣ 📁 frontend/
 ┃ ┣ 📁 src/
 ┃ ┣ 📄 package.json
 ┃ ┣ 📄 tsconfig.json
 ┃ ┣ 📄 vite.config.ts
 ┣ 📄 README.md
 ┣ 📄 postman_collection.json
 ┗ 📄 .gitignore

💡 Future Enhancements

Implement Undo/Redo functionality for graph actions

Add custom HighScoreNode and LowScoreNode animations

Optimize graph rendering for large datasets

Add cluster/load balancing for backend scalability

Include Jest/Supertest API test coverage

🖥️ Deployment (Next Steps)

Backend: Render

Frontend: Vercel

Database: MongoDB Atlas

(Deployment URLs will be updated after publishing)

👨‍💻 Author

Himanshu Yadav
🎓 B.Tech – Computer Science & Engineering
💼 Full Stack Developer
🌍 GitHub Profile

📧 imhimanshu1605@gmail.com


⭐ If you found this project interesting, don’t forget to give it a star on GitHub!

---

### ✅ Why This Is the *Best Version*
- ✅ **Professional structure** — perfect for GitHub, portfolio, or internship submission.  
- ✅ **Visually clear formatting** — easy to read for both technical reviewers and recruiters.  
- ✅ **Technical depth** — covers backend, frontend, and business logic clearly.  
- ✅ **Future-ready** — includes placeholders for deployment and tests.  
- ✅ **No unnecessary fluff** — everything is precise, relevant, and clean.  

---



