import { Component, inject, ViewChild } from '@angular/core';
import { OwnerService } from '../services/owner.service';
import { Reservation } from '../models/reservations';
import { Cottage } from '../models/cottages';
import { CommonModule } from '@angular/common';
import { MeniVlasnikComponent } from '../meni-vlasnik/meni-vlasnik.component';
import { FormsModule } from '@angular/forms';

// FullCalendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-vlasnik-rezervacije',
  standalone: true,
  imports: [
    CommonModule,
    MeniVlasnikComponent,
    FormsModule,
    FullCalendarModule
  ],
  templateUrl: './vlasnik-rezervacije.component.html',
  styleUrls: ['./vlasnik-rezervacije.component.css'],
})
export class VlasnikRezervacijeComponent {
  @ViewChild('calendar') calendarComponent: any;

  rezervacije: Reservation[] = [];
  komentar: string = "";
  user: string = "";
  cottages: Cottage[] = [];
  selectedReservation: Reservation | null = null;
  showDialog: boolean = false;

  ownerService = inject(OwnerService);

  // Calendar options
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'block',
    eventColor: '#378006', // default color for accepted
    eventTextColor: '#ffffff',
    eventContent: function(arg) {
      return { html: `<div>${arg.event.title}</div>` }; // prikazuje samo title
    }
  };

  ngOnInit(): void {
    this.user = localStorage.getItem("user")!;
    this.ucitajRezervacije();
  }

  ucitajRezervacije() {
    this.rezervacije = [];
    this.ownerService.getOwnersCottages(this.user).subscribe((data) => {
      this.cottages = data;
      for (let c of this.cottages) {
        this.ownerService.getOwnersReservations(c.naziv).subscribe((res) => {
          for (let r of res) {
            this.rezervacije.push(r);
          }
          this.rezervacije = this.rezervacije.sort((a: any, b: any) =>
            new Date(b.datum).getTime() - new Date(a.datum).getTime()
          );
          
          // Update calendar events
          this.updateCalendarEvents();
        });
      }
    });
  }

  updateCalendarEvents() {
    const events = this.rezervacije.map(r => {
      const isPending = r.status === "na čekanju";
      return {
        id: `${r.vikendica}_${r.datumPocetka}`,
        title:r.vikendica,
        start: r.datumPocetka,
        end: r.datumKraja,
        color: isPending ? '#ffeb3b' : '#378006', // žuta za čekanje, zelena za prihvaćene
        textColor: isPending ? '#000000' : '#ffffff',
        extendedProps: {
          reservation: r
        }
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  handleEventClick(clickInfo: EventClickArg) {
    const reservation = clickInfo.event.extendedProps['reservation'];
    if (reservation.status === 'odobreno') {
      return;
    }
    this.selectedReservation = reservation;
    this.showDialog = true;
  }

  prihvatiRezervaciju(r: Reservation) {
    this.ownerService.updateStatusReservation(r.vikendica, r.datumPocetka, "odobreno","").subscribe(() => {
      this.ucitajRezervacije();
      this.closeDialog();
    });
  }

  odbijRezervaciju(r: Reservation) {
    if (!this.komentar) {
      alert("Morate uneti komentar za odbijanje rezervacije!");
      return;
    }

    this.ownerService.updateStatusReservation(r.vikendica, r.datumPocetka, "odbijeno",this.komentar).subscribe(() => {
      this.ucitajRezervacije();
      this.closeDialog();
      this.komentar = "";
    });
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedReservation = null;
  }
}