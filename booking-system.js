// TRDC Concert Booking System with Firebase
// Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyDz5Qe96R4qEHTWu_MCq5nwMSwDuQi_kbg",
  authDomain: "trdc-annual-concert.firebaseapp.com",
  databaseURL: "https://trdc-annual-concert-default-rtdb.firebaseio.com",
  projectId: "trdc-annual-concert",
  storageBucket: "trdc-annual-concert.firebasestorage.app",
  messagingSenderId: "291931379499",
  appId: "1:291931379499:web:31e1d0e39f603b568a976e",
  measurementId: "G-XYJE4D8DC2"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    showAlert('Error connecting to booking system. Please refresh the page.', 'danger');
}

// Venue Configuration
const VENUE_CONFIG = {
    vip: {
        name: 'GOLD',
        price: 100000,
        rows: 3,
        seatsPerRow: 8,
        color: '#FFD700'
    },
    regular: {
        name: 'Regular',
        price: 75000,
        rows: 5,
        seatsPerRow: 10,
        color: '#87CEEB'
    }
};

// Global State
let selectedSeats = [];
let allSeats = {};

// Initialize the booking system
document.addEventListener('DOMContentLoaded', function() {
    initializeSeating();
    setupEventListeners();
});

// Create initial seat structure in Firebase if it doesn't exist
async function initializeSeating() {
    try {
        const seatsRef = database.ref('seats');
        const snapshot = await seatsRef.once('value');
        
        if (!snapshot.exists()) {
            console.log('Initializing seat structure in Firebase...');
            const initialSeats = {};
            
            // Create GOLD seats
            for (let row = 1; row <= VENUE_CONFIG.vip.rows; row++) {
                for (let seat = 1; seat <= VENUE_CONFIG.vip.seatsPerRow; seat++) {
                    const seatId = `GOLD-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: 'GOLD',
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.vip.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            }
            
            // Create Regular seats
            for (let row = 1; row <= VENUE_CONFIG.regular.rows; row++) {
                for (let seat = 1; seat <= VENUE_CONFIG.regular.seatsPerRow; seat++) {
                    const seatId = `REG-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: 'Regular',
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.regular.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            }
            
            await seatsRef.set(initialSeats);
            console.log('Seat structure initialized');
        }
        
        // Listen for real-time updates
        listenToSeatUpdates();
        
    } catch (error) {
        console.error('Error initializing seating:', error);
        showAlert('Error loading seats. Please refresh the page.', 'danger');
    }
}

// Listen to real-time seat updates
function listenToSeatUpdates() {
    const seatsRef = database.ref('seats');
    
    seatsRef.on('value', (snapshot) => {
        allSeats = snapshot.val() || {};
        renderSeating();
        
        // Hide loading, show seating area
        document.getElementById('loading').style.display = 'none';
        document.getElementById('seating-area').style.display = 'block';
    });
}

// Render the seating chart
function renderSeating() {
    renderSection('vip', 'vip-section', VENUE_CONFIG.vip);
    renderSection('regular', 'regular-section', VENUE_CONFIG.regular);
}

// Render a specific section
function renderSection(sectionType, containerId, config) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const prefix = sectionType === 'vip' ? 'GOLD' : 'REG';
    
    for (let row = 1; row <= config.rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);
        
        // Seats
        for (let seat = 1; seat <= config.seatsPerRow; seat++) {
            const seatId = `${prefix}-${row}-${seat}`;
            const seatData = allSeats[seatId];
            
            if (seatData) {
                const seatDiv = createSeatElement(seatId, seatData);
                rowDiv.appendChild(seatDiv);
            }
        }
        
        container.appendChild(rowDiv);
    }
}

// Create a seat element
function createSeatElement(seatId, seatData) {
    const seatDiv = document.createElement('div');
    seatDiv.className = 'seat';
    seatDiv.dataset.seatId = seatId;
    seatDiv.textContent = seatData.number;
    
    // Determine seat status
    if (selectedSeats.includes(seatId)) {
        seatDiv.classList.add('selected');
    } else if (seatData.status === 'booked') {
        seatDiv.classList.add('booked');
    } else if (seatData.status === 'available') {
        seatDiv.classList.add('available');
        seatDiv.onclick = () => toggleSeat(seatId, seatData);
    } else if (seatData.status === 'processing') {
        seatDiv.classList.add('processing');
    }
    
    // Tooltip
    seatDiv.title = `${seatData.section} - Row ${seatData.row}, Seat ${seatData.number}\nRp ${formatCurrency(seatData.price)}`;
    
    return seatDiv;
}

// Toggle seat selection
function toggleSeat(seatId, seatData) {
    if (seatData.status !== 'available') {
        return;
    }
    
    const index = selectedSeats.indexOf(seatId);
    
    if (index > -1) {
        // Deselect
        selectedSeats.splice(index, 1);
    } else {
        // Select
        if (selectedSeats.length >= 6) {
            showAlert('Maksimal 6 kursi per pemesanan', 'warning');
            return;
        }
        selectedSeats.push(seatId);
    }
    
    updateBookingSummary();
    renderSeating(); // Re-render to show selection
}

// Update booking summary
function updateBookingSummary() {
    const seatCount = selectedSeats.length;
    let totalPrice = 0;
    
    // Calculate total and create seat list
    const seatsList = document.getElementById('selected-seats-display');
    seatsList.innerHTML = '';
    
    if (seatCount === 0) {
        seatsList.innerHTML = '<p style="color: #999;">Belum ada kursi yang dipilih</p>';
    } else {
        selectedSeats.forEach(seatId => {
            const seatData = allSeats[seatId];
            totalPrice += seatData.price;
            
            const tag = document.createElement('span');
            tag.className = 'selected-seat-tag';
            tag.textContent = `${seatData.section} R${seatData.row}S${seatData.number}`;
            seatsList.appendChild(tag);
        });
    }
    
    // Update display
    document.getElementById('seat-count').textContent = seatCount;
    document.getElementById('total-price').textContent = `Rp ${formatCurrency(totalPrice)}`;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = seatCount === 0;
}

// Setup event listeners
function setupEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Handle checkout
async function handleCheckout() {
    if (selectedSeats.length === 0) {
        showAlert('Silakan pilih kursi terlebih dahulu', 'warning');
        return;
    }
    
    // Confirm booking
    const seatList = selectedSeats.map(seatId => {
        const seat = allSeats[seatId];
        return `${seat.section} Row ${seat.row} Seat ${seat.number}`;
    }).join(', ');
    
    const totalPrice = selectedSeats.reduce((sum, seatId) => {
        return sum + allSeats[seatId].price;
    }, 0);
    
    const confirmed = confirm(
        `Konfirmasi Pemesanan:\n\n` +
        `Kursi: ${seatList}\n` +
        `Total: Rp ${formatCurrency(totalPrice)}\n\n` +
        `Lanjutkan ke pembayaran?`
    );
    
    if (!confirmed) return;
    
    // Show processing state
    showAlert('Memproses pemesanan...', 'info');
    document.getElementById('checkout-btn').disabled = true;
    
    try {
        // Mark seats as processing first
        const updates = {};
        const bookingId = `BOOKING-${Date.now()}`;
        const timestamp = new Date().toISOString();
        
        selectedSeats.forEach(seatId => {
            updates[`seats/${seatId}/status`] = 'processing';
        });
        
        await database.ref().update(updates);
        
        // Create booking record
        const bookingData = {
            bookingId: bookingId,
            seats: selectedSeats,
            totalPrice: totalPrice,
            status: 'pending',
            createdAt: timestamp,
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 1000).toISOString() // 15 minutes
        };
        
        await database.ref(`bookings/${bookingId}`).set(bookingData);
        
        // Redirect to Google Form with booking details
        const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfLfhaCw-BQbC9qtd9aRxBf69Mc3t_AtCrU0ZhOz21nBCkzxQ/viewform';
        const seatInfo = encodeURIComponent(seatList);
        const price = encodeURIComponent(`Rp ${formatCurrency(totalPrice)}`);
        
        // You'll need to update these entry IDs from your Google Form
        const redirectUrl = `${formUrl}?entry.SEAT_FIELD=${seatInfo}&entry.PRICE_FIELD=${price}&entry.BOOKING_ID=${bookingId}`;
        
        // Store booking ID in localStorage for confirmation
        localStorage.setItem('currentBooking', bookingId);
        
        // Redirect to form
        window.location.href = redirectUrl;
        
    } catch (error) {
        console.error('Booking error:', error);
        showAlert('Terjadi kesalahan. Silakan coba lagi.', 'danger');
        
        // Revert seats to available
        const revertUpdates = {};
        selectedSeats.forEach(seatId => {
            revertUpdates[`seats/${seatId}/status`] = 'available';
        });
        await database.ref().update(revertUpdates);
        
        document.getElementById('checkout-btn').disabled = false;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(alert);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// UPDATED: booking-system.js - FIXED VERSION
// This fixes the issue where confirmed bookings were being released

// Handle booking expiration (optional - run periodically)
async function cleanupExpiredBookings() {
    try {
        const now = new Date().toISOString();
        const bookingsRef = database.ref('bookings');
        const snapshot = await bookingsRef.once('value');
        const bookings = snapshot.val() || {};
        
        const updates = {};
        
        Object.keys(bookings).forEach(bookingId => {
            const booking = bookings[bookingId];
            
            // IMPORTANT FIX: Only expire bookings that are PENDING and past expiration
            // Do NOT touch confirmed or cancelled bookings!
            if (booking.status === 'pending' && booking.expiresAt && booking.expiresAt < now) {
                // Release the seats
                booking.seats.forEach(seatId => {
                    updates[`seats/${seatId}/status`] = 'available';
                    updates[`seats/${seatId}/bookedBy`] = null;
                    updates[`seats/${seatId}/bookedAt`] = null;
                });
                
                // Mark booking as expired
                updates[`bookings/${bookingId}/status`] = 'expired';
                
                console.log(`Expiring booking ${bookingId}`);
            }
        });
        
        if (Object.keys(updates).length > 0) {
            await database.ref().update(updates);
            console.log(`Cleaned up ${Object.keys(updates).length / 4} expired bookings`);
        }
    } catch (error) {
        console.error('Error cleaning up bookings:', error);
    }
}

// INSTRUCTIONS:
// Replace the cleanupExpiredBookings() function in your booking-system.js 
// with this version. The key changes are:
// 1. Added check for booking.expiresAt existence
// 2. Added detailed logging
// 3. Confirmed bookings will NEVER be released


// Run cleanup every 5 minutes
setInterval(cleanupExpiredBookings, 5 * 60 * 1000);
