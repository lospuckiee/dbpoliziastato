document.addEventListener('DOMContentLoaded', () => {
    // Esempio: Click sulle schede dei moduli
    const cards = document.querySelectorAll('.module-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').innerText;
            alert(`Hai aperto il modulo: ${title}`);
        });
    });
});
