# StudioSpace

Peer-to-peer creative workspace and production studio sharing platform.

**Live site:** _add your Vercel URL here_
**Server repo:** `studiospace-server`

## Features

- Discover photo studios, sound stages, podcast rooms, music suites and art workshops, with category filters, search and sorting
- Full studio CRUD: add, view, update and delete listings, with cover and gallery image upload through imgbb
- Booking system with live price summary, status badges (Pending, Confirmed, Completed, Cancelled) and cancellation of pending bookings
- Double-booking prevention: overlapping requests are rejected against Confirmed bookings, with the taken slots shown in the booking form
- Hosts confirm or decline booking requests from My Studio Listings
- Star ratings and written reviews, one per guest per studio
- Email/password and Google login with BetterAuth (MongoDB adapter), with password rules checked live on registration
- JWT in an HTTPOnly cookie so the Express API rejects unauthorized mutations with 401
- Private routes that survive a page reload without bouncing a signed-in user to Login
- Light and dark theme toggle that restyles the whole app and remembers your choice
- Skeleton loaders, empty states with calls to action, a custom 404 page, toast notifications and modal dialogs (no browser alerts)

## Tech stack

Next.js (App Router, JavaScript), Tailwind CSS 4, DaisyUI 5, BetterAuth with the MongoDB adapter, JWT, react-hot-toast, Swiper, next-themes, react-icons, imgbb, Express.js and MongoDB.

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values
3. Start the server repo (`studiospace-server`) on port 5000 and run `npm run seed` there once
4. `npm run dev` and open http://localhost:3000

How the two apps talk: `next.config.mjs` rewrites `/backend/*` to `SERVER_URL`, so the
JWT cookie stays first-party and works on Vercel without third-party cookie problems.

Google login needs these redirect URIs in Google Cloud Console:
`http://localhost:3000/api/auth/callback/google` and
`https://<your-live-domain>/api/auth/callback/google`.

## Examiner test credentials

_Register an account and add its email and password here._

## Try the booking rules

1. Register and log in, then open **Add New Studio** and list a space.
2. Open the studio, click **Book Workspace Now** and send a request for tomorrow, 10:00 to 12:00.
3. Go to **My Studio Listings**, find the request under Booking requests and press **Confirm**.
4. Book the same studio again for 11:00 to 13:00: the request is rejected with an overlap message.
   Booking 12:00 to 14:00 works, because the first booking ends exactly at 12:00.
