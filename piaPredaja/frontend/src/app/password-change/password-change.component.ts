import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-change',
  imports: [FormsModule, RouterLink],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  private userService=inject(UserService)
  private router=inject(Router)

  username=""
  oldPass=""
  newPass=""
  message=""
  newPassAgain=""
  

  passwordChange(){
    if(this.username=="" || this.oldPass=="" || this.newPass=="" || this.newPassAgain=="") {
      this.message="Unesite sva polja"
      return;
    }
    if(this.newPass==this.newPassAgain){
      this.userService.passwordChange(this.username,this.oldPass,this.newPass).subscribe(data=>{
        this.message=data.message
        if(data.message=="Uspesno ste promenili lozinku"){
          this.router.navigate([''])
        }
      })
    }else{
      this.message="Nova i ponovljena lozinka treba da budu iste"
    }
  }

  
}
