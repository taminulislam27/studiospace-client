# StudioSpace
 
**A peer-to-peer marketplace for creative workspaces and production studios.**
Hosts list photo studios, film stages, podcast lounges, music suites and art workshops. Creators discover them, check real availability, and book by the hour.
 
**Live site:** https://studiospace-client-liard.vercel.app
**Server repository:** `studiospace-server` (Express + MongoDB API, deployed at https://studiospace-server-beryl-xi.vercel.app)
 
---
 
## Features
 
- **Discover studios.** Browse five categories with category filters, text search and sorting by newest, rating or price.
- **Full studio CRUD.** Add, view, update and delete listings, with cover and gallery images uploaded through imgbb.
- **Booking system.** Live price summary, hourly slots from 1 to 12 hours, and status badges (Pending, Confirmed, Completed, Cancelled). Guests can cancel pending bookings.
- **Double-booking prevention.** Overlapping requests are rejected against Confirmed bookings, and the taken time slots are shown in the booking form. Back-to-back bookings are allowed.
- **Host workflow.** Hosts confirm or decline booking requests from My Studio Listings.
- **Ratings and reviews.** Star ratings and written reviews, one per guest per studio, with the studio average recalculated automatically.
- **Authentication.** Email/password and Google sign-in with BetterAuth (MongoDB adapter). Password rules are checked live on registration.
- **Protected API.** A JWT is stored in an HTTPOnly cookie, and the Express API answers `401 Unauthorized` to unauthenticated mutations.
- **Private routes that survive reloads.** A signed-in user stays signed in when reloading any private page.
- **Light and dark theme.** One toggle restyles the entire app and remembers your choice.
- **Polished experience.** Responsive layout, skeleton loaders, empty states with calls to action, a custom 404 page, and toast notifications and modal dialogs instead of browser alerts.
## Tech stack
 
| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router, JavaScript), Tailwind CSS 4, DaisyUI 5 |
| Authentication | BetterAuth with the MongoDB adapter, Google OAuth, JWT in an HTTPOnly cookie |
| Backend | Express.js, MongoDB (Atlas) |
| UI libraries | react-hot-toast, Swiper, next-themes, react-icons |
| Image hosting | imgbb |
| Deployment | Vercel (client and server) |
 
## Examiner test credentials
 
| Field | Value |
| --- | --- |
| Email | `PUT-EXAMINER-EMAIL-HERE` |
| Password | `PUT-EXAMINER-PASSWORD-HERE` |
 
You can also register a new account, or continue with Google.
 
## Try the booking rules
 
1. Log in and open **Add New Studio** to list a space.
2. Open a studio you do not own and click **Book Workspace Now**. Send a request for tomorrow, 10:00 to 12:00.
3. Log in as the studio's host, open **My Studio Listings**, find the request under Booking requests and press **Confirm**.
4. Book the same studio for 11:00 to 13:00. The request is rejected with an overlap message.
   Booking 12:00 to 14:00 works, because the first booking ends exactly at 12:00.
## Local setup
 
**Prerequisites:** Node.js 20 or later, a MongoDB Atlas database, a Google OAuth client and an imgbb API key.
 
1. Clone this repository and install dependencies:
```bash
   npm install
```
2. Copy `.env.example` to `.env.local` and fill in the values:
   | Variable | Purpose |
   | --- | --- |
   | `MONGODB_URI` | MongoDB connection string used by BetterAuth |
   | `BETTER_AUTH_SECRET` | Random string of 32 or more characters |
   | `BETTER_AUTH_URL` | App URL, `http://localhost:3000` locally |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
   | `JWT_SECRET` | Must be identical to `JWT_SECRET` in the server repository |
   | `SERVER_URL` | API URL, `http://localhost:5000` locally |
   | `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for image uploads |
3. Start the server repository (`studiospace-server`) on port 5000 and run `npm run seed` there once to add sample studios.
4. Start the client:
```bash
   npm run dev
```
   Open http://localhost:3000.
 
**Google sign-in** needs these redirect URIs on your OAuth client in Google Cloud Console:
`http://localhost:3000/api/auth/callback/google` and `https://<your-domain>/api/auth/callback/google`.
 
## How the client and server connect
 
`next.config.mjs` rewrites `/backend/*` to `SERVER_URL`. The browser therefore talks to its own origin, so the JWT cookie stays first-party and works on Vercel without third-party cookie problems.
 
## Project structure
 
```
app/          Routes (home, studios, studio details, add and edit studio, my listings, my bookings, dashboard, auth, about)
components/   Reusable UI (navbar, footer, hero slider, studio form, booking modal, reviews, skeletons)
lib/          BetterAuth setup, API helper, constants, formatting and image-upload helpers
public/       Studio illustrations used by the sample listings
```
 
## Deployment (Vercel)
 
Add every variable from `.env.example` to the Vercel project. Set `BETTER_AUTH_URL` to the live client URL (no trailing slash) and `SERVER_URL` to the live server URL.