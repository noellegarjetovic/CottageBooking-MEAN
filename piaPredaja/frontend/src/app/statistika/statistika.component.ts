import { Component, ElementRef, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../services/owner.service';
import { Cottage } from '../models/cottages';
import { Reservation } from '../models/reservations';
import { Chart } from 'chart.js/auto';
import { MeniVlasnikComponent } from '../meni-vlasnik/meni-vlasnik.component';

@Component({
  selector: 'app-statistika',
  standalone: true,
  imports: [CommonModule, MeniVlasnikComponent],
  templateUrl: './statistika.component.html',
  styleUrl: './statistika.component.css'
})
export class StatistikaComponent implements OnInit, AfterViewInit {

  rezervacije: Reservation[] = [];
  vikendice: Cottage[] = [];
  user: string = "";
  ucitavanje: boolean = true;
  greska: string = "";

  ownerService = inject(OwnerService);

  meseci = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

  charts: any[] = []; // Čuva sve chart instance

  ngOnInit() {
    console.log('Statistika komponenta se inicijalizuje');
    this.user = localStorage.getItem("user") || "";
    
    if (!this.user) {
      this.greska = "Korisnik nije prijavljen";
      this.ucitavanje = false;
      return;
    }

    this.ucitajPodatke();
  }

  ngAfterViewInit() {
    if (!this.ucitavanje && !this.greska) {
      setTimeout(() => this.generisiSveGrafikone(), 100);
    }
  }

  async ucitajPodatke() {
    try {
      console.log('Učitavam podatke...');
      
      const vikendiceData = await this.ownerService.getOwnersCottages(this.user).toPromise();
      this.vikendice = vikendiceData || [];
      console.log('Pronađeno vikendica:', this.vikendice.length);

      if (this.vikendice.length === 0) {
        this.ucitavanje = false;
        return;
      }

      for (let vikendica of this.vikendice) {
        try {
          const rezervacijeData = await this.ownerService.getOwnersReservations(vikendica.naziv).toPromise();
          if (rezervacijeData) {
            rezervacijeData.forEach(r => {
              r.vikendica = vikendica.naziv;
              this.rezervacije.push(r);
            });
          }
        } catch (error) {
          console.error(`Greška pri učitavanju rezervacija za ${vikendica.naziv}:`, error);
        }
      }

      console.log('Ukupno rezervacija:', this.rezervacije.length);
      this.ucitavanje = false;

      setTimeout(() => this.generisiSveGrafikone(), 100);

    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
      this.greska = "Došlo je do greške pri učitavanju podataka";
      this.ucitavanje = false;
    }
  }

  // Metoda za proveru da li je rezervacija ostvarena
  jeOstvarenaRezervacija(rezervacija: Reservation): boolean {
    if (rezervacija.status !== "odobreno") {
        return false;
    }
    
    try {
        const datumKraja = new Date(rezervacija.datumKraja);
        const sada = new Date();
        return datumKraja < sada;
    } catch (error) {
        console.error('Nevalidan datum:', rezervacija.datumKraja);
        return false;
    }
  }

  generisiSveGrafikone() {
    this.unistiGrafikone();
    
    this.vikendice.forEach(vikendica => {
      this.generisiBarChartZaVikendicu(vikendica);
      this.generisiPieChartZaVikendicu(vikendica);
    });
  }

  generisiBarChartZaVikendicu(vikendica: Cottage) {
    const canvasId = 'barChart_' + vikendica.naziv;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
    if (!canvas) {
      console.log('Bar canvas nije pronađen za:', vikendica.naziv);
      return;
    }

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const brojevi = Array(12).fill(0);
      
      this.rezervacije
        .filter(r => r.vikendica === vikendica.naziv && this.jeOstvarenaRezervacija(r))
        .forEach(r => {
          try {
            const datum = new Date(r.datumPocetka);
            if (!isNaN(datum.getTime())) {
              const mesec = datum.getMonth();
              brojevi[mesec]++;
            }
          } catch (error) {
            console.error('Nevalidan datum:', r.datumPocetka);
          }
        });

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
      
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.meseci,
          datasets: [{
            label: `Ostvarene rezervacije - ${vikendica.naziv}`,
            data: brojevi,
            backgroundColor: colors[this.vikendice.indexOf(vikendica) % colors.length],
            borderColor: colors[this.vikendice.indexOf(vikendica) % colors.length],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              position: 'top'
            },
            title: { 
              display: true, 
              text: `Ostvarene rezervacije po mesecima - ${vikendica.naziv}` 
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Broj rezervacija'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Meseci'
              }
            }
          }
        }
      });

      this.charts.push(chart);
      console.log(`Bar chart generisan za: ${vikendica.naziv}`);

    } catch (error) {
      console.error('Greška pri generisanju bar charta za:', vikendica.naziv, error);
    }
  }

  generisiPieChartZaVikendicu(vikendica: Cottage) {
    const canvasId = 'pieChart_' + vikendica.naziv;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
    if (!canvas) {
      console.log('Pie canvas nije pronađen za:', vikendica.naziv);
      return;
    }

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { vikendDana, radnihDana } = this.izracunajDaneZaVikendicu(vikendica.naziv);

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Vikend dani', 'Radni dani'],
          datasets: [{
            data: [vikendDana, radnihDana],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              position: 'top'
            },
            title: { 
              display: true, 
              text: `Vikend vs Radni dani - ${vikendica.naziv}` 
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${label}: ${value} dana (${percentage}%)`;
                }
              }
            }
          }
        }
      });

      this.charts.push(chart);
      console.log(`Pie chart generisan za: ${vikendica.naziv}`);

    } catch (error) {
      console.error('Greška pri generisanju pie charta za:', vikendica.naziv, error);
    }
  }

  izracunajDaneZaVikendicu(nazivVikendice: string): { vikendDana: number, radnihDana: number } {
    let vikendDana = 0;
    let radnihDana = 0;

    this.rezervacije
      .filter(r => r.vikendica === nazivVikendice && this.jeOstvarenaRezervacija(r))
      .forEach(r => {
        try {
          const pocetak = new Date(r.datumPocetka);
          const kraj = new Date(r.datumKraja);
          
          if (!isNaN(pocetak.getTime()) && !isNaN(kraj.getTime())) {
            let current = new Date(pocetak);
            while (current < kraj) {
              const dan = current.getDay();
              if (dan === 0 || dan === 6) {
                vikendDana++;
              } else {
                radnihDana++;
              }
              current.setDate(current.getDate() + 1);
            }
          }
        } catch (error) {
          console.error('Nevalidan datum:', r.datumPocetka, r.datumKraja);
        }
      });

    return { vikendDana, radnihDana };
  }

  unistiGrafikone() {
    this.charts.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = [];
  }

  // Helper metode za prikaz u HTML-u
  getUkupnoDanaZaVikendicu(nazivVikendice: string): number {
    const { vikendDana, radnihDana } = this.izracunajDaneZaVikendicu(nazivVikendice);
    return vikendDana + radnihDana;
  }

  getVikendDanaZaVikendicu(nazivVikendice: string): number {
    const { vikendDana } = this.izracunajDaneZaVikendicu(nazivVikendice);
    return vikendDana;
  }

  getRadniDaniZaVikendicu(nazivVikendice: string): number {
    const { radnihDana } = this.izracunajDaneZaVikendicu(nazivVikendice);
    return radnihDana;
  }

  getBrojOstvarenihRezervacijaZaVikendicu(nazivVikendice: string): number {
    return this.rezervacije.filter(r => 
      r.vikendica === nazivVikendice && this.jeOstvarenaRezervacija(r)
    ).length;
  }

  // Cleanup
  ngOnDestroy() {
    this.unistiGrafikone();
  }
}