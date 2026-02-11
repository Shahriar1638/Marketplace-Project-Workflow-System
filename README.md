# FlowDesk - Marketplace Project Workflow System

FlowDesk is a role-based project marketplace where **Buyers** post visions, **Solvers** build solutions, and **Admins** orchestrate the platform. This application simulates a real-world client workflow with clear state transitions, task management, and delivery submission.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Secure routing and UI for Admin, Buyer, and Solver roles.
- **Project Lifecycle Management**: 
  - Creation → Proposal → Assignment → Development → Submission → Completion.
- **Solver Workspace**:
  - Task breakdown and management.
  - ZIP file submissions via Appwrite storage.
  - Real-time progress tracking.
- **Buyer Dashboard**:
  - Review incoming proposals.
  - Hire solvers.
  - Review and Accept/Reject task submissions.
- **Admin Console**:
  - Overview of platform statistics.
  - User and Project management.
- **Modern UI/UX**:
  - Built with **Tailwind CSS** and **Framer Motion** for smooth transitions.
  - Responsive design with distinct themes for each role (Zinc, Blue, Emerald).

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Next.js API Routes (Serverless functions).
- **Database**: MongoDB (via Mongoose).
- **Authentication**: NextAuth.js (Credentials Provider).
- **File Storage**: Appwrite Cloud.

## 📦 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shahriar1638/Marketplace-Project-Workflow-System.git
   cd flowdesk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # File Storage (Appwrite)
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Route Summary

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/signup` | POST | Public | User registration |
| `/api/admin/stats` | GET | Admin | Platform dashboard metrics |
| `/api/admin/users` | GET | Admin | List all users |
| `/api/buyer/projects` | GET, POST | Buyer | Manage own projects |
| `/api/buyer/projects/[id]/assign` | PATCH | Buyer | Assign a solver to a project |
| `/api/solver/market` | GET | Solver | Browse open projects |
| `/api/solver/active-projects/[id]/tasks` | POST | Solver | Create a new task/milestone |

## 🏗️ Key Architectural Decisions

1. **Role-Based Middleware**: 
   - Application flow is strictly segmented by user roles (`/admin`, `/buyer`, `/solver`).
   - `layout.js` files in each route group enforce specific navigation and themes.

2. **State-Driven Workflow**:
   - Projects transition through strict states: `open` → `assigned` → `completed`.
   - Tasks manage granular progress: `pending` → `submitted` → `accepted`/`rejected`.

3. **Hybrid Verification**:
   - Frontend handling for immediate feedback (toast notifications).
   - Backend API validation ensures unauthorized users cannot modify project states (e.g. only the assigned Buyer can approve a task).

---

Based on the [Project Details](./Project_details.md) requirements.
