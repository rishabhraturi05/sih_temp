# Evolvia 🚀

**Evolvia** is a **one-stop AI-powered career guidance platform**. It combines **AI-based test analysis**, **personalized career recommendations**, **college and scholarship discovery**, and **mentor guidance** into a single, unified platform.
---

## 🌟 Core Modules

### 🧠 AI Test Analysis

* AI-driven analysis of interest tests
* Career recommendations
* Strength & weakness insights
* Career-path mapping based on performance

### 💰 Scholarship Discovery

* Scholarship database
* Search for scholarships by keywords

### 👨‍🎓 Student–Mentor System

* Browse verified mentors
* Request 1:1 guidance sessions
* Track request status (Pending / Accepted / Rejected)
* Join scheduled live sessions

### 🧑‍💼 Admin Dashboard

* Manage students, mentors, and content
* Review and control mentor requests
* Approve/reject scheduled sessions
* Manage college & scholarship data

---

## 🎥 Real-Time Mentorship

* Secure one-to-one video meetings
* Role-based room access
* Meetings are enabled only at the scheduled time
* Low-latency video using cloud SDKs

---

## 🔐 Security & Architecture

* Role-based authentication (Student / Mentor / Admin)
* JWT-based secure login
* Protected routes & APIs
* Environment-based secret management
* Scalable, modular backend architecture

---

## 🛠️ Tech Stack

### Frontend

* **Next.js (App Router)**
* **React.js**
* **Tailwind CSS**

### Backend

* **Next.js API Routes**
* **Node.js**
* **MongoDB (Mongoose)**

### Media & Communication

* **ZegoCloud** – video conferencing
* **Cloudinary** – media storage
---

## 📂 Project Structure

```
Evolvia/
├── app/                # Next.js app router
├── components/         # Reusable UI components
├── lib/                # DB connection & utilities
├── models/             # Mongoose schemas
├── api/                # Backend API routes
├── ai/                 # AI logic & test analysis
├── public/             # Static assets
├── styles/             # Global styles
├── .env.local          # Environment variables
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret
```

---

## ▶️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/evolvia.git
cd evolvia
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```
