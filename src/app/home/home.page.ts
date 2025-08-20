import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ], 
})

export class HomePage {

 @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('lineCanvasDia') lineCanvasDia!: ElementRef;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef;

  barChart: any;
  lineChartDia: any;
  lineChart: any;

  constructor() {}

 ngAfterViewInit() {
    this.barChartMethod();
  //  this.doughnutChartMethod();
    this.lineChartMethod();
    this.lineChartDiaMethod();
  }


barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Ingresos', 'Gatos'],
        datasets: [{
          label: 'Ingresos Vs Gastos',
          data: [200000, 50000],
          backgroundColor: [
            'rgba(64, 204, 18, 0.65)',
            'rgba(255, 99, 133, 0.59)',
           
          ],
          borderColor: [
            'rgba(69, 235, 54, 1)',
            'rgba(255,99,132,1)',
           
          ],
          borderWidth: 1
        }]
      },
      options: {

        scales: {
          y: {
            beginAtZero: true
          }

        }
      }
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
    this.lineChartDia = new Chart(this.lineCanvasDia.nativeElement, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        datasets: [
          {
            label: 'Ingresos',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(0,255,187,1)',
            borderColor: 'rgba(0,255,187,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(0,255,187,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(0,255,187,1)',
            pointHoverBorderColor: 'rgba(0,255,187,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65000, 59000, 80000, 81000, 56000, 55000, 40000, 10000, 5000, 50000, 10000, 15000],
            spanGaps: false,
          },
          {
            label: 'Gastos',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(234,70,70,1)',
            borderColor: 'rgba(234,70,70,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(234,70,70,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(234,70,70,1)',
            pointHoverBorderColor: 'rgba(234,70,70,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [75000, 89000, 90000, 11000, 26000, 35000, 10000, 60000, 78000, 80000, 10000, 45000],
            spanGaps: false,
          }
        ]
      }
    });
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'Ingresos',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(0,255,187,1)',
            borderColor: 'rgba(0,255,187,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(0,255,187,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(0,255,187,1)',
            pointHoverBorderColor: 'rgba(0,255,187,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65000, 59000, 80000, 81000, 56000, 55000, 40000, 10000, 5000, 50000, 10000, 15000],
            spanGaps: false,
          },
          {
            label: 'Gastos',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(234,70,70,1)',
            borderColor: 'rgba(234,70,70,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(234,70,70,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(234,70,70,1)',
            pointHoverBorderColor: 'rgba(234,70,70,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [75000, 89000, 90000, 11000, 26000, 35000, 10000, 60000, 78000, 80000, 10000, 45000],
            spanGaps: false,
          }
        ]
      }
    });
  }



}
