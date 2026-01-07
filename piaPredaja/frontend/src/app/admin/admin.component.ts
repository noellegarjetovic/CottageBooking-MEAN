import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';

import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule,RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private userService=inject(UserService)
  private router=inject(Router)

  username=""
  password=""
  message=""

  login(){
    this.userService.loginAdmin(this.username,this.password).subscribe(data=>{
      if(data){
        localStorage.setItem('user',data.korime)
        this.router.navigate(['admin'])
      }else{
        this.message="Nije ispravno korisnicko ime ili sifra"
      }
    })
  }
}
