import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-staff',
  imports: [CommonModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent {
  photoURL: string | ArrayBuffer | null = null;

  previewPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
