import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackService, TrackDetail,Album } from '../../../Services/TrackService/track.service';
import { ArtistService, ArtistDetailDTO } from '../../../Services/Artist/artist.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService, PlayerTrack } from '../../../Services/Player/player.service';
import { LikeTrackInput, LikeTrackService } from '../../../Services/LikeTrack/like-track.service';
import { PlaylistMenu, PlaylistService, AddTrackToPlaylist } from '../../../Services/Playlist/playlist.service';
@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit {

  onAddToPlaylist() {
    this.isPlaylistModalOpen = true;
    console.log('Add to playlist clicked');
  }

  onLikeTrack() {
    if (this.trackId) {
      this.likeTrackService.ToggleUserLikeTrackStatus(this.trackId).subscribe({
        next: (isLiked: boolean) => {
          this.isLiked = !this.isLiked;
          console.log('Like track response:', isLiked);
        },
        error: (error: any) => {
          console.error('Error liking track:', error);
        }
      });
      this.updateLikeStatus();
    }
  }
  public playlists: PlaylistMenu[] = [];
  public isPlaylistModalOpen: boolean = false;
  public isLiked: boolean = false;
  public albums: Album[] = [];
  public trackId: number | null = null;
  public trackDetail: TrackDetail | null = null;
  public artistDetail: ArtistDetailDTO | null = null;
  public isPlaying = true;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  public playerCurrentTime: number = 0;
  public playerDuration: number = 0;
  public playerIsPlaying: boolean = false;
  private playerSub?: any;
  public likeTrackCount: number = 0;
  constructor(private route: ActivatedRoute,
     private trackService: TrackService,
     private artistService: ArtistService,
     private router: Router,
     private playerService: PlayerService,
     private likeTrackService: LikeTrackService,
     private playlistService: PlaylistService
   ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.trackId = id ? +id : null;
      this.loadTrackData();
    });
  }

  closePlaylistModal(): void {
    this.isPlaylistModalOpen = false;
  }

  addTrackToSelectedPlaylist(playlistId: number): void {
    if (!this.trackId) {
      console.error('No trackId available to add to playlist');
      return;
    }
    const payload: AddTrackToPlaylist = { playlistId, trackId: this.trackId };
    console.log('Adding track to playlist', payload);
    this.playlistService.AddTrackToPlaylist(payload).subscribe({
      next: (response) => {
        console.log('AddTrackToPlaylist success:', response);
        this.isPlaylistModalOpen = false;
      },
      error: (error) => {
        console.error('AddTrackToPlaylist error:', error);
      }
    });
  }
  ngOnInit(): void {
    this.isPlaying = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.trackId = id ? +id : null;
      this.loadTrackData();
    });
    this.playlistService.GetPlaylistMenu().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        console.log('Playlists fetched successfully:', playlists);
      },
      error: (error) => {
        console.error('Error fetching playlists:', error);
      }
    });
    // Cập nhật isLiked khi component được khởi tạo
    this.updateLikeStatus();

    this.playerSub = this.playerService.currentTrack$.subscribe(track => {
      if (track && this.trackDetail && track.id === this.trackDetail.trackId) {
        const audio = document.getElementById('global-audio') as HTMLAudioElement;
        if (audio) {
          this.playerCurrentTime = audio.currentTime;
          this.playerDuration = audio.duration;
        }
      }
    });
    this.playerService.isPlaying$.subscribe(isPlaying => {
      this.playerIsPlaying = isPlaying;
    });
    setInterval(() => {
      const audio = document.getElementById('global-audio') as HTMLAudioElement;
      const currentTrack = this.playerService['currentTrackSubject']?.value;
      if (audio && this.trackDetail && currentTrack && currentTrack.id === this.trackDetail.trackId) {
        this.playerCurrentTime = audio.currentTime;
        this.playerDuration = audio.duration;
      }
    }, 500);
  }

  private updateLikeStatus() {
    if (this.trackId) {
      this.likeTrackService.IsLikeTrack(this.trackId).subscribe({
        next: (isLiked: boolean) => {
          this.isLiked = isLiked;
          this.updateLikeTrackCount();
          console.log('Track like status updated:', isLiked);
        },
        error: (error: any) => {
          console.error('Error checking like status:', error);
        }
      });
    }
  }

  updateLikeTrackCount() {
    if (this.trackId) {
      this.likeTrackService.GetLikeTrackCount(this.trackId).subscribe({
        next: (count: number) => {
          this.likeTrackCount = count;
          console.log('Track like count updated:', count);
        },
        error: (error: any) => {
          console.error('Error fetching like count:', error);
        }
      });
    }
  }

  loadTrackData() {
    if (this.trackId) {
      this.trackService.GetTrackDetail(this.trackId).subscribe({
        next: (data) => {
          this.trackDetail = data;
          if (this.trackDetail?.updateBy !== undefined) {
            this.artistService.GetArtistDetail(this.trackDetail.updateBy).subscribe({
              next: (artistData) => {
                this.artistDetail = artistData;
                // Gọi PlayerService để phát nhạc qua global player
                if (this.trackDetail && this.artistDetail) {
                  const playerTrack: PlayerTrack = {
                    id: this.trackDetail.trackId,
                    title: this.trackDetail.title,
                    artist: this.artistDetail.name,
                    audioFileUrl: this.trackDetail.audioFileUrl,
                    coverArtUrl: this.trackDetail.coverArtUrl
                  };
                  this.playerService.setTrack(playerTrack);
                }

                // Cập nhật trạng thái like sau khi load track data
                this.updateLikeStatus();

                this.trackService.GetAlbumByArtist(this.artistDetail.userId).subscribe({
                  next: (albums) => {
                    this.albums = albums;
                  },
                  error: (error) => {
                    console.error('Error fetching album list:', error);
                  }
                });
              },
              error: (error) => {
                console.error('Error fetching artist details:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error fetching track details:', error);
        }
      });
    } else {
      console.error('Track ID is not valid');
    }
  }

  ViewProfile(artistId: number) {
    this.router.navigate(['home/artist-profile', artistId]);
  }

  formatTime(time: number): string {
    if (!time || isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
 OpenTrack(trackId: number) {
    // Logic to open the track details, e.g., navigate to a track details page
    console.log('Opening track with ID:', trackId);

    this.router.navigate(['home/track-details', trackId]);
  }
  // Xóa các hàm điều khiển audio nội bộ (onPlay, onPause, seekAudio, togglePlayPause)

  onPrevTrack() {
    // TODO: Implement logic to go to previous track
    console.log('Previous track');
  }

  onNextTrack() {
    const nextTrackIndex = this.albums[0].id;
    console.log('Next track index:', nextTrackIndex);
   this.OpenTrack(nextTrackIndex);
  }

  playPause() {
    if (this.playerIsPlaying) {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }

  seek(event: any) {
    const value = parseFloat(event.target.value);
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = value;
      this.playerCurrentTime = value;
    }
  }
}
