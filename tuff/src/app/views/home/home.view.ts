import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.view.html",
  styleUrl: "./home.view.css"
})
export class HomeView {

  selectedComponent = ComponentType.RESUME;

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
  CHALLENGES = 2,
  REGISTER = 3
}
