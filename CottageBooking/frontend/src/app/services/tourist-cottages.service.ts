import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/cottages';
import { User } from '../models/user';
import { Reservation } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class TouristCottagesService {

  private httpClient=inject(HttpClient);

  constructor() { }

  getCottages(){
    return this.httpClient.get<Cottage[]>("http://localhost:4000/tourist/getCottages")
  }

  getCottage(naziv: string) {
    return this.httpClient.post<Cottage>("http://localhost:4000/tourist/getCottage",{naziv:naziv});
  }

  getOwner(korime:string){
    return this.httpClient.post<User>("http://localhost:4000/tourist/getOwner",{korime:korime})
  }

  getMyReservations(korime:string){
    return this.httpClient.post<Reservation[]>("http://localhost:4000/tourist/getMyReservations",{korime:korime})
  }

  submitReservationComment(vikendica:string, datumP:string, koment:string, ocena:number, korime:string){
    return this.httpClient.post<String>("http://localhost:4000/tourist/submitReservationRating",{vikend:vikendica,datum:datumP,comm:koment,ocena:ocena, korime:korime})
  }
  deleteReservation(vikendica:string, datumP:string){
    return this.httpClient.post<string>("http://localhost:4000/tourist/deleteReservation",{vikendica:vikendica,datum:datumP})
  }

  checkReservationOverlap(vikendica:string, datumP:string, datumK:string){
    return this.httpClient.post<boolean>("http://localhost:4000/tourist/checkReservationOverlap",{vikendica:vikendica,datumPocetka:datumP,datumKraja:datumK})
  }

  addReservation(vikendica:string, turista:string, datumPocetka:string, datumKraja:string, brojOsoba:number, datum:string, zahtevi:string){
    return this.httpClient.post<boolean>("http://localhost:4000/tourist/addReservation",{vikendica:vikendica,turista:turista,datumPocetka:datumPocetka,datumKraja:datumKraja,brojOsoba:brojOsoba, datum:datum, zahtevi:zahtevi})
  }
}
