Here is the revised **frontend-focused** `README.md`. It highlights the Chrome Extension and Web Dashboard while providing just a brief "gist" of the backend connectivity as requested.

---

# InternOps Frontend

> **Smart Resume Filter & Application Tracker: Get Shortlisted, Not Rejected.**

**InternOps Frontend** is the user interface for the InternOps ecosystem. It consists of a **Chrome Extension** that acts as your sidekick while browsing job boards and a **Web Dashboard** for deep-diving into your application analytics.

### 🔌 Backend Integration

This frontend serves as the visual layer for the **[InternOps Backend](https://github.com/gyanprakashkushwaha/internops)**.

* **The Backend's Role:** It hosts the AI Agents (LangChain/LLMs) and the Database.
* **The Frontend's Role:** It collects job data, displays the analysis scores, and manages user interaction.

> *Note: This project requires a running instance of the InternOps Backend to function.*

---

## 🚀 Key Features

### 🧩 Chrome Extension (The Sidekick)

* **Instant Resume Scoring**: Analyzes your uploaded resume against the job description on your current tab in real-time.
* **Three Analysis Modes**:
* **ATS Mode**: Checks keywords and formatting.
* **Recruiter Mode**: Looks for red flags and career gaps.
* **Engineering Manager Mode**: Validates technical depth and "proof of work."


* **Live Status**: Asynchronous polling ensures you see progress without freezing your browser.

### 📊 Web Dashboard (The HQ)

* **Application History**: A clean table view of every job you've analyzed (Hired/Rejected status).
* **Detailed Reports**: comprehensive breakdown of why a resume succeeded or failed.
* **AI Chat Assistant**: Ask specific questions about your results (e.g., *"How do I fix the missing skills mentioned in this report?"*).

---

## 🛠️ Tech Stack

**Frontend Core**

* **Vue 3** (Composition API)
* **Vite**
* **Tailwind CSS v4**

**Extension Architecture**

* **Manifest V3** standard.
* **Chrome Storage & Messaging API** for state management.

---

## 📦 Prerequisites

1. **Node.js** (v18+) installed.
2. **Google Chrome** browser.
3. **InternOps Backend** running locally (or hosted remotely).
* *See [Backend Repository](https://github.com/gyanprakashkushwaha/internops) for setup instructions.*



---

## ⚡ Installation & Setup

### 1. Web Dashboard Setup

The dashboard allows you to view history and detailed reports.

```bash
# Clone the repository
git clone https://github.com/gyanprakashkushwaha/internops-frontend.git
cd internops-frontend/web

# Install dependencies
npm install

# Run development server
npm run dev

```

*Access the dashboard at `http://localhost:5173*`

### 2. Chrome Extension Setup

The extension allows you to analyze jobs while browsing.

1. Open **Google Chrome** and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** (top right corner).
3. Click **Load unpacked**.
4. Select the `extension` folder inside this repository.
5. The **InternOps** icon will appear in your toolbar.

---

## 📖 Usage

1. **Start the Backend**: Ensure your backend server is active (default: `http://localhost:8000`).
2. **Analyze a Job**:
* Go to a job posting (LinkedIn, etc.).
* Open the InternOps Extension.
* Upload your Resume (PDF) and click **Analyze**.


3. **View Results**:
* Check the extension popup for immediate scores.
* Visit the **Web Dashboard** to chat with the AI about the results.



---

## 🖼️ Visuals

### Extension Interface

*(Placeholder: Screenshot of the extension analyzing a job)*

### Dashboard Analytics

*(Placeholder: Screenshot of the application history table)*

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit changes (`git commit -m 'Add NewFeature'`).
4. Push to branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

For backend contributions, please visit the [InternOps Backend Repo](https://github.com/gyanprakashkushwaha/internops).

---

## 📞 Contact & Support

**Author:** Gyan Prakash Kushwaha
**GitHub:** [gyanprakashkushwaha](https://github.com/gyanprakashkushwaha)
**E-mail:** gyanprakash.sde@gmail.com

---
