import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackService, CreateTrackInput } from '../../../Services/TrackService/track.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-track',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-track.component.html'
})
export class CreateTrackComponent implements OnInit {
  constructor(private toastr: ToastrService, private router: Router, private authService: AuthService, private trackService: TrackService) {}
  private fb = inject(NonNullableFormBuilder);
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    isPublic: [false]
  });

  formStatus = signal(this.form.status);

  audioFile = signal<File | null>(null);
  coverArt = signal<File | null>(null);
  durationInSeconds = signal<number | null>(null);
  submitting = signal(false);

  // New: Preview for CoverArt
  coverArtPreview = signal<string | null>(null);

  audioFileError = signal('');
  coverArtError = signal('');

  canSubmit = computed(() => {
    return this.formStatus() === 'VALID' &&
      !!this.audioFile() &&
      !!this.coverArt() &&
      !!this.durationInSeconds() &&
      !this.audioFileError() &&
      !this.coverArtError();
  });

  ngOnInit() {
    if(!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.form.statusChanges.subscribe(status => {
      this.formStatus.set(status);
    });
  }
  removeAudioFile() {
    this.audioFile.set(null);
    this.durationInSeconds.set(null);
    this.audioFileError.set('');
  }

  onAudioFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    const allowed = ['audio/mp3', 'audio/mpeg', 'audio/x-m4a', 'audio/m4a'];

    if (file && allowed.includes(file.type)) {
      this.audioFile.set(file);
      this.audioFileError.set('');
      this.getAudioDuration(file);
    } else {
      this.audioFile.set(null);
      this.durationInSeconds.set(null);
      this.audioFileError.set('Chỉ chấp nhận định dạng .mp3 hoặc .m4a');
    }
  }

  onCoverArtSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    const allowed = ['image/png', 'image/jpeg'];

    if (file && allowed.includes(file.type)) {
      this.coverArt.set(file);
      this.coverArtError.set('');
      const previewUrl = URL.createObjectURL(file);
      this.coverArtPreview.set(previewUrl);
    } else {
      this.coverArt.set(null);
      this.coverArtPreview.set(null);
      this.coverArtError.set('Chỉ chấp nhận file .png hoặc .jpg');
    }
  }

  getAudioDuration(file: File) {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      this.durationInSeconds.set(Math.round(audio.duration));
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      this.durationInSeconds.set(null);
      this.audioFileError.set('Không thể đọc thời lượng từ file.');
    };
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    this.submitting.set(true);
    const formValue = this.form.getRawValue();

    const input: CreateTrackInput = {
      Title: formValue.title,
      Description: formValue.description || 'A special track',
      IsPublic: formValue.isPublic,
      AudioFile: this.audioFile()!,
      CoverArt: this.coverArt()!,
      DurationInSeconds: this.durationInSeconds()!,
      UpdateBy: 0 // server sẽ set từ AuthService
    };

    this.trackService.createTrack(input).subscribe({
      next: (res) => {
        alert('Track created thành công!');
        this.toastr.success('Track created successfully!');
        this.form.reset();
        this.audioFile.set(null);
        this.coverArt.set(null);
        this.durationInSeconds.set(null);
        this.coverArtPreview.set(null);
        this.submitting.set(false);
      },
      error: () => {
        alert('Tạo track thất bại');
        this.toastr.error('Failed to create track.');
        this.submitting.set(false);
      }
    });
  }
}
