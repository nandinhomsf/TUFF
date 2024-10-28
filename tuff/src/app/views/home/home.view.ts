import { Component } from "@angular/core";
import {EventService} from "../../services/event.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.view.html",
  styleUrl: "./home.view.css"
})
export class HomeView {

  loading: boolean = false;

  selectedComponent = ComponentType.RESUME;

  constructor() {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  protected readonly ComponentType = ComponentType;

  public buttonColor(componentButton: ComponentType) {
    return this.selectedComponent === componentButton ? "primary" : "accent";
  }

  public isSelected(componentButton: ComponentType) {
    return this.selectedComponent === componentButton;
  }

  public selectComponent(componentButton: ComponentType) {
    this.selectedComponent = componentButton;
  }
}

enum ComponentType {
  RESUME = 0,
  PROFILE = 1,
  CHALLENGES = 2
}
