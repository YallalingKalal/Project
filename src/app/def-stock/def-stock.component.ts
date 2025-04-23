import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
  stockItems: StockItem[] = [];
  newItem: StockItem = { id: 0, stock: '', stock_type: 'Child Product', defective_quantity: 0, reusable_quantity: 0, price: 0, reason: '' };
  nextId: number = 1;
  stockTypes: ('Child Product' | 'Parent Product')[] = ['Child Product', 'Parent Product'];
  stockOptions: string[] = []; // Array to hold stock options

  ngOnInit(): void {
    this.loadData();
    this.loadStockOptions();
  }

  loadStockOptions(): void {
    // In a real application, you would fetch these from a service/API
    this.stockOptions = ['stock A'];
  }

  loadData(): void {
    const storedData = localStorage.getItem('stockItems');
    if (storedData) {
      this.stockItems = JSON.parse(storedData);
      this.stockItems = this.stockItems.map(item => ({
        ...item,
        stock_type: this.stockTypes.includes(item.stock_type) ? item.stock_type : 'Child Product',
        price: item.price !== undefined ? item.price : 0 // Ensure price exists
      }));
      this.nextId = this.stockItems.length > 0 ? Math.max(...this.stockItems.map(item => item.id)) + 1 : 1;
    }
  }

  saveData(): void {
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
  }

  addItem(): void {
    if (this.newItem.stock && this.newItem.stock_type && this.newItem.defective_quantity >= 0 && this.newItem.reusable_quantity >= 0 && this.newItem.price >= 0 && this.newItem.reason) {
      this.newItem.id = this.nextId++;
      this.stockItems.push({ ...this.newItem });
      this.newItem = { id: 0, stock: '', stock_type: 'Child Product', defective_quantity: 0, reusable_quantity: 0, price: 0, reason: '' };
      this.saveData();
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