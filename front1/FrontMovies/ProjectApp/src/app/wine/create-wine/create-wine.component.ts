import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {WineService} from "../wine.service";
import {Router} from "@angular/router";
import {Wine} from "../wine/model/wine.model";

@Component({
  selector: 'app-create-wine',
  templateUrl: './create-wine.component.html',
  styleUrls: ['./create-wine.component.css']
})
export class CreateWineComponent {

  createWineForm = new FormGroup({
    name: new FormControl(),
    year: new FormControl(),
    grapes: new FormControl(),
    country: new FormControl(),
    region: new FormControl('Republika Srbija', [Validators.required]),
  });

  constructor(private wineService: WineService, private router: Router) {}

  ngOnInit(): void {}

  create() {
    if (this.createWineForm.valid) {
      const wine: Wine = {
        name: this.createWineForm.value.name,
        description: '',
        year: this.createWineForm.value.year,
        grapes: this.createWineForm.value.grapes,
        country: this.createWineForm.value.country,
        region: this.createWineForm.value.region ?? '',
        picture: '',
      };
      this.wineService.add(wine).subscribe(
        {
          next: (data: Wine) => {
            this.router.navigate(['wine'])
          },
          error: (_) => {}
        }
      );
    }
  }

}
