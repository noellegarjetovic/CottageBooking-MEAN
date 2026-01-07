import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { User } from '../models/user';
import { Cottage } from '../models/cottages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  private adminService = inject(AdminService);
  private router=inject(Router)

  users: User[] = [];
  cottages: Cottage[] = [];

  

  showUserModal: boolean = false;
  selectedUser: User | null = null;
  

  validationErrors: any = {};
  message: string = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
    });

    this.adminService.getAllCottages().subscribe(cottages => {
      this.cottages = cottages;
    });
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user };
    this.showUserModal = true;
  }

  closeModals() {
    this.showUserModal = false;
    this.selectedUser = null;
    this.validationErrors = {};
    this.message = '';
  }

  updateUser() {
    if (!this.selectedUser) return;

    if (!this.validateUser(this.selectedUser)) {
      this.message = 'Popravite greške u formi';
      return;
    }

    this.adminService.updateUser(this.selectedUser).subscribe(data=>{
      if (data=="Email je već u upotrebi kod drugog korisnika"){
        alert(data)
      }else{
        this.loadData();
        this.closeModals();
      }
    });
  }

  deleteUser(korime: string) {
    if (confirm(`Da li ste sigurni da želite da obrišete korisnika ${korime}?`)) {
      this.adminService.deleteUser(korime).subscribe({
        next: () => {
          this.message = 'Korisnik uspešno obrisan';
          this.loadData();
        },
        error: (error) => {
          this.message = 'Greška pri brisanju korisnika';
          console.error(error);
        }
      });
    }
  }

  deactivateUser(korime: string) {
    this.adminService.updateUserStatus(korime, "deaktiviran").subscribe({
      next: () => {
        this.message = 'Korisnik uspešno deaktiviran';
        this.loadData();
      },
      error: (error) => {
        this.message = 'Greška pri deaktivaciji korisnika';
        console.error(error);
      }
    });
  }

  approveUser(korime: string) {
    this.adminService.updateUserStatus(korime,"odobren").subscribe({
      next: () => {
        this.message = 'Korisnik uspešno odobren';
        this.loadData();
      },
      error: (error) => {
        this.message = 'Greška pri odobravanju korisnika';
        console.error(error);
      }
    });
  }

  rejectUser(korime: string) {
    this.adminService.updateUserStatus(korime,"odbijen").subscribe({
      next: () => {
        this.message = 'Korisnik uspešno odbijen';
        this.loadData();
      },
      error: (error) => {
        this.message = 'Greška pri odbijanju korisnika';
        console.error(error);
      }
    });
  }

  
  shouldHighlightCottage(cottage: Cottage): boolean {
    if (!cottage.ocene || cottage.ocene.length < 3) return false;
    const lastThree = cottage.ocene.slice(-3);
    return lastThree.every(ocena => ocena.ocena < 2);
  }

  getLastThreeRatings(cottage: Cottage): string {
    if (!cottage.ocene || cottage.ocene.length === 0) return 'Nema ocena';
    
    const lastThree = cottage.ocene.slice(-3);
    return lastThree.map(ocena => ocena.ocena).join(', ');
  }

  isCottageBlocked(cottage: Cottage): boolean {
    if (!cottage.blokiranaDo) return false;
    const blockUntil = new Date(cottage.blokiranaDo);
    const now = new Date();
    const isBlocked = blockUntil > now;
    if (!isBlocked && cottage.status === 'blokirana') {
      this.adminService.unBlockCottage(cottage.naziv).subscribe(data=>{
        this.loadData()
      });
    }
  
    return isBlocked;
  }

  blockCottage(cottage: Cottage) {
    this.adminService.blockCottage(cottage.naziv).subscribe(data=>{
      this.loadData()
    });
  }


  validateUser(user: any): boolean {
    this.validationErrors = {};

    // Ime
    if (!user.ime) {
      this.validationErrors.ime = 'Ime je obavezno';
    }

    // Prezime
    if (!user.prezime) {
      this.validationErrors.prezime = 'Prezime je obavezno';
    }

    // Adresa
    if (!user.adresa) {
      this.validationErrors.adresa = 'Adresa je obavezna';
    }

    // Email
    if (!user.email) {
      this.validationErrors.email = 'Email je obavezan';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      this.validationErrors.email = 'Email nije u ispravnom formatu';
    }

    // Telefon
    if (!user.telefon) {
      this.validationErrors.telefon = 'Telefon je obavezan';
    } else if (!/^\+?[0-9]{6,15}$/.test(user.telefon)) {
      this.validationErrors.telefon = 'Telefon mora biti u ispravnom formatu';
    }

    // Kartica
    if (!user.kartica) {
      this.validationErrors.kartica = 'Broj kartice je obavezan';
    } else {
      const cardErrors = this.validateCard(user.kartica);
      if (cardErrors) this.validationErrors.kartica = cardErrors;
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  validateCard(card: string): string {
    const cleanCard = card.replace(/\s/g, '');
    if (/^(300|301|302|303|36|38)\d*$/.test(cleanCard)) {
      if (cleanCard.length !== 15) return 'Diners kartica mora imati tačno 15 cifara';
    } else if (/^(51|52|53|54|55)\d*$/.test(cleanCard)) {
      if (cleanCard.length !== 16) return 'MasterCard kartica mora imati tačno 16 cifara';
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d*$/.test(cleanCard)) {
      if (cleanCard.length !== 16) return 'Visa kartica mora imati tačno 16 cifara';
    } else {
      return 'Nije odgovarajući tip kartice';
    }
    return '';
  }

  
  validateField(field: string, value: string) {
    switch (field) {
      case 'email':
        if (!value) {
          this.validationErrors.email = 'Email je obavezan';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          this.validationErrors.email = 'Email nije u ispravnom formatu';
        } else {
          this.validationErrors.email = '';
        }
        break;
      case 'telefon':
        if (!value) {
          this.validationErrors.telefon = 'Telefon je obavezan';
        } else if (!/^\+?[0-9]{6,15}$/.test(value)) {
          this.validationErrors.telefon = 'Telefon mora biti u ispravnom formatu';
        } else {
          this.validationErrors.telefon = '';
        }
        break;
    }
  }

  odjaviSe(){
    localStorage.removeItem("user");
    this.router.navigate(['loginAdmin'])
  }
}