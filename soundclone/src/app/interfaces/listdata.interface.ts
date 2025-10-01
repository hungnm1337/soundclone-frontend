
export interface ListTrackDTO {
  trackId: number;
  title: string;
  coverArtUrl: string;
  artistName: string;
}
export interface ListPlaylistDTO {
  playlistId: number;
  numTrack: number;
  title: string;
  picturePlaylistUrl: string;
  artistName: string;
}
export interface ArtistDTO {
  userId: number;
  name: string;
  profilePictureUrl: string;
}
