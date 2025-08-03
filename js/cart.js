document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
});

function renderCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        subtotalElement.textContent = '0.00';
        taxElement.textContent = '0.00';
        totalElement.textContent = '0.00';
        document.getElementById('checkout-btn').classList.add('disabled');
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <span class="remove-item" onclick="removeFromCart(${item.id})">×</span>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(id);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCartItems();
    }
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    renderCartItems();
}