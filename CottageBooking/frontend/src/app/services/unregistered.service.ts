import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Cottage } from '../models/cottages';

@Injectable({
  providedIn: 'root'
})
export class UnregisteredService {
  private httpClient = inject(HttpClient);
  private baseUrl = "http://localhost:4000/unregistered";

  // Sve vikendice
  getAllCottages() {
    return this.httpClient.get<Cottage[]>(`${this.baseUrl}/getAllCottages`);
  }

  // Broj vlasnika
  getNumberOwners() {
    return this.httpClient.get<number>(`${this.baseUrl}/getNumberOwners`);
  }

  // Broj turista
  getNumberTourists() {
    return this.httpClient.get<number>(`${this.baseUrl}/getNumberTourists`);
  }

  // Broj vikendica
  getNumberCottages() {
    return this.httpClient.get<number>(`${this.baseUrl}/getNumberCottages`);
  }

  // Statistika: poslednja 24h
  get24h() {
    return this.httpClient.get<any>(`${this.baseUrl}/get24h`);
  }

  // Statistika: poslednjih 7 dana
  get7d() {
    return this.httpClient.get<any>(`${this.baseUrl}/get7d`);
  }

  // Statistika: poslednjih 30 dana
  get30d() {
    return this.httpClient.get<any>(`${this.baseUrl}/get30d`);
  }

  
}
