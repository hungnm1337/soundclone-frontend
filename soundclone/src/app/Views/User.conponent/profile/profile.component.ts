import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileServiceService, UserProfile, UserInformation } from '../../../Services/profile/profile-service.service';
import { UploadService } from '../../../Services/UploadFile/upload.service';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Thêm FormsModule vào đây
  templateUrl: './profile.component.html',
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userProfile: UserProfile | null = null;
  showImageUpload = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  uploadError: string | null = null;
  isUploading = false;
  userInfoEdit: UserInformation | null = null;
  showUserInfoEditPopup = false;
  isSavingUserInfo = false;
  userInfoEditError: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private profileService: ProfileServiceService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserProfile() {
    const subscription = this.profileService.GetProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
        console.log('User Profile:', this.userProfile);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
    this.subscriptions.push(subscription);
  }

  openImageUpload() {
    this.showImageUpload = true;
    this.selectedImage = null;
    this.selectedFile = null;
    this.uploadError = null;
  }

  closeImageUpload() {
    this.showImageUpload = false;
    this.selectedImage = null;
    this.selectedFile = null;
    this.uploadError = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFileSelection(file);
    }
  }

  private handleFileSelection(file: File) {
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please select a valid image file.';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 5MB.';
      return;
    }

    this.uploadError = null;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async uploadImage() {
    if (!this.selectedFile || !this.userProfile) {
      return;
    }

    this.isUploading = true;
    this.uploadError = null;

    try {
      const response = await firstValueFrom(this.uploadService.uploadFile(this.selectedFile));

      if (response && response.url) {
        this.userProfile.profilePictureUrl = response.url;
        console.log('Image uploaded successfully:', response.url);
        this.profileService.changeProfilePicture(response.url).subscribe(
          () => {
            console.log('Profile picture updated successfully');
          },
          (error) => {
            console.error('Error updating profile picture:', error);
          }
        );
        this.closeImageUpload();
      } else {
        this.uploadError = 'Upload failed. Please try again.';
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.uploadError = 'Upload failed. Please try again.';
    } finally {
      this.isUploading = false;
    }
  }

  getAccountAge(createDate: string | undefined): string {
    if (!createDate) return 'N/A';

    const created = new Date(createDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  getProfileCompletion(): number {
    if (!this.userProfile) return 0;

    const fields = [
      this.userProfile.name,
      this.userProfile.email,
      this.userProfile.username,
      this.userProfile.phoneNumber,
      this.userProfile.dayOfBirth,
      this.userProfile.bio,
      this.userProfile.profilePictureUrl
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }

  ChangeUserInfor() {
    if (!this.userProfile) return;
    // Pre-fill the form with current userProfile data
    this.userInfoEdit = {
      userId: this.userProfile.userId,
      name: this.userProfile.name,
      email: this.userProfile.email,
      dayOfBirth: this.userProfile.dayOfBirth,
      phoneNumber: this.userProfile.phoneNumber,
      bio: this.userProfile.bio || ''
    };
    this.showUserInfoEditPopup = true;
    this.userInfoEditError = null;
  }

  closeUserInfoEditPopup() {
    this.showUserInfoEditPopup = false;
    this.userInfoEdit = null;
    this.userInfoEditError = null;
  }

  onUserInfoEditChange(field: keyof UserInformation, event: Event) {
    if (this.userInfoEdit) {
      const input = event.target as HTMLInputElement | HTMLTextAreaElement;
      (this.userInfoEdit as any)[field] = input.value;
    }
  }

  async saveUserInfoEdit() {
    if (!this.userInfoEdit) return;
    this.isSavingUserInfo = true;
    this.userInfoEditError = null;

    try {
      console.log('Sending to API:', this.userInfoEdit); // Log dữ liệu gửi lên
      const success = await firstValueFrom(this.profileService.updateUserInformation(this.userInfoEdit));
      console.log('API updateUserInformation response:', success); // Log response trả về

      if (success) {
        // Refresh profile data only if update was successful
        const subscription = this.profileService.GetProfile().subscribe(
          (profile) => {
            this.userProfile = profile;
            this.closeUserInfoEditPopup();
          },
          (error) => {
            console.error('Error reloading profile:', error);
            this.userInfoEditError = 'Failed to reload user profile.';
            this.closeUserInfoEditPopup();
          }
        );
        this.subscriptions.push(subscription);
      } else {
        this.userInfoEditError = 'Failed to update user information.';
        console.error('API updateUserInformation returned false'); // Log khi API trả về false
      }
    } catch (error: any) {
      console.error('Error updating user info:', error);
      this.userInfoEditError = 'Failed to update user information.';
    } finally {
      this.isSavingUserInfo = false;
    }
  }
}
