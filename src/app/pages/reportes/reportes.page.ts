import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MovimientosService } from '../../services/movimientos.service';
import { AgrupadoMes } from '../../models/agrupado-mes';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormsModule } from '@angular/forms';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-reportes',
  templateUrl: 'reportes.page.html',
  styleUrls: ['reportes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})

export class ReportesPage {

  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('lineCanvasDia') lineCanvasDia!: ElementRef;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef;


  barChart: any = null;
  lineChart: any = null;
  lineChartDia: any = null;

  totalesTipos: { tipo: string, valor: number }[] = [];
  coloresTipos: { [key: string]: string } = {};

  filtroMes: number = new Date().getMonth() + 1;  // Mes actual
  filtroAnio: number = new Date().getFullYear();  // Año actual

  mesesLista = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 },
  ];

  // aniosLista = [2023, 2024, 2025]; // puedes generarlos dinámicamente si quieres

  anioInicio = 2023;
  anioActual = new Date().getFullYear();
  aniosLista = Array.from({ length: this.anioActual - this.anioInicio + 1 }, (_, i) => this.anioInicio + i);

  constructor(private svc: MovimientosService,) { }

  ngOnInit() {
    this.aplicarFiltros();
  }

  ngAfterViewInit() {
    //this.barChartMethod();
    //this.lineChartMethod();
    //this.lineChartDiaMethod();
    //  this.doughnutChartMethod();

  }

  aplicarFiltros() {
    console.log("this.filtroAnio", this.filtroAnio)
    this.barChartMethod(this.filtroMes, this.filtroAnio);
    this.lineChartMethod(this.filtroAnio);   // este solo usa año completo
    this.lineChartDiaMethod(this.filtroMes, this.filtroAnio);
  }





  doughnutChartMethod(mes: number, anio: number) {
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

  barChartMethod(mes: number, anio: number) {
    console.log("barChartMethod", anio)
    this.svc.charBarMovimientos(mes, anio).subscribe((data) => {
      if (this.barChart) {
        this.barChart.destroy();
        this.barChart = null;
      }

      const labels = Object.keys(data);
      const valores = Object.values(data).map(v => Number(v));

      this.coloresTipos = {};
      const datasets = labels.map((tipo, i) => {
        let color;
        if (tipo.toLowerCase().includes('ingreso')) color = 'rgba(0, 128, 0, 0.6)';
        else if (tipo.toLowerCase().includes('gasto')) color = 'rgba(255, 0, 0, 0.6)';
        else color = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0,0.6)`;

        this.coloresTipos[tipo] = color;

        return {
          label: tipo,
          data: [valores[i]],
          backgroundColor: color,
          borderColor: `rgba(0,0,0,0.8)`,
          borderWidth: 1
        };
      });

      setTimeout(() => {
        this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'bar',
          data: { labels: ['Totales'], datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top' },
              datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#fff',
                font: { weight: 'bold', size: 14 },
                formatter: (value: number) => value.toLocaleString()
              }
            },
            scales: { y: { beginAtZero: true } }
          },
          plugins: [ChartDataLabels]
        });
        setTimeout(() => this.lineChart.resize(), 50);
      }, 10);
    });
  }
  lineChartDiaMethod(mes: number, anio: number) {
    console.log("lineChartDiaMethod", anio)
    this.svc.charLineMovimientosMesActual(mes, anio).subscribe((agrupado) => {
      if (this.lineChartDia) {
        this.lineChartDia.destroy();
        this.lineChartDia = null;
      }

      const dias = Object.keys(agrupado).sort((a, b) => Number(a) - Number(b));

      const tipos = new Set<string>();
      dias.forEach(d => Object.keys(agrupado[d]).forEach(t => tipos.add(t)));

      const datasets = Array.from(tipos).map(tipo => {
        let color;
        if (tipo.toLowerCase().includes('ingreso')) color = 'rgba(0, 128, 0, 1)';
        else if (tipo.toLowerCase().includes('gasto')) color = 'rgba(255, 0, 0, 1)';
        else color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;

        return {
          label: tipo,
          data: dias.map(d => agrupado[d][tipo] ?? 0),
          borderColor: color,
          backgroundColor: color,
          fill: false,
          tension: 0.1
        };
      });

      setTimeout(() => {
        this.lineChartDia = new Chart(this.lineCanvasDia.nativeElement, {
          type: 'line',
          data: { labels: dias, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Histórico Ingresos vs Gastos del Mes' } },
            interaction: { mode: 'index', intersect: false },
            scales: { y: { beginAtZero: true } }
          }
        });
        setTimeout(() => this.lineChart.resize(), 50);
      }, 10);
    });
  }
  lineChartMethod(anio: number) {
    console.log("lineChartMethod", anio)
    this.svc.charLineMovimientos(anio).subscribe(({ meses, datasets }) => {
      if (this.lineChart) {
        this.lineChart.destroy();
        this.lineChart = null;
      }

      const datasetsColoreados = datasets.map(ds => {
        let color;
        const tipo = ds.label.toLowerCase();

        if (tipo.includes('ingreso')) color = 'rgba(0, 128, 0, 1)';
        else if (tipo.includes('gasto')) color = 'rgba(255, 0, 0, 1)';
        else color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;

        return { ...ds, borderColor: color, backgroundColor: color, fill: false, tension: 0.1 };
      });

      setTimeout(() => {
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: { labels: meses, datasets: datasetsColoreados },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
            scales: { y: { beginAtZero: true } }
          },
          plugins: [ChartDataLabels]
        });
        setTimeout(() => this.lineChart.resize(), 50);
      }, 10);
    });
  }





}
