import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService, Vendor } from '../vendor.service';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css'],
})
export class AddVendorComponent implements OnInit {
  vendor: Vendor = {
    vendor_name: '',
    vendor_code: '',
    p_no: '',
    pan: '',
    address: '',
    gst_number: '',
    state: '',
    state_code: '',
    phone_number: '',
  };

  vendors: Vendor[] = [];
  editingIndex: number | null = null;

  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  // Load the vendor list from the backend
  loadVendors(): void {
    this.vendorService.getVendors().subscribe({
      next: (data: any) => {
        this.vendors = data.all_info
          ;
      },
      error: (err) => console.error('Error fetching vendors:', err),
    });
  }

  addVendor(): void {
    if (this.vendor.vendor_name && this.vendor.gst_number) {
      if (this.editingIndex !== null && this.vendor.id) {
        // Update existing vendor via API
        this.vendorService.updateVendor(this.vendor).subscribe({
          next: (updatedVendor: Vendor) => {
            this.vendors[this.editingIndex!] = updatedVendor;
            this.editingIndex = null;
            this.resetForm();
            this.loadVendors();
          },
          error: (err) => console.error('Error updating vendor:', err),
        });
      } else {
        // Add new vendor via API
        this.vendorService.addVendor(this.vendor).subscribe({
          next: (newVendor: Vendor) => {
            this.vendors.push(newVendor);
            this.resetForm();
            this.loadVendors();
          },
          error: (err) => console.error('Error adding vendor:', err),
        });
      }
    } else {
      alert('Vendor Name and GST Number required!');
    }
  }

  editVendor(index: number): void {
    // Load selected vendor details into the form for editing
    this.vendor = { ...this.vendors[index] };
    this.editingIndex = index;
  }

  deleteVendor(index: number): void {
    if (confirm('Are you sure to delete?')) {
      const vendorToDelete = this.vendors[index];
      if (vendorToDelete.id) {
        this.vendorService.deleteVendor(vendorToDelete.id).subscribe({
          next: () => {
            this.vendors.splice(index, 1);
          },
          error: (err) => console.error('Error deleting vendor:', err),
        });
      } else {
        // If vendor doesn't have an ID, remove locally (if applicable)
        this.vendors.splice(index, 1);
      }
    }
  }

  resetForm(): void {
    this.vendor = {
      vendor_name: '',
      vendor_code: '',
      p_no: '',
      pan: '',
      address: '',
      gst_number: '',
      state: '',
      state_code: '',
      phone_number: '',
    };
  }
}
