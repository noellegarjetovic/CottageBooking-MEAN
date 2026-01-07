import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-meni',
  imports: [RouterLink],
  templateUrl: './meni.component.html',
  styleUrl: './meni.component.css'
})
export class MeniComponent {

  router=inject(Router)

  
  logout() {
    localStorage.removeItem("user");
    this.router.navigate([""]);
  }
}
