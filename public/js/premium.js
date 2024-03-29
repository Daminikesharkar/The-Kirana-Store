

document.getElementById('premiumButton').addEventListener('click', function() {
    document.querySelector('.overview').style.display = 'none';
    document.querySelector('.premium-features').style.display = 'block';
    document.querySelector('.premium-user').style.display = 'block';
});

document.getElementById('show-leaderboard').addEventListener('click', function() {
    document.querySelector('.premium-features-leaderboard').style.display = 'block';
    document.querySelector('.premium-features-download').style.display = 'none';
});

document.getElementById('show-download').addEventListener('click', function() {
    document.querySelector('.premium-features-download').style.display = 'block';
    document.querySelector('.premium-features-leaderboard').style.display = 'none';
});

