# AI Research Crew Agent

An intelligent multi-agent research platform that automates the process of gathering, analyzing, and synthesizing information from multiple sources into structured reports.

## 🚀 Overview

AI Research Crew Agent is a full-stack application that coordinates multiple AI agents to:

* 🔍 Search the web for relevant information
* 📄 Extract and summarize content from sources
* 🧠 Analyze and organize findings
* 📝 Generate professional research reports
* 💾 Save and manage research history

This project is ideal for students, researchers, analysts, and professionals who need high-quality research reports quickly.

---

## ✨ Features

### 🤖 Multi-Agent Workflow

* **Planner Agent** – Breaks down the research task into subtasks.
* **Research Agent** – Collects data from online sources.
* **Analyst Agent** – Evaluates and structures findings.
* **Writer Agent** – Produces a polished final report.

### 📊 Research Dashboard

* Create and manage research projects.
* Track research progress in real time.
* View generated reports and source references.

### 📝 Report Generation

* Executive summary
* Key findings
* Detailed analysis
* References and citations

### 📂 Project History

* Store previous research reports.
* Reopen and export completed projects.

### 🔐 Secure Configuration

* API keys are stored in environment variables.

---

## 🏗️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* TypeScript

### Backend

* Node.js
* Express.js

### AI & Research

* OpenAI API / Gemini API / OpenRouter
* Tavily Search API (optional)
* LangChain / CrewAI (optional)

### Database

* Supabase / Firebase / MongoDB (optional)

---

## 📁 Project Structure

```text
AI_research_crew_agent/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── routes/
│   ├── agents/
│   ├── services/
│   └── index.js
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abhilash-nasam/Ai_research_crew_agent.git
cd Ai_research_crew_agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_TAVILY_API_KEY=your_tavily_api_key
```

> Only add the keys you plan to use.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

```text
http://localhost:5173
```

---

## 🔑 Getting API Keys

### OpenAI

* [https://platform.openai.com/](https://platform.openai.com/)

### Gemini

* [https://aistudio.google.com/](https://aistudio.google.com/)

### OpenRouter

* [https://openrouter.ai/](https://openrouter.ai/)

### Tavily

* [https://tavily.com/](https://tavily.com/)

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run preview  # Preview production build
npm run lint     # Run linter
```

---

## 🧠 How It Works

1. User enters a research topic.
2. Planner Agent defines research objectives.
3. Research Agent gathers information from online sources.
4. Analyst Agent filters and structures findings.
5. Writer Agent compiles a professional report.
6. Report is displayed and saved to project history.

---

## 📄 Example Research Topics

* Impact of AI in Healthcare
* Renewable Energy Trends in 2026
* Future of Autonomous Vehicles
* Cybersecurity Threat Landscape
* Market Analysis of Electric Vehicles

---

## 📤 Deployment

### Vercel

```bash
npm run build
```

Deploy the `dist/` folder to Vercel.

### Netlify

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## 🐞 Troubleshooting

### API Key Errors

Ensure your `.env` file contains valid API keys.

### Build Errors

Delete dependencies and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Vite may automatically choose another port. Check the terminal output.

---

## 📌 Roadmap

* [ ] PDF export
* [ ] Citation formatting (APA/MLA)
* [ ] Collaborative workspaces
* [ ] Voice-based research assistant
* [ ] Chrome extension

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by Abhilash Nasam.

GitHub: [https://github.com/abhilash-nasam](https://github.com/abhilash-nasam)

---

## ⭐ Support

If you found this project useful, please give it a star on GitHub.

```text
⭐ Star this repository to support the project!
```
