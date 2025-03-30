import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  apiLoginObj: any = {
    username: '',
    password: '',
  };

  router = inject(Router);
  http = inject(HttpClient);

  onLogin() {
    // Add validation
    if (!this.apiLoginObj.username || !this.apiLoginObj.password) {
      alert('Please enter both username and password');
      return;
    }

    this.http
      .post<any>('http://192.168.0.229:8000/api/login/', this.apiLoginObj)
      .subscribe({
        next: (res) => {
          if (res.status === 'success' && res.token) {
            // Store both token and userID
            localStorage.setItem('token', res.token);
            localStorage.setItem('userID', res.userID.toString());

            alert('Login successful, redirecting...');
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Invalid response:', res);
            alert('Login failed: Invalid response from server');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          alert('Login failed: ' + (error.error?.message || 'Unknown error'));
        },
      });
  }
}
