import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})

export class Register {
  user = { username: '', email: '', password: '' };
  errorMessage = signal<string | null>(null);
  constructor(private authService: Auth, private router: Router) { }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onRegister() {
    this.errorMessage.set(null);
    if (!this.user.username || !this.user.password) {
      this.errorMessage.set('Please enter a username and password.');
      return;
    }
    if (!this.isValidEmail(this.user.email)) {
      this.errorMessage.set('The email address is invalid.');
      return;
    }
    this.authService.register(this.user.username, this.user.password, this.user.email).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.loadUser();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set('');
      }
    });
  }
}
