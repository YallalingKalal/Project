import { Component, OnInit } from '@angular/core';
import { InvoiceApiService } from '../invoice-api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-records',
  imports: [CommonModule, MatIconModule],
  templateUrl: './all-records.component.html',
  styleUrl: './all-records.component.css',
})
export class AllRecordsComponent implements OnInit {
  invoices: any[] = [];

  constructor(private invoiceService: InvoiceApiService) { }

  ngOnInit() {
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.invoiceService.getAllInvoices().subscribe(
      (response: any) => {
        this.invoices = response.all_info;
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }

  // printInvoice(invoice_number: number) {
  //   this.invoiceService.getInvoiceById(invoice_number).subscribe((res: any) => {
  //     const invoice = res.info_details;
  //     const printWindow = window.open('', '', 'width=800,height=600');
  //     printWindow!.document.write(`
  //     <html>
  //     <head>
  //     <title>Tax Invoice ${invoice.invoice_number}</title>
  //     <style>
  //       body { font-family: Arial, sans-serif; padding: 20px; }
  //       .invoice-container { max-width: 800px; margin: auto; border: 1px solid black; padding: 20px; }
  //       .header, .bank-details, .terms { text-align: center; }
  //       .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  //       .table th, .table td { border: 1px solid black; padding: 8px; text-align: left; }
  //       .section { margin-bottom: 15px; }
  //       .bold { font-weight: bold; }
  //       .right { text-align: right; }
  //       .print-button { padding: 10px 20px; background: blue; float:right; color: white; margin-top: 35px; margin-bottom: 30px }
  //       @media print { .print-button { display: none; } }
  //     </style>
  //     </head>
  //   <body>
  //   <div class="invoice-container">
  //       <div class="header">
  //           <h2>TAX INVOICE</h2>
  //           <h3>JAL</h3>
  //           <p class="bold">Manufacturers: Air / Oil / Fuel Filters</p>
  //           <p style="font-size:13px">GAT No.663/1, A/p GOGALWADI, Tal: HAVELI, NEAR SEINUMERU NIRMAN GOGALWADI PLANT, PUNE- 412205.<br>
  //             Contact: (M) 9850410051, Email-sandesh.tawade.jal@gmail.com</p>
  //       </div>

  //       <table class="table">
  //           <tr><th>Invoice No</th><td>${invoice.invoice_number}</td></tr>
  //           <tr><th>Date</th><td>${invoice.invoice_date}</td></tr>
  //           <tr><th>GSTIN</th><td>${invoice.gst_no}</td></tr>
  //           <tr><th>Consignee Name</th><td>${invoice.consignee_name}</td></tr>
  //           <tr><th>State Code</th><td>${invoice.consignee_state_code}</td></tr>
  //       </table>

  //       <h3>Order & Transport Details</h3>
  //       <table class="table">
  //           <tr><th>Transport Mode</th><td>${invoice.transport_mode}</td></tr>
  //           <tr><th>Order No</th><td>${invoice.order_number}</td></tr>
  //       </table>

  //       <h3>Items</h3>
  //       <table class="table">
  //           <tr>
  //               <th>Description</th>
  //               <th>HSN Code</th>
  //               <th>Quantity</th>
  //               <th>Rate</th>
  //               <th>Total</th>
  //           </tr>
  //           <tr>
  //               <td>${invoice.description}</td>
  //               <td>${invoice.hsn_code}</td>
  //               <td>${invoice.quantity}</td>
  //               <td>${invoice.unit_rate}</td>
  //               <td>${invoice.total_value}</td>
  //           </tr>
  //       </table>

  //       <h3>Tax Details</h3>
  //       <table class="table">
  //           <tr><th>CGST</th><td>${invoice.cgst}</td></tr>
  //           <tr><th>SGST</th><td>${invoice.sgst}</td></tr>
  //           <tr><th>IGST</th><td>${invoice.igst}</td></tr>
  //           <tr><th>Grand Total</th><td class="bold">${invoice.grand_total}</td></tr>
  //       </table>

  //       <h3>Bank Details</h3>
  //       <table class="table">
  //           <tr><th>Bank Name</th><td>MAHESH SAHAKARI BANK LTD.PUNE</td></tr>
  //           <tr><th>Branch</th><td>SINHAGAD ROAD</td></tr>
  //           <tr><th>Account No</th><td>011130100000143</td></tr>
  //           <tr><th>IFSC Code</th><td>MSBL0000011</td></tr>
  //       </table>

  //       <button class="print-button" onclick="window.print();"><b>Print Invoice</b></button>
  //     </div>
  //   </body>
  //   </html>
  //     `);
  //     printWindow!.document.close();
  //     printWindow!.focus();
  //   });
  // }

  printInvoice(invoiceNumber: number) {
    this.invoiceService.getInvoiceByNumber(invoiceNumber).subscribe((res: any) => {
      const invoice = res.info_details;

      const itemRows = invoice.items
        .map(
          (item: any) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.hsn_code}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unit_rate}</td>
              <td>₹${item.total_value}</td>
            </tr>
          `
        )
        .join('');

      const totalRow = `
        <tr>
          <td colspan="4" class="right bold">Total Amount</td>
          <td class="bold">₹${invoice.total_amount}</td>
        </tr>
      `;

      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow!.document.write(`
        <html>
        <head>
          <title>Tax Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-container { max-width: 800px; margin: auto; border: 1px solid black; padding: 20px; }
            .header, .bank-details, .terms { text-align: center; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table th, .table td { border: 1px solid black; padding: 8px; text-align: left; }
            .section { margin-bottom: 15px; }
            .bold { font-weight: bold; }
            .right { text-align: right; }
            .print-button { padding: 10px 20px; background: blue; float:right; color: white; margin-top: 35px; margin-bottom: 30px }
            @media print { .print-button { display: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h2>TAX INVOICE</h2>
              <h3>JAL</h3>
              <p class="bold">Manufacturers: Air / Oil / Fuel Filters</p>
              <p style="font-size:13px">
                GAT No.663/1, A/p GOGALWADI, Tal: HAVELI, NEAR SEINUMERU NIRMAN GOGALWADI PLANT, PUNE- 412205.<br>
                Contact: (M) 9850410051, Email: sandesh.tawade.jal@gmail.com
              </p>
            </div>

            <table class="table">
              <tr><th>Invoice No</th><td>${invoice.invoice_number}</td></tr>
              <tr><th>Date</th><td>${invoice.invoice_date}</td></tr>
              <tr><th>GSTIN</th><td>${invoice.gst_no}</td></tr>
              <tr><th>Consignee Name</th><td>${invoice.consignee_name}</td></tr>
              <tr><th>State Code</th><td>${invoice.consignee_state_code}</td></tr>
            </table>

            <h3>Order & Transport Details</h3>
            <table class="table">
              <tr><th>Transport Mode</th><td>${invoice.transport_mode}</td></tr>
              <tr><th>Order No</th><td>${invoice.order_number}</td></tr>
              <tr><th>Vehicle No</th><td>${invoice.veh_no}</td></tr>
            </table>

            <h3>Items</h3>
            <table class="table">
              <tr>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
              ${itemRows}
              ${totalRow}
            </table>

            <h3>Bank Details</h3>
            <table class="table">
              <tr><th>Bank Name</th><td>MAHESH SAHAKARI BANK LTD.PUNE</td></tr>
              <tr><th>Branch</th><td>SINHAGAD ROAD</td></tr>
              <tr><th>Account No</th><td>011130100000143</td></tr>
              <tr><th>IFSC Code</th><td>MSBL0000011</td></tr>
            </table>

            <button class="print-button" onclick="window.print();"><b>Print Invoice</b></button>
          </div>
        </body>
        </html>
      `);
      printWindow!.document.close();
      printWindow!.focus();
    });
  }
}
