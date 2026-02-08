Full-Stack Challenge — Marketplace 
Project Workflow System 
# Introduction 
Thank you for your interest in RacoAI. This task simulates a real client workflow commonly encountered in our Marketplace Projects Division. It is designed to evaluate how you decompose a high-level system into clear roles, flows, APIs, and interfaces. Please focus on correctness, clarity, smooth user experience, and disciplined full-stack execution. 
Duration: 3 Days 
# Objective 
Build a role-based project marketplace workflow where projects are created by buyers and executed by problem solvers, with clear state transitions, task management, and delivery submission. This challenge evaluates: 
● Role-based access control 
● Full project lifecycle management 
● Clean API design and data flow 
● Smooth, animated, and understandable UI states 
# User Roles & Capabilities 
1. Admin 
● Assign Buyer role to users 
● View all users and projects 
● No project execution responsibilities 
2. Buyer 
● Create a project 
● View incoming requests from problem solvers 
● Assign one problem solver to a project 
● Review task submissions 
● Accept or reject submitted work 
3. Problem Solver 
● Create and manage a profile 
● Browse available projects 
● Request to work on a project 
● Once assigned: 
    ○ Create multiple sub-modules / tasks 
    ○ Manage task timelines and metadata 
    ○ Submit completed work as a ZIP file per task 
# Core Workflow (Must Implement) 
1. Admin assigns Buyer role to a user 
2. Buyer creates a project 
3. Problem solvers request to work on the project 
4. Buyer selects one problem solver 
5. Project becomes assigned 
6. Problem solver: 
    ○ Creates tasks/sub-modules 
    ○ Adds metadata: 
        ■ Title 
        ■ Description 
        ■ Timeline / deadline 
        ■ Status 
    ○ Submits ZIP file upon completion 
7. Buyer: 
    ○ Reviews submission 
    ○ Accepts submission → task marked as completed 
# UI / UX Requirements 
● Clear visual distinction between roles 
● Step-by-step project lifecycle visualization 
● Smooth animated transitions between states: 
    ○ Project unassigned → assigned 
    ○ Task in-progress → submitted → completed 
● Use animations to explain system state, not decorate it 
Recommended tools: 
    ● Framer Motion (UI transitions) 
    ● GSAP (timeline/state-based animation) 
    ● Subtle micro-interactions (hover, loading, success states) 
# Technical Requirements 
Frontend 
● Next.js 
● Role-aware routing and UI rendering 
● Animated state transitions 
● Clean component architecture 
● Responsive, professional UI 
Backend 
● Node.js (Express) or FastAPI 
● RESTful APIs with clear separation: 
    ○ Auth 
    ○ Users & roles 
    ○ Projects 
    ○ Requests 
    ○ Tasks 
    ○ Submissions 
● Proper request validation 
● Secure file upload handling (ZIP only) 
Database 
● PostgreSQL or MongoDB 
● Clear relationship modeling 
API & Data Flow Expectations 
● Clear request/response contracts 
● Consistent status codes 
● No frontend-side business logic hacks 
● Loading, error, and empty states handled properly 
● File upload progress feedback (basic is fine) 
# Deliverables 
1. System Understanding & Flow Decomposition 
● Short explanation of: 
    ○ Role hierarchy 
    ○ Project lifecycle 
    ○ State transitions 
● Simple diagram or written flow is acceptable 
2. GitHub Repository 
● Public repository link 
● Clear README including: 
    ○ System overview 
    ○ Tech stack 
    ○ Setup instructions 
    ○ API route summary 
    ○ Key architectural decisions 
3. Live Deployment (Strongly Preferred) 
    ● Frontend and backend deployed 
    ● Stable and smooth user experience 
# Evaluation Criteria 
● Correct role enforcement 
● Logical data modeling 
● Clean API structure 
● Smooth, intentional UI transitions 
● Code quality and readability 
● Ability to handle a multi-step real-world workflow 
# What Not to Do 
No hardcoded roles or IDs 
No skipping state transitions 
No UI without feedback or animation 
No unclear or undocumented APIs 