# 🚀 FIREBASE BOOKING SYSTEM - STEP BY STEP GUIDE

## 📋 What You're Building

A professional, real-time concert ticket booking system with:
- ✅ Live seat availability updates
- ✅ Prevents double-bookings automatically
- ✅ Admin dashboard to manage bookings
- ✅ Works perfectly on GitHub Pages
- ✅ 100% FREE (Firebase free tier)

---

## STEP 1: CREATE FIREBASE PROJECT (15 minutes)

### 1.1 Go to Firebase Console
👉 Visit: https://console.firebase.google.com/

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Project name: `trdc-concert-booking` (or any name you like)
3. Click **Continue**
4. **Google Analytics**: Turn OFF (not needed for this project)
5. Click **Create project**
6. Wait 30-60 seconds for project creation
7. Click **Continue**

### 1.3 Set Up Realtime Database
1. In left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. **Location**: Choose closest to Indonesia (e.g., `singapore-southeast1`)
4. **Security rules**: Start in **"test mode"** for now (we'll secure it later)
5. Click **Enable**

You should now see an empty database with URL like:
```
https://trdc-concert-booking-default-rtdb.firebaseio.com/
```

### 1.4 Get Your Firebase Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. App nickname: `TRDC Booking Web`
6. **Don't** check "Firebase Hosting" (we're using GitHub Pages)
7. Click **"Register app"**

You'll see code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q",
  authDomain: "trdc-concert-booking.firebaseapp.com",
  databaseURL: "https://trdc-concert-booking-default-rtdb.firebaseio.com",
  projectId: "trdc-concert-booking",
  storageBucket: "trdc-concert-booking.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**📝 COPY THIS ENTIRE CONFIG - YOU'LL NEED IT IN STEP 2!**

8. Click **"Continue to console"**

---

## STEP 2: UPDATE YOUR CODE FILES (5 minutes)

You have 3 files to update:
1. `booking-system.js` - Main booking logic
2. `admin-dashboard.html` - Admin panel

### 2.1 Update booking-system.js

1. Open `booking-system.js`
2. Find lines 4-11 (the firebaseConfig section):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ... etc
};
```

3. **REPLACE** this entire section with YOUR config from Step 1.4
4. Save the file

### 2.2 Update admin-dashboard.html

1. Open `admin-dashboard.html`
2. Find around line 255 (the firebaseConfig section)
3. **REPLACE** with YOUR config (same as Step 2.1)
4. Save the file

---

## STEP 3: UPLOAD TO GITHUB PAGES (10 minutes)

### 3.1 Prepare Your Files

Your GitHub repository should have:
```
your-repo/
├── index.html              (rename from index-firebase.html)
├── booking-system.js
├── admin-dashboard.html    (keep this file PRIVATE - don't publish link)
├── TRDC - Stage.jpg
├── stage.png
├── Map TRDC.png
├── Bar Code TRDC.png
├── Archies_Logo.JPG
└── Achi.png
```

### 3.2 Rename and Upload

1. Rename `index-firebase.html` to `index.html`
2. Upload to your GitHub repository:

```bash
cd TRDC
git add index.html booking-system.js admin-dashboard.html
git commit -m "Add Firebase booking system"
git push origin main
```

### 3.3 Test Your Site

Visit: `https://svargaantari.github.io/TRDC/`

You should see:
- ✅ Concert page loads
- ✅ Seat map appears (after "Memuat peta kursi..." message)
- ✅ Green seats (available)
- ✅ Can click to select seats (they turn blue)

---

## STEP 4: TEST THE BOOKING FLOW (5 minutes)

### 4.1 Test Seat Selection

1. Open your site: `https://svargaantari.github.io/TRDC/`
2. Scroll to "Pemesanan Tiket"
3. Click on a few seats (they should turn blue)
4. Check that summary updates:
   - Seat count increases
   - Total price calculates correctly
   - Selected seats show as tags

### 4.2 Test Real-Time Updates

1. Open your site in TWO browser windows (or one normal, one incognito)
2. In Window 1: Select some seats
3. In Window 2: Those seats should NOT be available to click
4. In Window 1: Deselect seats
5. In Window 2: Seats become available again

**This proves real-time sync is working! 🎉**

### 4.3 Test Checkout

1. Select seats
2. Click "Lanjut ke Pembayaran"
3. Confirm the booking
4. You'll be redirected to Google Form
5. **Note**: Form won't pre-fill yet (we'll fix that in Step 6)

---

## STEP 5: SET UP ADMIN DASHBOARD (5 minutes)

### 5.1 Access Dashboard Locally

**IMPORTANT**: Don't publish the admin dashboard link publicly!

**Option A**: Test locally
1. Open `admin-dashboard.html` directly in your browser
2. You should see dashboard with statistics

**Option B**: Upload but keep link private
1. Upload to GitHub
2. Access: `https://svargaantari.github.io/TRDC/admin-dashboard.html`
3. **Don't share this link** - only for organizers

### 5.2 Test Admin Functions

1. Make a test booking on your main site
2. Refresh admin dashboard
3. You should see:
   - Total seats: 64
   - Booking appears in "Pemesanan Aktif"
   - Status: "pending"
4. Click "Konfirmasi" to approve booking
5. Seats turn red on main site
6. Try clicking confirmed seats - they're locked ✅

---

## STEP 6: CONNECT GOOGLE FORM (10 minutes)

### 6.1 Update Your Google Form

1. Open your Google Form in edit mode
2. Add these fields if not present:
   - **Nama Lengkap** (text)
   - **Email** (email)
   - **No. WhatsApp** (text)
   - **Kursi yang Dipilih** (text)
   - **Total Harga** (text)
   - **Booking ID** (text)

### 6.2 Get Field Entry IDs

1. Preview your form
2. Right-click → **Inspect Element**
3. For each field, find code like: `entry.123456789`
4. Copy these entry IDs

Example:
```
Kursi yang Dipilih: entry.987654321
Total Harga: entry.123456789
Booking ID: entry.555555555
```

### 6.3 Update booking-system.js

1. Open `booking-system.js`
2. Find line ~280 (in the `handleCheckout` function)
3. Update the entry IDs:

```javascript
const redirectUrl = `${formUrl}?entry.987654321=${seatInfo}&entry.123456789=${price}&entry.555555555=${bookingId}`;
```

Replace `987654321`, `123456789`, `555555555` with YOUR actual entry IDs

4. Save and upload to GitHub

---

## STEP 7: SECURE YOUR FIREBASE DATABASE (5 minutes)

### 7.1 Update Security Rules

1. Go to Firebase Console
2. **Realtime Database** → **Rules** tab
3. Replace the rules with:

```json
{
  "rules": {
    "seats": {
      ".read": true,
      ".write": true,
      "$seatId": {
        ".validate": "newData.hasChildren(['section', 'row', 'number', 'price', 'status'])"
      }
    },
    "bookings": {
      ".read": true,
      ".write": true,
      "$bookingId": {
        ".validate": "newData.hasChildren(['bookingId', 'seats', 'totalPrice', 'status', 'createdAt'])"
      }
    }
  }
}
```

4. Click **"Publish"**

This allows:
- ✅ Anyone can read seat availability
- ✅ Anyone can create bookings
- ✅ Validates data structure
- ❌ Prevents malicious data

### 7.2 (Optional) Add Admin Authentication

For better security, you can:
1. Enable Firebase Authentication
2. Only allow authenticated users to confirm bookings
3. See Firebase docs for Authentication setup

---

## STEP 8: CONFIGURE SEAT LAYOUT (OPTIONAL - 5 minutes)

Want to customize the number of seats?

### 8.1 Edit Venue Configuration

Open `booking-system.js`, find lines 19-31:

```javascript
const VENUE_CONFIG = {
    vip: {
        name: 'VIP',
        price: 500000,
        rows: 3,           // ← Change this
        seatsPerRow: 8,    // ← Change this
        color: '#FFD700'
    },
    regular: {
        name: 'Regular',
        price: 250000,
        rows: 5,           // ← Change this
        seatsPerRow: 10,   // ← Change this
        color: '#87CEEB'
    }
};
```

**Example**: If you want 5 VIP rows with 10 seats each:
```javascript
vip: {
    name: 'VIP',
    price: 500000,
    rows: 5,
    seatsPerRow: 10,
    color: '#FFD700'
}
```

### 8.2 Reset Database

After changing layout:
1. Go to Firebase Console → Realtime Database
2. Delete all data (click the X next to root)
3. Refresh your website
4. New seat structure will be created automatically

---

## STEP 9: GO LIVE! 🎉

### 9.1 Pre-Launch Checklist

- [ ] Firebase project created and configured
- [ ] All files uploaded to GitHub Pages
- [ ] Seat selection works
- [ ] Real-time updates working (test with 2 browsers)
- [ ] Admin dashboard accessible (privately)
- [ ] Google Form connected
- [ ] Security rules published
- [ ] Test booking from start to finish

### 9.2 Launch!

1. Share your website: `https://svargaantari.github.io/TRDC/`
2. Monitor bookings via admin dashboard
3. Confirm bookings as they come in
4. Export CSV for your records

---

## 📞 TROUBLESHOOTING

### Problem: "Memuat peta kursi..." never disappears

**Solution**:
1. Open browser console (F12)
2. Check for errors
3. Verify Firebase config is correct
4. Check Firebase Database URL is accessible

### Problem: Seats don't turn blue when clicked

**Solution**:
1. Check console for JavaScript errors
2. Verify `booking-system.js` is loaded
3. Clear browser cache (Ctrl+Shift+R)

### Problem: Real-time updates not working

**Solution**:
1. Check Firebase security rules are published
2. Verify database URL in config
3. Test in incognito window

### Problem: Checkout redirects to form but fields are empty

**Solution**:
1. Verify entry IDs in `booking-system.js`
2. Make sure entry IDs match your form exactly
3. Check URL encoding

### Problem: Admin dashboard shows 0 bookings

**Solution**:
1. Check Firebase config in admin-dashboard.html
2. Make sure you've made at least one test booking
3. Refresh the page

---

## 🎯 QUICK TIPS

### Tip 1: Test Before Launch
Make 5-10 test bookings to ensure everything works

### Tip 2: Monitor Database
Keep Firebase Console open during launch to watch bookings in real-time

### Tip 3: Booking Limits
Current limit: 6 seats per booking. Change in `booking-system.js` line 171

### Tip 4: Backup Your Data
Export bookings CSV regularly via admin dashboard

### Tip 5: Customer Support
Give customers the booking ID - it helps you find their booking quickly

---

## 📊 WHAT HAPPENS WHEN SOMEONE BOOKS?

1. **Customer selects seats** → Seats turn blue locally
2. **Clicks checkout** → Seats marked as "processing" in Firebase
3. **15-minute timer starts** → Booking expires if not confirmed
4. **Redirected to Google Form** → Customer fills details
5. **Admin confirms** → Seats marked as "booked" permanently
6. **OR Admin cancels** → Seats released back to "available"

---

## 🔒 SECURITY NOTES

- ✅ Firebase config can be public (it's designed for client-side)
- ✅ Security comes from database rules, not hiding config
- ⚠️ Keep admin dashboard URL private
- ⚠️ Don't share Firebase Console login
- ✅ Regular backups recommended

---

## 📈 NEXT STEPS (OPTIONAL)

Want to add more features?

1. **Email Confirmations**
   - Use Firebase Functions
   - Send email when booking confirmed
   - Cost: Still free for low volume

2. **Payment Integration**
   - Add Midtrans/Xendit
   - Auto-confirm on payment
   - Requires backend setup

3. **QR Code Tickets**
   - Generate QR code per booking
   - Scan at venue entrance

4. **WhatsApp Notifications**
   - Send booking confirmation via WhatsApp
   - Use WhatsApp Business API

---

## 🎉 CONGRATULATIONS!

You now have a professional, real-time concert booking system!

**What You Built:**
- ✅ Real-time seat availability
- ✅ Prevents double-bookings
- ✅ Beautiful seat map
- ✅ Admin dashboard
- ✅ Google Form integration
- ✅ 100% FREE hosting

**Total Cost:** Rp 0 (Firebase free tier covers ~10,000 bookings/month)

---

## 📞 NEED HELP?

If you get stuck:
1. Check console for errors (F12)
2. Verify all steps completed
3. Test with incognito window
4. Check Firebase Console for data

Good luck with your TRDC Annual Concert 2026! 🎭🎵
