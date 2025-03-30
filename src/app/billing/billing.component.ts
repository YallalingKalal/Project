import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';

interface Product {
  name: string;
  hsnCode: number;
  rate: number;
}

interface BillItem {
  id: number;
  selectedProduct: Product | null;
  quantity: number;
  rate: number;
  amount: number;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
})
export class BillingComponent implements OnInit {
  displayedColumns: string[] = [
    'sr',
    'product',
    'hsn',
    'qty',
    'rate',
    'amount',
  ];
  dataSource!: MatTableDataSource<BillItem>;
  private idCounter = 0;

  productList: Product[] = [
    { name: 'Pen', hsnCode: 23805, rate: 5.0 },
    { name: 'Notebook', hsnCode: 4820, rate: 20.0 },
    { name: 'Eraser', hsnCode: 3926, rate: 2.0 },
    { name: 'Sharpener', hsnCode: 8214, rate: 3.0 },
    { name: 'Pencil', hsnCode: 9609, rate: 4.0 },
  ];

  ngOnInit() {
    this.dataSource = new MatTableDataSource([this.createNewBillItem()]);
  }

  createNewBillItem(): BillItem {
    return {
      id: ++this.idCounter,
      selectedProduct: null,
      quantity: 1,
      rate: 0,
      amount: 0,
    };
  }

  onProductChange(event: MatSelectChange, row: BillItem): void {
    const product = event.value as Product;
    row.rate = product.rate;
    this.calculateAmount(row);
  }

  calculateAmount(row: BillItem): void {
    if (row.selectedProduct && row.quantity > 0) {
      row.amount = row.rate * row.quantity;
      this.checkAndAddRow();
    }
  }

  private checkAndAddRow(): void {
    const items = this.dataSource.data;
    const lastItem = items[items.length - 1];

    if (lastItem.selectedProduct !== null) {
      items.push(this.createNewBillItem());
      this.dataSource.data = [...items];
    }
  }

  addRow(): void {
    const items = this.dataSource.data;
    items.push(this.createNewBillItem());
    this.dataSource.data = [...items];
  }

  getTotalAmount(): number {
    return this.dataSource.data
      .filter((item) => item.selectedProduct !== null)
      .reduce((total, item) => total + item.amount, 0);
  }

  getGST(): number {
    return this.getTotalAmount() * 0.18;
  }

  getFinalAmount(): number {
    return this.getTotalAmount() + this.getGST();
  }

  isValidForInvoice(): boolean {
    return this.dataSource.data.some(
      (item) =>
        item.selectedProduct !== null && item.quantity > 0 && item.amount > 0
    );
  }

  generateInvoice(): void {
    // Implement invoice generation logic here
    console.log('Generating invoice...');
    console.log('Items:', this.dataSource.data);
    console.log('Total Amount:', this.getFinalAmount());
  }
}
