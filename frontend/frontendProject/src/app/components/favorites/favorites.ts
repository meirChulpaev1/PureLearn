import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video1, Video } from '../../services/video'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  videos = signal<any>([]);
  isLoading = signal(true)
  constructor(private authService: Auth, private videoService: Video, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
       this.videoService.getMyFavorites().subscribe({
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
  unLikeVideo(video: Video1) {
    this.videoService.removeFavorite(video.id).subscribe({
      next: () => {
       this.videos.update(prev => prev.filter((v:any) => v.video.id !== video.id));
      }
    });
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

}

