// ScrollReveal animations
ScrollReveal({distance: '60px', duration: 2500, delay: 400});
ScrollReveal().reveal('.profile-card', {delay: 500, origin: 'bottom'});
ScrollReveal().reveal('.profile-image', {delay: 600, scale: 0.85});

// Music player control functionality
const video = document.getElementById('bgVideo');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const unmuteBtn = document.getElementById('unmuteBtn');
const progressSlider = document.getElementById('progressSlider');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-current');
const timeDuration = document.querySelector('.time-duration');

// Format time display
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play/Pause functionality
playBtn.addEventListener('click', () => {
    video.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
});

pauseBtn.addEventListener('click', () => {
    video.pause();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'flex';
});

// Previous button (restart)
prevBtn.addEventListener('click', () => {
    video.currentTime = 0;
});

// Next button (skip 10 seconds)
nextBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
});

// Mute/Unmute functionality
muteBtn.addEventListener('click', () => {
    video.muted = true;
    muteBtn.style.display = 'none';
    unmuteBtn.style.display = 'flex';
});

unmuteBtn.addEventListener('click', () => {
    video.muted = false;
    unmuteBtn.style.display = 'none';
    muteBtn.style.display = 'flex';
});

// Update progress bar as video plays
video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressFill.style.width = percent + '%';
    progressSlider.value = percent;
    timeCurrent.textContent = formatTime(video.currentTime);
});

// Update duration when video loads
video.addEventListener('loadedmetadata', () => {
    timeDuration.textContent = formatTime(video.duration);
    progressSlider.max = 100;
});

// Allow user to seek through video
progressSlider.addEventListener('input', (e) => {
    const percent = e.target.value / 100;
    video.currentTime = percent * video.duration;
});

// Autoplay on load
window.addEventListener('load', () => {
    video.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
});

// Birthday Countdown
function updateBirthdayCountdown() {
    const birthdayElement = document.getElementById('birthdayCountdown');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Birthday is November 1st (01/11 in DD/MM format)
    let birthday = new Date(currentYear, 10, 1); // Month is 0-indexed, so 10 = November
    
    // If birthday has already passed this year, count to next year
    if (currentDate > birthday) {
        birthday = new Date(currentYear + 1, 10, 1);
    }
    
    // Calculate days remaining
    const timeDifference = birthday - currentDate;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    if (daysRemaining === 0) {
        birthdayElement.textContent = '🎉 Happy Birthday! 🎉';
    } else if (daysRemaining === 1) {
        birthdayElement.textContent = '🎂 Tomorrow is your birthday!';
    } else {
        birthdayElement.textContent = `${daysRemaining} days until your birthday 🎂`;
    }
}

// Update countdown on page load and every minute
updateBirthdayCountdown();
setInterval(updateBirthdayCountdown, 60000); // Update every minute

// Calculate and Update Age
function updateAge() {
    const userAgeElement = document.getElementById('userAge');
    const birthDate = new Date(2003, 10, 1); // Month is 0-indexed, so 10 = November
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    
    // Check if birthday has passed this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    userAgeElement.textContent = `${age} years old`;
}

// Update age on page load
updateAge();
// Update age every day at midnight (to catch birthday changes)
setInterval(updateAge, 86400000); // Update every 24 hours
