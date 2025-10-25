import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fieldsync.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// MOCK API FUNCTIONS (Replace with real API calls)
// ============================================

// Auth APIs
export const authAPI = {
  // Send OTP to phone number
  sendOTP: async (phone, role) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'OTP sent successfully' });
      }, 1000);
    });
  },

  // Verify OTP
  verifyOTP: async (phone, otp, role) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: role === 'farmer' ? 'Rajesh Kumar' : 'CHC Punjab',
          phone,
          email: `${phone}@example.com`,
          role,
        };
        resolve({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser,
          role,
        });
      }, 1000);
    });
  },

  // Admin login
  adminLogin: async (email, password) => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'admin123') {
          resolve({
            success: true,
            token: 'mock-admin-token-' + Date.now(),
            user: {
              id: 'admin-001',
              name: 'Admin User',
              email,
              role: 'admin',
            },
            role: 'admin',
          });
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  },

  // Farmer signup
  farmerSignup: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'OTP sent to your phone',
        });
      }, 1000);
    });
  },

  // Owner signup
  ownerSignup: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Registration submitted for approval',
        });
      }, 1000);
    });
  },
};

// Farmer Portal APIs
export const farmerAPI = {
  // Get available machines with filters
  getMachines: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const machineImages = {
          'Happy Seeder': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500',
          'Rotavator': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
          'Mulcher': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500',
          'Baler': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500',
        };
        
        const mockMachines = Array.from({ length: 20 }, (_, i) => {
          const type = ['Happy Seeder', 'Rotavator', 'Mulcher', 'Baler'][i % 4];
          return {
            id: `machine-${i + 1}`,
            name: `${type} Pro ${i + 1}`,
            type,
            price: 500 + i * 50,
            rating: 4 + Math.random(),
            image: machineImages[type],
            location: {
              lat: 30.7 + Math.random() * 0.5,
              lng: 76.7 + Math.random() * 0.5,
              address: `Village Khanna ${i + 1}, Ludhiana, Punjab`,
            },
            owner: `CHC Punjab ${i + 1}`,
            available: Math.random() > 0.3,
          };
        });
        resolve({ success: true, machines: mockMachines });
      }, 500);
    });
  },

  // Get machine details
  getMachineDetails: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate booked slots for demo (some slots are already booked)
        const bookedSlots = {
          '2025-10-25': ['09:00 AM', '02:00 PM', '04:00 PM'],
          '2025-10-26': ['10:00 AM', '11:00 AM', '01:00 PM'],
          '2025-10-27': ['08:00 AM', '03:00 PM'],
        };
        
        resolve({
          success: true,
          machine: {
            id,
            name: 'Happy Seeder Pro Max',
            type: 'Happy Seeder',
            price: 600,
            priceUnit: 'per hour',
            rating: 4.8,
            reviews: 124,
            images: [
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
              'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
              'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
            ],
            description: 'High-quality happy seeder for efficient stubble management. Perfect for rice and wheat fields. Equipped with latest technology for smooth operation.',
            specs: {
              Model: '2024 Latest',
              'Engine HP': '60 HP',
              'Working Width': '2.5 meters',
              'Fuel Type': 'Diesel',
              'Capacity': '5 acres/hour',
            },
            location: {
              lat: 30.7,
              lng: 76.7,
              address: 'Village Khanna, District Ludhiana, Punjab - 141401',
            },
            owner: {
              name: 'CHC Punjab Services',
              rating: 4.9,
              machines: 15,
              phone: '+91 98765 43210',
            },
            bookedSlots,
          },
        });
      }, 500);
    });
  },

  // Create booking
  createBooking: async (bookingData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          bookingId: 'booking-' + Date.now(),
          message: 'Booking created successfully',
        });
      }, 1000);
    });
  },

  // Get my bookings
  getMyBookings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBookings = [
          {
            id: 'booking-1',
            machine: 'Happy Seeder Pro',
            date: '2025-10-28',
            time: '10:00 AM',
            duration: 4,
            status: 'confirmed',
            totalPrice: 2400,
            owner: 'CHC Punjab',
          },
          {
            id: 'booking-2',
            machine: 'Rotavator XL',
            date: '2025-10-25',
            time: '08:00 AM',
            duration: 3,
            status: 'completed',
            totalPrice: 1800,
            owner: 'CHC Haryana',
          },
        ];
        resolve({ success: true, bookings: mockBookings });
      }, 500);
    });
  },

  // Track machine live location
  trackMachine: async (bookingId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          location: {
            lat: 30.7334 + Math.random() * 0.01,
            lng: 76.7794 + Math.random() * 0.01,
          },
          status: 'en_route',
          eta: '15 mins',
        });
      }, 500);
    });
  },
};

// Owner Portal APIs
export const ownerAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          stats: {
            totalRevenue: 145000,
            pendingBookings: 8,
            machinesActive: 12,
            completedJobs: 234,
            monthlyRevenue: [12000, 15000, 18000, 22000, 25000, 28000],
          },
        });
      }, 500);
    });
  },

  // Get recent booking requests
  getBookingRequests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRequests = [
          {
            id: 'req-1',
            farmer: 'Rajesh Kumar',
            machine: 'Happy Seeder Pro',
            date: '2025-10-30',
            time: '09:00 AM',
            duration: 5,
            location: 'Village Khanna',
            status: 'pending',
          },
          {
            id: 'req-2',
            farmer: 'Suresh Singh',
            machine: 'Rotavator XL',
            date: '2025-10-29',
            time: '11:00 AM',
            duration: 3,
            location: 'Village Moga',
            status: 'pending',
          },
        ];
        resolve({ success: true, requests: mockRequests });
      }, 500);
    });
  },

  // Accept/Reject booking
  updateBookingStatus: async (bookingId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Booking ${status} successfully`,
        });
      }, 1000);
    });
  },

  // Get my machines
  getMyMachines: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockMachines = [
          {
            id: 'mach-1',
            name: 'Happy Seeder Pro',
            type: 'Happy Seeder',
            status: 'active',
            bookings: 45,
            revenue: 67500,
            registrationDate: '2024-01-15',
          },
          {
            id: 'mach-2',
            name: 'Rotavator XL',
            type: 'Rotavator',
            status: 'maintenance',
            bookings: 32,
            revenue: 48000,
            registrationDate: '2024-03-20',
          },
        ];
        resolve({ success: true, machines: mockMachines });
      }, 500);
    });
  },

  // Register new machine
  registerMachine: async (machineData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Machine submitted for approval',
          machineId: 'mach-' + Date.now(),
        });
      }, 1500);
    });
  },

  // Get all bookings
  getAllBookings: async (status = 'all') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBookings = [
          {
            id: 'book-1',
            farmer: 'Rajesh Kumar',
            machine: 'Happy Seeder Pro',
            date: '2025-10-28',
            time: '10:00 AM',
            duration: 4,
            amount: 2400,
            status: 'confirmed',
          },
          {
            id: 'book-2',
            farmer: 'Suresh Singh',
            machine: 'Rotavator XL',
            date: '2025-10-25',
            time: '08:00 AM',
            duration: 3,
            amount: 1800,
            status: 'completed',
          },
        ];
        resolve({ success: true, bookings: mockBookings });
      }, 500);
    });
  },

  // Get payment history
  getPaymentHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPayments = [
          {
            id: 'pay-1',
            bookingId: 'book-1',
            date: '2025-10-20',
            farmer: 'Rajesh Kumar',
            amount: 2400,
            status: 'paid_out',
          },
          {
            id: 'pay-2',
            bookingId: 'book-2',
            date: '2025-10-18',
            farmer: 'Suresh Singh',
            amount: 1800,
            status: 'processing',
          },
        ];
        resolve({
          success: true,
          payments: mockPayments,
          summary: {
            totalEarned: 145000,
            lastPayout: 45000,
            pendingPayout: 12500,
          },
        });
      }, 500);
    });
  },
};

export default api;
