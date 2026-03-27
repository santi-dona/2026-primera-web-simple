document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initReviews();
});

function initAnimations() {
    const elements = document.querySelectorAll('.header, .work-section, .info-grid, .friends-section, .contact-section, .reviews-section');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

let reviews = JSON.parse(localStorage.getItem('santinoReviews')) || [
    { name: 'Juan', stars: 5, text: 'El mejor amigo, siempre está para vos!' },
    { name: 'Matías', stars: 5, text: 'Una banda, el pibe es una masa.' },
    { name: 'Franco', stars: 4, text: 'Buena gente, jugadorazo al basket.' }
];

let selectedStars = 0;

function initReviews() {
    const starInput = document.getElementById('starInput');
    const stars = starInput.querySelectorAll('span');
    const submitBtn = document.getElementById('submitReview');

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.dataset.value);
            highlightStars(value);
        });

        star.addEventListener('click', () => {
            selectedStars = parseInt(star.dataset.value);
            highlightStars(selectedStars);
        });
    });

    starInput.addEventListener('mouseleave', () => {
        highlightStars(selectedStars);
    });

    submitBtn.addEventListener('click', submitReview);

    renderReviews();
    updateAverage();
}

function highlightStars(count) {
    const stars = document.querySelectorAll('#starInput span');
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const nameInput = document.getElementById('reviewerName');
    const textInput = document.getElementById('reviewText');
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (selectedStars === 0) {
        shakeElement(document.getElementById('starInput'));
        return;
    }

    if (!name) {
        shakeElement(nameInput);
        nameInput.focus();
        return;
    }

    const newReview = {
        name: name,
        stars: selectedStars,
        text: text || 'Sin comentario'
    };

    reviews.unshift(newReview);
    localStorage.setItem('santinoReviews', JSON.stringify(reviews));

    nameInput.value = '';
    textInput.value = '';
    selectedStars = 0;
    highlightStars(0);

    renderReviews();
    updateAverage();
    
    showNotification('¡Reseña enviada correctamente!');
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-name">${escapeHtml(review.name)}</span>
                <span class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span>
            </div>
            <p class="review-text">${escapeHtml(review.text)}</p>
        </div>
    `).join('');
}

function updateAverage() {
    const total = reviews.reduce((sum, r) => sum + r.stars, 0);
    const average = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;

    document.getElementById('averageRating').textContent = average;
    document.getElementById('reviewCount').textContent = `${reviews.length} reseñas`;

    const averageStars = document.getElementById('averageStars');
    const fullStars = Math.round(average);
    averageStars.innerHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
