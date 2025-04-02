import { Component, OnInit } from '@angular/core';
import { SupplierService, Supplier } from '../supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((data: any) => {
      this.suppliers = data.all_info;
    });
  }

  addOrUpdateSupplier(): void {
    if (this.supplier.supplier_name && this.supplier.gst_number) {
      if (this.editingIndex !== null) {
        // Update existing supplier
        this.supplierService.updateSupplier(this.supplier).subscribe(() => {
          this.suppliers[this.editingIndex!] = { ...this.supplier };
          this.resetForm();
        });
      } else {
        // Add new supplier
        this.supplierService
          .addSupplier(this.supplier)
          .subscribe((newSupplier) => {
            this.suppliers.push(newSupplier);
            this.resetForm();
          });
      }
    } else {
      alert('Supplier supplier_name and GST Number required!');
    }
  }

  editSupplier(index: number): void {
    this.supplier = { ...this.suppliers[index] };
    this.editingIndex = index;
  }

  deleteSupplier(index: number): void {
    const supplierToDelete = this.suppliers[index];
    if (confirm('Are you sure to delete?') && supplierToDelete.id) {
      this.supplierService.deleteSupplier(supplierToDelete.id).subscribe(() => {
        this.suppliers.splice(index, 1);
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
  }
}
