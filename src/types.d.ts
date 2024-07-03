
type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: { spotify: string; };
  followers: { href: string; total: number; };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
}

type Playlist = {
  name: string;
}

type PlaylistRequest = {
  items: Playlist[];
}


type Icon = {
  url: string;
  height: number | null;
  width: number | null;
}

type Category = {
  href: string;
  icons: Icon[];
  id: string;
  name: string;
}

type Categories = {
  href: string;
  items: Category[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

type CategoriesRequest = {
  categories: Categories[];
}

type ExternalUrls = {
  spotify: string;
}

type Followers = {
  href: string | null;
  total: number;
}

type Image = {
  url: string;
  height: number;
  width: number;
}

type Artist = {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

type ArtistsRequest = {
  artists: Artist[];
}
 
type ExternalUrls ={
  url: string;
  height: number;
  width: number;
}


type Album ={
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  album_group?: string; 
}

type AlbumsRequest = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Album[];
}
type track = {
    album:[]
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  };

