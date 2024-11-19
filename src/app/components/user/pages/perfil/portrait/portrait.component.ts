import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portrait',
  templateUrl: './portrait.component.html',
  styleUrl: './portrait.component.css'
})
export class PortraitComponent implements OnInit {

  public user_lc: any = {};

  ngOnInit(): void {
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
  }

}
