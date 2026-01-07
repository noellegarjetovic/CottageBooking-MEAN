import { Component, inject } from '@angular/core';
import { Cottage, Ocena } from '../models/cottages';
import { TouristCottagesService } from '../services/tourist-cottages.service';
import { MeniComponent } from '../meni/meni.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tourist-cottages',
  imports: [MeniComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './tourist-cottages.component.html',
  styleUrl: './tourist-cottages.component.css'
})
export class TouristCottagesComponent {
  cottages:Cottage[]=[]

  private touristCottageService=inject(TouristCottagesService)

  ngOnInit(){
    this.touristCottageService.getCottages().subscribe(data=>{
      this.cottages=data;
    })
  }

  searchNaziv: string = '';
  searchMesto: string = '';
  filteredCottages: any[] = [];

  search() {
    this.filteredCottages = this.cottages.filter(c => {
      const matchNaziv = this.searchNaziv ? c.naziv.toLowerCase().includes(this.searchNaziv.toLowerCase()) : true;
      const matchMesto = this.searchMesto ? c.mesto.toLowerCase().includes(this.searchMesto.toLowerCase()) : true;
      return matchNaziv && matchMesto;
    });
  }
  getAverage(ocene: Ocena[]): number {
    if (!ocene || ocene.length === 0) return 0;
    const sum = ocene.reduce((a, b) => a + b.ocena, 0);
    return sum / ocene.length;
  }

  getStars(ocene: Ocena[]): string {
      let ocena;
      if (!ocene || ocene.length === 0) {
          ocena = 0;
      } else {
          const sum = ocene.reduce((a, b) => a + b.ocena, 0);
          ocena = sum / ocene.length;
      }
      
      let stars = '';
      for (let i = 1; i <= 5; i++) {
          stars += i <= Math.round(ocena) ? '★' : '☆';
      }
      return stars;
  }

  sortByMestoAsc(): void {
  this.cottages.sort((a: any, b: any) => a.mesto.localeCompare(b.mesto));
}

sortByMestoDesc(): void {
  this.cottages.sort((a: any, b: any) => b.mesto.localeCompare(a.mesto));
}

sortByNazivAsc(): void {
  this.cottages.sort((a: any, b: any) => a.naziv.localeCompare(b.naziv));
}

sortByNazivDesc(): void {
  this.cottages.sort((a: any, b: any) => b.naziv.localeCompare(a.naziv));
}


}
