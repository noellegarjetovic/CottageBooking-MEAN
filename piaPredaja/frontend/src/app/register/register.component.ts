import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);


  u: User = {
    korime: '',
    lozinka: '',
    ime: '',
    prezime: '',
    pol: '',
    adresa: '',
    telefon: '',
    email: '',
    slika:'',
    kartica: '',
    tip: '',
    status: 'cekanje'
  };

  message = '';
  type = '';
  imageBase64: string | null = null; 

  validationErrors = {
    korime: '',
    lozinka: '',
    ime: '',
    prezime: '',
    pol: '',
    adresa: '',
    telefon: '',
    email: '',
    kartica: '',
    tip: '',
    slika: ''
  };

  register() {
    this.message = '';
    
    if (!this.validateAll()) {
      this.message = 'Popravite greške u formi pre slanja';
      return;
    }
    const userData: User = {
      korime: this.u.korime,
      lozinka: this.u.lozinka,
      ime: this.u.ime,
      prezime: this.u.prezime,
      pol: this.u.pol,
      adresa: this.u.adresa,
      telefon: this.u.telefon,
      email: this.u.email,
      slika: this.imageBase64 || "",
      kartica: this.u.kartica,
      tip: this.u.tip,
      status: 'cekanje'
    };

    this.userService.register(userData).subscribe(data => {
        this.message = data.message;
        if (data.message === "Uspesna registracija") {
          this.router.navigate([''])
        }
      }
    );
  }
  

  selectedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        this.validationErrors.slika = "Slika mora biti JPG ili PNG";
        input.value = '';
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
          this.validationErrors.slika = "Slika mora biti između 100x100 i 300x300 px";
          input.value = '';
          this.imageBase64 = null;
        } else {
          this.validationErrors.slika = '';
          const reader = new FileReader();
          reader.onload = () => {
            this.imageBase64 = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  }

  validateAll(): boolean {
    let isValid = true;
    
    this.validationErrors = {
      korime: '',
      lozinka: '',
      ime: '',
      prezime: '',
      pol: '',
      adresa: '',
      telefon: '',
      email: '',
      kartica: '',
      tip: '',
      slika: ''
    };

    if (!this.u.korime) {
      this.validationErrors.korime = 'Korisničko ime je obavezno';
      isValid = false;
    } else if (this.u.korime.length < 3) {
      this.validationErrors.korime = 'Korisničko ime mora imati najmanje 3 karaktera';
      isValid = false;
    }

    if (!this.u.lozinka) {
      this.validationErrors.lozinka = 'Lozinka je obavezna';
      isValid = false;
    } else {
      const passwordErrors = this.validatePassword(this.u.lozinka);
      if (passwordErrors) {
        this.validationErrors.lozinka = passwordErrors;
        isValid = false;
      }
    }

    if (!this.u.ime) {
      this.validationErrors.ime = 'Ime je obavezno';
      isValid = false;
    } else if (!/^[A-Za-zŽžĆćČčŠšĐđ]+$/.test(this.u.ime)) {
      this.validationErrors.ime = 'Ime može sadržati samo slova';
      isValid = false;
    }


    if (!this.u.prezime) {
      this.validationErrors.prezime = 'Prezime je obavezno';
      isValid = false;
    } else if (!/^[A-Za-zŽžĆćČčŠšĐđ]+$/.test(this.u.prezime)) {
      this.validationErrors.prezime = 'Prezime može sadržati samo slova';
      isValid = false;
    }

    
    if (!this.u.pol) {
      this.validationErrors.pol = 'Pol je obavezan';
      isValid = false;
    }

  
    if (!this.u.adresa) {
      this.validationErrors.adresa = 'Adresa je obavezna';
      isValid = false;
    }

  
    if (!this.u.telefon) {
      this.validationErrors.telefon = 'Telefon je obavezan';
      isValid = false;
    } else if (!/^\+?[0-9]{6,15}$/.test(this.u.telefon)) {
      this.validationErrors.telefon = 'Telefon mora biti u formatu +xxxxxxxxxxx ili imati samo cifre (6-15 cifara)';
      isValid = false;
    }

    
    if (!this.u.email) {
      this.validationErrors.email = 'Email je obavezan';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.u.email)) {
      this.validationErrors.email = 'Email nije u ispravnom formatu';
      isValid = false;
    }

    
    if (!this.u.kartica) {
      this.validationErrors.kartica = 'Broj kartice je obavezan';
      isValid = false;
    } else {
      const cardErrors = this.validateCard(this.u.kartica);
      if (cardErrors) {
        this.validationErrors.kartica = cardErrors;
        isValid = false;
      }
    }

    
    if (!this.u.tip) {
      this.validationErrors.tip = 'Tip korisnika je obavezan';
      isValid = false;
    }

    return isValid;
  }

  validatePassword(password: string): string {
    let errors = '';
    
    if (!/^[A-Za-z]/.test(password)) errors += 'Lozinka mora početi slovom\n';
    if (!/^.{6,10}$/.test(password)) errors += 'Lozinka mora imati između 6 i 10 karaktera\n';
    if (!/[A-Z]/.test(password)) errors += 'Lozinka mora imati bar jedno veliko slovo\n';
    if (!/([^a-z]*[a-z][^a-z]*){3}/.test(password)) errors += 'Lozinka mora imati bar 3 mala slova\n';
    if (!/[0-9]/.test(password)) errors += 'Lozinka mora imati bar jedan broj\n';
    if (!/[!@#$%^&*]/.test(password)) errors += 'Lozinka mora imati bar jedan specijalni karakter\n';
    
    return errors;
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

  cardType() {
    const cleanCard = this.u.kartica.replace(/\s/g, '');
    
    if (/^(300|301|302|303|36|38)\d*$/.test(cleanCard)) {
      if (cleanCard.length === 15) this.type = "diners";
      else this.type = "";
    } else if (/^(51|52|53|54|55)\d*$/.test(cleanCard)) {
      if (cleanCard.length === 16) this.type = "mastercard";
      else this.type = "";
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d*$/.test(cleanCard)) {
      if (cleanCard.length === 16) this.type = "visa";
      else this.type = "";
    } else {
      this.type = "";
    }
  }

}