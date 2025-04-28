import { Component, inject, OnInit } from '@angular/core';
import { SupplierService, Supplier } from '../supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent implements OnInit {
  supplier: Supplier = {
    supplier_name: '',
    address: '',
    gst_number: '',
    state: '',
    state_code: '',
    phone_number: '',
    p_no: '',
    supplier_code: '',
    pan: '',
  };

  suppliers: Supplier[] = [];
  editingIndex: number | null = null;

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  toastr: ToastrService = inject(ToastrService);


  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: any) => {
        this.suppliers = data.all_info;
        this.toastr.success('Suppliers loaded successfully', 'Success');
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.toastr.error('Failed to load suppliers', 'Error');
      }
    });
  }

  addOrUpdateSupplier(): void {
    if (this.supplier.supplier_name && this.supplier.gst_number) {
      if (this.editingIndex !== null) {
        // Update existing supplier
        this.supplierService.updateSupplier(this.supplier).subscribe({
          next: () => {
            this.suppliers[this.editingIndex!] = { ...this.supplier };
            this.resetForm();
            this.loadSuppliers();
            this.toastr.success('Supplier updated successfully', 'Success');
          },
          error: (err) => {
            console.error('Error updating supplier:', err);
            this.toastr.error('Failed to update supplier', 'Error');
          }
        });
      } else {
        // Add new supplier
        this.supplierService.addSupplier(this.supplier).subscribe({
          next: (newSupplier) => {
            this.suppliers.push(newSupplier);
            this.resetForm();
            this.loadSuppliers();
            this.toastr.success('New supplier added successfully', 'Success');
          },
          error: (err) => {
            console.error('Error adding supplier:', err);
            this.toastr.error('Failed to add supplier', 'Error');
          }
        });
      }
    } else {
      this.toastr.warning('Supplier Name and GST Number are required!', 'Warning');
    }
  }

  editSupplier(index: number): void {
    this.supplier = { ...this.suppliers[index] };
    this.editingIndex = index;
    this.toastr.info('Editing supplier details', 'Info');
  }

  deleteSupplier(index: number): void {
    const supplierToDelete = this.suppliers[index];
    if (confirm('Are you sure to delete?') && supplierToDelete.id) {
      this.supplierService.deleteSupplier(supplierToDelete.id).subscribe({
        next: () => {
          this.suppliers.splice(index, 1);
          this.toastr.success('Supplier deleted successfully', 'Success');
        },
        error: (err) => {
          console.error('Error deleting supplier:', err);
          this.toastr.error('Failed to delete supplier', 'Error');
        }
      });
    }
  }

  resetForm(): void {
    this.supplier = {
      supplier_name: '',
      address: '',
      gst_number: '',
      state: '',
      state_code: '',
      phone_number: '',
      p_no: '',
      supplier_code: '',
      pan: '',
    };
    this.editingIndex = null;
    this.toastr.info('Form has been reset', 'Info');
  }
}
