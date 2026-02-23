import { Component, OnInit, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video1, Video } from '../../services/video'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  videos = signal<Video1[]>([]);
  myFavoritesVideos: any[] = [];
  isLoading = signal(true)
  name = signal('');//-------------------------------------
  constructor(public authService: Auth, private videoService: Video, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadVideosToNotConnected() ;
    this.loadUser();
    this.loadVideosAndFavorites();
  }
  loadUser() {
    this.authService.getCurrentUser().subscribe({
      next: (data) => this.name.set(`hello ${data.username}`)
    })
  }

  loadVideosAndFavorites() {

    this.videoService.getVideos().subscribe({
      next: (videoData) => {
        this.videoService.getMyFavorites().subscribe({
          next: (favData) => {
            const favoritesIds = favData.map((f: any) => f.video.id);
            const mergedVideos = videoData.map(v => ({ ...v, is_favorite: favoritesIds.includes(v.id) }));
            this.videos.set(mergedVideos);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }
  loadVideosToNotConnected() {
    this.videoService.getVideos().subscribe({
      next: (videoData) => {
        this.videos.set(videoData);
        this.isLoading.set(false);
      }
    })
  }

  likeVideo(video: Video1) {
    this.videoService.addFavorite(video.id).subscribe({
      next: () => {
        this.videos.update(items =>
          items.map(v => v.id === video.id ? { ...v, is_favorite: true } : v))
      }
    });
  }
  unLikeVideo(video: Video1) {
    this.videoService.removeFavorite(video.id).subscribe({
      next: () => {
        this.videos.update(items =>
          items.map(v => v.id === video.id ? { ...v, is_favorite: false } : v)
        );
      }
    });
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

}
