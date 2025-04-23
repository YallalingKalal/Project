import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,

} from '@angular/forms';
import { StaffService, Staff } from '../staff.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  staffImage: File | null | undefined;
  aadharCardFile: File | null | undefined;
  panCardFile: File | null | undefined;
  staffList: Staff[] = [];
  filteredStaffList: Staff[] = [];
  registrationForm: FormGroup;
  showForm = false;
  editingStaffIndex: number | null = null;
  photoURL: string | ArrayBuffer | null = null;
  aadharCardURL: string | ArrayBuffer | null = null;
  panCardURL: string | ArrayBuffer | null = null;
  searchTerm: string = '';
  showSearchInput: boolean = false;
  viewFormDetails: boolean = false;
  staffDetails: Staff | null = null;

  constructor(private staffService: StaffService) {
    this.registrationForm = new FormGroup({
      full_name: new FormControl('', Validators.required),
      date_of_birth: new FormControl(null),
      gender: new FormControl(null),
      phone_number: new FormControl('', [Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl('', [Validators.email]),
      designation: new FormControl(''),
      department: new FormControl(''),
      date_of_joining: new FormControl(null),
      salary: new FormControl(null, [Validators.min(0)]),
      address: new FormControl(''),
      aadhar_card: new FormControl(null),
      pan_card: new FormControl(null),
      photo: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe((data: any) => {
      this.staffList = data.all_info;
      this.filteredStaffList = [...this.staffList];
    });
  }

  // onFileSelected(event: any): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     this.registrationForm.patchValue({ photo: file });
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.photoURL = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     this.registrationForm.patchValue({ photo: null });
  //     this.photoURL = null;
  //   }
  // }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.staffImage = fileList[0];
    } else {
      this.staffImage = null; // Reset file if no file is selected
    }
  }

  addStaff(): void {
    if (this.registrationForm.valid) {
      // Create a new FormData object
      const formData: FormData = new FormData();

      // Append each form field to the FormData object.
      // Loop through all keys in your form (except the photo control)
      Object.keys(this.registrationForm.value).forEach((key) => {
        // If the key is not 'photo', append its value.
        // (You could also skip null/undefined values if needed)
        if (key !== 'photo') {
          formData.append(key, this.registrationForm.get(key)?.value);
        }
      });

      // Append the file if available (staffImage should be set in your onFileSelected method)
      if (this.staffImage) {
        formData.append('photo', this.staffImage);
      }
      if (this.aadharCardFile) {
        formData.append('aadhar_card', this.aadharCardFile);
      }
      if (this.panCardFile) {
        formData.append('pan_card', this.panCardFile);
      }

      // If updating an existing staff record, include the id.
      if (this.editingStaffIndex !== null) {
        const id = this.staffList[this.editingStaffIndex].id;
        formData.append('id', id?.toString() || '');
        this.staffService.updateStaff(formData).subscribe((updatedStaff) => {
          this.staffList[this.editingStaffIndex!] = updatedStaff;
          this.filteredStaffList = [...this.staffList];
          this.registrationForm.reset();
          this.loadStaff();
          this.photoURL = null;
          this.showForm = false;
          this.editingStaffIndex = null;
          this.viewFormDetails = false; // Ensure view form is closed after edit
        });
      } else {
        // For a new record
        this.staffService.addStaff(formData).subscribe((newStaff) => {
          this.staffList.push(newStaff);
          this.filteredStaffList = [...this.staffList];
          this.registrationForm.reset();
          this.loadStaff();
          this.photoURL = null;
          this.aadharCardURL = null;
          this.panCardURL = null;
          this.showForm = false;
          this.viewFormDetails = false; // Ensure view form is closed after add
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  editStaff(index: number): void {
    this.editingStaffIndex = index;
    const staffToEdit = this.staffList[index];
    this.registrationForm.patchValue(staffToEdit);
    this.photoURL = null;
    this.aadharCardURL = null;
    this.panCardURL = null;
    this.showForm = true;
    this.showSearchInput = false;
    this.viewFormDetails = false;
  }

  deleteStaff(index: number): void {
    const staffToDelete = this.staffList[index];
    if (staffToDelete.id && confirm('Are you sure to delete?')) {
      this.staffService.deleteStaff(staffToDelete.id).subscribe(() => {
        this.staffList.splice(index, 1);
        this.filteredStaffList = [...this.staffList];
      });
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.editingStaffIndex = null;
    this.registrationForm.reset();
    this.photoURL = null;
    this.showSearchInput = false;
    this.aadharCardURL = null;
    this.panCardURL = null;
    this.showSearchInput = false;
    this.viewFormDetails = false;
  }

  searchStaff(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStaffList = this.staffList.filter(
      (staff) =>
        staff.full_name.toLowerCase().includes(term) ||
        staff.phone_number.includes(term)
    );
  }

  toggleSearchInput(): void {
    this.showSearchInput = !this.showSearchInput;
    if (!this.showSearchInput) {
      this.searchTerm = '';
      this.filteredStaffList = [...this.staffList];
    }
  }

  viewStaffDetails(staff: Staff): void {
    this.staffDetails = staff;
    this.registrationForm.patchValue(staff);
    this.photoURL = staff?.photo || null;
    this.aadharCardURL = staff?.['aadhar_card'] || null;
    this.panCardURL = staff?.['pan_card'] || null;
    this.viewFormDetails = true;
    this.showForm = true;
    this.showSearchInput = false;
    this.editingStaffIndex = null;
  }
}
