# The Grind

> A modern habit tracking and productivity web application built to help users develop consistency, manage daily habits, and stay focused.

**Live Demo:** [The Grind](https://grind-habit-tracker-hxbfabvdo-tanuelara-8264.vercel.app/)

**Repository:** [GitHub](https://github.com/tanuelara-cmyk/The-Grind)

---

Login Page

<img width="1912" height="926" alt="Screenshot 2026-09-07 214043" src="https://github.com/user-attachments/assets/91c8b1fa-8831-4b8b-b7dd-2a3c9f272e2b" />

Dashboard

<img width="1915" height="918" alt="Screenshot 2026-09-07 212910" src="https://github.com/user-attachments/assets/4b21fe2d-7424-4d1f-a3e1-d8bbbd55f656" />

---

## Overview

**The Grind** is a productivity-focused web application that combines habit tracking, streak monitoring, focused work sessions, progress tracking, and a guided productivity chatbot into a single interface.

The project was built with a focus on keeping productivity simple and accessible rather than overwhelming users with unnecessary features.

The core idea is:

**Build habits → Stay consistent → Stay focused → Track progress**

---

## Key Features

### Habit Tracking

* Create and manage daily habits
* Mark habits as completed
* Track daily consistency
* Maintain habit streaks

### Progress Tracking

* Monitor habit completion and consistency
* Track progress toward daily productivity goals
* View productivity information in a centralized dashboard

### Productivity Chatbot

* Built-in chatbot for quick productivity guidance
* Provides answers to predefined productivity-related questions
* Covers topics related to habits, focus, consistency, and productivity
* Designed as a simple guided experience rather than an open-ended AI assistant
  
### Responsive Interface

* Designed for different screen sizes
* Clean and minimal interface
* Focuses on usability and straightforward navigation

---

## Tech Stack

| Technology   | Role                                 |
| ------------ | ------------------------------------ |
| React        | Component-based frontend development |
| TypeScript   | Type safety and maintainable code    |
| Vite         | Development server and build tooling |
| Tailwind CSS | Styling and responsive design        |
| Lucide React | UI icons                             |
| Motion       | UI animations and transitions        |
| Express.js   | Server-side support                  |
| Node.js      | JavaScript runtime                   |
| dotenv       | Environment variable management      |
| Vercel       | Production deployment                |

---

## Project Structure

```text
The-Grind/
│
├── .github/
│   └── workflows/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── TheGrind/
│
├── pom.xml
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

## Application Architecture

The application follows a component-based React architecture.

```text
                    The Grind
                       │
                       ▼
                  React App
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Habits      Focus Timer   Chatbot
          │            │            │
          ▼            ▼            ▼
     Completion      Sessions    Q&A / Chat
          │                         │
          └────────────┬────────────┘
                       ▼
                Progress Tracking
```

The project separates reusable UI components, utility functions, application logic, and shared TypeScript types to make the codebase easier to maintain and extend.

---

## Deployment

The application is deployed using **Vercel**.

Every production-ready version can be built using the standard Vite production build process and deployed through Vercel's Git integration.

---

## Design Approach

The Grind was designed around three principles:

### Simplicity

Productivity tools should be easy to understand and use without a steep learning curve.

### Consistency

The application emphasizes daily progress and streaks to encourage users to build sustainable habits.

### Focus

The interface keeps important productivity actions accessible without unnecessary complexity.

---

## Challenges & Learning

Building The Grind provided practical experience with modern frontend development, including:

* Designing a component-based React application
* Working with TypeScript in a React project
* Managing application state
* Creating reusable components
* Building responsive interfaces
* Implementing habit and streak logic
* Creating a focus timer
* Implementing persistent chat data
* Integrating a guided chatbot experience
* Working with environment variables
* Using Git and GitHub for version control
* Deploying and debugging a production application with Vercel

One of the practical deployment challenges involved handling the difference between **GitHub Pages sub-path deployment and Vercel root deployment**, which required correctly configuring the Vite base path.

---

## Future Improvements

Planned improvements could include:

* User authentication
* Database-backed habit storage
* Cloud synchronization
* Dynamic AI-powered conversations
* Advanced productivity analytics
* Achievement and reward system
* Multi-device synchronization

---

## Project Goals

The project was created to gain hands-on experience in building and deploying a real-world web application while applying concepts from:

* Frontend development
* UI/UX design
* State management
* API integration
* TypeScript
* Version control
* Production deployment

---

## Author

**Tanu**

Computer Engineering Student

---

## License

This project was developed as an academic and personal learning project.

