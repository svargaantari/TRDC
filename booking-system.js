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

// Venue Configuration - Updated with actual layout
const VENUE_CONFIG = {
    goldLeft: {
        name: 'Gold - L',
        price: 100000,
        rows: 8,
        seatsPerRow: 13,
        color: '#FFD700',
        prefix: 'GOLD-L'
    },
    goldRight: {
        name: 'Gold - R',
        price: 100000,
        rows: 8,
        seatsPerRow: 14,
        color: '#FFD700',
        prefix: 'GOLD-R'
    },
    regularLeft: {
        name: 'Regular - L',
        price: 75000,
        color: '#E88B8B',
        prefix: 'REG-L',
        seatsConfig: [3, 6, 9, 10, 10, 10, 10, 10, 11] // seats per row
    },
    regularRight: {
        name: 'Regular - R',
        price: 75000,
        color: '#E88B8B',
        prefix: 'REG-R',
        seatsConfig: [5, 8, 10, 13, 15, 16, 17, 18, 18, 13] // seats per row
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
            
            // Create Gold - L seats
            for (let row = 1; row <= VENUE_CONFIG.goldLeft.rows; row++) {
                for (let seat = 1; seat <= VENUE_CONFIG.goldLeft.seatsPerRow; seat++) {
                    const seatId = `${VENUE_CONFIG.goldLeft.prefix}-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: VENUE_CONFIG.goldLeft.name,
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.goldLeft.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            }
            
            // Create Gold - R seats
            for (let row = 1; row <= VENUE_CONFIG.goldRight.rows; row++) {
                for (let seat = 1; seat <= VENUE_CONFIG.goldRight.seatsPerRow; seat++) {
                    const seatId = `${VENUE_CONFIG.goldRight.prefix}-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: VENUE_CONFIG.goldRight.name,
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.goldRight.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            }
            
            // Create Regular - L seats (variable seats per row)
            VENUE_CONFIG.regularLeft.seatsConfig.forEach((seatsInRow, index) => {
                const row = index + 1;
                for (let seat = 1; seat <= seatsInRow; seat++) {
                    const seatId = `${VENUE_CONFIG.regularLeft.prefix}-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: VENUE_CONFIG.regularLeft.name,
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.regularLeft.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            });
            
            // Create Regular - R seats (variable seats per row)
            VENUE_CONFIG.regularRight.seatsConfig.forEach((seatsInRow, index) => {
                const row = index + 1;
                for (let seat = 1; seat <= seatsInRow; seat++) {
                    const seatId = `${VENUE_CONFIG.regularRight.prefix}-${row}-${seat}`;
                    initialSeats[seatId] = {
                        section: VENUE_CONFIG.regularRight.name,
                        row: row,
                        number: seat,
                        price: VENUE_CONFIG.regularRight.price,
                        status: 'available',
                        bookedBy: null,
                        bookedAt: null
                    };
                }
            });
            
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
    renderSection('goldLeft', 'gold-left-section', VENUE_CONFIG.goldLeft);
    renderSection('goldRight', 'gold-right-section', VENUE_CONFIG.goldRight);
    renderSection('regularLeft', 'regular-left-section', VENUE_CONFIG.regularLeft);
    renderSection('regularRight', 'regular-right-section', VENUE_CONFIG.regularRight);
}

// Render a specific section
function renderSection(sectionType, containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found`);
        return;
    }
    
    container.innerHTML = '';
    
    // Handle regular sections with variable seats
    if (config.seatsConfig) {
        config.seatsConfig.forEach((seatsInRow, index) => {
            const row = index + 1;
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            
            // Row label
            const rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = row;
            rowDiv.appendChild(rowLabel);
            
            // Seats
            for (let seat = 1; seat <= seatsInRow; seat++) {
                const seatId = `${config.prefix}-${row}-${seat}`;
                const seatData = allSeats[seatId];
                
                if (seatData) {
                    const seatDiv = createSeatElement(seatId, seatData);
                    rowDiv.appendChild(seatDiv);
                }
            }
            
            container.appendChild(rowDiv);
        });
    } else {
        // Handle gold sections with fixed seats per row
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
                const seatId = `${config.prefix}-${row}-${seat}`;
                const seatData = allSeats[seatId];
                
                if (seatData) {
                    const seatDiv = createSeatElement(seatId, seatData);
                    rowDiv.appendChild(seatDiv);
                }
            }
            
            container.appendChild(rowDiv);
        }
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
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days
        };
        
        await database.ref(`bookings/${bookingId}`).set(bookingData);
        
        // Redirect to payment confirmation page
        const seatInfo = encodeURIComponent(seatList);
        const redirectUrl = `payment-confirmation.html?bookingId=${bookingId}&seats=${seatInfo}&total=${totalPrice}`;
        
        // Store booking ID in localStorage for confirmation
        localStorage.setItem('currentBooking', bookingId);
        
        // Redirect to payment confirmation page
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

// Handle booking expiration - FIXED VERSION
async function cleanupExpiredBookings() {
    try {
        const now = new Date().toISOString();
        const bookingsRef = database.ref('bookings');
        const snapshot = await bookingsRef.once('value');
        const bookings = snapshot.val() || {};
        
        const updates = {};
        
        Object.keys(bookings).forEach(bookingId => {
            const booking = bookings[bookingId];
            
            // IMPORTANT: Only expire bookings that are PENDING and past expiration
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

// Run cleanup every 5 minutes
setInterval(cleanupExpiredBookings, 5 * 60 * 1000);
