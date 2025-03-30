import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../services/products.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  showAddStockForm = false;
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  editingIndex: number | null = null;

  newStock: Product = {
    name: '',
    supplier: '',
    price: 0,
    hsn_code: '',
    quantity: 0,
    total: 0,
    stock_type: 'Parent',
  };

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products from the API
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        // Use 'any' for flexibility with API response
        if (response && response.all_stock) {
          this.productList = response.all_stock.map((product: Product) => ({
            ...product,
            quantity: product.quantity ?? 1, // Set default quantity to 1 if missing
            total: product.total ?? product.price, // Set default total to price if missing
          }));
          this.filterProductList('All');
        } else {
          console.error('Invalid API response:', response);
        }
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  // Add a new stock item via the API
  addNewStock(): void {
    if (
      this.newStock.name &&
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
          this.loadProducts(); // Reloads the latest data from API
          // this.resetNewStockForm(); // Reset form fields
          this.showAddStockForm = false; // Hide form after submission
        },
        error: (err) => console.error('Error adding product:', err),
      });
    }
  }

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
          },
          error: (err) => console.error('Error updating product:', err),
        });
      } else {
        this.editingIndex = null;
        this.updateQuantity();
      }
    }
  }

  // Remove product via API call
  removeProduct(index: number): void {
    const product = this.filteredProductList[index];
    if (product.id) {
      this.productsService.deleteProduct(product).subscribe({
        next: () => {
          this.productList = this.productList.filter(
            (p) => p.id !== product.id
          );
          this.filterProductList('All');
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    } else {
      this.productList.splice(index, 1);
      this.filterProductList('All');
    }
  }
}
