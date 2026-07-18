# Aurence — Luxury Hotel Management System

A pure HTML5 / CSS3 / vanilla-JavaScript multi-page website. No build step required.

## Run locally

Open the folder in VS Code and click **"Go Live"** (Live Server extension). Or open `index.html` directly in a browser.

## Structure

```
index.html            Home
hotels.html           Listings + filters
hotel.html            Property detail (uses ?id=)
booking.html          Reservation checkout
dashboard.html        Guest portal
checkin.html          Online check-in wizard
services.html         In-stay concierge requests
checkout.html         Final folio / invoice
review.html           Post-stay review
profile.html          Account preferences

admin/index.html      Admin dashboard
admin/hotels.html     Hotel inventory
admin/rooms.html      Room status board
admin/bookings.html   Reservations
admin/customers.html  CRM
admin/employees.html  Staff
admin/reviews.html    Guest feedback
admin/reports.html    Analytics
admin/settings.html   Configuration

assets/css/style.css  Design system (navy + gold)
assets/js/data.js     Mock data + localStorage
assets/js/app.js      Nav / footer / helpers
assets/js/admin.js    Admin sidebar
assets/img/*.jpg      Property imagery
```

Bookings, requests and profile edits persist via `localStorage`.
