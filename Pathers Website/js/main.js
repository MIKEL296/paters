// ===========================
// PATHERS CHURCH WEBSITE
// Main JavaScript Functionality
// ===========================

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('nav ul');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
}

// Close mobile menu when link is clicked
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu ? .classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.textContent = '☰';
        }
    });
});

// Modal Functionality
const modal = {
    open: function(modalId) {
        const overlay = document.getElementById(modalId);
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close: function(modalId) {
        const overlay = document.getElementById(modalId);
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
};

// Modal close button handlers
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const overlay = e.target.closest('.modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Form Submission Handlers
const formHandlers = {
    init: function() {
        this.setupContactForm();
        this.setupPrayerForm();
        this.setupNewsletterForm();
    },

    setupContactForm: function() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm(form, 'contact');
            });
        }
    },

    setupPrayerForm: function() {
        const form = document.getElementById('prayer-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm(form, 'prayer');
            });
        }
    },

    setupNewsletterForm: function() {
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm(form, 'newsletter');
            });
        }
    },

    submitForm: function(form, type) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate form submission (in production, send to server)
        console.log(`${type} form submitted:`, data);

        // Store in localStorage for demo purposes
        const key = `${type}_submissions`;
        const submissions = JSON.parse(localStorage.getItem(key) || '[]');
        submissions.push({...data, timestamp: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(submissions));

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = `Thank you! Your ${type} has been received.`;
        form.insertBefore(successMessage, form.firstChild);

        // Reset form
        form.reset();

        // Remove message after 5 seconds
        setTimeout(() => successMessage.remove(), 5000);
    }
};

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
    formHandlers.init();
});

// Event Filtering
const eventFilters = {
    init: function() {
        const filterButtons = document.querySelectorAll('.event-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterEvents(category);

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    },

    filterEvents: function(category) {
        const events = document.querySelectorAll('.event-card');
        events.forEach(event => {
            if (category === 'all' || event.dataset.category === category) {
                event.style.display = 'block';
                setTimeout(() => event.classList.add('fade-in-up'), 10);
            } else {
                event.style.display = 'none';
            }
        });
    }
};

// Sermon Search
const sermonSearch = {
    init: function() {
        const searchInput = document.getElementById('sermon-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.search(e.target.value);
            });
        }
    },

    search: function(query) {
        const sermons = document.querySelectorAll('.sermon-item');
        const lowerQuery = query.toLowerCase();

        sermons.forEach(sermon => {
            const title = sermon.querySelector('.sermon-title') ? .textContent.toLowerCase() || '';
            const series = sermon.querySelector('.sermon-series') ? .textContent.toLowerCase() || '';

            if (title.includes(lowerQuery) || series.includes(lowerQuery)) {
                sermon.style.display = 'block';
                sermon.classList.add('fade-in-up');
            } else {
                sermon.style.display = 'none';
            }
        });
    }
};

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy Load Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Fade in elements on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.fade-on-scroll').forEach(el => {
    fadeObserver.observe(el);
});

// Admin Dashboard Functions
const adminDashboard = {
    init: function() {
        this.loadSermons();
        this.loadEvents();
        this.loadPrayerRequests();
    },

    loadSermons: function() {
        const sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        const sermonList = document.getElementById('sermon-list');
        if (sermonList) {
            sermonList.innerHTML = sermons.map(sermon => `
        <div class="admin-item">
          <h4>${sermon.title}</h4>
          <p>Series: ${sermon.series}</p>
          <p>Date: ${sermon.date}</p>
          <button onclick="adminDashboard.deleteSermon('${sermon.id}')">Delete</button>
        </div>
      `).join('');
        }
    },

    addSermon: function(formData) {
        const sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        sermons.push({
            id: Date.now(),
            ...formData
        });
        localStorage.setItem('sermons', JSON.stringify(sermons));
        this.loadSermons();
    },

    deleteSermon: function(id) {
        const sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        const filtered = sermons.filter(s => s.id != id);
        localStorage.setItem('sermons', JSON.stringify(filtered));
        this.loadSermons();
    },

    loadEvents: function() {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const eventList = document.getElementById('event-list');
        if (eventList) {
            eventList.innerHTML = events.map(event => `
        <div class="admin-item">
          <h4>${event.title}</h4>
          <p>Date: ${event.date}</p>
          <p>Time: ${event.time}</p>
          <button onclick="adminDashboard.deleteEvent('${event.id}')">Delete</button>
        </div>
      `).join('');
        }
    },

    addEvent: function(formData) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        events.push({
            id: Date.now(),
            ...formData
        });
        localStorage.setItem('events', JSON.stringify(events));
        this.loadEvents();
    },

    deleteEvent: function(id) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const filtered = events.filter(e => e.id != id);
        localStorage.setItem('events', JSON.stringify(filtered));
        this.loadEvents();
    },

    loadPrayerRequests: function() {
        const prayers = JSON.parse(localStorage.getItem('prayer_submissions') || '[]');
        const prayerList = document.getElementById('prayer-list');
        if (prayerList) {
            prayerList.innerHTML = prayers.map(prayer => `
        <div class="admin-item">
          <h4>${prayer.name}</h4>
          <p>Request: ${prayer.request}</p>
          <p>Privacy: ${prayer.privacy || 'Private'}</p>
          <p>Submitted: ${new Date(prayer.timestamp).toLocaleDateString()}</p>
        </div>
      `).join('');
        }
    }
};

// Initialize admin dashboard if on admin page
if (document.body.classList.contains('admin-page')) {
    adminDashboard.init();
}

// Event filtering initialization
if (document.querySelector('.event-filter-btn')) {
    eventFilters.init();
}

// Sermon search initialization
sermonSearch.init();

// Analytics tracking (basic)
const analytics = {
    trackEvent: function(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            ...data
        };
        console.log('Event tracked:', event);
    },

    trackPageView: function() {
        this.trackEvent('page_view', {
            page: window.location.pathname
        });
    }
};

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
    analytics.trackPageView();
});

// Utility: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility: Format time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}