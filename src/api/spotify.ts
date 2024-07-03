import { generateCodeChallenge, generateCodeVerifier } from "../utils";

const apiAccount = 'https://accounts.spotify.com'
const api = 'https://api.spotify.com'
const params = new URLSearchParams({ limit: "50" });

export async function redirectToProvider(): Promise<void> {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.VITE_CLIENTID);
  params.append("response_type", "code");
  params.append("redirect_uri", import.meta.env.VITE_URI_CALLBACK);
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `${apiAccount}/authorize?${params.toString()}`;
}

export async function getTokens(code: string): Promise<TokenResponse> {
  const verifier = localStorage.getItem("verifier");
  if(!verifier){
    throw new Error("Code verifier not found");
  }
  const params = new URLSearchParams();

  params.append("client_id", import.meta.env.VITE_CLIENTID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", import.meta.env.VITE_URI_CALLBACK);
  params.append("code_verifier", verifier!);

  const result = await fetch(`${apiAccount}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  const { access_token, refresh_token } = await result.json();
  return {
    access_token,
    refresh_token
  };
}

export async function getProfile(token: string): Promise<UserProfile> {
  const result = await fetch(`${api}/v1/me`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getMyPlaylists(token: string): Promise<PlaylistRequest> {
  const result = await fetch(`${api}/v1/me/playlists`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

// TODO agregar nuevas funciones para obtener playlists, canciones, etc

export async function getMyPlaylist(token: string, playlistId: string): Promise<PlaylistRequest> {
  const result = await fetch(`${api}/v1/me/playlists/${playlistId}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}


//-----------------------------------------------------------------------------------------Categories
export async function getAllCategories(token: string): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/browse/categories`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getSigleCategorie(token: string, categoriesId: string): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/browse/categories/${categoriesId}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}
//------------------------------------------------------------------------------------------------Artist--------------------------------
export async function getArtist(token: string): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/artists`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getSingleArtist(token: string, artistId: string ): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/artists/${artistId}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}
//----------------------------------------------------------------------------------------Genres--------------------------------
export async function getGenres(token: string ): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/recommendations/available-genre-seeds`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}
//--------------------------------------------------------------------------------------------Songs--------------------------------
export async function getSong(token: string, songId: string ): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/recommendations/tracks/${songId}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getMyFavouritesSongs(token: string): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/me/tracks?${params.toString()}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getNextSong(token: string ): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/me/player/next/v1/me/player/next`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getPreviousSong(token: string ): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/me/player/previous/v1/me/player/next`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function getRepeatSong(token: string): Promise<PlaylistRequest> {

  const result = await fetch(`${api}/v1/me/player/repeat`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}




