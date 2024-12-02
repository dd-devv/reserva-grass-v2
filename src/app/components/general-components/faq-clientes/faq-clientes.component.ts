import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-faq-clientes',
  templateUrl: './faq-clientes.component.html',
  styleUrl: './faq-clientes.component.css'
})
export class FaqClientesComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

}