import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button-search',
  templateUrl: './button-search.component.html',
  styleUrl: './button-search.component.css'
})
export class ButtonSearchComponent {

  @Output() option = new EventEmitter<string>();

  public searchOption: string = 'name';

  searChange(opt: string) {
    this.searchOption = opt;
    this.option.emit(opt);
  }
  
}
