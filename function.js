// ScrollReveal animations
ScrollReveal({distance: '60px', duration: 2500, delay: 400});
ScrollReveal().reveal('.profile-card', {delay: 500, origin: 'bottom'});
ScrollReveal().reveal('.profile-image', {delay: 600, scale: 0.85});

// Music player control functionality
const video = document.getElementById('bgVideo');
const audio = document.getElementById('bgAudio');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const unmuteBtn = document.getElementById('unmuteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressSlider = document.getElementById('progressSlider');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-current');
const timeDuration = document.querySelector('.time-duration');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const songName = document.querySelector('.song-name');

let currentVolume = 1;
let isMuted = false;
let isPlaying = false;
let currentTrackIndex = 0;

const tracks = [
    {
        title: '恋は月の蔭に',
        type: 'audio',
        source: 'music/恋は月の蔭に.mp3',
        thumbnailType: 'image',
        thumbnailSrc: 'thumbnail/music-thumbnail.jpg'
    },
    {
        title: 'Velune',
        type: 'audio',
        source: 'music/Velune_demo_santilavadenz.mp3',
        thumbnailType: 'video',
        thumbnailSrc: 'thumbnail/rainy1.mp4'
    }
];

function syncVolumeUI() {
    audio.volume = currentVolume;
    video.volume = currentVolume;
    audio.muted = isMuted;
    video.muted = isMuted;

    if (isMuted || currentVolume === 0) {
        muteBtn.style.display = 'none';
        unmuteBtn.style.display = 'flex';
    } else {
        muteBtn.style.display = 'flex';
        unmuteBtn.style.display = 'none';
    }

    volumeSlider.value = currentVolume.toString();
}

function setVolume(level) {
    currentVolume = Math.max(0, Math.min(1, Number(level)));
    isMuted = currentVolume === 0;
    syncVolumeUI();
}

function setPlaybackState(playing) {
    isPlaying = playing;
    playBtn.style.display = playing ? 'none' : 'flex';
    pauseBtn.style.display = playing ? 'flex' : 'none';
}

function getActiveMedia() {
    return tracks[currentTrackIndex].type === 'video' ? video : audio;
}

function updateThumbnail(track) {
    if (track.thumbnailType === 'image') {
        thumbnailContainer.innerHTML = `<img src="${track.thumbnailSrc}" alt="Album Art" class="thumbnail-img">`;
    } else {
        thumbnailContainer.innerHTML = `
            <video class="thumbnail-img" autoplay loop muted playsinline>
                <source src="${track.thumbnailSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }
}

function updateProgressDisplay(media) {
    if (!media || Number.isNaN(media.duration) || media.duration <= 0) {
        return;
    }

    const percent = (media.currentTime / media.duration) * 100;
    progressFill.style.width = percent + '%';
    progressSlider.value = percent;
    timeCurrent.textContent = formatTime(media.currentTime);
    timeDuration.textContent = formatTime(media.duration);
    progressSlider.max = 100;
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];
    songName.textContent = track.title;
    updateThumbnail(track);

    if (track.type === 'video') {
        video.querySelector('source').src = track.source;
        video.load();
        video.currentTime = 0;
        audio.pause();
        audio.currentTime = 0;
    } else {
        audio.querySelector('source').src = track.source;
        audio.load();
        audio.currentTime = 0;
        video.pause();
        video.currentTime = 0;
    }

    timeCurrent.textContent = '0:00';
    timeDuration.textContent = '0:00';
    progressFill.style.width = '0%';
    progressSlider.value = 0;

    if (isPlaying) {
        playCurrentTrack();
    } else {
        setPlaybackState(false);
    }
}

function playCurrentTrack() {
    const media = getActiveMedia();
    media.play().catch(() => {});
    setPlaybackState(true);
}

function pauseCurrentTrack() {
    video.pause();
    audio.pause();
    setPlaybackState(false);
}

// Format time display
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play/Pause functionality
playBtn.addEventListener('click', () => {
    playCurrentTrack();
});

pauseBtn.addEventListener('click', () => {
    pauseCurrentTrack();
});

// Previous button
prevBtn.addEventListener('click', () => {
    const nextIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(nextIndex);
});

// Next button
nextBtn.addEventListener('click', () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(nextIndex);
});

// Mute/Unmute functionality
muteBtn.addEventListener('click', () => {
    isMuted = true;
    syncVolumeUI();
});

unmuteBtn.addEventListener('click', () => {
    isMuted = false;
    if (currentVolume === 0) {
        currentVolume = 0.5;
    }
    syncVolumeUI();
});

volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value);
});

// Update progress bar as media plays
video.addEventListener('timeupdate', () => {
    updateProgressDisplay(video);
});

audio.addEventListener('timeupdate', () => {
    updateProgressDisplay(audio);
});

// Update duration when media loads
video.addEventListener('loadedmetadata', () => {
    updateProgressDisplay(video);
});

audio.addEventListener('loadedmetadata', () => {
    updateProgressDisplay(audio);
});

// Allow user to seek through the active media
progressSlider.addEventListener('input', (e) => {
    const percent = e.target.value / 100;
    const media = getActiveMedia();
    media.currentTime = percent * media.duration;
});

// Autoplay on load
window.addEventListener('load', () => {
    syncVolumeUI();
    loadTrack(0);
    playCurrentTrack();
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
        birthdayElement.textContent = '🎂 Tomorrow is birthday!';
    } else {
        birthdayElement.textContent = `${daysRemaining} days until birthday 🎂`;
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
