# BeingSmile — Frontend

> A premium humanitarian crowdfunding platform built with React 19 and Vite. Connect donors with verified missions that create real impact.

**Live App:** [beingsmile.org](https://beingsmile.org)  
**Production API:** [api.beingsmile.org](https://api.beingsmile.org)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS 4 |
| UI Components | Flowbite React |
| Auth | Firebase (Email + Google OAuth) |
| Payments | Stripe + Aamarpay (BDT) |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form |
| Routing | React Router 7 |
| Notifications | React Toastify |
| Icons | React Icons (Feather) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (for auth)
- Stripe publishable key (for card payments)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/beingsmile-frontend.git
cd beingsmile-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Running Locally

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Project Structure

```
src/
├── api/               # Axios instance (points to production/local API)
├── assets/            # Images and static assets
├── components/        # Reusable UI components
│   ├── checkout/      # Stripe checkout form + provider
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── HowItWorks.jsx
│   ├── Testimonial.jsx
│   ├── WhyBeingSmile.jsx
│   ├── FAQ.jsx
│   ├── Campaign.jsx   # Campaign card component
│   ├── Login.jsx
│   ├── Register.jsx
│   └── AamarpayForm.jsx
├── contexts/          # React contexts (AuthProvider)
├── hooks/             # Custom hooks (useAuth, useCampaign, etc.)
├── layouts/
│   ├── MainLayout.jsx # Public site layout with Navbar
│   └── Dashboard.jsx  # Authenticated dashboard shell
├── pages/
│   ├── Home.jsx
│   ├── BrowseCampaigns.jsx
│   ├── CampaignDetails.jsx
│   ├── StartCampaign.jsx
│   ├── Profile.jsx
│   ├── ContactUs.jsx
│   └── Payment*.jsx   # Success / Failure / Cancelled pages
└── routers/
    ├── Router.jsx
    └── PrivateRoute.jsx
```

---

## Key Features

- 🌟 **Light-only design system** — "Sky & Sun" humanitarian aesthetic
- 🔐 **Firebase authentication** — Email/password + Google sign-in
- 💳 **Dual payment gateway** — Stripe (international) + Aamarpay (BDT)
- 🎯 **Campaign discovery** — Browse, filter by category, and search
- 📊 **Impact tracking** — Real-time progress bars and donor counts
- 👤 **User dashboard** — Profile management, campaign management, donations history
- 📱 **Fully responsive** — Mobile-first design

---

## Switching API Environments

In `src/api/axiosInstance.jsx`:

```js
// Production
baseURL: "https://api.beingsmile.org/api/"

// Local development
// baseURL: "http://localhost:5000/api/"
```
