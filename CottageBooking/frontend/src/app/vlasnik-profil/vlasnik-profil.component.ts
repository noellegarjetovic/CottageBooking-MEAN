import { Component, inject } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { MeniVlasnikComponent } from '../meni-vlasnik/meni-vlasnik.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vlasnik-profil',
  imports: [MeniVlasnikComponent, FormsModule, CommonModule],
  templateUrl: './vlasnik-profil.component.html',
  styleUrl: './vlasnik-profil.component.css'
})
export class VlasnikProfilComponent {
  
  tourist: User = new User();
  originalTourist: User = new User();
  editMode: boolean = false;
  selectedImage: string | null = null;
  user: string = "";
  message: string = "";
  isCheckingEmail: boolean = false;

  validationErrors = {
    ime: '',
    prezime: '',
    adresa: '',
    email: '',
    telefon: ''
  };

  private userService = inject(UserService)
  private httpClient = inject(HttpClient)

  ngOnInit(): void {
    this.user = localStorage.getItem("user")!;
    this.userService.getUser(this.user).subscribe(data => {
      this.tourist = data;
      this.originalTourist = { ...data };
    })
  }

  toggleEdit() {
    if (this.editMode) {
      this.tourist = { ...this.originalTourist };
      this.selectedImage = null;
      this.clearValidationErrors();
      this.message = '';
    }
    this.editMode = !this.editMode;
  }

  selectedFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        this.message = "Slika mora biti JPG ili PNG format";
        event.target.value = '';
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
          this.message = "Slika mora biti između 100x100 i 300x300 px";
          event.target.value = '';
          this.selectedImage = null;
        } else {
          this.message = '';
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImage = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  }

  clearValidationErrors() {
    this.validationErrors = {
      ime: '', prezime: '', adresa: '', email: '', telefon: ''
    };
  }

  validateForm(): boolean {
    this.clearValidationErrors();
    let isValid = true;

    // Ime
    if (!this.tourist.ime) {
      this.validationErrors.ime = 'Ime je obavezno';
      isValid = false;
    }

    // Prezime
    if (!this.tourist.prezime) {
      this.validationErrors.prezime = 'Prezime je obavezno';
      isValid = false;
    }

    // Adresa
    if (!this.tourist.adresa) {
      this.validationErrors.adresa = 'Adresa je obavezna';
      isValid = false;
    }

    // Email
    if (!this.tourist.email) {
      this.validationErrors.email = 'Email je obavezan';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.tourist.email)) {
      this.validationErrors.email = 'Email nije u ispravnom formatu';
      isValid = false;
    }

    // Telefon
    if (!this.tourist.telefon) {
      this.validationErrors.telefon = 'Telefon je obavezan';
      isValid = false;
    } else if (!/^\+?[0-9]{6,15}$/.test(this.tourist.telefon)) {
      this.validationErrors.telefon = 'Telefon mora biti u formatu +xxxxxxxxxxx';
      isValid = false;
    }

    return isValid;
  }

  saveChanges() {
    this.message = '';

    if (!this.validateForm()) {
      this.message = 'Popravite greške u formi pre čuvanja';
      return;
    }

    const userData = {
      ime: this.tourist.ime,
      prezime: this.tourist.prezime,
      adresa: this.tourist.adresa,
      email: this.tourist.email,
      telefon: this.tourist.telefon,
      slika: this.selectedImage || this.tourist.slika,
      korime: this.user 
    };

    this.userService.updateUser(this.user, userData).subscribe(data=>{
      if(data=="Korisnik uspešno ažuriran"){
        this.editMode=false;
        this.ngOnInit();
      }else{
        this.message=data
      }
    })
  }
}