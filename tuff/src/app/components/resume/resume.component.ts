import { Component } from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "resume",
  templateUrl: "./resume.component.html",
  styleUrl: "./resume.component.css"
})
export class ResumeComponent {

  constructor(private router: Router) {
  }

  public createChallenge() {
    this.router.navigate(["challenge"]).then(_ => console.log("Navigated to challenge creation"));
  }

}
