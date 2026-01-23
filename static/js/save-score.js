// Helper function to save game scores
function saveGameScore(gameSlug, score, playerName = '') {
    // Check if user is authenticated (we'll check via a meta tag or cookie)
    const isAuthenticated = document.querySelector('meta[name="user-authenticated"]');
    
    if (!isAuthenticated || isAuthenticated.content !== 'True') {
        return; // User not logged in, don't save
    }
    
    // Get CSRF token from cookie or meta tag
    let csrftoken = getCookie('csrftoken');
    if (!csrftoken) {
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta) {
            csrftoken = csrfMeta.content;
        }
    }
    
    if (!csrftoken) {
        console.warn('CSRF token not found, score not saved');
        return;
    }
    
    fetch('/save-score/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            game_slug: gameSlug,
            score: score,
            player_name: playerName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Score saved successfully!');
        } else {
            console.warn('Failed to save score:', data.message);
        }
    })
    .catch(error => {
        console.error('Error saving score:', error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
