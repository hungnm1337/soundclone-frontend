import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaylistService, PlaylistMenu, PlaylistCreateInput } from '../../../Services/Playlist/playlist.service';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  goToPlaylist(playlistId: number) {
    this.router.navigate(['/home/playlist', playlistId]);
  }
  goToLiked() {
      this.router.navigate(['/home/liked']);
  }
  goHome() {
    this.router.navigate(['/home']);
  }

  playlists: PlaylistMenu[] = [];

  constructor(
    private router: Router,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private fb: FormBuilder // Thêm FormBuilder
  ) {
    this.createPlaylistForm = this.fb.group({
      title: ['', Validators.required],
      isPublish: [false]
    });
  }
  ngOnInit() {
    this.playlistService.GetPlaylistMenu().subscribe(data => {
      this.playlists = data;
    });

    this.playlistService.playlistUpdated$.subscribe(() => {
      this.playlistService.GetPlaylistMenu().subscribe(data => {
        this.playlists = data;
      });
    });
  }
  createTrack() {
    this.router.navigate(['/home/createtrack']);
  }
  showCreatePlaylistPopup = false;
  createPlaylistForm: FormGroup;
  playlistImageFile: File | null = null;
  playlistImagePreview: string | null = null;
  newPlaylist: PlaylistCreateInput = {
    title: '',
    picturePlaylistUrl: undefined as any, // Sẽ gán khi chọn file
    isPublish: false
  };
  isCreatingPlaylist = false;
  createPlaylistError: string | null = null;
  createPlaylist() {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      // Reset all form data and variables before opening popup
      this.resetCreatePlaylistForm();
      this.showCreatePlaylistPopup = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  resetCreatePlaylistForm() {
    // Reset form to initial state
    this.createPlaylistForm.reset({
      title: '',
      isPublish: false
    });

    // Reset image-related variables
    this.playlistImageFile = null;
    this.playlistImagePreview = null;

    // Reset error message
    this.createPlaylistError = null;

    // Reset newPlaylist object
    this.newPlaylist = {
      title: '',
      picturePlaylistUrl: undefined as any,
      isPublish: false
    };
  }

  onPlaylistFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.createPlaylistError = 'Chỉ chấp nhận file ảnh .jpg hoặc .png';
        this.playlistImageFile = null;
        this.playlistImagePreview = null;
        return;
      }
      this.createPlaylistError = null;
      this.playlistImageFile = file;
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.playlistImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitCreatePlaylist() {
    if (this.createPlaylistForm.invalid || !this.playlistImageFile) {
      this.createPlaylistError = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }
    const playlistInput: PlaylistCreateInput = {
      title: this.createPlaylistForm.value.title,
      picturePlaylistUrl: this.playlistImageFile,
      isPublish: this.createPlaylistForm.value.isPublish
    };
    this.isCreatingPlaylist = true;
    this.createPlaylistError = null;
    this.playlistService.CreatePlaylist(playlistInput).subscribe({
      next: (playlist) => {
        this.isCreatingPlaylist = false;
        this.showCreatePlaylistPopup = false;
        // Reset form after successful creation
        this.resetCreatePlaylistForm();
        // Reload playlists
        this.playlistService.GetPlaylistMenu().subscribe(data => {
          this.playlists = data;
        });
      },
      error: (err) => {
        this.isCreatingPlaylist = false;
        this.createPlaylistError = 'Tạo playlist thất bại!';
      }
    });
  }

  closeCreatePlaylistPopup() {
    this.showCreatePlaylistPopup = false;
    // Reset form when closing popup to ensure clean state for next open
    this.resetCreatePlaylistForm();
  }

  removePlaylistImage() {
    this.playlistImageFile = null;
    this.playlistImagePreview = null;
  }

  showAllTracks = false;
  showAllArtists = false;
  showAllPlaylists = false;

  toggleTracks() {
    this.showAllTracks = !this.showAllTracks;
  }

  toggleArtists() {
    this.showAllArtists = !this.showAllArtists;
  }

  togglePlaylists() {
    this.showAllPlaylists = !this.showAllPlaylists;
  }
}
