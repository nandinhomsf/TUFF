import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: "resume",
  templateUrl: "./resume.component.html",
  styleUrl: "./resume.component.css"
})
export class ResumeComponent implements OnInit {

  public isAdmin: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.isAdmin = StorageService.userAdmin();
  }

  public createChallenge() {
    this.router.navigate(["challenge"]).then(_ => console.log("Navigated to challenge creation"));
  }

}
