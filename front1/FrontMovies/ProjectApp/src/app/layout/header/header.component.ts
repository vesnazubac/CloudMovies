import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('textColorInOut', [
      state('in', style({
        color: 'white' 
      })),
      state('out', style({
        color: 'blue'
      })),
      transition('in <=> out', animate('3s ease-in-out')),
    ]),
    trigger('fadeInOut', [
      state('in', style({
        opacity: 1,
      })),
      state('out', style({
        opacity: 0,
      })),
      transition('in <=> out', animate('1s ease-in-out')),
    ]),
  ]
})
export class HeaderComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  imagePaths: string[] = ['../../../assets/images/avatar.jpg','../../../assets/images/dune.jpg','../../../assets/images/drive.jpg','../../../assets/images/minionigrupa.jpg','../../../assets/images/winnie.jpg' ,"../../../assets/images/iceage.jpg",
    '../../../assets/images/stitch.jpg'
 
                                        ]
  currentImageIndex = 0
  currentState = 'in'

  ngOnInit(): void {
    setInterval(() => {
      this.showNextImage();
    }, 3000); // Ubrzan interval
  }

  showNextImage() {
    this.currentState = 'out';
    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.currentImageIndex < this.imagePaths.length - 1) {
        this.currentImageIndex = this.currentImageIndex + 1;
      } else {
        this.currentImageIndex = 0;
      }

      this.currentState = 'in';
      this.cdr.detectChanges();
    }, 1000); // Brži prelaz
  }
}
