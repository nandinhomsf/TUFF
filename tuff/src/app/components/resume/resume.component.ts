import { Component } from "@angular/core";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: "resume",
  templateUrl: "./resume.component.html",
  styleUrl: "./resume.component.css"
})
export class ResumeComponent {

  public isAdmin: boolean;

  constructor(private router: Router) {
    this.isAdmin = StorageService.userAdmin();
  }

  public createChallenge() {
    this.router.navigate(["challenge"]).then(_ => console.log("Navigated to challenge creation"));
  }

}
