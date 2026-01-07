import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

import { TouristCottagesService } from '../services/tourist-cottages.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { MeniComponent } from '../meni/meni.component';

@Component({
  selector: 'app-cottage-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MeniComponent],
  templateUrl: './cottage-details.component.html',
  styleUrls: ['./cottage-details.component.css']
})
export class CottageDetailsComponent implements OnInit, AfterViewInit {
  naziv!: string;
  cottage: any;
  owner: any;
  private map: any;
  cardNumber: string = "";
  user: string = "";

  private userService = inject(UserService)
  private httpClient = inject(HttpClient)
  private route = inject(ActivatedRoute);
  private cottageService = inject(TouristCottagesService);

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  isMapInitialized: boolean = false;
  mapInitializationAttempted: boolean = false;

  step: number = 1;
  message: string = '';
  arrivalDate: string = '';
  arrivalTime: string = '';
  departureDate: string = '';
  departureTime: string = '';
  adults: number = 1;
  children: number = 0;
  additionalNotes: string = '';
  successMessage: string = '';
  price: number = 0;
  

  constructor() {}

  ngOnInit(): void {
    this.naziv = this.route.snapshot.paramMap.get('naziv')!;
    this.cottageService.getCottage(this.naziv).subscribe(data => {
      this.cottage = data;

      this.cottageService.getOwner(this.cottage.vlasnik).subscribe(ownerData => {
        this.owner = ownerData;
      });

      this.user = localStorage.getItem("user")!;
      this.userService.getUser(this.user).subscribe(userData => {
        this.cardNumber = userData.kartica;
      });

      
      setTimeout(() => {
        this.initMap();
      }, 300);
    });
  }

  ngAfterViewInit(): void {
    if (this.cottage) {
      setTimeout(() => {
        this.initMap();
      }, 300);
    }
  }

  private initMap(): void {
    if (this.isMapInitialized) {
      return;
    }


    const lat = this.cottage.koordinate.lat;
    const lng = this.cottage.koordinate.lng;

    try {
      console.log('Inicijalizacija mape sa koordinatama:', lat, lng);
      
      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(this.cottage.naziv)
        .openPopup();
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 500);

      this.isMapInitialized = true;
      this.mapInitializationAttempted = true;
      

    } catch (error) {
      console.error('Greška pri inicijalizaciji mape:', error);
      this.mapInitializationAttempted = true;
    }
  }

  getAverage(): number {
    if (!this.cottage || !this.cottage.ocene || this.cottage.ocene.length === 0) return 0;
    const sum = this.cottage.ocene.reduce((a: number, b: number) => a + b, 0);
    return Math.round((sum / this.cottage.ocene.length) * 10) / 10;
  }

  nextStep() {
    this.message = '';
    const now = new Date();

    if (!this.arrivalDate || !this.departureDate || !this.arrivalTime || !this.departureTime) {
      this.message = 'Morate uneti oba datuma.';
      return;
    }

    const arrivalDateTime = new Date(`${this.arrivalDate}T${this.arrivalTime}`);
    const departureDateTime = new Date(`${this.departureDate}T${this.departureTime}`);

    if (arrivalDateTime <= now) {
      this.message = 'Datum i vreme dolaska mora biti posle trenutnog vremena.';
      return;
    }

    if (arrivalDateTime >= departureDateTime) {
      this.message = 'Datum dolaska mora biti pre datuma odlaska.';
      return;
    }

    const [arrHour] = this.arrivalTime ? this.arrivalTime.split(':').map(Number) : [0];
    const [depHour] = this.departureTime ? this.departureTime.split(':').map(Number) : [0];

    if (arrHour < 14) {
      this.message = 'Dolazak je moguć od 14h pa nadalje.';
      return;
    }

    if (depHour > 10) {
      this.message = 'Odlazak mora biti najkasnije do 10h.';
      return;
    }

    if (!this.adults || this.adults <= 0) {
      this.message = 'Broj odraslih mora biti barem 1.';
      return;
    }

    if (this.children === null) {
      this.message = 'Unesite broj dece (ako ih nema, unesite 0).';
      return;
    }

    let totalPrice = 0;
    let current = new Date(arrivalDateTime);

    while (current < departureDateTime) {
      const month = current.getMonth(); 
      if (month >= 4 && month <= 7) {
        totalPrice += this.cottage.cenaLeto;
      } else {
        totalPrice += this.cottage.cenaZima;
      }
      current.setDate(current.getDate() + 1);
    }

    this.price = totalPrice*(this.children+this.adults);
    this.step = 2;
  }

  previousStep() {
    this.step = 1;
  }

  submitBooking(): void {
    this.message = '';
    this.successMessage = '';

    if (!this.cardNumber || this.cardNumber.length < 16) {
      this.message = 'Unesite validan broj kartice.';
      return;
    }

    this.cottageService.checkReservationOverlap(this.naziv, this.arrivalDate, this.departureDate).subscribe(data => {
      if (data) {
        const arrivalDateTime = `${this.arrivalDate}T${this.arrivalTime}`;
        const departureDateTime = `${this.departureDate}T${this.departureTime}`;
        const datum = new Date().toISOString().slice(0, 16);
        const zahtevi = this.additionalNotes;
        
        this.cottageService.addReservation(this.naziv, this.user, arrivalDateTime, departureDateTime, this.adults + this.children, datum, zahtevi)
          .subscribe(res => {
            if (res) {
              this.successMessage = 'Uspesno ste rezervisali vikendicu';
            } else {
              this.successMessage = 'Niste uspeli da rezervisete vikendicu';
            }
          });
      } else {
        this.successMessage = 'Vikendica je rezervisana u tom periodu';
      }
    });
  }
}