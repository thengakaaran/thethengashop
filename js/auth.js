document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');
    
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            authButton.textContent = 'Logout';
            authButton.onclick = handleLogout;
        } else {
            authButton.textContent = 'Login';
            authButton.onclick = handleLogin;
        }
    });
    
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            authButton.textContent = 'Logout';
            authButton.onclick = handleLogout;
        } else if (event === 'SIGNED_OUT') {
            authButton.textContent = 'Login';
            authButton.onclick = handleLogin;
        }
    });
});

async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    });
    
    if (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Logout error:', error);
    }
}