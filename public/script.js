let playlist = document.querySelector(".playlist");
let playlist_song = document.querySelectorAll(".plylstsong");
let cards = document.querySelector(".cardbox");
let lib_name = document.querySelector(".lower_header ul li:last-child");
let music_nav = document.querySelector(".song_nevigation ul");
let music_name = document.querySelector(".songname p");
let footer = document.querySelector(".footer");
let playbtn = document.querySelector(".play");
let nextbtn = document.querySelector(".next");
let prevbtn = document.querySelector(".prev");
let musicbar = document.querySelector(".musicbar");
let volumebar = document.querySelector(".volumebar");
let volumebtn = document.querySelector(".volume ul li:first-child");
let sidebarbtn = document.querySelector(".sidebar-btn");
let cancelbtn = document.querySelector(".Spoti_logo li:last-child");
let left = document.querySelector(".left");



let currentsong = new Audio();
let folders, songs, folderName, songIndex;
let albumLoaded = false, songsLoaded = false;


// Fetching all Folders,Songs,Cover
const getFolder = async () => {
    let res = await fetch('/getFolder')
    let resjson = await res.json()
    return resjson;
}
const getSongs = async (folderName) => {
    let res = await fetch('/getContent', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ folderName, 'contentType': 'songs' })
    })
    let resjson = await res.json()
    return resjson;
}
const getCover = async (folderName) => {
    let res = await fetch('/getContent', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ folderName, 'contentType': 'cover' })
    })
    let resjson = await res.json()
    return resjson;
}


// Adding Songs on Front-End
function AddCard(imgurl, name) {
    let div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src='./${imgurl}'>
    <p>${name}</p>`;
    cards.append(div);
}
const AddToPlaylist = () => {
    let albums = document.querySelectorAll('.card')
    albums.forEach(album => {
        //hovering effect
        album.addEventListener("mouseover", () => {
            album.querySelector("p").style.color = "white";
        });
        album.addEventListener("mouseout", () => {
            album.querySelector("p").style.color = "rgb(145, 145, 145)";
        });

        album.addEventListener('click', async () => {
            // Clearing previous album
            while (playlist.hasChildNodes()) {
                playlist.removeChild(playlist.firstChild);
            }
            folderName = album.querySelector('p').innerHTML;
            let x = await getSongs(folderName)
            songIndex = 0;
            songs = x;
            for (let i = 0; i != songs.length; i++) {
                addSongIntoPlaylist(songs[i], songs[i].split(`${folderName}/`)[1])
                songsLoaded = true
            }
            if (songsLoaded)
                PlaySong()
        })
    })
}
function addSongIntoPlaylist(songurl, name) {
    // Clearing previous album

    let tmpsong = new Audio(songurl);
    let songdiv = document.createElement("div");
    songdiv.className = "plylstsong";

    tmpsong.addEventListener("canplay", () => {
        songdiv.innerHTML = `
        <div><img src="Assests/SVGs/music-note-svgrepo-com.svg"></div>
        <div><p>${name}</p></div>
        <div class="duration">${ConvertIntoMin(tmpsong.duration)}</div>`;
        songdiv.classList.add("plylstsong_trans");
    });

    playlist.append(songdiv);

    // Hovering effect
    songdiv.addEventListener("mouseover", () => {
        songdiv.style.backgroundColor = "#323232";
        songdiv.querySelector("p").style.color = "white";
        songdiv.style.transition = "all 0.12s";
    });
    songdiv.addEventListener("mouseout", () => {
        songdiv.style.backgroundColor = "#121212";
        songdiv.querySelector("p").style.color = "rgb(145, 145, 145)";
        songdiv.style.transition = "all 0.12s";
    });

    // Click to playsong from playlist
    songdiv.addEventListener('click', (e) => {
        for (let i = 0; i != songs.length; i++) {
            if (songs[i].split(`${folderName}/`)[1] == name) {
                songIndex = i;
                break;
            }
        }
        PlaySong();
    })
}






// Play the Song
function PlaySong() {
    let songurl = songs[songIndex];
    let songname = songs[songIndex].split(`${folderName}/`)[1]
    footer.style.opacity = "1";
    music_name.parentElement.style.opacity = "1";
    playbtn.src = "Assests/SVGs/pause-1006-svgrepo-com.svg";

    currentsong.src = `${songurl} `;
    currentsong.addEventListener("canplay", () => {
        music_nav.children[0].innerHTML = "0:0";
        music_name.innerHTML = songname;
        music_nav.children[2].innerHTML = ConvertIntoMin(currentsong.duration);
    });

    currentsong.play();
    currentsong.addEventListener("timeupdate", SongProgress);
    playbtn.addEventListener("click", setPlaypause);
    musicbar.classList.add("musicbar_trans");
    musicbar.addEventListener("click", seek_mus);
    volumebar.addEventListener("click", seek_vol);
    volumebtn.addEventListener("click", VolumeSet);
    nextbtn.addEventListener("click", nextSong);
    prevbtn.addEventListener("click", prevSong);
    currentsong.addEventListener("ended", nextSong);
}


// Functionality
function ConvertIntoMin(x) {
    let min = (parseInt(x / 60)).toString();
    let sec = Math.round(x % 60);
    if (sec < 10) {
        sec = "0".concat(sec.toString());
    }
    else
        sec = sec.toString();

    return min + ":" + sec;
}
function SongProgress() {
    let pos = (currentsong.currentTime / currentsong.duration) * 100;
    musicbar.firstElementChild.style.width = `${pos}%`;
    music_nav.children[0].innerHTML = ConvertIntoMin(currentsong.currentTime);
}
function setPlaypause() {
    if (currentsong.paused) {
        playbtn.src = "Assests/SVGs/pause-1006-svgrepo-com.svg";
        currentsong.play();
    }
    else {
        playbtn.src = "Assests/SVGs/play-1003-svgrepo-com.svg";
        currentsong.pause();
    }
}
function VolumeSet() {
    if (currentsong.volume == "0") {
        volumebtn.firstElementChild.src = "Assests/SVGs/volume-high-svgrepo-com.svg";
        currentsong.volume = "0.4";
        volumebar.firstElementChild.style.width = "40%"; // Random 40%
    }
    else {
        volumebtn.firstElementChild.src = "Assests/SVGs/volume-off-svgrepo-com.svg";
        currentsong.volume = "0";
        volumebar.firstElementChild.style.width = `0`;
    }
}
function seek_mus(e) {
    let x = (e.offsetX / musicbar.clientWidth);
    currentsong.currentTime = x * (currentsong.duration);
    musicbar.firstElementChild.style.width = `${x * 100}%`;
}
function seek_vol(e) {
    let x = (e.offsetX / volumebar.clientWidth);
    volumebar.firstElementChild.style.width = `${x * 100}%`;
    currentsong.volume = `${x}`;
}
function VolumeSet(params) {
    if (currentsong.volume == "0") {
        volumebtn.firstElementChild.src = "Assests/SVGs/volume-high-svgrepo-com.svg";
        currentsong.volume = "0.4";
        volumebar.firstElementChild.style.width = "40%"; // Random 40%
    }
    else {
        volumebtn.firstElementChild.src = "Assests/SVGs/volume-off-svgrepo-com.svg";
        currentsong.volume = "0";
        volumebar.firstElementChild.style.width = `0`;
    }
}
function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    PlaySong();
}
function prevSong() {
    songIndex = (songIndex - 1);
    songIndex < 0 ? songIndex = songs.length - 1 : songIndex;
    PlaySong();
}



// Start 
const Start = async () => {
    folders = await getFolder()
    for (let i = 0; i != folders.length; i++) {
        let coverImage = await getCover(folders[i]);
        AddCard(coverImage, folders[i])
        if (i == folders.length - 1) {
            albumLoaded = true
        }
    }
    if (albumLoaded) {
        AddToPlaylist()
    }
}

Start()