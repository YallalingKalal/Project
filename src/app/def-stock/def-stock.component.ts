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
    this.defStockService.showDefStock().subscribe(
      (response: any) => {
        this.stockItems = response.all_info.map((item: any, index: number) => ({
          ...item,
          id: index + 1,
          isEditing: false,
          stock_type: item.stock_type || 'Child Product',
          price: item.price !== undefined ? item.price : 0
        }));
        this.nextId = this.stockItems.length > 0 ? Math.max(...this.stockItems.map(item => item.id)) + 1 : 1;
      },
      (error: any) => {
        console.error('Error fetching defective stock from server:', error);
      }
    );
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
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: false } : item));
    this.saveData();
  }

  cancelEdit(index: number): void {
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: false } : item));
  }

  deleteItem(index: number): void {
    this.stockItems = this.stockItems.filter((_, i) => i !== index);
    this.saveData();
  }
}