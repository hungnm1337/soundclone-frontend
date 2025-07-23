import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackService, TrackDetail,Album } from '../../../Services/TrackService/track.service';
import { ArtistService, ArtistDetailDTO } from '../../../Services/Artist/artist.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService, PlayerTrack } from '../../../Services/Player/player.service';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit {
onAddToPlaylist() {
throw new Error('Method not implemented.');
}
onLikeTrack() {
throw new Error('Method not implemented.');
}

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

  constructor(private route: ActivatedRoute, private trackService: TrackService, private artistService: ArtistService, private router: Router, private playerService: PlayerService) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.trackId = id ? +id : null;
      this.loadTrackData();
    });
  }
  ngOnInit(): void {
    this.isPlaying = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.trackId = id ? +id : null;
      this.loadTrackData();
    });
    // Subscribe trạng thái player toàn cục
    this.playerSub = this.playerService.currentTrack$.subscribe(track => {
      if (track && this.trackDetail && track.id === this.trackDetail.trackId) {
        // Lấy currentTime và duration từ audio element toàn cục
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
    // Lắng nghe sự kiện timeupdate để cập nhật tiến độ
    setInterval(() => {
      const audio = document.getElementById('global-audio') as HTMLAudioElement;
      const currentTrack = this.playerService['currentTrackSubject']?.value;
      if (audio && this.trackDetail && currentTrack && currentTrack.id === this.trackDetail.trackId) {
        this.playerCurrentTime = audio.currentTime;
        this.playerDuration = audio.duration;
      }
    }, 500);
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
