import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  urlApiTest=''
  categories = [
    {value: 'MATH', label: 'Mathematics'},{value: 'SCIENCE', label: 'Science'},
    {value: 'HISTORY', label: 'History'},{value: 'LANGUAGES', label: 'Languages'},
    {value: 'COMPUTERS', label: 'Computers'},{value: 'OTHER', label: 'Other'}
  ];
  constructor(private videoService: Video, private router: Router) { }
  postVideo() {
    this.videoService.addVideo(this.video.title, this.video.url, this.video.category).subscribe({
      next: () => {
        this.router.navigate(['/my-videos']);
      },
      error: () => alert('error')

    })
  }
  checkApi(){
    
  }
}
