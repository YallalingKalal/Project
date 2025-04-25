import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DefStockService } from '../def-stock.service';

interface StockItem {
  id: number;
  stock: string;
  stock_type: 'Child Product' | 'Parent Product';
  defective_quantity: number;
  reusable_quantity: number;
  price: number; // Added price property
  reason: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-def-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './def-stock.component.html',
  styleUrls: ['./def-stock.component.css']
})
export class DefStockComponent implements OnInit {
  constructor(private defStockService: DefStockService) { }
  stockItems: StockItem[] = [];
  newItem: StockItem = { id: 0, stock: '', stock_type: 'Child Product', defective_quantity: 0, reusable_quantity: 0, price: 0, reason: '' };
  nextId: number = 1;
  stockTypes: ('Child Product' | 'Parent Product')[] = ['Child Product', 'Parent Product'];
  stockOptions: any[] = []; // Array to hold stock options

  ngOnInit(): void {
    this.loadServerData();
    this.loadStockOptions();
  }



  loadStockOptions(): void {
    this.defStockService.getDefectiveStock().subscribe(
      (response: any) => {
        // console.log(response);
        this.stockOptions = response.all_info;
      },
      (error: any) => {
        console.error('Errorr fetching descriptions:', error);
      }
    );
  }

  // onDescriptionChange(stockOption: any): void {
  //   const selectedProduct = this.stockOptions.find(
  //     (p) => p.description === stockOption.description
  //   );
  //   if (selectedProduct) {
  //     this.newItem.price = selectedProduct.price;
  //   }
  // }
  onDescriptionChange(description: string): void {
    const selectedProduct = this.stockOptions.find(p => p.description === description);
    if (selectedProduct) {
      this.newItem.price = selectedProduct.price;
    }
  }



  loadServerData(): void {
    this.defStockService.showDefStock().subscribe({
      next: (response: any) => {
        this.stockItems = response.all_info.map((item: any) => ({
          ...item,
          isEditing: false,
          stock_type: item.stock_type || 'Child Product',
          price: item.price !== undefined ? item.price : 0
        }));
        // Use the backend-provided IDs instead of generating new ones
        this.nextId = this.stockItems.length > 0 ?
          Math.max(...this.stockItems.map(item => item.id)) + 1 : 1;
      },
      error: (error: any) => {
        console.error('Error fetching defective stock from server:', error);
        alert('Error loading stock data. Please refresh the page.');
      }
    });
  }


  saveData(): void {
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
  }

  addItem(): void {
    if (this.newItem.stock && this.newItem.stock_type && this.newItem.defective_quantity >= 0 &&
      this.newItem.reusable_quantity >= 0 && this.newItem.price >= 0 && this.newItem.reason) {

      this.defStockService.addDefStock(this.newItem).subscribe(
        (response) => {
          console.log('Item added successfully', response);
          this.loadServerData(); // Refresh the list from server
          this.newItem = {
            id: 0,
            stock: '',
            stock_type: 'Child Product',
            defective_quantity: 0,
            reusable_quantity: 0,
            price: 0,
            reason: ''
          };
        },
        (error) => {
          console.error('Error adding item', error);
        }
      );
    }
  }


  editItem(index: number): void {
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: true } : item));

  }

  saveItem(index: number): void {
    const itemToUpdate = this.stockItems[index];

    this.defStockService.updateDefStock(itemToUpdate).subscribe(
      (response) => {
        console.log('Item updated successfully', response);
        this.stockItems[index] = { ...response, isEditing: false };
        this.loadServerData(); // Optionally update with latest response
      },
      (error) => {
        console.error('Error updating item', error);
      }
    );
  }



  cancelEdit(index: number): void {
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: false } : item));
  }

  deleteItem(index: number): void {
    const itemToDelete = this.stockItems[index];
    if (!itemToDelete || !itemToDelete.id) {
      console.error('Item ID is missing');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete stock: "${itemToDelete.stock}"?`);
    if (!confirmDelete) return;

    this.defStockService.deleteDefStock(itemToDelete.id).subscribe({
      next: () => {
        console.log('Item deleted successfully');
        this.loadServerData();
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        if (error.status === 400) {
          // alert('Unable to delete: Item not found in the database.');
        } else {
          // alert('An error occurred while deleting the item. Please try again.');
        }
      }
    });
  }

}