export interface PlaylistMenu {
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  trackQuantity: number;
  isPublish: boolean;
}

export interface AddTrackToPlaylist {
  playlistId: number;
  trackId: number;
}

export interface PlaylistCreateInput {
  title: string;
  picturePlaylistUrl: File;
  isPublish: boolean;
}

export interface PlaylistDTO {
  makeBy: number;
  title: string;
  picturePlaylistUrl: string;
  isPublish: boolean;
}

export interface UpdatePlaylistDTO{
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  isPublish: boolean;
  userId: number;
}

export interface PlaylistDetailDTO {
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  trackQuantity: number;
  isPublish: boolean;
  artistName : string;
  artistId : number;
}

export interface DeletePlaylistDTO{
  playlistId: number;
  userId: number;
}

export interface RemoveTrackFromPlaylistDTO{
  playlistId: number;
  trackId: number;
  userId: number;
}
