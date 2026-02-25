import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video1, Video } from '../../services/video'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-videos.html',
  styleUrl: './my-videos.scss',
})
export class MyVideos implements OnInit {

  videos = signal<Video1[]>([]);
  isLoading = signal(true)

  constructor(private videoService: Video, private sanitizer: DomSanitizer, private router: Router) { }
  ngOnInit(): void {
   
    this.loadVideos();
  }
  loadVideos() {
    this.videoService.getMyVideos().subscribe({
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
  delVideo(id: number) {
    this.videoService.deleteVideo(id).subscribe({
      next: () => {
        this.videos.update(prev => prev.filter(v => v.id !== id));
      },
      error: (error) => { alert(error) }
    })
  }

  toAddVideo() {
    this.router.navigate(['/add-video']);
  }

}

