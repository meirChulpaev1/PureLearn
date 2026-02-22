import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Video1 {
  id: number;
  title: string;
  url: string;
  category_display: string;
  uploader: string;
  is_favorite: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class Video {
  private apiUrl = 'http://127.0.0.1:8000/api/videos/';

  constructor(private http: HttpClient) { }

  getVideos(): Observable<Video1[]> {
    return this.http.get<Video1[]>(this.apiUrl + 'get-videos/');
  }
  addVideo(data:any): Observable<any>{
    return this.http.post(this.apiUrl + 'post/', data);
  }  
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + `delete/${id}/`);
  }
  getMyVideos(): Observable<any> {
    return this.http.get(this.apiUrl + 'my-videos/');
  }

  //-------------------------

  getPendingVideos(): Observable<any> {
    return this.http.get(this.apiUrl + 'pending-videos/');
  }
  approveVideo(id: number): Observable<any> {
    return this.http.post(this.apiUrl + `approve/${id}/`, {});
  }
  rejectVideo(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + `reject/${id}/`,);
  }
  //--------------------------------  
  addFavorite(videoId: number): Observable<any> {
    return this.http.post(this.apiUrl + `add-favorites/${videoId}/`, {});
  }
  removeFavorite(videoId: number): Observable<any> {
    return this.http.delete(this.apiUrl + `remove-favorites/${videoId}/`);
  }

  getMyFavorites(): Observable<any> {
    return this.http.get(this.apiUrl + 'my-favorites/');
  }


}
