import { Component, inject } from '@angular/core';
import { TouristCottagesService } from '../services/tourist-cottages.service';
import { Reservation } from '../models/reservations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeniComponent } from '../meni/meni.component';
import { Cottage } from '../models/cottages';

@Component({
  selector: 'app-tourist-reservations',
  imports: [CommonModule, FormsModule, MeniComponent],
  templateUrl: './tourist-reservations.component.html',
  styleUrl: './tourist-reservations.component.css'
})
export class TouristReservationsComponent {
  private cottagesService = inject(TouristCottagesService);

  currentReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];
  user:string=""
  vikendica:Cottage[]=[]

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.user=localStorage.getItem("user")!;
    this.cottagesService.getMyReservations(this.user).subscribe((res) => {
      const today = new Date();
      
      this.currentReservations = res.filter(r => new Date(r.datumKraja) >= today);
      this.pastReservations = res
        .filter(r => new Date(r.datumKraja) < today)
        .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
      for(let i=0;i<res.length;i++){
        this.cottagesService.getCottage(res[i].vikendica).subscribe(data=>{
          this.vikendica[i]=data;
        })
      }
    });
  }

  getCottageName(cottageId: string) {
    // pretpostavljamo da imamo lokalni cache vikendica ili fetchujemo na klik
    return this.cottagesService.getCottage(cottageId).subscribe(c => c.naziv);
  }

  

  showCommentForm: boolean = false;
  selectedReservation: Reservation | null = null;
  newComment: string = '';
  newRating: number = 0;

  openCommentForm(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.showCommentForm = true;
    this.newComment = '';
    this.newRating = 0;
  }

  cancelComment() {
    this.showCommentForm = false;
    this.selectedReservation = null;
    this.newComment = '';
    this.newRating = 0;
  }

  submitComment() {
    if (!this.newComment || this.newRating === 0) {
      alert('Morate uneti komentar i ocenu!');
      return;
    }
    if (!this.selectedReservation) return;
    
    this.cottagesService.submitReservationComment(this.selectedReservation.vikendica, this.selectedReservation.datumPocetka, this.newComment, this.newRating, this.user).
    subscribe((str) => {
      alert(str)
      this.selectedReservation!.komentar = this.newComment;
      this.selectedReservation!.ocena = this.newRating;
      this.cancelComment();
    });
  }

  message:string=""
  otkazi(r:Reservation){
    const danas = new Date();
    const datumPocetka = new Date(r.datumPocetka);

    const razlikaUDanima = Math.floor((datumPocetka.getTime() - danas.getTime()) / (1000 * 60 * 60 * 24));

    if (razlikaUDanima < 1) {
      this.message="Rezervaciju je moguće otkazati samo dan ili više pre početka!";
      return;
    }
    this.cottagesService.deleteReservation(r.vikendica,r.datumPocetka).subscribe(data=>{
      this.ngOnInit()
    })

  }


}
