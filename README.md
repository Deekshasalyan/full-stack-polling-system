# 🗳️ Full Stack Development Task: Basic Polling System and Trend Analysis

[cite_start]This project implements a full-stack application for a basic polling system with trend analysis, fulfilling all provided requirements[cite: 4, 52].

---

## 🛠️ Tech Stack & Architecture

| Component | Technology | Requirement Adherence | Notes |
| :--- | :--- | :--- | :--- |
| **Backend** | Node.js / Express | [cite_start]Implemented in Node.js/Express[cite: 32]. | Used Express for API routing. |
| **Database** | SQLite (via Prisma) | [cite_start]Relational Database Management System (RDBMS) used[cite: 31]. | Easily portable for local testing. |
| **ORM** | Prisma | [cite_start]**Mandatory** Object-Relational Mapping (ORM) used for database operations[cite: 28, 122]. | Simplifies database interactions. |
| **Frontend** | React (Vite) | [cite_start]Single Page Application (SPA) library used[cite: 48]. | Provides a user-friendly and responsive interface. |
| **Charting** | Chart.js / react-chartjs-2 | [cite_start]**Mandatory** chart library used for interactive data visualizations[cite: 29, 68]. | Used for Line and Bar charts. |

---

## [cite_start]🚀 How to Set Up and Run the Project [cite: 22]

**Prerequisites:** Node.js (v18+) and npm installed.

### 1. Backend (API Server) Setup

Navigate to the project root directory (`D:\Polling System`):

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Database Setup:** The project uses SQLite. The connection is configured in the `.env` file.
3.  **Run Migrations:** Initialize the database schema (`votes` table) using Prisma.
    ```bash
    npx prisma migrate dev --name init_polling_system
    ```
4.  **Start the Backend Server:**
    ```bash
    npx nodemon server.js
    ```
    *The server will run on **http://localhost:3000**.*

### 2. Frontend (React App) Setup

Navigate to the frontend folder: `D:\Polling System\frontend`:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Frontend Application:**
    ```bash
    npm run dev
    ```
    *The application will typically open in your browser at **http://localhost:5173**.*

---

## [cite_start]📋 Codebase and API Documentation [cite: 24]

### Database Schema (`votes` Table)

| Column | Type | Constraints | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | PRIMARY KEY, Auto-increment | Unique identifier |
| `name` | `String` | NOT NULL | Voter's name |
| `voting_choice` | `Boolean` | | [cite_start]True/False vote [cite: 56] |
| `casted_at` | `DateTime` | NOT NULL | [cite_start]Date/Time of submission [cite: 57] |

### API Endpoints

| Endpoint | Method | Purpose | Response Structure |
| :--- | :--- | :--- | :--- |
| `/vote` | `POST` | Records a new vote submission. | [cite_start]`201 Success` [cite: 74] |
| `/data` | `GET` | Fetches **all** vote records for the data table. | [cite_start]`{"data": [...]}` [cite: 88, 89] |
| `/counts` | `GET` | Fetches vote counts **grouped by day** for the Line Chart (Requires `?voting_choice=true` or `false`). | `{"data": [{"count": 2, "casted_at": "YYYY-MM-DD"}, ...]}` [cite: 98, 101] |
| `/results` | `GET` | Fetches the overall **total counts** for the Bar Graph. | [cite_start]`{"data": [{"count": 3, "voting_choice": true}, ...]}` [cite: 110, 112] |

---

## [cite_start]🧪 Testing and Edge Cases [cite: 17, 18, 25]

While comprehensive unit tests are a "significant plus," the application handles the following edge cases:

* [cite_start]**Invalid/Missing Inputs:** The backend (`/vote` POST) returns a `400 Bad Request` if `name`, `voting_choice`, or `casted_at` are missing, and the frontend displays a clear error message[cite: 46, 47].
* **Missing Data:** The Dashboard charts and table handle empty database states gracefully by displaying "No votes cast yet" or rendering charts with zero counts.
* **Chart Aggregation:** The backend uses raw SQL (`DATE(casted_at)`) to ensure votes are correctly grouped by the day they were cast, crucial for the Line Chart trend analysis.

---

## [cite_start]📖 References and Resources Used [cite: 7, 23]

* **Official Documentation:** Node.js, Express, React, Prisma, Chart.js.
* **Search Engines:** Google, Stack Overflow (used for general debugging and understanding Prisma raw queries).
* [cite_start]**AI Assistance:** (Acknowledge any use of LLMs/GitHub Copilot here for specific functions or boilerplates, emphasizing you understand and are responsible for the code [cite: 7, 8, 9]).

---

## [cite_start]🎥 Project Demonstration (Screen Record) [cite: 26]

**(Include a link to the screen record video demonstrating the entire functionality here)**
