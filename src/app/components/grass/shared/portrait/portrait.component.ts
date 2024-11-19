import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';

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

  imagePreview: string | ArrayBuffer | null = null;
  croppedImageFile: File | null = null;
  imageChangedEvent: any = '';
  croppedImage: SafeUrl = '';

  constructor(
    private _toastrService: ToastService,
    private _userService: UserService,
    private sanitizer: DomSanitizer
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {

    this._userService
      .obtener_empresa(this.id, this.token)
      .subscribe({
        next: (res) => {
          this.empresa = res.data;
          if (this.empresa.portada) {
            if (this.empresa.portada.length >= 1) {
              this.isImagePort = true;
              this.addImage = false;
            } else {
              this.isImagePort = false;
              this.addImage = true;
            }
          } else {
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

  fileChangeEventCrop(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageChangedEvent = event;

      const allowedTypes = [
        'image/png', 'image/webp', 'image/jpg', 'image/jpeg',
        'image/PNG', 'image/WEBP', 'image/JPG', 'image/JPEG'
      ];

      if (!allowedTypes.includes(file.type)) {
        this._toastrService.showToast('Solo se permiten archivos webp, jpeg, jpg, png');
        return;
      }

      this.show_image = true;

      // Continúa con el procesamiento de la imagen si el tipo es válido
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      // Crear un nuevo archivo a partir del blob
      this.croppedImageFile = new File([event.blob], 'cropped_image.png', { type: 'image/png' });

      // Crear una URL para previsualización
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.blob));

      // Asignar el archivo a foto_perfil (asumiendo que foto_perfil es de tipo File)
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
    // show message
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

    if (
      ![
        'image/png',
        'image/webp',
        'image/jpg',
        'image/jpeg',
        'image/gif',
      ].includes(file.type)
    ) {
      this.showErrorMessage('El archivo debe ser una imagen');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.file = file;

    if (file) {
      // Convierte el archivo en una URL de datos (data URL)
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Asigna la URL de datos a la propiedad imagePreview
      this.imagePreview = e.target.result;
    };

    // Lee el contenido del archivo como una URL de datos
    reader.readAsDataURL(file);
  }

  subir_imagen() {
    this.load_btn = true;
    const uuid = uuidv4();

    if (this.file) {
      const data = {
        imagen: this.file,
        _id: uuid,
      };

      this._userService
        .agregar_imagen_portada(this.id, data, this.token)
        .subscribe((response) => {
          this._toastrService.showToast(
            'Se subió con éxito');
          this.file = undefined;
          this.load_btn = false;
        });
    } else {
      this.showErrorMessage('Debe seleccionar una imagen');
      this.load_btn = false;
    }
  }

  private showErrorMessage(message: string) {
    this._toastrService.showToast(message);
  }

}
