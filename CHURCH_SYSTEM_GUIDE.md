# Global Power Church Management System - Technical & Operational Guide

Welcome to the Global Power Church Management System! This guide serves as a comprehensive manual for understanding, maintaining, and navigating the codebase, architecture, and features. 

## 1. System Architecture
The application uses a decoupled architecture with a Python/Django REST framework backend and a React (Vite) frontend.

- **Frontend**: React 18+, TypeScript, Vite, TailwindCSS (for styling), and Framer Motion (for animations).
- **Backend**: Django 4+, Django REST Framework (DRF), and SQLite/PostgreSQL depending on the environment.
- **API Communication**: The frontend interacts with the backend using a custom Axios wrapper located at `src/services/api.ts`.
- **Styling**: Complex and modern UI elements (Glassmorphism, deep gradients) are implemented via standard Tailwind utility classes and CSS modules (`src/index.css`).

## 2. Directory Structure

### Frontend (`/src`)
- `/components`: Reusable UI components (buttons, cards, badges) and specific domain components.
  - `/admin`: Components specifically used within the admin portal (e.g., `BranchSelector`, `AdminLayout`).
  - `/ui`: Base UI components.
- `/contexts`: React Context providers (e.g., `AuthContext.tsx` for managing authentication state and tokens).
- `/hooks`: Custom React hooks (e.g., `use-toast.ts`, `use-site-settings.ts`, `use-user-role.ts`).
- `/pages`: Full-page views for public and admin sides. 
  - `Sermons.tsx`, `Events.tsx`, `Give.tsx`, `Quotes.tsx`: Publicly accessible pages.
  - `/admin`: Protected pages requiring authentication (e.g., `Dashboard.tsx`, `MemberProfiles.tsx`).
- `/services`: Services handling API requests and business logic. `api.ts` is the central file for all endpoints.

### Backend (`/api` and core Django structure)
- `/api/models.py`: Database schema definitions (Members, Finance, Events, Sermons, Quotes, etc.).
- `/api/views.py`: DRF ViewSets controlling data flow and permissions. Access control (branch filtering) is primarily handled here.
- `/api/serializers.py`: Defines how Django models are converted into JSON data for the frontend.
- `/api/urls.py`: Maps endpoint paths to ViewSets.

## 3. Role-Based Access Control (RBAC) & Routing

The system includes multiple roles, handled dynamically by the backend and frontend.

### Roles Available:
1. **Super Admin (Bishop)**: Full access to all branches, members, finances, and system settings.
2. **Branch Admin (Pastor)**: Access restricted to their assigned branch.
3. **Secretary**: Similar to Branch Admin, but typically manages day-to-day data entry (Members, Attendance).
4. **Sunday School Teacher**: Restricted to managing the `/admin/sunday-school` dashboard.
5. **Member**: Basic user level (currently public viewers, or app integration if implemented).

### Authentication & Routing Flow:
- **Login**: `src/pages/Login.tsx`
- **Logic**: Upon successful login, the `getRedirectPath` function dictates the user's initial dashboard.
  - `super_admin`, `branch_admin`, `secretary` -> `/admin` (Main Dashboard)
  - `sunday_school_teacher` -> `/admin/sunday-school`
- **Branch Segregation**: Controlled seamlessly by `useUserRole` hook and Django's `get_queryset` overriding. If a user is NOT a `super_admin`, Django automatically filters queries to return only data belonging to the user's `user.role.branch`.

## 4. Key Features & How to Modify Them

### 1. Generating Quotes
- **Frontend**: The public `/quotes` page allows anyone to view quotes and create stylized quote images.
- **Backend**: In `api/views.py`, the `SocialQuoteViewSet` includes a custom `@action` called `generate` that accepts `AllowAny` permission. This allows unauthenticated users (members of the church) to generate quote cards dynamically.

### 2. Member Activities Tracking
- **Frontend**: In `src/pages/admin/MemberProfiles.tsx`, the member's details dialog includes an "Activities" tab. This summarizes the member's service attendance and financial contributions.
- **Backend**: The `MemberViewSet` features a custom `activities` endpoint. It queries the `AttendanceMember` and `Finance` models using the specific member's ID to compile an activity report.

### 3. Public Pages (Sermons, Events, Give)
- These pages utilize `apiService` to pull data dynamically from the Django API (e.g., `getEvents`, `getSermons`).
- **Styling**: They use Framer Motion for scroll animations and rich UI to create a premium visual experience.

## 5. Troubleshooting & Common Issues

- **Date Formatting Errors**: Ensure backend date strings (e.g., `event_date`, `sermon_date`) are formatted correctly on the frontend using `new Date().toLocaleDateString()`.
- **CORS/API Connection Issues**: If the frontend fails to load data, verify `VITE_API_URL` is set correctly in the frontend environment, and `CORS_ALLOWED_ORIGINS` is updated in Django's `settings.py`.
- **Missing Data (Branch Segregation)**: If a Branch Admin cannot see data, ensure the data's `branch_id` matches the user's assigned `branch_id`.

## 6. How to Run Locally

1. **Start Backend**:
   ```bash
   python manage.py runserver
   ```
2. **Start Frontend**:
   ```bash
   npm run dev
   ```

You can use this guide as your reference point for navigating the architecture and features of the church system!
