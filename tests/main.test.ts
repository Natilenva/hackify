// tests/main.test.ts

import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import * as Main from '../src/main'; 

// Mock para el localStorage
const localStorageMock = {
  getItem: vi.fn(() => 'mock-access-token'),
  setItem: vi.fn(),
};

// Mock para el fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        items: [
          {
            id: 'mock-playlist-id',
            name: 'Test Playlist',
            images: [{ url: 'mock-image-url', width: 300, height: 300 }],
            tracks: {
              items: [
                {
                  track: {
                    id: 'mock-track-id',
                    name: 'Mock Track',
                    artists: [{ name: 'Mock Artist' }],
                    album: { name: 'Mock Album', images: [{ url: 'mock-album-image-url' }] },
                  },
                },
              ],
            },
          },
        ],
      }),
  })
) as any;

// Mock para document y sus elementos
document.getElementById = vi.fn((id: string) => {
  const mockElement = {
    style: { display: '' },
    innerHTML: '',
    addEventListener: vi.fn(),
    appendChild: vi.fn(),
    setAttribute: vi.fn(),
  };

  switch (id) {
    case 'publicSection':
    case 'privateSection':
    case 'profileSection':
    case 'playlistsSection':
    case 'actionsSection':
    case 'playlists':
    case 'playlistSingle':
      return mockElement;
    case 'loginButton':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    case 'profileButton':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    case 'playlistsButton':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    case 'logoutButton':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    case 'changeButton':
    case 'playButton':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    case 'embed-iframe':
      return mockElement;
    case 'playlistSingle-mock-playlist-id':
      return { ...mockElement, addEventListener: vi.fn((event, callback) => callback()) };
    default:
      return null;
  }
});

describe('Main module tests', () => {
  beforeAll(() => {
    // Configurar el localStorage mock antes de las pruebas
    global.localStorage = localStorageMock as any;
  });

  beforeEach(() => {
    // Restablecer mocks entre cada prueba
    vi.resetAllMocks();
  });

  it('should initialize the application', async () => {
    // Mock para authenticatorInit
    const mockProfile = { id: 'mock-id', display_name: 'Mock User', email: 'mock@example.com', uri: 'mock-uri', external_urls: { spotify: 'https://mock-spotify-url.com' } };
    vi.spyOn(Main, 'authenticatorInit').mockImplementation(() => Promise.resolve(mockProfile));

    // Mock para initPlayer
    const mockEmbedIframe = document.getElementById('embed-iframe')!;
    vi.spyOn(Main, 'initPlayer').mockImplementation(() => {});

    // Mock para renderPublicSection
    vi.spyOn(Main, 'renderPublicSection').mockImplementation(() => {});

    // Llamar a la función init y verificar el comportamiento esperado
    await Main.init();
    expect(Main.authenticatorInit).toHaveBeenCalled();
    expect(Main.initPlayer).toHaveBeenCalledWith(mockEmbedIframe);
    expect(Main.renderPublicSection).toHaveBeenCalledWith(true);
  });

  it('should render public section', () => {
    const mockProfile = { display_name: 'Mock User' };

    // Mock para loginButton event listener
    const loginButton = document.getElementById('loginButton')!;
    vi.spyOn(loginButton, 'addEventListener').mockImplementation((event, callback) => callback());

    // Llamar a la función renderPublicSection y verificar el comportamiento esperado
    Main.renderPublicSection(true);
    expect(loginButton.addEventListener).toHaveBeenCalled();
    expect(document.getElementById('publicSection')!.style.display).toBe('none');
  });

  it('should render playlists section', async () => {
    const mockProfile = { id: 'mock-id' };

    // Mock para getMyPlaylists
    vi.spyOn(Main, 'getMyPlaylists').mockImplementation(() => Promise.resolve({ items: [{ id: 'mock-playlist-id', name: 'Test Playlist', images: [{ url: 'mock-image-url' }] }] }));

    // Mock para renderPlaylists
    vi.spyOn(Main, 'renderPlaylists').mockImplementation(() => {});

    // Llamar a la función initPlaylistSection y verificar el comportamiento esperado
    await Main.initPlaylistSection(mockProfile);
    expect(Main.getMyPlaylists).toHaveBeenCalledWith('mock-access-token');
    expect(Main.renderPlaylists).toHaveBeenCalled();
    expect(document.getElementById('playlistsSection')!.style.display).toBe('flex');
  });

  it('should render single playlist view', async () => {
    const mockPlaylist = { id: 'mock-playlist-id', name: 'Test Playlist', images: [{ url: 'mock-image-url' }], tracks: { items: [{ track: { id: 'mock-track-id', name: 'Mock Track', artists: [{ name: 'Mock Artist' }], album: { name: 'Mock Album', images: [{ url: 'mock-album-image-url' }] } } }] } };

    // Mock para getSinglePlaylist
    vi.spyOn(Main, 'getSinglePlaylist').mockImplementation(() => Promise.resolve(mockPlaylist));

    // Llamar a la función renderPlaylistSingle y verificar el comportamiento esperado
    await Main.renderPlaylistSingle({ id: 'mock-playlist-id' });
    expect(Main.getSinglePlaylist).toHaveBeenCalledWith('mock-access-token', 'mock-playlist-id');
    expect(document.getElementById('playlistSingle')!.style.display).toBe('block');
    expect(document.getElementById('playlistSingle')!.innerHTML).toContain('Test Playlist');
  });

  it('should handle click events', () => {
    // Mock para profileButton event listener
    const profileButton = document.getElementById('profileButton')!;
    vi.spyOn(profileButton, 'addEventListener').mockImplementation((event, callback) => callback());

    // Llamar a la función initMenuSection y verificar el comportamiento esperado
    Main.initMenuSection();
    expect(profileButton.addEventListener).toHaveBeenCalled();
  });

  it('should render profile data', () => {
    const mockProfile = { display_name: 'Mock User', id: 'mock-id', email: 'mock@example.com', uri: 'mock-uri', external_urls: { spotify: 'https://mock-spotify-url.com' }, href: 'mock-href' };

    // Llamar a la función renderProfileData y verificar el comportamiento esperado
    Main.renderProfileData(mockProfile);
    expect(document.getElementById('displayName')!.innerText).toBe('Mock User');
    expect(document.getElementById('id')!.innerText).toBe('mock-id');
    expect(document.getElementById('email')!.innerText).toBe('mock@example.com');
    expect(document.getElementById('uri')!.innerText).toBe('mock-uri');
    expect(document.getElementById('url')!.innerText).toBe('mock-href');
    expect(document.getElementById('uri')!.getAttribute('href')).toBe('https://mock-spotify-url.com');
    expect(document.getElementById('url')!.getAttribute('href')).toBe('mock-href');
  });
});
