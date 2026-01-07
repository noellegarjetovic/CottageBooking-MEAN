import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private httpClient=inject(HttpClient)

  login(username:string, pass:string){
    const data={
      korime:username,
      lozinka:pass
    }
    return this.httpClient.post<string>("http://localhost:4000/users/login",data)
  }

  register(user:User){
    return this.httpClient.post<Message>("http://localhost:4000/users/register",user)
  }

  loginAdmin(username:string, pass:string){
    const data={
      korime:username,
      lozinka:pass
    }
    return this.httpClient.post<User>("http://localhost:4000/users/loginAdmin",data)
  }

  passwordChange(username:string, oldPass:string, newPass:string){
    const data={
      korime:username,
      staraL:oldPass,
      novaL:newPass
    }
    return this.httpClient.post<Message>("http://localhost:4000/users/passwordChange",data)
  }

  passwordChangeAdmin(username:string, oldPass:string, newPass:string){
    const data={
      korime:username,
      staraL:oldPass,
      novaL:newPass
    }
    return this.httpClient.post<Message>("http://localhost:4000/users/passwordChangeAdmin",data)
  }

  getUser(username:string){
    return this.httpClient.post<User>("http://localhost:4000/tourist/getUser",{korime:username})
  }

  updateUser(username:string,userData:any){
    return this.httpClient.post<string>("http://localhost:4000/tourist/updateUser",{korime:username,userData:userData})
  }


}
