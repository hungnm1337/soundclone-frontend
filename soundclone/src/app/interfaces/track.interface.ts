export interface CreateTrack {
  Title: string;
  Description: string;
  AudioFileUrl: string;
  CoverArtUrl: string;
  DurationInSeconds: number;
  IsPublic: boolean;
  UpdateBy: number;
}

export interface CreateTrackInput {
  Title: string;
  Description: string;
  AudioFile: File;
  CoverArt: File;
  DurationInSeconds: number;
  IsPublic: boolean;
  UpdateBy: number;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  year: string;
  view: number;
  imageUrl: string;
}

export interface TrackDetail {
  trackId: number;
  title: string;
  description: string;
  audioFileUrl: string;
  coverArtUrl: string;
  waveformUrl: string;
  durationInSeconds: number;
  isPublic: boolean;
  uploadDate: Date;
  updateBy: number;
  playCount: number;
}
