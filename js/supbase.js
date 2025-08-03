// Initialize Supabase
const supabaseUrl = 'https://ajtfvkncdfcjqoytczrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGZ2a25jZGZjanFveXRjenJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjc3OTEsImV4cCI6MjA2OTcwMzc5MX0.ClixFy1A97QNT6xNU4sqX-ROT_sQ21Zpple9TyCTK2k';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Cart functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);