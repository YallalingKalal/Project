import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService, Product } from '../services/products.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  showAddStockForm = false;
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  editingIndex: number | null = null;

  newStock: Product = {
    description: '',
    supplier: '',
    price: 0,
    hsn_code: '',
    quantity: 0,
    total: 0,
    stock_type: 'Parent',
  };

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  toastr: ToastrService = inject(ToastrService);


  // Load products from the API
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        if (response && response) {
          this.productList = response.all_info.map((product: Product) => ({
            ...product,
            quantity: product.quantity ?? 1,
            total: product.total ?? product.price,
          }));
          this.filterProductList('All');
          this.toastr.success('Stock loaded successfully', 'Success');
        } else {
          this.toastr.error('Invalid response from server', 'Error');
          console.error('Invalid API response:', response);
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load stock items', 'Error');
        console.error('Error loading products:', err);
      },
    });
  }

  // Add a new stock item via the API
  addNewStock(form: NgForm): void {
    if (
      this.newStock.description &&
      this.newStock.price > 0 &&
      this.newStock.hsn_code
    ) {
      const newProduct: Product = {
        ...this.newStock,
        quantity: 1,
        total: this.newStock.price,
      };

      this.productsService.addProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.showAddStockForm = false;
          this.newStock = {
            description: '',
            supplier: '',
            price: 0,
            hsn_code: '',
            quantity: 0,
            total: 0,
            stock_type: 'Parent',
          };
          form.resetForm({
            stock_type: 'Parent',
          });
          this.toastr.success('New stock item added successfully', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to add new stock item', 'Error');
          console.error('Error adding product:', err);
        },
      });
    } else {
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
    }
  }

  // resetNewStockForm(){
  //   this.showAddStockForm.reset();
  // }

  // Filter products based on type
  filterProductList(type: string): void {
    this.filteredProductList =
      type === 'All'
        ? [...this.productList] // Show all products
        : this.productList.filter(
          (product) =>
            product.stock_type?.toLowerCase() === type.toLowerCase()
        );
  }

  // Update quantity and recalculate total locally
  updateQuantity(): void {
    this.filteredProductList.forEach((item) => {
      item.total = item.quantity! * item.price;
    });
  }

  // Enable editing mode
  editProduct(index: number): void {
    this.editingIndex = index;
  }

  // Save the edited product by calling the API update method
  saveEdit(): void {
    if (this.editingIndex !== null) {
      const product = this.filteredProductList[this.editingIndex];
      if (product.id) {
        this.productsService.updateProduct(product).subscribe({
          next: (updatedProduct: Product) => {
            const index = this.productList.findIndex(
              (p) => p.id === updatedProduct.id
            );
            if (index !== -1) {
              this.productList[index] = {
                ...updatedProduct,
                quantity: updatedProduct.quantity || product.quantity,
                total: updatedProduct.total || updatedProduct.price,
              };
            }
            this.editingIndex = null;
            this.updateQuantity();
            this.toastr.success('Stock item updated successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to update stock item', 'Error');
            console.error('Error updating product:', err);
          },
        });
      } else {
        this.editingIndex = null;
        this.updateQuantity();
        this.toastr.warning('Cannot update: Invalid product ID', 'Warning');
      }
    }
  }

  // Remove product via API call
  removeProduct(index: number): void {
    const product = this.filteredProductList[index];
    if (confirm('Are you sure you want to delete this item?')) {
      if (product.id) {
        this.productsService.deleteProduct(product).subscribe({
          next: () => {
            this.productList = this.productList.filter(
              (p) => p.id !== product.id
            );
            this.filterProductList('All');
            this.toastr.success('Stock item deleted successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to delete stock item', 'Error');
            console.error('Error deleting product:', err);
          },
        });
      } else {
        this.productList.splice(index, 1);
        this.filterProductList('All');
        this.toastr.warning('Removed untracked item', 'Warning');
      }
    }
  }
}
