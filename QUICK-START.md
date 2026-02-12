# ⚡ QUICK START GUIDE - TRDC Firebase Booking

## 🎯 3 Simple Steps to Get Started

### STEP 1: CREATE FIREBASE PROJECT (10 min)
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "trdc-concert"
3. Enable Realtime Database (test mode)
4. Copy your Firebase config

### STEP 2: UPDATE YOUR CODE (2 min)
Replace `firebaseConfig` in these files with YOUR config:
- `booking-system.js` (line 4)
- `admin-dashboard.html` (line 255)

### STEP 3: UPLOAD & TEST (5 min)
```bash
git add index-firebase.html booking-system.js admin-dashboard.html
git commit -m "Add Firebase booking"
git push
```

**Done!** Visit your site and test booking.

---

## 📁 YOUR FILES

| File | What It Does | Action |
|------|--------------|--------|
| **index-firebase.html** | Main booking page | Rename to `index.html` |
| **booking-system.js** | Booking logic | Upload as-is |
| **admin-dashboard.html** | Admin panel | Keep link private |

---

## 🔧 FIREBASE CONFIG

You need to replace this in 2 files:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Get it from: **Firebase Console → Project Settings → Your apps → Web**

---

## ✅ TESTING CHECKLIST

After uploading:
- [ ] Site loads without errors
- [ ] Seats appear (green = available)
- [ ] Can select seats (turn blue)
- [ ] Summary updates correctly
- [ ] Open 2 browsers - real-time sync works
- [ ] Admin dashboard shows statistics
- [ ] Can confirm bookings

---

## 🎨 CUSTOMIZE VENUE

Want different seat layout?

Edit `booking-system.js` lines 19-31:

```javascript
const VENUE_CONFIG = {
    vip: {
        rows: 3,        // ← Change number of rows
        seatsPerRow: 8, // ← Change seats per row
        price: 500000   // ← Change price
    },
    regular: {
        rows: 5,
        seatsPerRow: 10,
        price: 250000
    }
};
```

---

## 📊 ADMIN DASHBOARD

Access: `https://YOUR-SITE/admin-dashboard.html`

**What You Can Do:**
- View all bookings in real-time
- Confirm pending bookings
- Cancel bookings
- Export bookings to CSV
- View seat availability

**Keep this URL private!**

---

## 🔗 GOOGLE FORM INTEGRATION

1. Get your form entry IDs (inspect form fields)
2. Update `booking-system.js` line 280:

```javascript
const redirectUrl = `${formUrl}?entry.SEAT=${seatInfo}&entry.PRICE=${price}&entry.BOOKING_ID=${bookingId}`;
```

Replace `entry.SEAT`, `entry.PRICE`, `entry.BOOKING_ID` with your actual IDs.

---

## 🔒 SECURITY RULES

After testing, update Firebase rules:

1. Firebase Console → Realtime Database → Rules
2. Copy from `FIREBASE-SETUP-GUIDE.md` Step 7
3. Publish

---

## 🚨 COMMON ISSUES

**Seats not loading?**
→ Check Firebase config is correct
→ Open console (F12) to see errors

**Real-time not working?**
→ Check Firebase rules are published
→ Test in incognito window

**Checkout fails?**
→ Verify Google Form entry IDs
→ Check redirect URL in console

---

## 📞 SUPPORT FILES

- **FIREBASE-SETUP-GUIDE.md** - Detailed step-by-step (READ THIS FIRST!)
- **concert-booking-solutions.md** - Comparison of all options
- **WORKFLOW-DIAGRAM.md** - System architecture

---

## 💡 PRO TIPS

1. **Test thoroughly before launch** - Make 5-10 test bookings
2. **Monitor during launch** - Keep Firebase Console open
3. **Backup regularly** - Export CSV from admin dashboard
4. **Set booking limit** - Default is 6 seats/booking (line 171)
5. **15-min expiry** - Unconfirmed bookings auto-cancel

---

## 🎉 WHAT YOU GET

✅ Real-time seat updates across all users
✅ Automatic double-booking prevention
✅ Professional admin dashboard
✅ Mobile-responsive design
✅ Google Form integration
✅ CSV export for records
✅ 100% FREE (Firebase free tier)

**Total seats:** 64 (24 VIP + 40 Regular)
**Can handle:** 10,000+ bookings/month on free tier
**Cost:** Rp 0

---

## 🚀 LAUNCH CHECKLIST

Before going live:
- [ ] Firebase project created
- [ ] Config updated in both files
- [ ] Files uploaded to GitHub Pages
- [ ] Site tested (2 browsers)
- [ ] Admin dashboard works
- [ ] Google Form connected
- [ ] Security rules updated
- [ ] Test booking end-to-end
- [ ] CSV export tested
- [ ] Ready to sell tickets! 🎫

---

**Need detailed help?** Read **FIREBASE-SETUP-GUIDE.md**

**Good luck with TRDC Annual Concert 2026!** 🎭🎵
