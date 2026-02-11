# Video Presentation Script & Architecture Report

Use this guide to structure your 5-minute explanation video. The goal is to show **how** you solved the problem, not just **what** you built.

---

## ⏱️ Video Structure (5 Minutes Max)

### 1. Introduction (0:00 - 0:30)
*   **Who you are:** "Hi, I'm [Your Name], and this is FlowDesk, a role-based marketplace workflow system."
*   **The Problem:** "The goal was to build a secure platform connecting Buyers and Solvers with clear state transitions and role-based access control."
*   **Tech Stack:** "I used Next.js (App Router) for the frontend/backend, MongoDB for the database, NextAuth for authentication, and Appwrite for secure file storage."

### 2. Architecture & Role-Based Access (0:30 - 1:30)
*   *Show the code or diagram briefly*
*   **Authentication:** "I implemented a robust RBAC (Role-Based Access Control) system using NextAuth sessions. Middleware protects routes, ensuring only Admins can access `/admin`, Buyers see `/buyer`, etc."
*   **Database Schema:** "I modeled relationships between Users, Projects, and Requests. A Project has a `buyerId`, an assigned `solverId`, and an array of `requests` (applications)."
*   **State Machine:** "The core logic relies on a state machine:
    1.  **Open:** Project created by Buyer.
    2.  **Pending:** Solvers apply.
    3.  **Assigned:** Buyer selects a Solver.
    4.  **In Progress:** Solver creates milestones.
    5.  **Completed:** Tasks are submitted and approved."

### 3. Core Workflow Demo (1:30 - 3:30)
*   *Walk through the actual app flow*
*   **Buyer Flow:** "Here, I'm logged in as a Buyer. I create a project. I see a smooth, animated dashboard."
*   **Solver Flow:** "Switching to a Solver account. I browse the Marketplace, filter by tech stack (React, Node), and apply."
*   **Assignment:** "Back to Buyer. I review applications and 'Hire' the solver. SweetAlert2 handles the confirmation UX."
*   **Work & Submission:** "As the Solver, I now see the Active Workspace. I break down the work into Milestones. I upload a ZIP file (stored via Appwrite) and submit."
*   **Approval:** "Finally, the Buyer reviews the ZIP and approves the milestone."

### 4. Technical Highlights & best Practices (3:30 - 4:30)
*   **API Design:** "I built RESTful API endpoints at `/api/projects`, `/api/requests`, etc. All endpoints validate user sessions server-side to prevent unauthorized access."
*   **File Handling:** "File uploads are handled securely. We validate ZIP file types on both client and server before sending to Appwrite storage."
*   **UX/UI:** "I used Framer Motion for page transitions and list animations to make the state changes feel organic. I replaced native alerts with custom SweetAlert2 modals for a premium feel."

### 5. Conclusion (4:30 - 5:00)
*   "Run the tests or show dynamic responsive design briefly."
*   "FlowDesk meets all requirements: secure roles, complete lifecycle management, and a polished UI. Thank you for watching."

---

## 🏗️ Architecture Overview (For the Report)

### 1. Tech Stack
*   **Framework:** Next.js 14 (App Router)
*   **Database:** MongoDB (Mongoose ODM)
*   **Auth:** NextAuth.js (Credentials Provider)
*   **Storage:** Appwrite (Bucket Storage for ZIPs)
*   **UI/UX:** TailwindCSS, Framer Motion, Lucide Icons, SweetAlert2

### 2. Data Models
*   **User:** Stores `role` (Admin/Buyer/Solver/User), `profile` (bio, skills), and auth data.
*   **Project:** The central entity.
    *   `status`: 'open' | 'assigned' | 'completed'
    *   `solverId`: Reference to the hired user.
    *   `requests`: Array of applications with cover letters.
    *   `tasks/milestones`: Sub-documents for tracking work progress.

### 3. Key Design Decisions
*   **Server-Side Validation:** We never trust the client. Every API route checks `session.user.role` before performing actions (e.g., only Buyers can delete their own projects).
*   **Optimistic UI:** We use loading states and smooth transitions (Framer Motion) to make the app feel faster than it is.
*   **Unified API Response:** structured standard JSON responses for success/error handling across the app.

### 4. Security
*   **RBAC Middleware:** prevents users from manually navigating to unauthorized pages.
*   **Sanitization:** Inputs are validated to prevent injection attacks.
*   **Secure Submissions:** Only ZIP files are allowed for deliverables to prevent malicious script uploads.
