// tests/spotify.test.ts

import { describe, it, expect, beforeAll, vi } from 'vitest';
import * as SpotifyAPI from '../src/api/spotify'; 

describe('Spotify API functions', () => {
  let token: string;

  beforeAll(async () => {
    token = 'your-access-token';
  });

  it('should redirect to Spotify login page', async () => {
    const redirectSpy = vi.spyOn(document.location, 'assign').mockImplementation(() => {});
    await SpotifyAPI.redirectToProvider();
    expect(redirectSpy).toHaveBeenCalled();
    redirectSpy.mockRestore();
  });

  it('should retrieve tokens from Spotify', async () => {
    const code = 'your-code'; // Simula el código de autorización

    // Mocking fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
        }),
      })
    ) as any;

    const tokens = await SpotifyAPI.getTokens(code);
    expect(tokens).toHaveProperty('access_token', 'mock-access-token');
    expect(tokens).toHaveProperty('refresh_token', 'mock-refresh-token');
  });

  it('should get user profile information', async () => {
    // Mocking fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          id: 'mock-id',
          display_name: 'mock-display-name',
        }),
      })
    ) as any;

    const profile = await SpotifyAPI.getProfile(token);
    expect(profile).toHaveProperty('id', 'mock-id');
    expect(profile).toHaveProperty('display_name', 'mock-display-name');
  });

  it('should fetch user playlists', async () => {
    // Mocking fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          items: [],
        }),
      })
    ) as any;

    const playlists = await SpotifyAPI.getMyPlaylists(token);
    expect(playlists).toHaveProperty('items');
    expect(Array.isArray(playlists.items)).toBe(true);
  });

  it('should create a new playlist', async () => {
    const userId = 'your-user-id';

    // Mocking fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          id: 'mock-playlist-id',
          name: 'Test Playlist',
        }),
      })
    ) as any;

    const playlist = await SpotifyAPI.createPlaylist(token, userId, 'Test Playlist', 'Description', true);
    expect(playlist).toHaveProperty('id', 'mock-playlist-id');
    expect(playlist).toHaveProperty('name', 'Test Playlist');
  });
});
