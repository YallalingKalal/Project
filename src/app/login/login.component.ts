import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
  toastr: ToastrService = inject(ToastrService);

  onLogin() {
    if (!this.apiLoginObj.username || !this.apiLoginObj.password) {
      this.toastr.warning('Please enter both username and password', 'Validation');
      return;
    }

    this.http
      .post<any>('https://jal.beatsacademy.in/api/user/login/', this.apiLoginObj)
      .subscribe({
        next: (res) => {
          if (res.status === 'success' && res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userID', res.userID.toString());

            this.toastr.success('Login successful, redirecting...', 'Success');
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Invalid response:', res);
            this.toastr.error('Login failed: Invalid response from server', 'Error');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.toastr.error(error.error?.message || 'Unknown error', 'Login Failed');
        },
      });
  }

}
