import './main.css';
import { init as authenticatorInit, login, logout } from './auth';

import {
  getMyPlaylists,
  initPlayer,
  playTrack,
  togglePlay,
  getSinglePlaylist,
  getGenres,
} from './api';

const publicSection = document.getElementById('publicSection')!;
const privateSection = document.getElementById('privateSection')!;
const profileSection = document.getElementById('profileSection')!;
const playlistsSection = document.getElementById('playlistsSection')!;
const actionsSection = document.getElementById('actionsSection')!;
const playlistview = document.getElementById('playlists')!;
const playlistsSingle = document.getElementById('playlistSingle')!;

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

function initPublicSection(profile?: UserProfile): void {
  document.getElementById('loginButton')!.addEventListener('click', login);

  renderPublicSection(!!profile);
}

function renderPlaylist(render: boolean): void {
  playlistview.style.display = render ? 'flex' : 'none';
}

function renderPublicSection(render: boolean): void {
  publicSection.style.display = render ? 'none' : 'block';
}

function initPrivateSection(profile?: UserProfile): void {
  renderPrivateSection(!!profile);
  initMenuSection();
  initProfileSection(profile);
  initPlaylistSection(profile);
  initActionsSection();
}

function renderPrivateSection(isLogged: boolean) {
  privateSection.style.display = isLogged ? 'flex' : 'none';
}

function initMenuSection(): void {
  document.getElementById('profileButton')!.addEventListener('click', () => {
    renderProfileSection(profileSection.style.display !== 'none');
  });
  document.getElementById('playlistsButton')!.addEventListener('click', () => {
    playlistsSingle.style.display = 'none';
    renderPlaylistsSection(true);
    renderPlaylist(true);
  });
  document.getElementById('logoutButton')!.addEventListener('click', logout);
}

function initProfileSection(profile?: UserProfile | undefined) {
  renderProfileSection(!!profile);
  if (profile) {
    renderProfileData(profile);
  }
}

function renderProfileSection(render: boolean) {
  profileSection.style.display = render ? 'none' : 'flex';
}

function renderProfileData(profile: UserProfile) {
  document.getElementById('displayName')!.innerText = profile.display_name;
  document.getElementById('id')!.innerText = profile.id;
  document.getElementById('email')!.innerText = profile.email;
  document.getElementById('uri')!.innerText = profile.uri;
  document
    .getElementById('uri')!
    .setAttribute('href', profile.external_urls.spotify);
  document.getElementById('url')!.innerText = profile.href;
  document.getElementById('url')!.setAttribute('href', profile.href);
}

function initPlaylistSection(profile?: UserProfile): void {
  if (profile) {
    getMyPlaylists(localStorage.getItem('accessToken')!).then(
      (playlists: PlaylistRequest): void => {
        renderPlaylistsSection(!!profile);
        renderPlaylists(playlists);
      }
    );
  }
}

function renderPlaylistsSection(render: boolean) {
  playlistsSection.style.display = render ? 'flex' : 'none';
}

function renderPlaylists(playlists: PlaylistRequest) {
  const playlistElement = document.getElementById('playlists');

  if (!playlistElement) {
    throw new Error('Element not found');
  }
  let htmlLista = '';
  playlists.items.forEach((playlist) => {
    const imageUrl =
      playlist.images.length > 0
        ? playlist.images[0].url
        : 'public\hackifyLogo.png';

    htmlLista =
      htmlLista +
      `<li id="playlist-${playlist.id}" class="playlist-item">
       <button id="playlistSingle-${playlist.id}"><img src="${imageUrl}" alt="${playlist.name}  class="playlistImage" class="playlist-image"></button>

        <span class="playlist-name">${playlist.name}</span>
      </li>`;
  });
  playlistElement.innerHTML = htmlLista;

  playlists.items.forEach((playlist) => {
    const button = document.getElementById(`playlistSingle-${playlist.id}`);

    if (button) {
      button.addEventListener('click', () => {
        renderPlaylistSingle(playlist);
      });
    }
  });
}

async function renderPlaylistSingle(lista: Playlist) {
  renderPlaylist(false);

  let playlist = await getSinglePlaylist(
    localStorage.getItem('accessToken')!,
    lista.id
  );

  if (!playlistsSingle) {
    throw new Error('Element not found');
  }
  playlistsSingle.style.display = 'block';
  playlistsSingle.innerHTML = '';
  const header = document.createElement('div');
  header.innerHTML = `
    <h2>${playlist.name}</h2>
    
    <img src="${playlist.images[0].url}" alt="${playlist.name}" width="${playlist.images[0].width}" class="playlistImage" height="${playlist.images[0].height}">
    <span class="playlist-name">${playlist.name}</span>
    
  `;
  playlistsSingle.appendChild(header);

  const trackList = document.createElement('ul');

  playlist.tracks.items.forEach((track) => {
    const trackItem = document.createElement('li');

    trackItem.innerHTML = `
      <img src="${track.track.album.images[2].url}" alt="${track.name}"/>
      <button class = "songButton" track-id= "${track.track.id}">
      <p><strong>${track.track.name}</strong> - ${track.track.artists[0].name}  ${track.track.album.name}</p>
      </button>
    `;
    trackList.appendChild(trackItem);

    
  });

  playlistsSingle.appendChild(trackList);

  const songButton =  document.querySelectorAll('.songButton');
    songButton.forEach(button => {
      button.addEventListener('click', (event) => {
        const trackId = button.getAttribute('track-id');
        playTrack(`spotify:track:${trackId}`)
        togglePlay()
        renderActionsSection(true);
      })
    })

}


async function renderGenres(genres: Genres) {
  let allGenres = await getGenres(localStorage.getItem('accessToken')!);
}

function initActionsSection(): void {
  document.getElementById('changeButton')!.addEventListener('click', () => {
    playTrack('spotify:track:11dFghVXANMlKmJXsNCbNl'); // solo a modo de ejemplo
  });
  document.getElementById('playButton')!.addEventListener('click', () => {
    togglePlay();
  });
  renderActionsSection(true);
}

function renderActionsSection(render: boolean) {
  actionsSection.style.display = render ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', init);
