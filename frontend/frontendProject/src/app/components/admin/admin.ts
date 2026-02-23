import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Video, Video1 } from '../../services/video';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  name = signal<string>('');
  videos = signal<Video1[]>([]);
  isLoading = signal(true)
  constructor(private authService: Auth, private videoService: Video, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.loadVideos();
  }
  loadVideos() {
    this.videoService.getPendingVideos().subscribe({
      next: (data) => {
        this.videos.set(data);
        this.isLoading.update(()=>false);
      },
      error: (err) => {
        console.error('error in videos', err);
        this.isLoading.update(()=>false);
      }
    })
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
  approveVideo(id: number) {
    this.videoService.approveVideo(id).subscribe({
      next: () => {
        this.videos.update(prev => prev.filter(v => v.id !== id));
      }
    })
  }
  rejectVideo(id: number) {
    this.videoService.rejectVideo(id).subscribe({
      next: () => {
        this.videos.update(prev => prev.filter(v => v.id !== id));
      }
    })
  }
}
