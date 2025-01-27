import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../../services/toast/toast.service';
import { UserService } from '../../../../services/user.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { Modal } from 'flowbite';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-portrait',
  templateUrl: './portrait.component.html',
  styleUrl: './portrait.component.css'
})
export class PortraitComponent implements OnInit {
  public empresa: any = {};
  public id;
  public token;
  public url;
  public show_image = false;
  public file: File | any = undefined;
  public load_btn = false;
  public isImagePort = false;
  public addImage = true;
  public isImage = false;
  private modal: Modal | null = null;

  public portada_url = '';

  imagePreview: string | ArrayBuffer | null = null;
  croppedImageFile: File | null = null;
  imageChangedEvent: any = '';
  croppedImage: SafeUrl = '';

  constructor(
    private _toastrService: ToastService,
    private _userService: UserService,
    private sanitizer: DomSanitizer,
    public router: Router
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = environment.url;
  }

  ngOnInit(): void {
    this.initModal();
    this.loadCompanyData();
  }

  private initModal(): void {
    const modalElement = document.getElementById('uploadModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  private loadCompanyData(): void {
    this._userService.obtener_empresa(this.id, this.token).subscribe({
      next: (res) => {
        this.empresa = res.data;
        
        if (this.empresa.portada) {
          if (this.empresa.portada.length >= 1) {
            this.portada_url = `https://api.reservatugrass.com/api/obtener_imagen_portada/${this.empresa.portada[0].imagen}`;
            this.isImagePort = true;
            this.addImage = false;
          } else {
            this.isImagePort = false;
            this.addImage = true;
          }
        } else {
          this.portada_url = '../../../../../assets/img-webp/default-portada.webp'
          this.isImagePort = false;
          this.addImage = true;
        }
      },
      error: (err) => {
        this.empresa = {};
        this.isImagePort = false;
        this.addImage = true;
      }
    });
  }

  openModal(): void {
    if (this.modal) {
      this.modal.show();
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
      // Resetear estados cuando se cierra el modal
      this.file = undefined;
      this.imagePreview = null;
      this.croppedImage = '';
      this.show_image = false;
    }
  }

  fileChangeEventCrop(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageChangedEvent = event;

      const allowedTypes = [
        'image/png', 'image/webp', 'image/jpg', 'image/jpeg',
        'image/PNG', 'image/WEBP', 'image/JPG', 'image/JPEG'
      ];

      if (!allowedTypes.includes(file.type)) {
        this._toastrService.warning('Solo se permiten archivos webp, jpeg, jpg, png');
        return;
      }

      this.show_image = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImageFile = new File([event.blob], 'cropped_image.png', { type: 'image/png' });
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.blob));
      this.file = this.croppedImageFile;
    }
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    this._toastrService.error('Error al cargar la imagen');
  }

  fileChangeEvent(event: any): void {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      this.showErrorMessage('No hay imagen en el envío');
      return;
    }

    if (file.size > 20000000) {
      this.showErrorMessage('La imagen no debe ser mayor a 20MB');
      return;
    }

    if (!['image/png', 'image/webp', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.type)) {
      this.showErrorMessage('El archivo debe ser una imagen');
      return;
    }

    this.file = file;
    this.convertToBase64(file);
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  subir_imagen() {
    if (!this.file) {
      this.showErrorMessage('Debe seleccionar una imagen');
      return;
    }

    this.load_btn = true;
    const uuid = uuidv4();
    const data = {
      imagen: this.file,
      _id: uuid,
    };

    this._userService.agregar_imagen_portada(this.id, data, this.token).subscribe({
      next: (response) => {
        this._toastrService.success('Se subió con éxito');
        this.file = undefined;
        this.load_btn = false;
        this.closeModal();
        this.loadCompanyData(); // Recargar datos después de subir
      },
      error: (error) => {
        this.showErrorMessage('Error al subir la imagen');
        this.load_btn = false;
      }
    });
  }

  private showErrorMessage(message: string) {
    this._toastrService.error(message);
  }
}