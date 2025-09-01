import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListTrackComponent } from "../../common.component/list-track/list-track.component";
import { ConfirmDialogComponent } from "../../common.component/confirm-dialog/confirm-dialog.component";
import { PlaylistService, PlaylistDetailDTO, UpdatePlaylistDTO, RemoveTrackFromPlaylistDTO } from '../../../Services/Playlist/playlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListDataService } from '../../../Services/ListData/list-data.service';
import { LikePlaylistService } from '../../../Services/LikePlaylist/like-playlist.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UploadService } from '../../../Services/UploadFile/upload.service';
import { PlaylistStateService } from '../../../Services/Playlist/playlist-state.service';
import { Subscription } from 'rxjs';
import { FooterComponent } from "../../common.component/footer/footer.component";
@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [ListTrackComponent, CommonModule, ReactiveFormsModule, ConfirmDialogComponent, FooterComponent],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss'
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {


  isLiked: boolean = false;
  playlistDetail: PlaylistDetailDTO | undefined;
  playlistId: number | null = null;
  trackInPlaylist : ListTrackDTO[] = [];
  likeCount:number = 0;
  isLikeLoading: boolean = false;
  isAuthor: boolean = false;
  modelUpdate: UpdatePlaylistDTO | null = null;
  // Edit playlist properties
  isEditPlaylistModalOpen: boolean = false;
  editPlaylistForm: FormGroup;
  playlistImageFile: File | null = null;
  playlistImagePreview: string | null = null;
  isEditingPlaylist: boolean = false;
  editPlaylistError: string | null = null;
  private subscription = new Subscription();

  ngOnInit(): void {
    // Removed the premature like status check - it will be called after playlistId is set

    // Subscribe to playlist updates
    this.subscription.add(
      this.playlistStateService.playlistUpdated$.subscribe(playlistId => {
        if (playlistId && this.playlistId === playlistId) {
          console.log('Playlist updated, refreshing data...');
          this.loadPlaylistData();
          this.loadTracksInPlaylist();
        }
      })
    );
  }

  constructor(private playlistService: PlaylistService
    , private route: ActivatedRoute
    , private router: Router
    , private listDataService: ListDataService
    , private likePlaylistService: LikePlaylistService,
    private authService: AuthService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private playlistStateService: PlaylistStateService
  ) {
    // Initialize edit playlist form
    this.editPlaylistForm = this.fb.group({
      title: ['', Validators.required],
      isPublish: [false]
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.playlistId = id ? +id : null;
      if (this.playlistId) {
        this.playlistService.GetPlaylistDetail(this.playlistId).subscribe(playlist => {
          this.playlistDetail = playlist;
          this.isAuthor = this.authService.getCurrentUserUserId() === playlist.artistId;
          this.listDataService.GetTracksByPlaylistId(this.playlistId!).subscribe(tracks => {
            this.trackInPlaylist = tracks;
          });
        });

        // Check like status and count after playlistId is available
        this.checkLikeStatus();
        this.updateLikeCount();
      } else {
        this.router.navigate(['/error']);
      }
    });
  }
  // Delete playlist properties
  isDeleteConfirmModalOpen: boolean = false;
  deleteConfirmMessage: string = '';

    // Track management properties
  isTrackListModalOpen: boolean = false;
  isRemovingTrack: boolean = false;
  removingTrackId: number | null = null;
  showRemoveSuccessMessage: boolean = false;

  openTrackListModal() {
    this.isTrackListModalOpen = true;
  }

  closeTrackListModal() {
    this.isTrackListModalOpen = false;
    this.showRemoveSuccessMessage = false;
  }

  removeTrackFromPlaylist(trackId: number) {
    if (!this.playlistId || !trackId) {
      console.error('Missing playlistId or trackId');
      return;
    }

    this.isRemovingTrack = true;
    this.removingTrackId = trackId;

    const removeModel: RemoveTrackFromPlaylistDTO = {
      playlistId: this.playlistId,
      trackId: trackId,
      userId: this.authService.getCurrentUserUserId() || 0
    };

    this.playlistService.RemoveTrackOfPlaylist(removeModel).subscribe({
      next: (response) => {
        console.log('Track removed successfully:', response);

        // Thông báo playlist đã được cập nhật
        this.playlistStateService.notifyPlaylistUpdated(this.playlistId!);

        // Refresh danh sách track và playlist data
        this.loadTracksInPlaylist();
        this.loadPlaylistData();

        this.isRemovingTrack = false;
        this.removingTrackId = null;

        // Hiển thị thông báo thành công
        this.showRemoveSuccessMessage = true;
        setTimeout(() => {
          this.showRemoveSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error removing track:', error);
        this.isRemovingTrack = false;
        this.removingTrackId = null;
      }
    });
  }
  deletePlaylist() {
    if (this.playlistId) {
      this.deleteConfirmMessage = `Are you sure you want to delete "${this.playlistDetail?.title}"? This action cannot be undone.`;
      this.isDeleteConfirmModalOpen = true;
    }
  }

  confirmDeletePlaylist() {
    if (this.playlistId) {
      this.playlistService.deletePlaylist(this.playlistId).subscribe({
        next: (success) => {
          if (success) {
            // Thông báo cho component khác biết playlist đã bị xóa
            this.playlistStateService.notifyPlaylistDeleted(this.playlistId!);
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Error deleting playlist:', error);
        }
      });
      this.closeDeleteConfirmModal();
    }
  }

  closeDeleteConfirmModal() {
    this.isDeleteConfirmModalOpen = false;
  }

  checkLikeStatus() {
    if (this.playlistId) {
      this.likePlaylistService.IsLikePlaylist(this.playlistId).subscribe({
        next: (isLiked) => {
          this.isLiked = isLiked;
        },
        error: (error) => {
          console.error('Error checking like status:', error);
          this.isLiked = false;
        }
      });
    }
  }

  toggleLike() {
    if (this.playlistId && !this.isLikeLoading) {
      this.isLikeLoading = true;

      this.likePlaylistService.ToggleUserLikePlaylistStatus(this.playlistId).subscribe({
        next: (success) => {
          if (success) {
            this.isLiked = !this.isLiked;
            this.updateLikeCount();
          }
          this.isLikeLoading = false;
        },
        error: (error) => {
          console.error('Error toggling like:', error);
          this.isLikeLoading = false;
        }
      });
    }
  }

  updateLikeCount() {
    if (this.playlistId) {
      this.likePlaylistService.GetLikePlaylistCount(this.playlistId).subscribe({
        next: (count: number) => {
          this.likeCount = count;
        },
        error: (error: any) => {
          console.error('Error updating like count:', error);
        }
      });
    }
  }

  // Edit Playlist Methods
  EditPlaylist() {
    if (!this.isAuthor) {
      console.log('User is not the author of this playlist');
      return;
    }

    // Populate form with current playlist data
    this.editPlaylistForm.patchValue({
      title: this.playlistDetail?.title || '',
      isPublish: this.playlistDetail?.isPublish || false
    });

    // Set current image preview
    this.playlistImagePreview = this.playlistDetail?.picturePlaylistUrl || null;
    this.playlistImageFile = null;
    this.editPlaylistError = null;

    // Open edit modal
    this.isEditPlaylistModalOpen = true;
  }

  onEditPlaylistFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.editPlaylistError = 'Chỉ chấp nhận file ảnh .jpg hoặc .png';
        this.playlistImageFile = null;
        this.playlistImagePreview = null;
        return;
      }
      this.editPlaylistError = null;
      this.playlistImageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.playlistImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditPlaylistImage() {
    this.playlistImageFile = null;
    this.playlistImagePreview = this.playlistDetail?.picturePlaylistUrl || null;
  }

    submitEditPlaylist() {
    if (this.editPlaylistForm.invalid) {
      this.editPlaylistError = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }

    if (!this.playlistId) {
      this.editPlaylistError = 'Không tìm thấy playlist ID.';
      return;
    }

    this.isEditingPlaylist = true;
    this.editPlaylistError = null;

    // Xử lý ảnh trước: nếu có ảnh mới thì upload lên server
    if (this.playlistImageFile) {
      console.log('🔄 Uploading new image file...');

      // Upload ảnh mới lên server
      this.uploadService.uploadFile(this.playlistImageFile).subscribe({
        next: (response: any) => {
          console.log('✅ Image uploaded successfully!');
          console.log('📸 Upload response:', response);

          // Lấy URL ảnh từ response
          const newImageUrl = response.url || response.imageUrl || response.picturePlaylistUrl;
          console.log('🖼️ New image URL from server:', newImageUrl);

          // Tiếp tục với việc update playlist
          this.updatePlaylistWithImage(newImageUrl);
        },
        error: (error: any) => {
          console.error('❌ Error uploading image:', error);
          this.editPlaylistError = 'Upload ảnh thất bại! Vui lòng thử lại.';
          this.isEditingPlaylist = false;
        }
      });
    } else {
      // Không có ảnh mới, giữ nguyên ảnh cũ
      console.log('📋 No new image selected, keeping existing image');
      const currentImageUrl = this.playlistDetail?.picturePlaylistUrl;
      console.log('🖼️ Current image URL:', currentImageUrl);

      // Tiếp tục với việc update playlist (không thay đổi ảnh)
      this.updatePlaylistWithImage(currentImageUrl || null);
    }
  }

  private updatePlaylistWithImage(imageUrl: string | null) {
    // Tạo modelUpdate từ dữ liệu form
    this.modelUpdate = {
      playlistId: this.playlistId || 0,
      userId: this.authService.getCurrentUserUserId() || 0,
      title: this.editPlaylistForm.value.title,
      isPublish: this.editPlaylistForm.value.isPublish,
      picturePlaylistUrl: imageUrl || this.playlistDetail?.picturePlaylistUrl || ''
    };

    // In ra console modelUpdate
    console.log('modelUpdate:', this.modelUpdate);

    this.playlistService.UpdatePlaylist(this.modelUpdate).subscribe({
      next: (response: any) => {
        this.isEditingPlaylist = false;
        this.isEditPlaylistModalOpen = false;
        // Thông báo cho component khác biết playlist đã được cập nhật
        this.playlistStateService.notifyPlaylistUpdated(this.playlistId!);
        this.loadPlaylistData();
      },
      error: (error: any) => {
        this.editPlaylistError = 'Cập nhật playlist thất bại!';
        this.isEditingPlaylist = false;
      }
    });

    // For now, just close the modal
    this.isEditingPlaylist = false;
    this.isEditPlaylistModalOpen = false;
  }

  closeEditPlaylistModal() {
    this.isEditPlaylistModalOpen = false;
    this.playlistImageFile = null;
    this.playlistImagePreview = null;
    this.editPlaylistError = null;
  }

  private loadPlaylistData() {
    if (this.playlistId) {
      this.playlistService.GetPlaylistDetail(this.playlistId).subscribe(playlist => {
        this.playlistDetail = playlist;
        this.isAuthor = this.authService.getCurrentUserUserId() === playlist.artistId;
      });
    }
  }

  private loadTracksInPlaylist() {
    if (this.playlistId) {
      this.listDataService.GetTracksByPlaylistId(this.playlistId).subscribe(tracks => {
        this.trackInPlaylist = tracks;
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
