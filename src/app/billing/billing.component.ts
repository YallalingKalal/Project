import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Vendor {
  name: string;
  address: string;
  gstNo: string;
  consignee: string;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  invoiceData = {
    companyName: '',
    customerName: '',
    customerAddress: '',
    invoiceNumber: '',
    gstNo: '',
    consignee: '',
    remarks: '',
    inclusive: false,
    copies: 2,
    invoiceDate: '',
    challanNo: '',
    orderDate: '',
    orderNo: '',
    vehNo: '',
    transportMode: 'BY ROAD',
    dueDate: '',
    timeOfSupply: '',
    paymentTerms: '',
    document: '',
    deliveryTerms: '',
    transport: '',
    placeOfSupply: '',
    lrNo: '',
    lrDate: '',
    ref: '',
    lineItems: [
      {
        description: '',
        hsnSac: '',
        quantity: 0,
        unitPrice: 0,
        discountPercentage: 0,
        gstRate: 0,
      },
    ],
  };

  vendors: Vendor[] = [
    {
      name: 'Vendor A',
      address: '123 Main St, City A',
      gstNo: 'GSTA12345',
      consignee: 'Consignee A',
    },
    {
      name: 'Vendor B',
      address: '456 Elm Rd, City B',
      gstNo: 'GSTB67890',
      consignee: 'Consignee B',
    },
  ];

  ngOnInit(): void {
    const today = new Date();
    this.invoiceData.invoiceDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addLineItem() {
    this.invoiceData.lineItems.push({
      description: '',
      hsnSac: '',
      quantity: 0,
      unitPrice: 0,
      discountPercentage: 0,
      gstRate: 0,
    });
  }

  removeLineItem(index: number) {
    this.invoiceData.lineItems.splice(index, 1);
  }

  calculateCGST(item: any): number {
    return item.unitPrice * item.quantity * (item.gstRate / 2 / 100);
  }

  calculateSGST(item: any): number {
    return this.calculateCGST(item);
  }

  calculateIGST(item: any): number {
    return item.unitPrice * item.quantity * (item.gstRate / 100);
  }

  calculateNetAmount(item: any): number {
    const priceAfterDiscount =
      item.unitPrice * item.quantity * (1 - item.discountPercentage / 100);
    return priceAfterDiscount;
  }

  calculateLineItemTotal(item: any): number {
    const netAmount = this.calculateNetAmount(item);
    const gstAmount =
      this.calculateIGST(item) > 0
        ? this.calculateIGST(item)
        : this.calculateCGST(item) + this.calculateSGST(item);
    return netAmount + gstAmount;
  }

  calculateInvoiceTotal(): number {
    let total = 0;
    for (const item of this.invoiceData.lineItems) {
      total += this.calculateLineItemTotal(item);
    }
    return total;
  }

  onVendorSelected(vendorName: string) {
    const selectedVendor = this.vendors.find((v) => v.name === vendorName);
    if (selectedVendor) {
      this.invoiceData.gstNo = selectedVendor.gstNo;
      this.invoiceData.consignee = selectedVendor.consignee;
      this.invoiceData.customerAddress = selectedVendor.address;
      this.invoiceData.customerName = selectedVendor.name; // Set customer name to vendor name
    } else {
      this.invoiceData.gstNo = '';
      this.invoiceData.consignee = '';
      this.invoiceData.customerAddress = '';
      this.invoiceData.customerName = '';
    }
  }

  updateInvoice() {
    console.log('Invoice Updated:', this.invoiceData);
    // Implement your logic to update the invoice data
  }

  printInvoice() {
    window.print();
  }

  generateChallan() {
    console.log('Challan Generated:', this.invoiceData);
    // Implement your logic to generate a challan
  }

  submitForm() {
    console.log('Form Submitted:', this.invoiceData);
    // Implement your logic to submit the form data
  }

  cancelForm() {
    console.log('Form Cancelled');
    // Implement your logic to cancel the form
  }

  changeSomething() {
    console.log('Change button clicked');
    // Implement the functionality for the Change button
  }
}
