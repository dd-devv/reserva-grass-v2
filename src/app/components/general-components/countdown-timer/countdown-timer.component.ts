import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.css'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() startDate: string = new Date().toISOString(); // Acepta fecha en formato ISO
  
  private subscription: Subscription | undefined;
  private readonly FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutos en milisegundos
  
  minutes: number = 15;
  seconds: number = 0;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private startTimer() {
    // Parsea la fecha ISO a objeto Date
    const targetDate = new Date(this.startDate);
    
    // Verifica si la fecha es válida
    if (isNaN(targetDate.getTime())) {
      console.error('Fecha inválida proporcionada:', this.startDate);
      return;
    }

    // Calcula el tiempo restante inicial
    const calculateTimeLeft = (): number => {
      const now = new Date().getTime();
      const startTime = targetDate.getTime();
      return Math.max(0, this.FIFTEEN_MINUTES - (now - startTime));
    };

    // Calcula tiempo inicial
    let timeLeft = calculateTimeLeft();
    this.updateDisplay(timeLeft);

    // Actualiza el timer cada segundo
    this.subscription = interval(1000).subscribe(() => {
      timeLeft = calculateTimeLeft();
      
      if (timeLeft > 0) {
        this.updateDisplay(timeLeft);
      } else {
        this.minutes = 0;
        this.seconds = 0;
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
    });
  }

  private updateDisplay(timeInMs: number) {
    const totalSeconds = Math.floor(timeInMs / 1000);
    this.minutes = Math.floor(totalSeconds / 60);
    this.seconds = totalSeconds % 60;
  }
}