# Evolvia 🚀

Evolvia is a **full-stack mentor–student interaction platform** built to streamline mentorship scheduling, communication, and real-time meetings. The platform provides dedicated dashboards for **students** and **admins**, supports **secure authentication**, **meeting scheduling**, and **live video conferencing**, making it a complete end-to-end solution.

This project is designed with **modern web technologies** and focuses on scalability, clean architecture, and real-world production practices.

---

## ✨ Features

### 👨‍🎓 Student Features

* Secure authentication & profile management
* Browse available mentors
* Send meeting requests
* View request status (Pending / Accepted / Rejected)
* Join live video meetings at the scheduled time

### 🧑‍💼 Admin Features

* Admin authentication
* View all incoming meeting requests
* Accept or reject student requests
* Schedule meetings with mentors
* Manage users and meetings from dashboard

### 🎥 Real-Time Video Meetings

* One-to-one video calling
* Secure room-based access
* Auto-enabled only at scheduled time
* Low-latency communication using cloud-based video SDK

### 🔐 Security & Reliability

* Environment variable-based secret management
* Role-based access control (Student / Admin)
* Protected routes
* Secure API handling

---

## 🛠️ Tech Stack

### Frontend

* **Next.js (App Router)**
* **React.js**
* **Tailwind CSS**
* **Zustand / Context API** (state management)

### Backend

* **Next.js API Routes**
* **Node.js**
* **MongoDB (Mongoose)**

### Authentication

* **JWT-based authentication**
* **Role-based authorization**

### Media & Communication

* **ZegoCloud / LiveKit** – video conferencing
* **Cloudinary** – media storage

### Dev & Tools

* **Git & GitHub**
* **Postman** – API testing
* **dotenv** – environment variables

---

## 📂 Project Structure

```
Evolvia/
├── app/                # Next.js app router
├── components/         # Reusable UI components
├── lib/                # DB connection & utilities
├── models/             # Mongoose schemas
├── api/                # Backend API routes
├── public/             # Static assets
├── styles/             # Global styles
├── .env.local          # Environment variables
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add:

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

The app will be live at:

```
http://localhost:3000
```

---

## 📸 Screenshots

> *(Add screenshots of Student Dashboard, Admin Dashboard, and Video Call UI here)*

---

## 🧠 Key Learnings

* Building scalable full-stack applications using Next.js
* Designing role-based dashboards
* Secure authentication & authorization
* Integrating real-time video communication
* Managing cloud media storage
* Production-level environment variable handling

---

## 🚀 Future Enhancements

* Group meetings & webinars
* In-app chat system
* Email & notification system
* Payment integration for paid mentorship
* Analytics dashboard for admins

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 👤 Author

**Rishabh Raturi**
B.Tech Electrical Engineering | Full-Stack Developer

If you found this project useful, consider ⭐ starring the repository!
