document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    
    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', debounce(loadProducts, 300));
});

async function loadProducts() {
    const searchTerm = document.getElementById('search')?.value || '';
    let query = supabase
        .from('products')
        .select('*');
    
    if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data: products, error } = await query;
    
    if (error) {
        console.error('Error loading products:', error);
        return;
    }
    
    const productsContainer = document.getElementById('products-grid') || 
                             document.getElementById('featured-products');
    
    if (productsContainer) {
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_url}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image_url}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function addToCart(id, name, price, imageUrl) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id, 
            name, 
            price, 
            imageUrl, 
            quantity: 1 
        });
    }
    
    saveCart(cart);
    alert(`${name} added to cart!`);
}

// Utility function
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}