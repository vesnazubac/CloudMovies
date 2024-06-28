import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Wine} from "../wine/model/wine.model";

@Component({
  selector: 'app-wine-card',
  templateUrl: './wine-card.component.html',
  styleUrls: ['./wine-card.component.css']
})
export class WineCardComponent {

  @Input()
  wine: Wine;

  @Output()
  clicked: EventEmitter<Wine> = new EventEmitter<Wine>();

  onWineClicked(): void {
    this.clicked.emit(this.wine);
  }

}
