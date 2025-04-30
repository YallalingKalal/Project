import { Component, inject, OnInit } from '@angular/core';
import { InvoiceApiService } from '../invoice-api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-records',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './all-records.component.html',
  styleUrl: './all-records.component.css',
})
export class AllRecordsComponent implements OnInit {
  invoices: any[] = [];
  vendors: any[] = [];
  deletingInvoiceId: number | null = null;
  toastr: ToastrService = inject(ToastrService);

  constructor(private invoiceService: InvoiceApiService) { }

  ngOnInit() {
    this.getAllInvoices();
    this.getAllVendors();
  }

  getAllInvoices() {
    this.invoiceService.getAllInvoices().subscribe(
      (response: any) => {
        this.invoices = response.all_info;
        this.toastr.success('Records loaded successfully', 'Success');
      },
      (error) => {
        console.error('Error fetching invoices:', error);
        this.toastr.error('Failed to load records', 'Error');
      }
    );
  }

  getAllVendors() {
    this.invoiceService.getBillVendors().subscribe(
      (response: any) => {
        this.vendors = response.all_info;
        this.toastr.success('Vendors loaded successfully', 'Success');
      },
      (error) => {
        console.error('Error fetching Vendors:', error);
        this.toastr.error('Failed to load Vendors', 'Error');
      }
    );
  }

  deleteInvoice(invoiceNumber: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.deletingInvoiceId = invoiceNumber;
      this.invoiceService.deleteInvoice(invoiceNumber).subscribe(
        () => {
          this.toastr.success('Invoice deleted successfully', 'Success');
          this.getAllInvoices();
          this.deletingInvoiceId = null;
        },
        (error) => {
          console.error('Error deleting invoice:', error);
          this.toastr.error('Failed to delete invoice', 'Error');
          this.deletingInvoiceId = null;
        }
      );
    }
  }

  printInvoice(invoiceNumber: number) {
    this.invoiceService.getInvoiceByNumber(invoiceNumber).subscribe(
      (res: any) => {
        const invoice = res.info_details;
        const vendor = res.vendors?.[0] || {};

        if (!invoice) {
          this.toastr.error('Invoice data not found', 'Error');
          return;
        }

        const itemRows = invoice.items
          .map(
            (item: any) => `
              <tr>
                <td style="padding: 4px; font-size: 10px;">${item.description}</td>
                <td style="padding: 4px; font-size: 10px;">${item.hsn_code}</td>
                <td style="padding: 4px; font-size: 10px; text-align: right;">${item.quantity}</td>
                <td style="padding: 4px; font-size: 10px; text-align: right;">₹${item.unit_rate}</td>
                <td style="padding: 4px; font-size: 10px; text-align: right;">₹${item.total_value}</td>
              </tr>`
          )
          .join('');

        const taxRows = `
          <tr>
            <td colspan="4" class="right bold" style="padding-top: 5px; padding-bottom: 5px; font-size: 10px;">Taxable Amount</td>
            <td style="padding-top: 5px; padding-bottom: 5px; font-size: 10px; text-align: right;">₹${invoice.taxable_amount || 0}</td>
          </tr>
          <tr>
            <td colspan="4" class="right" style="padding-top: 2px; padding-bottom: 2px; font-size: 10px;">CGST (${invoice.cgst || 0}%)</td>
            <td style="padding-top: 2px; padding-bottom: 2px; font-size: 10px; text-align: right;">₹${invoice.cgst_amount || 0}</td>
          </tr>
          <tr>
            <td colspan="4" class="right" style="padding-top: 2px; padding-bottom: 2px; font-size: 10px;">SGST (${invoice.sgst || 0}%)</td>
            <td style="padding-top: 2px; padding-bottom: 2px; font-size: 10px; text-align: right;">₹${invoice.sgst_amount || 0}</td>
          </tr>
          <tr>
            <td colspan="4" class="right" style="padding-top: 2px; padding-bottom: 2px; font-size: 10px;">IGST (${invoice.igst || 0}%)</td>
            <td style="padding-top: 2px; padding-bottom: 2px; font-size: 10px; text-align: right;">₹${invoice.igst_amount || 0}</td>
          </tr>
          <tr>
            <td colspan="4" class="right bold" style="padding-top: 5px; font-size: 10px;">Total Amount</td>
            <td class="bold" style="padding-top: 5px; font-size: 10px; text-align: right;">₹${invoice.total_amount}</td>
          </tr>
        `;

        const printWindow = window.open('', '', 'width=750,height=900');
        if (!printWindow) {
          this.toastr.error('Unable to open print window. Check popup settings.', 'Error');
          return;
        }

        printWindow.document.write(`
          <html>
          <head>
            <title>Tax Invoice ${invoice.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 5px; font-size: 10px; margin: 5px; }
              .invoice-container { max-width: 700px; margin: auto; padding: 10px; border: 1px solid #ccc; display: flex; flex-direction: column; }
              .header, .bank-details, .terms { text-align: center; margin-bottom: 8px; }
              .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
              .table th, .table td { border: none; padding: 4px; text-align: left; font-size: 10px; }
              .table th { font-weight: bold; border-bottom: 1px solid #ccc; }
              .section { margin-bottom: 8px; }
              .bold { font-weight: bold; }
              .right { text-align: right; }
              .print-button { padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 5px; float:right; margin-top: 10px; margin-bottom: 10px; font-size: 10px; cursor: pointer; }
              @media print { .print-button { display: none; } }
              .company-info { font-size: 9px; line-height: 1.2; }
              .item-table { border-collapse: collapse; width: 100%; margin-top: 5px; }
              .item-table th, .item-table td { border-bottom: 1px solid #eee; padding: 4px; text-align: left; font-size: 10px; }
              .item-table th { font-weight: bold; }
              .total-table { border-collapse: collapse; width: 100%; margin-top: 10px; }
              .total-table td { padding: 2px 5px; font-size: 10px; }
              .total-table .bold { font-weight: bold; }
              hr { border-top: 1px solid #ccc; margin: 5px 0; }
              .bottom-section { display: flex; justify-content: space-between; margin-top: 15px; align-items: flex-end; }
              .left-bottom-text { text-align: left; font-size: 9px; line-height: 1.2; }
              .right-bottom-signature { text-align: right; }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="header">
                <h2>TAX INVOICE</h2>
                <img src="./assets/jal.jpg" height="50" width="50" alt="Company Logo">
                <h3>JAL</h3>
                <p class="company-info bold">Manufacturers: Air / Oil / Fuel Filters</p>
                <p class="company-info">
                  GAT No.663/1, A/p GOGALWADI, Tal: HAVELI, NEAR SEINUMERU NIRMAN GOGALWADI PLANT, PUNE- 412205.<br>
                  Contact: (M) 9850410051, Email: sandesh.tawade.jal@gmail.com
                </p>
              </div>
              <hr>
              <table class="table" style="margin-top: 10px;">
                <tr><th style="width: 20%;">Invoice No</th><td style="width: 30%;">${invoice.invoice_number}</td><th style="width: 20%;">Date</th><td style="width: 30%;">${invoice.invoice_date}</td></tr>
                <tr><th>GSTIN</th><td>${invoice.gst_no}</td><th>Consignee Name</th><td>${invoice.consignee_name}</td></tr>
                <tr><th>State</th><td>${invoice.consignee_state}</td><th>Vendor Code</th><td>${invoice.vendor_code}</td></tr>
                <tr><th>State Code</th><td>${invoice.consignee_state_code}</td><th>PO Number</th><td>${invoice.consignee_p_no || ''}</td></tr>
                <tr><th>PAN Number</th><td colspan="3">${invoice.consignee_pan || ''}</td></tr>
              </table>
              <hr>
              <h3>Order & Transport Details</h3>
              <table class="table">
                <tr><th style="width: 25%;">Transport Mode</th><td style="width: 25%;">${invoice.transport_mode}</td><th style="width: 25%;">Order No</th><td style="width: 25%;">${invoice.order_number}</td></tr>
                <tr><th>Vehicle No</th><td>${invoice.veh_no}</td><th>Transport</th><td>${invoice.transport}</td></tr>
                <tr><th>LR No</th><td>${invoice.l_r_number}</td><th>LR Date</th><td>${invoice.l_r_date}</td></tr>
                <tr><th>Place of Supply</th><td>${invoice.place_of_supply}</td><th>Date of Supply</th><td>${invoice.due_on}</td></tr>
                <tr><th>Time of Supply</th><td colspan="3">${invoice.time_of_supply}</td></tr>
              </table>
              <hr>
              <h3>Items</h3>
              <table class="item-table">
                <tr>
                  <th style="width: 40%;">Description</th>
                  <th style="width: 15%;">HSN Code</th>
                  <th style="width: 10%; text-align: right;">Qty</th>
                  <th style="width: 15%; text-align: right;">Rate</th>
                  <th style="width: 20%; text-align: right;">Total</th>
                </tr>
                ${itemRows}
              </table>
              <table class="total-table" style="margin-top: 10px;">
                <tr><td colspan="3" class="right bold">Taxable Amount</td><td class="right">₹${invoice.taxable_amount || 0}</td></tr>
                <tr><td colspan="3" class="right">CGST (${invoice.cgst_rate || 0}%)</td><td class="right">₹${invoice.cgst_amount || 0}</td></tr>
                <tr><td colspan="3" class="right">SGST (${invoice.sgst_rate || 0}%)</td><td class="right">₹${invoice.sgst_amount || 0}</td></tr>
                <tr><td colspan="3" class="right">IGST (${invoice.igst_rate || 0}%)</td><td class="right">₹${invoice.igst_amount || 0}</td></tr>
                <tr><td colspan="3" class="right bold">Total Amount</td><td class="right bold">₹${invoice.total_amount}</td></tr>
              </table>
              <hr>
              <h3>Bank Details</h3>
              <table class="table">
                <tr><th style="width: 30%;">Bank Name</th><td style="width: 70%;">MAHESH SAHAKARI BANK LTD.PUNE</td></tr>
                <tr><th>Branch</th><td>SINHAGAD ROAD</td></tr>
                <tr><th>Account No</th><td>011130100000143</td></tr>
                <tr><th>IFSC Code</th><td>MSBL0000011</td></tr>
              </table>
              <hr>
              <div class="bottom-section">
                <div class="left-bottom-text">
                  Whether the Tax is payable on Reverse Charges basis (Yes / No )<br><br>
                  Certified that the particulars given above are true and correct and the amount indicated represents the price<br>
                  actually charged and that there is no flow of additional consideration directly or indirectly from the buyer.<br><br>
                  Terms & Conditions<br>
                  1) Subject to PUNE Jurisdiction only.<br>
                  2) Interest @24% shall be charged if payment not made within due date.
                </div>
                <div class="right-bottom-signature">
                  <p style="margin-bottom: 5px;"><strong>For JAL</strong></p>
                  <div style="height: 30px;"></div>
                  <p style="text-align: right; margin-top: 5px;"><strong>Authorised Signature</strong></p>
                </div>
              </div>

              <button class="print-button" onclick="window.print();"><b>Print Invoice</b></button>
            </div>
          </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        this.toastr.info('Print window opened. Click Print Invoice to continue.', 'Info');
      },
      (error) => {
        console.error('Error fetching invoice details:', error);
        this.toastr.error('Failed to load invoice details', 'Error');
      }
    );
  }
}