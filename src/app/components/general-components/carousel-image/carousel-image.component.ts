import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from '../../../services/global';
import { CarouselItem, CarouselOptions, initFlowbite } from 'flowbite';

interface GalleryItem {
  imagen: string;
  _id: string;
}

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carousel-image',
  templateUrl: './carousel-image.component.html',
  styleUrl: './carousel-image.component.css'
})
export class CarouselImageComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() galeria: GalleryItem[] = [];
  @ViewChild('carouselExample') carouselElement!: ElementRef;
  @Input() tipo = 'Fútbol/Futsal';

  private carousel: any;
  public images: ImageItem[] = [];
  private url = GLOBAL.url;
  public uniqueId: string;

  constructor() {
    this.uniqueId = Math.random().toString(36).substring(2, 15);
  }

  ngOnInit(): void {
    if (this.galeria && this.galeria.length > 0) {
      this.images = this.transformGalleryToImageItems(this.galeria);
    }
  }

  getIndicatorClasses(): string {
    switch (this.tipo) {
      case 'Voley':
        return 'bg-pink-400/50 dark:bg-pink-500/50 hover:bg-pink-400 rounded-full size-2.5';
      case 'Mixto':
        return 'bg-purple-400/50 dark:bg-purple-500/50 hover:bg-purple-400 rounded-full size-2.5';
      default: // Futbol o Futsal
        return 'bg-forestGreen-400/50 dark:bg-forestGreen-500/50 hover:bg-forestGreen-400 rounded-full size-2.5';
    }
  }

  private transformGalleryToImageItems(gallery: GalleryItem[]): ImageItem[] {
    return gallery.map((item, index) => ({
      id: index + 1,
      src: `${this.url}/obtener_galeria_cancha/${item.imagen}`,
      alt: `Imagen ${index + 1}`
    }));
  }

  getItemId(imageId: number): string {
    return `carousel-item-${this.uniqueId}-${imageId}`;
  }

  getIndicatorId(imageId: number): string {
    return `carousel-indicator-${this.uniqueId}-${imageId}`;
  }

  ngAfterViewInit(): void {
    initFlowbite();
    setTimeout(() => {
      this.initializeCarousel();
    }, 0);
  }

  private initializeCarousel(): void {
    if (this.carouselElement && this.images.length > 0) {
      const items: CarouselItem[] = this.images.map(img => ({
        position: img.id - 1,
        el: document.getElementById(this.getItemId(img.id)) as HTMLElement
      }));

      const options: CarouselOptions = {
        defaultPosition: 0,
        interval: 4500,
        indicators: {
          activeClasses: this.getActiveIndicatorClasses(),
          inactiveClasses: this.getIndicatorClasses(),
          items: this.images.map(img => ({
            position: img.id - 1,
            el: document.getElementById(this.getIndicatorId(img.id)) as HTMLElement
          }))
        }
      };

      this.carousel = new (window as any).Carousel(
        this.carouselElement.nativeElement,
        items,
        options
      );

      this.carousel.cycle();
    }
  }

  private getActiveIndicatorClasses(): string {
    switch (this.tipo) {
      case 'Voley':
        return 'bg-pink-500 w-6 dark:bg-pink-500';
      case 'Mixto':
        return 'bg-purple-500 w-6 dark:bg-purple-500';
      default: // Futbol o Futsal
        return 'bg-forestGreen-500 w-6 dark:bg-forestGreen-500';
    }
  }

  ngOnDestroy(): void {
    if (this.carousel) {
      this.carousel.pause();
    }
  }
}