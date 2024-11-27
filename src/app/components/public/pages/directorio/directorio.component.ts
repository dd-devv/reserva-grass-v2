import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent implements OnInit {

  public primeras_empresas: Array<any> = [];
  public load_data = false;

  currentPage = 1;
  pageSize = 12;

  constructor(
    private _title: Title,
    private _userService: UserService
  ) {

  }


  ngOnInit(): void {
    this._title.setTitle('Directorio');
    this.load_data = true;

    this._userService.listar_empresas_publico().subscribe((response) => {
      if (response.data != undefined) {
        this.primeras_empresas = response.data;
        this.load_data = false;
      } else {
        this.primeras_empresas = [];
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.primeras_empresas.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}