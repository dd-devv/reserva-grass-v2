import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq-user',
  templateUrl: './faq-user.component.html',
  styleUrl: './faq-user.component.css'
})
export class FaqUserComponent implements OnInit {

  constructor(private _title: Title) {

  }

  ngOnInit(): void {
    this._title.setTitle('Preguntas frecuentes');
  }

}
