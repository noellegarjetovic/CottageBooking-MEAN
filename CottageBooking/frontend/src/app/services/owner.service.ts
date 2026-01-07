import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Reservation } from '../models/reservations';
import { Cottage } from '../models/cottages';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private httpClient=inject(HttpClient);

  constructor() { }

  getOwnersReservations(naziv:string){
      return this.httpClient.post<Reservation[]>("http://localhost:4000/owner/getOwnersReservations",{naziv:naziv})
    }
  getOwnersCottages(vlasnik:string){
      return this.httpClient.post<Cottage[]>("http://localhost:4000/owner/getOwnersCottages",{vlasnik:vlasnik})
    }
  updateStatusReservation(vik:string, datumP:string,status:string, comment:string){
      return this.httpClient.post<String>("http://localhost:4000/owner/updateStatusReservation",{naziv:vik,datum:datumP,status:status,komentarOdbijanja:comment})
    }

  addCottage(cottage: Cottage) {
    return this.httpClient.post<string>("http://localhost:4000/owner/addCottage", cottage);
  }

  updateCottage(naziv: string, cottage: Cottage) {
    return this.httpClient.post<string>("http://localhost:4000/owner/updateCottage", {naziv:naziv,cottage:cottage});
  }

  deleteCottage(naziv: string) {
    return this.httpClient.post<string>("http://localhost:4000/owner/deleteCottage",{naziv:naziv});
  }

  importFromJson(file: FormData) {
    return this.httpClient.post<string>("http://localhost:4000/owner/addCottageJSON", file);
  }

}
