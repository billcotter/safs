document.addEventListener('DOMContentLoaded', () => {
  const genreButtons = document.querySelectorAll('[data-genre]');
  const movieCards = document.querySelectorAll('.movie-card');

  genreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const genre = button.getAttribute('data-genre');
      
      movieCards.forEach(card => {
        const genres = JSON.parse(card.getAttribute('data-genres') || '[]');
        card.classList.toggle('hidden', !genres.includes(genre));
      });
    });
  });
}); 