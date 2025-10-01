import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../Services/TrackService/track.service';
import { ArtistService } from '../../../Services/Artist/artist.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService, PlayerTrack } from '../../../Services/Player/player.service';
import { LikeTrackService } from '../../../Services/LikeTrack/like-track.service';
import { PlaylistService } from '../../../Services/Playlist/playlist.service';
import { AuthService } from '../../../Services/auth.service';
import { PlaylistStateService } from '../../../Services/Playlist/playlist-state.service';
import { FooterComponent } from "../../common.component/footer/footer.component";
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '../../../Services/Comment/comment.service';
import { ArtistDetailDTO } from '../../../interfaces/artist.interface';
import { CommentDTO } from '../../../interfaces/comment.interface';
import { PlaylistMenu, AddTrackToPlaylist } from '../../../interfaces/playlist.interface';
import { Album, TrackDetail } from '../../../interfaces/track.interface';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, FooterComponent, FormsModule],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit, OnDestroy {
  public showAllComments: boolean = false;

  showComments() {
    this.commentService.getCommentsByTrackId(this.trackId!).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.showAllComments = !this.showAllComments;
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      }
    });
    this.showAllComments = !this.showAllComments;
  }

  onAddToPlaylist() {
    this.playlistService.GetPlaylistMenu().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        this.isPlaylistModalOpen = true;
        console.log('Add to playlist clicked');
      },
      error: (error) => {
        console.error('Error fetching playlists:', error);
      }
    });
  }

  private refreshPlaylists() {
    this.playlistService.GetPlaylistMenu().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        console.log('Playlists refreshed after update');
      },
      error: (error) => {
        console.error('Error refreshing playlists:', error);
      }
    });
  }

  onLikeTrack() {
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    if (this.trackId) {
      this.likeTrackService.ToggleUserLikeTrackStatus(this.trackId).subscribe({
        next: (isLiked: boolean) => {
          this.isLiked = !this.isLiked;
          console.log('Like track response:', isLiked);
          this.updateLikeTrackCount();
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
  public comments: CommentDTO[] = [];
  public newCommentContent: string = '';
  public currentDisplayComment: CommentDTO | null = null;
  public currentCommentIndex: number = 0;
  private commentDisplayInterval: any;

  constructor(private route: ActivatedRoute,
    private commentService: CommentService,
    private toastr: ToastrService,
    private trackService: TrackService,
    private artistService: ArtistService,
    private router: Router,
    private playerService: PlayerService,
    private likeTrackService: LikeTrackService,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private playlistStateService: PlaylistStateService
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
        this.playlistStateService.notifyPlaylistUpdated(playlistId);
        this.toastr.success('Track added to playlist successfully!');
        console.log(`Track đã được thêm vào playlist thành công!`);
      },
      error: (error) => {
        this.toastr.error('Error adding track to playlist.');
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
      this.loadComments(this.trackId);
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
    // Cập nhật like count (luôn gọi dù có đăng nhập hay không)
    this.updateLikeTrackCount();
    // Chỉ cập nhật like status khi user đã đăng nhập
    if (this.authService.isLoggedIn()) {
      this.updateLikeStatus();
    } else {
      this.isLiked = false; // Set mặc định false cho user chưa đăng nhập
    }
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

    // Subscribe to playlist updates
    this.playlistStateService.playlistUpdated$.subscribe(playlistId => {
      if (playlistId) {
        console.log('Playlist updated, refreshing playlists in track detail...');
        this.refreshPlaylists();
      }
    });
  }

  private loadComments(trackId: number | null) {
    if (!trackId) return;

    // Clear comment display interval cũ trước
    this.stopCommentDisplay();

    this.commentService.getCommentsByTrackId(trackId).subscribe({
      next: (data) => {
        this.comments = data;
        this.startCommentDisplay();
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  private startCommentDisplay() {
    if (this.comments.length === 0) return;

    this.currentCommentIndex = 0;
    this.currentDisplayComment = this.comments[0];

    this.commentDisplayInterval = setInterval(() => {
      this.currentCommentIndex++;
      if (this.currentCommentIndex >= this.comments.length) {
        this.currentCommentIndex = 0;
      }
      this.currentDisplayComment = this.comments[this.currentCommentIndex];
    }, 3000);
  }

  private stopCommentDisplay() {
    this.currentCommentIndex = 0;
    this.currentDisplayComment = null;
    if (this.commentDisplayInterval) {
      clearInterval(this.commentDisplayInterval);
      this.commentDisplayInterval = null;
    }
  }

  private updateLikeStatus() {
    // Chỉ gọi API khi user đã đăng nhập
    if (!this.authService.isLoggedIn()) {
      this.isLiked = false;
      console.log('User not logged in, setting like status to false');
      return;
    }

    if (this.trackId) {
      this.likeTrackService.IsLikeTrack(this.trackId).subscribe({
        next: (isLiked: boolean) => {
          this.isLiked = isLiked;
          this.updateLikeTrackCount(); // Cập nhật lại số lượng like sau khi biết trạng thái like
          console.log('Track like status updated:', isLiked);
        },
        error: (error: any) => {
          console.error('Error checking like status:', error);
          this.isLiked = false; // Set default value on error
        }
      });
    }
  }

  updateLikeTrackCount() {
    // Luôn gọi API để lấy số lượng like (dù có đăng nhập hay không)
    if (this.trackId) {
      this.likeTrackService.GetLikeTrackCount(this.trackId).subscribe({
        next: (count: number) => {
          this.likeTrackCount = count;
          console.log('Track like count updated:', count);
        },
        error: (error: any) => {
          console.error('Error fetching like count:', error);
          this.likeTrackCount = 0; // Set default value on error
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
    this.router.navigate(['home/track-details', trackId]);
  }

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

  onCommentKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.newCommentContent.trim()) {
      this.createComment();
    }
  }

  createComment() {
    if (!this.newCommentContent.trim() || !this.trackId) {
      return;
    }

    const commentDTO: CommentDTO = {
      commentId: 0, // Sẽ được set bởi backend
      writeBy: this.authService.getCurrentUserUserId()!,
      writeDate: new Date().toISOString(),
      trackId: this.trackId,
      parentCommentId: null,
      content: this.newCommentContent.trim()
    };

    this.commentService.addComment(commentDTO).subscribe({
      next: (newComment) => {
        this.comments.push(newComment);
        this.toastr.success('Comment added successfully!');
        // Restart comment display với comment mới
        this.stopCommentDisplay();
        this.startCommentDisplay();
      },
      error: (error) => {
        this.toastr.error('Error adding comment.');
        console.error('Error adding comment:', error);
      }
    });

    console.log('CommentDTO created:', commentDTO);

    // Clear input after creating comment
    this.newCommentContent = '';
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
    this.stopCommentDisplay();
  }
}
