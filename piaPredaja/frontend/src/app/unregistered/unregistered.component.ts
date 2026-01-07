import { Component, inject } from '@angular/core';
import { Cottage } from '../models/cottages';
import { TouristCottagesService } from '../services/tourist-cottages.service';
import { MeniComponent } from '../meni/meni.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UnregisteredService } from '../services/unregistered.service';

@Component({
  selector: 'app-tourist-cottages',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './unregistered.component.html',
  styleUrl: './unregistered.component.css'
})
export class UnregisteredComponent {
  cottages:Cottage[]=[]
  numberOwners:number=0
  numberTourists:number=0
  numberCottages: number=0;
  reservations24h:number=0
  reservations7d:number=0
  reservations30d:number=0

  private unregisteredService=inject(UnregisteredService)
  private router=inject(Router)
  

  ngOnInit(){
    this.unregisteredService.getAllCottages().subscribe(data=>{
      this.cottages=data;
    })
    this.loadStats()
  }

  loadStats() {
    this.unregisteredService.getNumberOwners().subscribe(num => this.numberOwners = num);
    this.unregisteredService.getNumberTourists().subscribe(num => this.numberTourists = num);
    this.unregisteredService.getNumberCottages().subscribe(num => this.numberCottages = num);
    this.unregisteredService.get24h().subscribe(num => this.reservations24h = num);
    this.unregisteredService.get7d().subscribe(num => this.reservations7d = num);
    this.unregisteredService.get30d().subscribe(num => this.reservations30d = num);
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
back(){
  this.router.navigate([""])
}


}
