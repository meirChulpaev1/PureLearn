import { Component, OnInit } from '@angular/core';
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
  videos: Video1[] = [];
  isLoading = true;
  name = ''
  constructor(private authService: Auth, private videoService: Video, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.name = `hello ${data.username}`
      }
    })
    this.videoService.getMyFavorites().subscribe({
      next: (data) => {
        this.videos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('error in videos', err);
        this.isLoading = false;
      }
    })
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

}

