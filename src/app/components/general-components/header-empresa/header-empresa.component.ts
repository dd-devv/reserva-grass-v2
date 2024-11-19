import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header-empresa',
  templateUrl: './header-empresa.component.html',
  styleUrl: './header-empresa.component.css'
})
export class HeaderEmpresaComponent implements OnInit{

  ngOnInit(): void {
    initFlowbite();
  }

}
