import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, PlayerTrack } from '../../../Services/Player/player.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

const PLAYER_CURRENT_TIME_KEY = 'player_current_time';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnDestroy {
  currentTrack: PlayerTrack | null = null;
  isPlaying = false;
  private subs: Subscription[] = [];
  @ViewChild('audioEl') audioRef!: ElementRef<HTMLAudioElement>;
  private shouldAutoPlay = false;
  currentTime: number = 0;
  duration: number = 0;

  constructor(private playerService: PlayerService, private router: Router) {
    this.subs.push(
      this.playerService.currentTrack$.subscribe(track => {
        this.currentTrack = track;
        // Khi đổi track, loadedmetadata sẽ tự động gọi restoreCurrentTime
      })
    );
    this.subs.push(
      this.playerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
        if (isPlaying) {
          this.playAudio();
        } else {
          this.pauseAudio();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  playAudio() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.play();
  }

  pauseAudio() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.pause();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }

  onTimeUpdate() {
    const audio = this.audioRef?.nativeElement;
    if (audio && this.currentTrack) {
      this.currentTime = audio.currentTime;
      localStorage.setItem(PLAYER_CURRENT_TIME_KEY, audio.currentTime.toString());
    }
  }

  onLoadedMetadata() {
    const audio = this.audioRef?.nativeElement;
    if (audio && this.currentTrack) {
      this.duration = audio.duration;
      const saved = localStorage.getItem(PLAYER_CURRENT_TIME_KEY);
      if (saved) {
        audio.currentTime = parseFloat(saved);
        this.currentTime = audio.currentTime;
      } else {
        this.currentTime = 0;
      }
      // Nếu trạng thái là đang play thì play lại
      if (this.isPlaying) {
        audio.play();
      }
    }
  }

  onSeek(event: any) {
    const audio = this.audioRef?.nativeElement;
    const value = parseFloat(event.target.value);
    if (audio) {
      audio.currentTime = value;
      this.currentTime = value;
      localStorage.setItem(PLAYER_CURRENT_TIME_KEY, value.toString());
    }
  }

  get progressPercent(): number {
    return this.duration ? (this.currentTime / this.duration) * 100 : 0;
  }

  formatTime(time: number): string {
    if (!time || isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  closePlayer() {
    this.playerService.stop();
    this.currentTime = 0;
    this.duration = 0;
    localStorage.removeItem(PLAYER_CURRENT_TIME_KEY);
  }

  goToTrackDetail() {
    if (this.currentTrack) {
      this.router.navigate(['/home/track-details', this.currentTrack.id]);
    }
  }
}
