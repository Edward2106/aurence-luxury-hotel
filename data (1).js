// Central mock data + localStorage helpers
(function () {
  const IMG = "assets/img/";
  const hotel1 = IMG + "hotel1.jpg";
  const hotel2 = IMG + "hotel2.jpg";
  const hotel3 = IMG + "hotel3.jpg";
  const hotel4 = IMG + "hotel4.jpg";
  const spa = IMG + "spa.jpg";

  const hotels = [
    { id: "aman-maldives", name: "Aman Azure Maldives", location: "Malé Atoll", country: "Maldives", price: 1250, rating: 4.9, reviews: 842, image: hotel3, gallery: [hotel3, hotel1, spa, hotel2], facilities: ["Pool","Spa","Restaurant","Gym","WiFi","Parking"], description: "An oceanfront sanctuary of overwater villas, private plunge pools and hand-crafted service — where the horizon becomes your only neighbour.", stars: 5 },
    { id: "ritz-riviera", name: "The Ritz Riviera", location: "Côte d'Azur", country: "France", price: 890, rating: 4.8, reviews: 1204, image: hotel1, gallery: [hotel1, hotel2, spa, hotel4], facilities: ["Pool","Spa","Restaurant","WiFi","Parking"], description: "Belle Époque grandeur reimagined for the modern traveller, moments from the promenade and the Mediterranean's most storied bays.", stars: 5 },
    { id: "four-seasons-tokyo", name: "Four Seasons Skyline", location: "Ginza, Tokyo", country: "Japan", price: 720, rating: 4.9, reviews: 967, image: hotel2, gallery: [hotel2, hotel1, spa, hotel3], facilities: ["Pool","Spa","Restaurant","Gym","WiFi"], description: "A vertical retreat above the world's most electric city — omakase kitchens, cedar onsens and skyline suites tuned to the season.", stars: 5 },
    { id: "alpine-chalet", name: "Zermatt Alpine Chalet", location: "Zermatt", country: "Switzerland", price: 640, rating: 4.7, reviews: 512, image: hotel4, gallery: [hotel4, spa, hotel1, hotel2], facilities: ["Spa","Restaurant","Gym","WiFi","Parking"], description: "Handcrafted timber, roaring fireplaces and Matterhorn views — an intimate mountain hideaway for winter and beyond.", stars: 5 },
    { id: "santorini-cliff", name: "Santorini Cliff Suites", location: "Oia", country: "Greece", price: 580, rating: 4.8, reviews: 733, image: hotel3, gallery: [hotel3, hotel1, spa, hotel2], facilities: ["Pool","Restaurant","WiFi","Parking"], description: "Whitewashed suites carved into the caldera, private terraces facing the Aegean sunset.", stars: 5 },
    { id: "kyoto-ryokan", name: "Kyoto Silk Ryokan", location: "Higashiyama, Kyoto", country: "Japan", price: 460, rating: 4.9, reviews: 388, image: hotel1, gallery: [hotel1, spa, hotel2, hotel4], facilities: ["Spa","Restaurant","WiFi"], description: "A hushed ryokan of tatami rooms, kaiseki dining and private cedar baths beneath a garden of maples.", stars: 5 },
  ];

  const destinations = [
    { name: "Maldives", count: 24, image: hotel3 },
    { name: "Paris", count: 42, image: hotel1 },
    { name: "Tokyo", count: 31, image: hotel2 },
    { name: "Zermatt", count: 18, image: hotel4 },
  ];

  const rooms = [
    { id: "r1", name: "Deluxe Ocean Suite", size: "68 m²", beds: "1 King", price: 1250, capacity: 2, image: hotel1, status: "Available" },
    { id: "r2", name: "Overwater Villa", size: "92 m²", beds: "1 King + Sofa", price: 1890, capacity: 3, image: hotel3, status: "Occupied" },
    { id: "r3", name: "Presidential Residence", size: "180 m²", beds: "2 King", price: 3450, capacity: 4, image: hotel2, status: "Cleaning" },
    { id: "r4", name: "Garden Junior Suite", size: "48 m²", beds: "1 Queen", price: 640, capacity: 2, image: hotel4, status: "Maintenance" },
  ];

  const reviews = [
    { id: 1, author: "Amelia R.", rating: 5, date: "March 2025", text: "Faultless from arrival to departure. The suite butler anticipated every need before we asked." },
    { id: 2, author: "Marcus H.", rating: 5, date: "February 2025", text: "The spa alone is worth the trip. Kaiseki dinner was the finest meal of our year." },
    { id: 3, author: "Sofia L.", rating: 4, date: "January 2025", text: "Exceptional service and views. A small delay at check-in but resolved graciously." },
  ];

  const bookings = [
    { id: "BK-8291", customer: "Amelia Rowe", hotel: "Aman Azure Maldives", room: "Overwater Villa", checkIn: "2026-08-12", checkOut: "2026-08-18", status: "Confirmed", total: 11340 },
    { id: "BK-7712", customer: "Marcus Hale", hotel: "The Ritz Riviera", room: "Deluxe Suite", checkIn: "2026-06-04", checkOut: "2026-06-09", status: "Completed", total: 4450 },
    { id: "BK-7104", customer: "Sofia Lange", hotel: "Four Seasons Skyline", room: "City View King", checkIn: "2026-04-22", checkOut: "2026-04-25", status: "Completed", total: 2160 },
    { id: "BK-9032", customer: "Daniel Ito", hotel: "Kyoto Silk Ryokan", room: "Tatami Garden", checkIn: "2026-09-10", checkOut: "2026-09-13", status: "Pending", total: 1380 },
    { id: "BK-9110", customer: "Laura Vine", hotel: "Zermatt Alpine Chalet", room: "Alpine Loft", checkIn: "2026-12-20", checkOut: "2026-12-27", status: "Confirmed", total: 4480 },
  ];

  const customers = [
    { id: "C-001", name: "Amelia Rowe", email: "amelia@example.com", tier: "Platinum", stays: 12, spent: 45200 },
    { id: "C-002", name: "Marcus Hale", email: "marcus@example.com", tier: "Gold", stays: 7, spent: 21800 },
    { id: "C-003", name: "Sofia Lange", email: "sofia@example.com", tier: "Gold", stays: 5, spent: 14200 },
    { id: "C-004", name: "Daniel Ito", email: "daniel@example.com", tier: "Silver", stays: 3, spent: 6100 },
    { id: "C-005", name: "Laura Vine", email: "laura@example.com", tier: "Platinum", stays: 15, spent: 62400 },
  ];

  const employees = [
    { id: "E-001", name: "Isabelle Duval", role: "General Manager", hotel: "Ritz Riviera", shift: "Day", status: "Active" },
    { id: "E-002", name: "Kenji Tanaka", role: "Head Concierge", hotel: "Four Seasons Skyline", shift: "Day", status: "Active" },
    { id: "E-003", name: "Aisha Rahman", role: "Spa Director", hotel: "Aman Azure", shift: "Day", status: "Active" },
    { id: "E-004", name: "Oliver Grant", role: "Executive Chef", hotel: "Zermatt Alpine", shift: "Evening", status: "Active" },
    { id: "E-005", name: "Nadia Petrov", role: "Housekeeping Lead", hotel: "Santorini Cliff", shift: "Day", status: "Active" },
  ];

  const services = [
    { id: "S1", name: "In-suite dining", desc: "24-hour room service curated by our Michelin chef.", price: "From $45" },
    { id: "S2", name: "Spa & wellness", desc: "Signature treatments, hammam, cedar sauna and cold plunge.", price: "From $180" },
    { id: "S3", name: "Chauffeur service", desc: "Chauffeured Mercedes-Maybach transfers on request.", price: "From $120/hr" },
    { id: "S4", name: "Private excursion", desc: "Bespoke day trips curated by your concierge team.", price: "On request" },
    { id: "S5", name: "Laundry & pressing", desc: "Same-day laundry, pressing and shoe-shine service.", price: "From $25" },
    { id: "S6", name: "Butler service", desc: "A dedicated butler for the duration of your stay.", price: "Complimentary" },
  ];

  // LocalStorage helpers
  const LS = {
    get(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  };

  // Seed defaults
  if (!LS.get("aurence.profile")) LS.set("aurence.profile", { firstName: "Amelia", lastName: "Rowe", email: "amelia@example.com", phone: "+1 415 555 0148", tier: "Platinum", preferences: { bed: "King", pillow: "Down", newspaper: "FT" } });
  if (!LS.get("aurence.bookings")) LS.set("aurence.bookings", bookings);
  if (!LS.get("aurence.requests")) LS.set("aurence.requests", []);
  if (!LS.get("aurence.settings")) LS.set("aurence.settings", { emailUpdates: true, smsAlerts: false, currency: "USD", language: "English" });

  window.AURENCE = { hotels, destinations, rooms, reviews, bookings, customers, employees, services, LS };
})();
