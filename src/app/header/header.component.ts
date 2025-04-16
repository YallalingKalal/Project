import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  RouterLink,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule,
    SidebarComponent,
    RouterOutlet,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) { }

  toaster: ToastrService = inject(ToastrService);

  logout() {
    localStorage.clear(); // Clear all localStorage items
    // OR use localStorage.removeItem('username') to remove specific item
    this.router.navigate(['/login']);
    this.toaster.success('You have been logged out!', 'Logout');
  }
}
