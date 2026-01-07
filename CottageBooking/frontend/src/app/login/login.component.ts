import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private userService=inject(UserService)
  private router=inject(Router)

  username=""
  password=""
  message=""

  login(){
    if(this.username!="" && this.password!=""){
      this.userService.login(this.username,this.password).subscribe(data=>{
        if(data.split(" ")[0]!="Greška"){
          localStorage.setItem('user',data.split(" ")[1])
          if(data.split(" ")[0]=="turista"){
            this.router.navigate(["/profilTurista"])
          }else{
            this.router.navigate(["/profilVlasnik"])
          }
        }else{
          this.message=data
        }
      })
    }else{
      this.message="Popunite sva polja"
    }
  }
  

}
