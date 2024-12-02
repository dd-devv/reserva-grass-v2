import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrl: './wait.component.css'
})
export class WaitComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

}
