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

  private carousel: any;
  public images: ImageItem[] = [];
  private url = GLOBAL.url;

  ngOnInit(): void {
    if (this.galeria && this.galeria.length > 0) {
      this.images = this.transformGalleryToImageItems(this.galeria);
    }
  }

  private transformGalleryToImageItems(gallery: GalleryItem[]): ImageItem[] {
    return gallery.map((item, index) => ({
      id: index + 1,
      src: `${this.url}/obtener_galeria_cancha/${item.imagen}`,
      alt: `Imagen ${index + 1}`
    }));
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
        el: document.getElementById(`carousel-item-${img.id}`) as HTMLElement
      }));

      const options: CarouselOptions = {
        defaultPosition: 0,
        interval: 3000,
        indicators: {
          activeClasses: 'bg-red-800 w-6 dark:bg-red-800',
          inactiveClasses: 'bg-red-400/50 dark:bg-red-800/50 hover:bg-gray-400',
          items: this.images.map(img => ({
            position: img.id - 1,
            el: document.getElementById(`carousel-indicator-${img.id}`) as HTMLElement
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

  ngOnDestroy(): void {
    if (this.carousel) {
      this.carousel.pause();
    }
  }
}