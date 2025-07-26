import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileServiceService, UserProfile } from '../../../Services/profile/profile-service.service';
import { UploadService } from '../../../Services/UploadFile/upload.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  providers: [DatePipe]
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userProfile: UserProfile | null = null;
  showImageUpload = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  uploadError: string | null = null;
  isUploading = false;

  constructor(
    private profileService: ProfileServiceService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.profileService.GetProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
        console.log('User Profile:', this.userProfile);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  // Popup Management
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

  // File Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  // Drag and Drop
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

  // File Validation and Preview
  private handleFileSelection(file: File) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please select a valid image file.';
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 5MB.';
      return;
    }

    this.uploadError = null;
    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

    // Upload Image
  async uploadImage() {
    if (!this.selectedFile || !this.userProfile) {
      return;
    }

    this.isUploading = true;
    this.uploadError = null;

    try {
      const response = await this.uploadService.uploadFile(this.selectedFile).toPromise();

      if (response && response.url) {
        // Update profile with new image URL
        this.userProfile.profilePictureUrl = response.url;

        // Here you would typically call your profile update service
        // await this.profileService.updateProfile(this.userProfile).toPromise();

        console.log('Image uploaded successfully:', response.url);
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
}
