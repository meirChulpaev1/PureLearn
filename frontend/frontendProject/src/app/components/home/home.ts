import { Component, OnInit } from '@angular/core';
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
  videos: Video1[] = [];
  myvideos: Video1[] =[];
  isLoading = true;
  name = ''
  constructor(public authService: Auth,private videoService: Video,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.name=`hello ${data.username}`
      }
    })
    this.videoService.getMyVideos().subscribe({
      next: (data) => {
        this.myvideos = data;
      },
      error: (err) => {
        console.error('error in videos', err);
      }
    })
    this.videoService.getVideos().subscribe({
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
  likeVideo(video: Video1) {
    this.videoService.addFavorite(video.id).subscribe({
      next: () => {
        video.is_favorite = true;
        alert('added to your Favorite!');
      }
    });
  }
  getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

}
