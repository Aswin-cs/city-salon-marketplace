# City Salon Marketplace

A premium urban grooming directory for Mumbai's most beautiful grooming spaces and elite studios. 

---

## 🌟 Core Features

### 1. Unified Navigation Bar
- **Responsive Design**: Clean desktop layout with hover micro-animations and a sleek mobile hamburger toggle drawer.
- **Dynamic Session Handling**: Suspense-wrapped Server Component that streams the authentication state (Profile, Dashboard, Sign Out / Sign In) without blocking the page's initial static paint.

### 2. Homepage Salon Search & Filtering
- **Fuzzy Multi-Field Search**: A unified, debounced search bar querying salon names, descriptions, services offered, and neighborhood zones.
- **Param-Preserving Navigation**: Merges active service and zone categories automatically when executing text searches.

### 3. Interactive Profile Booking Management
- **Status Filters**: Tabs to instantly filter appointment history by status: `All Bookings`, `Live (Active)`, or `Cancelled`.
- **Sort Selectors**: Tactile dropdown controls to sort bookings by `Date` (Latest/Oldest First) or `Price` (Highest/Lowest First).
- **Client-Side Optimization**: Derives lists dynamically on the client to avoid screen flashes or roundtrips, maintaining instant performance.

### 4. Admin Manager Dashboard
- **Role-Based Protection**: Strict middleware security restricting access to the `/dashboard` route. Non-admin client roles are redirected to `/`.
- **Analytics Overview**: Live summary widgets tracking total bookings, simulated active traffic, aggregate revenue, and pending actions.
- **Data Table**: Full overview of recent booking reservations and status descriptors.

### 5. Offline Payment Flow
- **Direct At-Salon Payments**: Clear UI banners and warnings in checkout modals and history logs reminding users that all payments are handled offline.

### 6. Security Rate Limiting
- **API Protection**: Customized in-memory sliding-window rate limiter protecting:
  - Booking creations (5 requests/min limit)
  - Account registrations (3 signups/5 mins limit)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.3 (App Router with Turbo compiler and Partial Prerendering)
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: NextAuth.js (Credentials & Google OAuth Provider support)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

---

## ⚙️ Configuration & Environment Setup

Create a `.env` file in the root directory and specify the following keys:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_jwt_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional login provider)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🚀 Execution Instructions

### Development Server
Run the local development server (uses Turbopack by default):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Generate an optimized production build:
```bash
npm run build
```

### Start Server
Start the compiled application in production mode:
```bash
npm run start
```
