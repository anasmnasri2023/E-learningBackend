# 🌍 E-Learning Language Platform – Backend  

This repository contains the **backend services** for the **E-Learning Language Platform**, a modern real-time language learning application (alternative to Cambly).  
It connects learners with professional or native speakers for an engaging and effective learning experience.  

---

## ✨ Features  

- 🔐 **Authentication & Authorization** – Secure login/registration with JWT.  
- 👥 **User Management** – Support for learners and tutors (native/professional speakers).  
- 💬 **Real-Time Chat** – One-to-one messaging with read receipts using **Socket.IO**.  
- 🎥 **Video/Audio Sessions** – Integration-ready for live classes.  
- 📚 **Course & Booking System** – Manage lessons, courses, and schedules.  
- ⭐ **Reviews & Ratings** – Feedback system for learners and tutors.  
- 📩 **Notifications** – Email reminders with **Nodemailer**.  
- 📊 **Admin Dashboard Support** – Manage users, tutors, and system statistics.  

---

## 🛠️ Tech Stack  

- **Backend Framework:** Node.js + Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT + bcrypt  
- **Real-Time Communication:** Socket.IO  
- **Email Service:** Nodemailer  
- **File Uploads:** Multer / Cloud Storage (optional)  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
- git clone https://github.com/anasmnasri2023/E-learningBackend.git
- cd e-learning-language-backend
### 2️⃣ Install Dependencies

npm install
### 3️⃣ Configure Environment Variables
- Create a .env file in the root directory based on .env.example. Example:PORT=5000
- MONGO_URI=mongodb://127.0.0.1:27017/e-learning-db
- EMAIL_USER=anes.mnasri@esprit.tn
### 4️⃣ Run the Server
npm start

👉 The backend will be available at: http://localhost:5000

🚀 Next Steps
 Connect with the frontend (React).

📜 License
This project is licensed under the MIT License.

👨‍💻 Developed by Anas Mnasri
