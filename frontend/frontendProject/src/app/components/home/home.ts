import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Video1, Video } from '../../services/video'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  videos = signal<Video1[]>([]);
  searchQuery = signal('');
  myFavoritesVideos: any[] = [];
  isLoading = signal(true)
  filteredVideos = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allVideos = this.videos();
    if (!query) return allVideos;
    return allVideos.filter(item =>
      item.title.toLowerCase().includes(query)
    );
  })

  constructor(public authService: Auth, private videoService: Video, private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.loadVideosToNotConnected();
    }
    this.loadVideosAndFavorites();
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
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
  del(id: number) {
    this.videoService.deleteVideo(id).subscribe({
      next: () => {
        this.videos.update(prev => prev.filter(v => v.id !== id));
      },
      error: (error) => { alert(error) }
    })
  }
  addVideo() {
    this.router.navigate(['/add-video']);
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }


}
