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


const setLikes = () => {
    songData.forEach((item) => {
        if(localStorage.getItem(item.name) !== null){
            item.isLiked = JSON.parse(localStorage.getItem(item.name));
        }
    })
}
setLikes()


const setBeats = (state) => {
    beatAnimation.forEach((item) => {
        item.style.animationPlayState = state;
    })
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
    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds;
}


audio.addEventListener('loadedmetadata', () => {
    musicTime = audio.duration;
    fullSongTime.textContent = convertToMinute(musicTime);
    songSlider.max = musicTime;
    songSlider.value = audio.currentTime;
    count = 0;
})

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
})


pauseBtn.addEventListener('click', () => {
    clearInterval(interval);
    audio.pause();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'block';
    setBeats('paused');
})


next.addEventListener('click', () => {
    songIndex++;
    if(songIndex === songData.length){
        songIndex = 0;
    }
    mediaSource(songIndex);
    audio.play();
    checkBtns();
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
    localStorage.setItem(songData[songIndex].name,songData[songIndex].isLiked)
});


songSlider.addEventListener('input', () => {
    audio.currentTime = songSlider.value;
    count = songSlider.value;
})


audio.addEventListener('ended', () => {
    count = 0;
    songSlider.value = 0;
    clearInterval(interval);
    currentSongTime.textContent = '00:00';
    setBeats('paused');
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'block';
    document.querySelector('.loader').style.display = 'none';
})


audio.addEventListener('waiting', () => {
    pauseBtn.style.display = 'none';
    clearInterval(interval);
    document.querySelector('.loader').style.display = 'block';
    setBeats('paused');
})

audio.addEventListener('playing', () => {
    interval = setInterval(sliding,1000);
    document.querySelector('.loader').style.display = 'none';
    pauseBtn.style.display = 'block';
    setBeats('running');
})
