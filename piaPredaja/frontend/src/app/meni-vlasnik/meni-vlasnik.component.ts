import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-meni-vlasnik',
  imports: [RouterLink],
  templateUrl: './meni-vlasnik.component.html',
  styleUrl: './meni-vlasnik.component.css'
})
export class MeniVlasnikComponent {
  router=inject(Router)

  
  logout() {
    localStorage.removeItem("user");
    this.router.navigate([""]);
  }

}
