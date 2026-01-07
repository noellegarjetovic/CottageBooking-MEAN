import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MeniVlasnikComponent } from '../meni-vlasnik/meni-vlasnik.component';
import { OwnerService } from '../services/owner.service';
import { Cottage } from '../models/cottages';

@Component({
  selector: 'app-moje-vikendice',
  standalone: true,
  imports: [CommonModule, FormsModule, MeniVlasnikComponent],
  templateUrl: './moje-vikendice.component.html',
  styleUrls: ['./moje-vikendice.component.css']
})
export class MojeVikendiceComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private ownerService=inject(OwnerService)

  vikendice: any[] = [];
  user: string = "";
  message: string = "";
  originalName:string="";

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showJsonModal: boolean = false;

  selectedCottage: any = null;
  newCottage: any = {
    naziv: '',
    mesto: '',
    telefon: '',
    cenaLeto: 0,
    cenaZima: 0,
    usluge: '',
    koordinate: {
      lat: 0,
      lng: 0
    },
    slike: []
  };

  imagePreviews: string[] = [];
  jsonFile: File | null = null;

  validationErrors = {
    naziv: '',
    mesto: '',
    telefon: '',
    cenaLeto: '',
    cenaZima: ''
  };

  ngOnInit(): void {
    this.user = localStorage.getItem("user")!;
    this.ucitajVikendice();
  }

  ucitajVikendice(): void {
    this.ownerService.getOwnersCottages(this.user).subscribe(data=>{
        this.vikendice=data
      });
  }
  openAddModal(): void {
    this.newCottage = {
      naziv: '',
      mesto: '',
      telefon: '',
      cenaLeto: 0,
      cenaZima: 0,
      usluge: '',
      koordinate: {
        lat: 0,
        lng: 0
      },
      slike: []
    };
    this.imagePreviews = [];
    this.clearValidationErrors();
    this.showAddModal = true;
  }

  openEditModal(vikendica: Cottage): void {
    this.selectedCottage = { ...vikendica };
    this.imagePreviews = [...vikendica.slike];
    this.originalName= vikendica.naziv
    this.clearValidationErrors();
    this.showEditModal = true;
  }

  openDeleteModal(vikendica: any): void {
    this.selectedCottage = vikendica;
    this.showDeleteModal = true;
  }

  openJsonModal(): void {
    this.jsonFile = null;
    this.showJsonModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showJsonModal = false;
    this.selectedCottage = null;
    this.imagePreviews = [];
    this.clearValidationErrors();
    this.message = '';
  }


  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
          this.message = "Slike moraju biti JPG ili PNG format";
          continue;
        }

        const img = new Image();
        img.onload = () => {
          if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
            this.message = "Slika mora biti između 100x100 i 300x300 px";
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              this.imagePreviews.push(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        };
        img.src = URL.createObjectURL(file);
      }
    }
    event.target.value = ''; 
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }


  clearValidationErrors(): void {
    this.validationErrors = {
      naziv: '',
      mesto: '',
      telefon: '',
      cenaLeto: '',
      cenaZima: ''
    };
  }

  validateForm(cottage: any): boolean {
    this.clearValidationErrors();
    let isValid = true;

    if (!cottage.naziv || cottage.naziv.trim() === '') {
      this.validationErrors.naziv = 'Naziv je obavezan';
      isValid = false;
    }

    if (!cottage.mesto || cottage.mesto.trim() === '') {
      this.validationErrors.mesto = 'Mesto je obavezno';
      isValid = false;
    }

    if (!cottage.telefon || cottage.telefon.trim() === '') {
      this.validationErrors.telefon = 'Telefon je obavezan';
      isValid = false;
    } else if (!/^\+?[0-9]{6,15}$/.test(cottage.telefon)) {
      this.validationErrors.telefon = 'Telefon mora biti u ispravnom formatu';
      isValid = false;
    }

    if (!cottage.cenaLeto || cottage.cenaLeto <= 0) {
      this.validationErrors.cenaLeto = 'Cena za leto mora biti veća od 0';
      isValid = false;
    }

    if (!cottage.cenaZima || cottage.cenaZima <= 0) {
      this.validationErrors.cenaZima = 'Cena za zimu mora biti veća od 0';
      isValid = false;
    }

    return isValid;
  }

  dodajVikendicu(): void {
    if (!this.validateForm(this.newCottage)) {
      this.message = 'Popravite greške u formi';
      return;
    }

    const cottageData = {
      ...this.newCottage,
      vlasnik: this.user,
      slike: this.imagePreviews,
      status: 'aktivna',
      ocene: [],
      komentari: []
    };

    this.ownerService.addCottage(cottageData).subscribe(data=>{
        this.ucitajVikendice()
        this.closeModals()
      });
  }

  izmeniVikendicu(): void {
    if (!this.validateForm(this.selectedCottage)) {
      this.message = 'Popravite greške u formi';
      return;
    }

    const cottageData = {
      ...this.selectedCottage,
      slike: this.imagePreviews 
    };

    this.ownerService.updateCottage(this.originalName, cottageData).subscribe(data=>{
      alert(data)
        this.ucitajVikendice()
        this.closeModals()
      });
  }

  obrisiVikendicu(): void {
    this.ownerService.deleteCottage(this.selectedCottage.naziv).subscribe(data=>{
      
      this.ucitajVikendice()
      this.closeModals()
    });
  }

  
  onJsonFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      this.jsonFile = file;
    } else {
      this.message = 'Odaberite validan JSON fajl';
    }
  }

  uveziIzJson(): void {
    if (!this.jsonFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        
        const cottageData = {
          ...jsonData,
          vlasnik: this.user,
          status: 'aktivna',
          ocene: jsonData.ocene || [],
          komentari: jsonData.komentari || []
        };

        this.ownerService.addCottage(cottageData)
          .subscribe(data=>  {
            this.ucitajVikendice();
            this.closeModals()
          });
      } catch (error) {
        this.message = 'Nevalidan JSON format';
      }
    };
    reader.readAsText(this.jsonFile);
  }

  getProsecnaOcena(ocene: any[]): number {
    if (!ocene || ocene.length === 0) return 0;
    const sum = ocene.reduce((a, b) => a + b.ocena, 0);
    return Math.round((sum / ocene.length) * 10) / 10;
  }
}