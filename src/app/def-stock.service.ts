import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface StockItem {
  id: number;
  stock: string;
  stock_type: 'Child Product' | 'Parent Product';
  defective_quantity: number;
  reusable_quantity: number;
  price: number; // Added price property
  reason: string;
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root'
})



export class DefStockService {

  private baseApiUrl = 'https://jal.beatsacademy.in/api/stock';
  private getApiUrl = `${this.baseApiUrl}/allstock/`;
  private defgetAPI = 'https://jal.beatsacademy.in/api/stock/DefectiveStock/';
  private postApiUrl = `${this.defgetAPI}addstock/`;
  private defgetAPIUrl = `${this.defgetAPI}allstock/`;

  constructor(private http: HttpClient) { }

  getDefectiveStock(): Observable<any> {
    return this.http.get(this.getApiUrl);
  }
  addDefStock(stockItem: StockItem): Observable<any> {
    return this.http.post<StockItem>(this.postApiUrl, stockItem);
  }

  showDefStock(): Observable<any> {
    return this.http.get(this.defgetAPIUrl);
  }
}
