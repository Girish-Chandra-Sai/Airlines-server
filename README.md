✈️ SkyPath Airlines – Full-Stack Airline Reservation System


A fully functional, full-stack airline reservation platform built using the MERN stack. The system supports real-time flight search, seamless booking workflows, user authentication, and review features — all deployed for scalable use.

🚀 Live Demo

🔗 https://skypath-airlines.onrender.com

📌 Features
🔍 Real-Time Flight Search

Search flights based on source, destination, dates, and passenger count.

Optimized backend API for quick and accurate results.

🛫 End-to-End Booking Workflow

Complete booking flow including:
  Flight selection
  Passenger details
  Booking confirmation

Smooth and responsive UI powered by React.js

⭐ User Reviews

  Users can post and view flight reviews
  Helps improve transparency and customer decision-making

🔐 Secure Authentication

  Token-based authentication using JWT
  Secure login & signup
  User-protected routes

🛠 Scalable Deployment

  Fully deployed on Render
  Backend + frontend optimized for reliability and uptime

🏗 Tech Stack
  Frontend
  React.js
  HTML, CSS, JavaScript

Backend
  Node.js
  Express.js
  RESTful API architecture

Database
  MongoDB (Efficient storage for flights, bookings, and users)

Other Tools
  Git
  JWT Authentication
  Render Deployment

📚 Project Architecture
SkyPath Airlines
│
├── client/              # React.js Frontend
│   ├── components/      # Reusable components
│   ├── pages/           # Route pages
│   └── utils/           # Helpers & API handlers
│
├── server/              # Node.js + Express Backend
│   ├── models/          # MongoDB Schemas
│   ├── routes/          # API Routes
│   └── controllers/     # Business Logic
│
└── README.md

🧪 Core Functionalities
✔ Flight Search

Queries optimized to fetch available flights based on user criteria.

✔ Booking System

Stores booking details securely in MongoDB.

✔ User Authentication

Passwords safely hashed, tokens securely managed.

✔ Reviews & Feedback

Users can interact with flights beyond just booking.

🛡 Security

JWT for secure, stateless authentication

Input validation

Protected API endpoints

📦 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/skypath-airlines.git
cd skypath-airlines

2️⃣ Install Dependencies

Backend:

cd server
npm install


Frontend:

cd client
npm install

3️⃣ Setup Environment Variables

Create .env in /server:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

4️⃣ Start Development Servers

Backend:

npm start


Frontend:

npm start

🌐 Deployment

The full application is deployed on Render, ensuring:

High availability

Automatic scalability

Continuous deployment

5e3b7c08-b7fc-44af-b65b-ca7e039…

👨‍💻 Author

Mannava Girish Chandra Sai
B.Tech – Computer Science & Engineering
Indian Institute of Information Technology, Gwalior

🔗 LinkedIn

📧 mannavagirish7@gmail.com

⭐ Show Your Support

If you found this project useful, consider giving it a star ⭐ on GitHub!
