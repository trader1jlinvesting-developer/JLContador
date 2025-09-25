import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MovimientosService } from '../services/movimientos.service';
import { AgrupadoMes } from '../models/agrupado-mes';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule,],
})

export class HomePage {

  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('lineCanvasDia') lineCanvasDia!: ElementRef;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef;

  barChart: any;
  lineChartDia: any;
  lineChart: any;
  totalesTipos: { tipo: string, valor: number }[] = [];
  coloresTipos: { [key: string]: string } = {};


  constructor(private svc: MovimientosService,) { }

  ngAfterViewInit() {
    this.barChartMethod();
    //  this.doughnutChartMethod();
    this.lineChartMethod();
    this.lineChartDiaMethod();
  }


  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.svc.charBarMovimientos().subscribe((data) => {
      const labels = Object.keys(data);
      const valores = Object.values(data).map(v => Number(v));

      // generar colores una sola vez y guardarlos
      this.coloresTipos = {};
      const datasets = labels.map((tipo, i) => {
        const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
        this.coloresTipos[tipo] = color;

        return {
          label: tipo, // 👈 cada dataset tiene como etiqueta el tipo
          data: [valores[i]], // 👈 solo un valor en cada dataset
          backgroundColor: color,
          borderColor: `rgba(0,0,0,0.8)`,
          borderWidth: 1
        };
      });

      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Totales'],
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            datalabels: {   // 👈 configuración del plugin
              anchor: 'center',
              align: 'center',
              color: '#fff',  // texto blanco dentro de la barra,   // color del texto
              font: {
                weight: 'bold',
                size: 14
              },
              formatter: (value: number) => value.toLocaleString() // separador de miles
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        },
        plugins: [ChartDataLabels] // 👈 importante
      });


      // datos para los cards
      this.totalesTipos = labels.map((tipo, i) => ({
        tipo: tipo,
        valor: valores[i]
      }));
    });


  }

  doughnutChartMethod() {
    /**this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
       type: 'doughnut',
       data: {
         labels: ['Ingresos', 'Gastos'],
         datasets: [{
           label: 'Total $',
           data: [50000, 29000],
           backgroundColor: [
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 159, 64, 0.2)',
             
           ],
           hoverBackgroundColor: [
             '#FF6384',
             '#FFCE56',
             
           ]
         }]
       }
     }); */
  }



  lineChartDiaMethod() {
    this.svc.charLineMovimientosMesActual().subscribe((agrupado: AgrupadoMes) => {
      const dias = Object.keys(agrupado).sort((a, b) => Number(a) - Number(b));

      // 👇 Set global de tipos (se asegura que incluya todos, incluso CXC)
      const tipos = new Set<string>();
      dias.forEach(d => {
        Object.keys(agrupado[d]).forEach(t => tipos.add(t));
      });

      const datasets = Array.from(tipos).map(tipo => {
        const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
        return {
          label: tipo,
          data: dias.map(d => agrupado[d][tipo] ?? 0), // 👈 Si no existe, lo rellena con 0
          borderColor: color,
          backgroundColor: color,
          fill: false,
          tension: 0.1
        };
      });

      this.lineChartDia = new Chart(this.lineCanvasDia.nativeElement, {
        type: 'line',
        data: {
          labels: dias,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Histórico Ingresos vs Gastos del Mes'
            }
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }



  lineChartMethod() {
    this.svc.charLineMovimientos().subscribe(({ meses, datasets }) => {
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: meses,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'top' },
            datalabels: {
              align: 'top',
              anchor: 'end',
              color: '#000',
              font: { weight: 'bold', size: 11 },
              formatter: (value: number) => value > 0 ? value.toLocaleString() : ''
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        },
        plugins: [ChartDataLabels]
      });
    });
  }




}
