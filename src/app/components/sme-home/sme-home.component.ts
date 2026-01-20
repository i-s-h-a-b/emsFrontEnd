import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sme-home',
  imports: [RouterLink],
  templateUrl: './sme-home.component.html',
  styleUrl: './sme-home.component.css'
})
export class SmeHomeComponent {
  smeName = 'SME Officer';
}