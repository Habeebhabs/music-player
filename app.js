import { songData } from "./songData.js";
const volumeBtn = document.querySelector('.sound');
const volumeSlider = document.querySelector('.range-volume');
const repeatBtn = document.querySelector('.fa-repeat-alt');
const beatAnimation = document.querySelectorAll('.beats');
const songImage = document.querySelector('.song-img');
const songName = document.querySelector('.name');
const songArtist = document.querySelector('.artist');
const shuffleBtn = document.querySelector('.fa-random');
const likeBtn = document.querySelector('.fa-heart');
const songSlider = document.querySelector('.range-track');
const currentSongTime = document.querySelector('.current-time');
const fullSongTime = document.querySelector('.total-time');
const previous = document.querySelector('.fa-backward');
const next = document.querySelector('.fa-forward');
const playBtn = document.querySelector('.fa-play-circle');
const pauseBtn = document.querySelector('.fa-pause');
const audio = document.createElement('audio');

let musicTime = 0;
let count = 0;
let songIndex = 0;
let interval = undefined;

const sliding = () => {
    count++;
    songSlider.value = count;
    currentSongTime.textContent = convertToMinute(audio.currentTime);
}


const mediaSource = (index) => {
    audio.src = songData[index].url;
    songImage.src = songData[index].img;
    songName.textContent = songData[index].name;
    songArtist.textContent = songData[index].artist;
    if(songData[index].isLiked){
        likeBtn.classList.add('like')
    }
    else{
        likeBtn.classList.remove('like')
    }
}


const convertToMinute = (value) => {
    const sec = parseInt(value, 10);
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds;
}


audio.onloadedmetadata = () => {
    musicTime = audio.duration;
    fullSongTime.textContent = convertToMinute(musicTime);
    songSlider.max = musicTime;
    songSlider.value = audio.currentTime;
    count = 0;
}

mediaSource(songIndex);

volumeBtn.addEventListener('click', () => {
    if(!volumeSlider.classList.contains('show')){
        volumeSlider.classList.add('show')
    }
    else{
        volumeSlider.classList.remove('show')
    }
})

const checkMusicVolume = () => {
    audio.volume = volumeSlider.value / 10;
    if(audio.volume === 0){
        volumeBtn.classList.replace(volumeBtn.classList[1],'fa-volume-mute');
    }
    else if(audio.volume < 0.4){
        volumeBtn.classList.replace(volumeBtn.classList[1],'fa-volume-down');
    }
    else if(audio.volume < 0.8){
        volumeBtn.classList.replace(volumeBtn.classList[1],'fa-volume');
    }
    else{
        volumeBtn.classList.replace(volumeBtn.classList[1],'fa-volume-up');
    }
}


volumeSlider.addEventListener('input',checkMusicVolume);

checkMusicVolume()

volumeSlider.addEventListener("mouseleave", () => {
    volumeSlider.classList.add('expanding');
    setTimeout(() => {
        volumeSlider.classList.remove('show','expanding');
    }, 500);
})


repeatBtn.addEventListener('click', () => {
    audio.load();
    audio.play();
    checkBtns();
})


playBtn.addEventListener('click', () => {
    audio.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    beatAnimation.forEach((item) => {
        if(item.classList.contains('anim')){
            item.style.animationPlayState = 'running';
        }
        else{
            item.classList.add('anim');
        }
    })

    interval = setInterval(sliding,1000);
})


pauseBtn.addEventListener('click', () => {
    audio.pause();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'block';
    beatAnimation.forEach((item) => {
        item.style.animationPlayState = 'paused';
    })
    clearInterval(interval);
})


next.addEventListener('click', () => {
    songIndex++;
    if(songIndex === songData.length){
        songIndex = 0;
    }
    mediaSource(songIndex);
    audio.play();
    checkBtns();
    interval = setInterval(sliding,1000);
})


const checkBtns = () => {
    if(playBtn.style.display = 'block'){
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    }
}


previous.addEventListener('click', () => {
    if(audio.currentTime > musicTime / 2){
        audio.load();
        audio.play();
        return
    }
    songIndex--;
    if(songIndex === -1){
        songIndex = songData.length - 1;
    }
    mediaSource(songIndex);
    audio.play();
    checkBtns();
    interval = setInterval(sliding,1000);
})


likeBtn.addEventListener('click', () => {
    if(likeBtn.classList.contains('like')){
        likeBtn.classList.remove('like');
        likeBtn.classList.add('like-two');
        songData[songIndex].isLiked = false;
    }
    else{
        likeBtn.classList.remove('like-two')
        likeBtn.classList.add('like');
        songData[songIndex].isLiked = true;
    }
});


songSlider.addEventListener('input', () => {
    audio.currentTime = songSlider.value;
    count = songSlider.value;
})
