import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  user = { username: '', password: '' };
  errorMessage = signal<string | null>(null);
  constructor(private authService: Auth, private router: Router) {}
  onLogin() {
    this.errorMessage.set(null);
    if (!this.user.username || !this.user.password) {
      this.errorMessage.set('Please enter a username and password.');
      return;
    }
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.loadUser();
        // this.authService.isAdmin()
        this.router.navigate(['/']);
      },
      error: (err) => {
          this.errorMessage.set("error password or name is incorrect. ");
      }
    });
  }
}
