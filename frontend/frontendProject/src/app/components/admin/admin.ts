import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
  category: any = signal('')
  categoryCache = signal<{ [url: string]: string }>({});
  constructor(private videoService: Video, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.loadVideos();
  }
  loadVideos() {
    this.videoService.getPendingVideos().subscribe({
      next: (data) => {
        this.videos.set(data);
        this.isLoading.update(() => false);

        data.forEach((video:Video1) => {
          this.fetchCategory(video.url);
        });
      },
      error: (err) => {
        console.error('error in videos', err);
        this.isLoading.update(() => false);
      }
    })
  }
  fetchCategory(url: string) {
  if (this.categoryCache()[url]) return;

  this.videoService.get_video_category(url).subscribe({
    next: (res) => {
      this.categoryCache.update(cache => ({
        ...cache,
        [url]: YOUTUBE_CATEGORIES[res.number] || 'Other Category'
      }));
    }
  });
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
const YOUTUBE_CATEGORIES: { [key: number]: string } = {
  1: 'Film & Animation',
  2: 'Autos & Vehicles',
  10: 'Music',
  15: 'Pets & Animals',
  17: 'Sports',
  20: 'Gaming',
  22: 'People & Blogs',
  23: 'Comedy',
  24: 'Entertainment',
  25: 'News & Politics',
  26: 'Howto & Style',
  27: 'Education',
  28: 'Science & Technology',
};