import './main.css';
import { init as authenticatorInit, login, logout } from './auth';
import { getMyPlaylists, initPlayer, playTrack, togglePlay,getSinglePlaylist  } from './api';

const publicSection = document.getElementById("publicSection")!;
const privateSection = document.getElementById("privateSection")!;
const profileSection = document.getElementById("profileSection")!;
const playlistsSection = document.getElementById("playlistsSection")!;
const actionsSection = document.getElementById("actionsSection")!;

async function init() {
  let profile: UserProfile | undefined;
  try {
    profile = await authenticatorInit();
    initPlayer(document.getElementById('embed-iframe')!);
  } catch (error) {
    console.error(error);
  }

  initPublicSection(profile);
  initPrivateSection(profile);
}

function initPublicSection(profile?: UserProfile): void{
  document.getElementById("loginButton")!.addEventListener("click", login);
  
  renderPublicSection(!!profile);
}

function renderPublicSection(render: boolean): void {
  publicSection.style.display = render ? "none" : "block";
}

function initPrivateSection(profile?: UserProfile): void  {
  renderPrivateSection(!!profile);
  initMenuSection();
  initProfileSection(profile);
  initPlaylistSection(profile);
  initActionsSection();
}

function renderPrivateSection(isLogged: boolean) {
  privateSection.style.display = isLogged ? "block" : "none";
}

function initMenuSection(): void  {
  document.getElementById("profileButton")!.addEventListener("click", () => {
    renderProfileSection(profileSection.style.display !== "none");
  });
  document.getElementById("playlistsButton")!.addEventListener("click", () => {
    renderPlaylistsSection(playlistsSection.style.display !== "none");
  });
  document.getElementById("logoutButton")!.addEventListener("click", logout);
}

function initProfileSection(profile?: UserProfile | undefined) {
  renderProfileSection(!!profile);
  if (profile) {
    renderProfileData(profile);
  }
}

function renderProfileSection(render: boolean) {
  profileSection.style.display = render ? "none" : "block";
}

function renderProfileData(profile: UserProfile) {
  document.getElementById("displayName")!.innerText = profile.display_name;
  document.getElementById("id")!.innerText = profile.id;
  document.getElementById("email")!.innerText = profile.email;
  document.getElementById("uri")!.innerText = profile.uri;
  document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url")!.innerText = profile.href;
  document.getElementById("url")!.setAttribute("href", profile.href);
}

function initPlaylistSection(profile?: UserProfile): void {
  if (profile) {
    getMyPlaylists(localStorage.getItem("accessToken")!)
    .then((playlists: PlaylistRequest): void => {
      renderPlaylistsSection(!!profile);
      renderPlaylists(playlists);
    });
  }
}

function renderPlaylistsSection(render: boolean) {
  playlistsSection.style.display = render ? "none" : "block";
}

function renderPlaylists(playlists: PlaylistRequest) {
  const playlistElement = document.getElementById("playlists");
  if (!playlistElement) {
    throw new Error("Element not found");
  }

  playlistElement.innerHTML = playlists.items.map((playlist) => {
    const imageUrl = playlist.images.length > 0 ? playlist.images[0].url : 'public\hackifyLogo.png'; 
    return `
      <li class="playlist-item">
       <button id="playlistSingle" ${addEventListener('click', () => {
        renderPlaylistSingle(playlist)
        console.log(playlist);
      })}><img src="${imageUrl}" alt="${playlist.name}" class="playlist-image"></button>

        <span class="playlist-name">${playlist.name}</span>
      </li>`;
  }).join('');

  playlists.items.forEach((playlist) => {
    const button = document.getElementById(`playlistSingle`);

    if(button){
      button.addEventListener('click', () => {
        renderPlaylistSingle(playlist)
        console.log('playlist');
      })
    }
})
}
function renderPlaylistSingle(lista : Playlist){

  const playlistsSingle = document.getElementById('playlistSingle');
  getSinglePlaylist(localStorage.getItem("accessToken")!, lista.id)
  console.log(lista)
  if(!playlistsSingle){
    throw new Error ("Element not found")
  }

  playlistsSingle.innerHTML = '';
  const header = document.createElement('div');
  header.innerHTML = `
    <h2>${lista.name}</h2>
    <img src="${lista.images[0].url}" alt="${lista.name}" width="${lista.images[0].width}" height="${lista.images[0].height}">
    <span class="playlist-name">${lista.name}</span>
  `;
  playlistsSingle.appendChild(header);

  const trackList = document.createElement('ul');

  lista.tracks.forEach(track => {
    const trackItem = document.createElement('li');

    trackItem.innerHTML = `
      <strong>${track.name}</strong> - ${track.artists} (${track.album})
    `;
    trackList.appendChild(trackItem);
  });

  playlistsSingle.appendChild(trackList);

  }
  


function initActionsSection(): void {
  document.getElementById("changeButton")!.addEventListener("click", () => {
    playTrack('spotify:track:11dFghVXANMlKmJXsNCbNl'); // solo a modo de ejemplo
  });
  document.getElementById("playButton")!.addEventListener("click", () => {
    togglePlay();
  });
  renderActionsSection(true);
}

function renderActionsSection(render: boolean) {
  actionsSection.style.display = render ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", init);
