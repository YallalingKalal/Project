import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceApiService } from '../invoice-api.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface LineItem {
  description: string;
  hsn_code: string;
  quantity: number;
  unit_rate: number;
  discount_percentage: number;
  gst_rate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total_value?: number;
  discount_amount?: number;
  grand_total?: number;
}

interface InvoiceData {
  vendor_name: string;
  gst_no: string;
  consignee_name: string;
  consignee_state_code: string;
  consignee_address: string;
  remarks: string;
  challan_date: string;
  invoice_date: string;
  challan_number: string;
  order_date: string;
  order_number: string;
  veh_no: string;
  transport_mode: string;
  due_on: string;
  time_of_supply: string;
  payment_terms: string;
  document: string;
  delivery_terms: string;
  transport: string;
  place_of_supply: string;
  l_r_number: string;
  l_r_date: string;
  ref: string;
  total_amount: any;
  items: LineItem[];
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  invoiceData: InvoiceData = {
    vendor_name: '',
    gst_no: '',
    consignee_name: '',
    consignee_state_code: '',
    consignee_address: '',
    remarks: '',
    challan_date: '',
    invoice_date: '',
    challan_number: '',
    order_date: '',
    order_number: '',
    veh_no: '',
    transport_mode: 'road',
    due_on: '',
    time_of_supply: '',
    payment_terms: '',
    document: '',
    delivery_terms: '',
    transport: '',
    place_of_supply: '',
    l_r_number: '',
    l_r_date: '',
    ref: '',
    total_amount: '',
    items: [],
  };

  vendorsArray: any[] = [];
  descriptionsArray: any[] = []; // Assuming this is for descriptions
  selectedVendor: any = null;

  constructor(private invoiceService: InvoiceApiService) {}

  ngOnInit(): void {
    this.getVendors();
    this.getDescriptions();
  }

  onVendorChange(vendor: any): void {
    if (vendor) {
      this.invoiceData.vendor_name = vendor.vendor_name;
      this.invoiceData.gst_no = vendor.gst_number;
      this.invoiceData.consignee_name = vendor.consignee_name || '';
      this.invoiceData.consignee_state_code = vendor.consignee_state_code || '';
      this.invoiceData.consignee_address = vendor.address || '';
      // Add more fields as needed
    }
  }

  onDescriptionChange(item: any): void {
    const selectedProduct = this.descriptionsArray.find(
      (p) => p.description === item.description
    );
    if (selectedProduct) {
      item.hsn_code = selectedProduct.hsn_code;
      item.quantity = selectedProduct.quantity;
      item.unit_rate = selectedProduct.price;
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addLineItem(): void {
    this.invoiceData.items.push({
      description: '',
      hsn_code: '0',
      quantity: 0,
      unit_rate: 0.0,
      discount_percentage: 0.0,
      gst_rate: 0.0,
      cgst: 0.0,
      sgst: 0.0,
      igst: 0.0,
      discount_amount: 0.0,
      total_value: 0.0,
      grand_total: 0.0,
    });
  }

  removeLineItem(index: number): void {
    this.invoiceData.items.splice(index, 1);
  }

  calculateNetAmount(item: LineItem): number {
    const base = item.quantity * item.unit_rate;
    const discountAmount = (base * item.discount_percentage) / 100;
    item.discount_amount = discountAmount;
    return base - discountAmount;
  }

  calculateGSTAmount(item: LineItem, rate: number): number {
    const netAmount = this.calculateNetAmount(item);
    return (netAmount * rate) / 100;
  }

  calculateLineItemTotal(item: LineItem): number {
    const net = this.calculateNetAmount(item);
    const cgst = item.cgst ? this.calculateGSTAmount(item, item.cgst) : 0;
    const sgst = item.sgst ? this.calculateGSTAmount(item, item.sgst) : 0;
    const igst = item.igst ? this.calculateGSTAmount(item, item.igst) : 0;
    const gst = item.gst_rate
      ? this.calculateGSTAmount(item, item.gst_rate)
      : 0;

    item.total_value = net;
    item.grand_total = net + cgst + sgst + igst + gst;
    return item.grand_total;
  }

  calculateInvoiceTotal(): number {
    const total = this.invoiceData.items.reduce(
      (sum, item) => sum + this.calculateLineItemTotal(item),
      0
    );
    this.invoiceData.total_amount = total;
    return total;
  }
  

  // calculateInvoiceTotal(): number {
  //   return this.invoiceData.items.reduce(
  //     (sum, item) => sum + this.calculateLineItemTotal(item),
  //     0
  //   );
  // }

  getTotalByType(type: 'gst' | 'cgst' | 'sgst' | 'igst'): number {
    let total = 0;
    for (const item of this.invoiceData.items) {
      const net = this.calculateNetAmount(item);
      switch (type) {
        case 'gst':
          total += this.calculateGSTAmount(item, item.gst_rate || 0);
          break;
        case 'cgst':
          total += this.calculateGSTAmount(item, item.cgst || 0);
          break;
        case 'sgst':
          total += this.calculateGSTAmount(item, item.sgst || 0);
          break;
        case 'igst':
          total += this.calculateGSTAmount(item, item.igst || 0);
          break;
      }
    }
    return total;
  }

  // submitInvoice(): void {
  //   if (
  //     !this.invoiceData.items ||
  //     this.invoiceData.items.length === 0
  //   ) {
  //     alert('Please enter records!');
  //     return;
  //   }

  //   const firstLineItem = this.invoiceData.items[0];
  //   const formattedPayload: any = { ...this.invoiceData, ...firstLineItem };
  //   delete formattedPayload.lineItems;

  //   this.invoiceService.postInvoice(formattedPayload).subscribe(
  //     (response: any) => {
  //       console.log('Invoice submitted successfully:', response);
  //       alert('Invoice submitted successfully!');
  //     },
  //     (error: any) => {
  //       console.error('Error submitting invoice:', error);
  //       alert('Failed to submit invoice.');
  //     }
  //   );
  // }

  submitInvoice(): void {
    if (!this.invoiceData.items || this.invoiceData.items.length === 0) {
      alert('Please enter records!');
      return;
    }
  
    this.invoiceData.total_amount = this.calculateInvoiceTotal(); // 👈 ensure it's updated
  
    const firstLineItem = this.invoiceData.items[0];
    const formattedPayload: any = { ...this.invoiceData, ...firstLineItem };
    delete formattedPayload.lineItems;
  
    this.invoiceService.postInvoice(formattedPayload).subscribe(
      (response: any) => {
        console.log('Invoice submitted successfully:', response);
        alert('Invoice submitted successfully!');
      },
      (error: any) => {
        console.error('Error submitting invoice:', error);
        alert('Failed to submit invoice.');
      }
    );
  }
  

  getVendors(): void {
    this.invoiceService.getBillVendors().subscribe(
      (response: any) => {
        this.vendorsArray = response.all_info;
      },
      (error: any) => {
        console.error('Error fetching vendors:', error);
      }
    );
  }

  getDescriptions(): void {
    this.invoiceService.getBillDescriptions().subscribe(
      (response: any) => {
        console.log(response);
        this.descriptionsArray = response;
      },
      (error: any) => {
        console.error('Error fetching descriptions:', error);
      }
    );
  }
}
