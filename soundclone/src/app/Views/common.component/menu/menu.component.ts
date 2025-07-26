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
      this.showCreatePlaylistPopup = true;
      this.newPlaylist = { title: '', picturePlaylistUrl: undefined as any, isPublish: false };
      this.createPlaylistError = null;
    } else {
      this.router.navigate(['/login']);
    }
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
    this.playlistImageFile = null;
    this.playlistImagePreview = null;
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
