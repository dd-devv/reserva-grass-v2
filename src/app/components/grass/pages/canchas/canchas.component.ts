// canchas.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { initFlowbite } from 'flowbite';
import type { CarouselItem, CarouselOptions } from 'flowbite';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-canchas',
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.css'
})
export class CanchasComponent implements AfterViewInit, OnDestroy {

  public galeria: Array<any> = [];


  @ViewChild('carouselExample') carouselElement!: ElementRef;

  private carousel: any;

  images: ImageItem[] = [
    {
      id: 1,
      src: "https://images.pexels.com/photos/9517939/pexels-photo-9517939.jpeg",
      alt: "Cancha 1"
    },
    {
      id: 2,
      src: "https://images.pexels.com/photos/13920037/pexels-photo-13920037.jpeg",
      alt: "Cancha 2"
    },
    {
      id: 3,
      src: "https://images.pexels.com/photos/16384666/pexels-photo-16384666/free-photo-of-hombres-jugando-un-partido-de-futbol.jpeg",
      alt: "Cancha 3"
    },
    {
      id: 4,
      src: "https://images.pexels.com/photos/13633979/pexels-photo-13633979.jpeg",
      alt: "Cancha 4"
    }
  ];

  ngAfterViewInit(): void {
    // Initialize Flowbite
    initFlowbite();

    // Wait for DOM to be ready
    setTimeout(() => {
      this.initializeCarousel();
    }, 0);
  }

  private initializeCarousel(): void {
    if (this.carouselElement) {
      const items: CarouselItem[] = this.images.map(img => ({
        position: img.id - 1,
        el: document.getElementById(`carousel-item-${img.id}`) as HTMLElement
      }));

      const options: CarouselOptions = {
        defaultPosition: 0,
        interval: 3000,
        indicators: {
          activeClasses: 'bg-red-800 w-6 dark:bg-gray-800',
          inactiveClasses: 'bg-gray-400/50 dark:bg-gray-800/50 hover:bg-gray-400',
          items: this.images.map(img => ({
            position: img.id - 1,
            el: document.getElementById(`carousel-indicator-${img.id}`) as HTMLElement
          }))
        }
      };

      // Initialize the carousel
      this.carousel = new (window as any).Carousel(
        this.carouselElement.nativeElement,
        items,
        options
      );

      // Start the carousel
      this.carousel.cycle();
    }
  }

 
  ngOnDestroy(): void {
    if (this.carousel) {
      this.carousel.pause();
    }
  }
}