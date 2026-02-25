import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Video } from '../../services/video';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-videos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-videos.html',
  styleUrl: './add-videos.scss',
})
export class AddVideos {
  video = { title: "", url: "", category: "" }
  urlApiTest = ''
  isGood: any = signal('')
  errorMessage = signal<string | null>(null);
  categories = [
    { value: 'MATH', label: 'Mathematics' }, { value: 'SCIENCE', label: 'Science' },
    { value: 'HISTORY', label: 'History' }, { value: 'LANGUAGES', label: 'Languages' },
    { value: 'COMPUTERS', label: 'Computers' }, { value: 'OTHER', label: 'Other' }
  ];
  constructor(private videoService: Video, private router: Router) { }

  postVideo() {
    this.errorMessage.set(null);
    if (!this.video.title || !this.video.url || !this.video.category) {
      this.errorMessage.set('The field/s cannot be left empty.');
      return;
    }
    this.videoService.addVideo(this.video.title, this.video.url, this.video.category).subscribe({
      next: () => {
        this.router.navigate(['/my-videos']);
      },
      error: () => alert('error')

    })
  }
  checkApi() {
    this.videoService.get_video_category(this.urlApiTest).subscribe({
      next: (data) => {
        if (data.is_educational)
          this.isGood.set(true);
        else
          this.isGood.set(false);
      }
    })
    this.urlApiTest = ""

  }
}
