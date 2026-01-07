import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { VlasnikRezervacijeComponent } from './vlasnik-rezervacije.component';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { Browser } from 'leaflet';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent, VlasnikRezervacijeComponent],
  imports: [BrowserModule, FullCalendarModule, FormsModule]
  
})
export class CalendarModule { }
