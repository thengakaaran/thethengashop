document.addEventListener('DOMContentLoaded', async () => {
    await renderCheckoutItems();
    
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
});

async function renderCheckoutItems() {
    const cart = getCart();
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    const shippingElement = document.getElementById('shipping');
    
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.1;
    const total = subtotal + tax + shipping;
    
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

async function placeOrder() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert('Please login to place an order');
        return handleLogin();
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = 5.00;
    const total = subtotal + tax + shipping;
    
    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
            user_id: user.id,
            total,
            status: 'processing'
        }])
        .select()
        .single();
    
    if (orderError) {
        console.error('Order error:', orderError);
        alert('Failed to create order. Please try again.');
        return;
    }
    
    // Add order items
    const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
    }));
    
    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
    
    if (itemsError) {
        console.error('Order items error:', itemsError);
        alert('Failed to create order items. Please contact support.');
        return;
    }
    
    // Clear cart
    saveCart([]);
    
    // Redirect to thank you page or show success message
    alert(`Order #${order.id} placed successfully! Thank you for your purchase.`);
    window.location.href = 'index.html';
}