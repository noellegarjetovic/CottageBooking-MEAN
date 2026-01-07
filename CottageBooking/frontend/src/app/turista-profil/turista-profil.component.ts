import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MeniComponent } from '../meni/meni.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-turista-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, MeniComponent],
  templateUrl: './turista-profil.component.html',
  styleUrls: ['./turista-profil.component.css']
})
export class TuristaProfilComponent {

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
    telefon: '',
    kartica: ''
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
      ime: '', prezime: '', adresa: '', email: '', telefon: '', kartica: ''
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

    // Kartica
    if (!this.tourist.kartica) {
      this.validationErrors.kartica = 'Broj kartice je obavezan';
      isValid = false;
    } else {
      const cardError = this.validateCard(this.tourist.kartica);
      if (cardError) {
        this.validationErrors.kartica = cardError;
        isValid = false;
      }
    }

    return isValid;
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
      return 'Nije odgovarajući tip kartice (Diners, MasterCard ili Visa)';
    }
    
    return '';
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
      kartica: this.tourist.kartica,
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