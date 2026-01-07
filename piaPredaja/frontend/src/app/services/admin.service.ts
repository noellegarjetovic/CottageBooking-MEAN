import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { Cottage } from '../models/cottages';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private httpClient=inject(HttpClient);

  constructor() { }

  getAllUsers(){
      return this.httpClient.get<User[]>("http://localhost:4000/admin/getAllUsers")
    }
  
  updateUserStatus(korime:string, st:string){
      return this.httpClient.post<string>("http://localhost:4000/admin/updateUserStatus",{korime:korime,status:st})
    }
  
  deleteUser(korime:string){
    return this.httpClient.post<string>("http://localhost:4000/admin/deleteUser",{korime:korime})
  }

  addUser(user:User){
    return this.httpClient.post<string>("http://localhost:4000/admin/addUser",{user:user})
  }

  updateUser(user:User){
    return this.httpClient.post<string>("http://localhost:4000/admin/updateUser",{user:user})
  }

  getAllCottages(){
    return this.httpClient.get<Cottage[]>("http://localhost:4000/admin/getAllCottages")
  }

  blockCottage(vikendica:string){
    return this.httpClient.post<string>("http://localhost:4000/admin/blockCottage",{vikendica:vikendica})
  }
  unBlockCottage(vikendica:string){
    return this.httpClient.post<string>("http://localhost:4000/admin/unBlockCottage",{vikendica:vikendica})
  }
}
