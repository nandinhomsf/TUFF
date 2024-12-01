import {Component} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RecoveryUseCase} from "../../usecases/authentication/recovery.usecase";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "recovery-form",
  templateUrl: "./recovery.view.html",
  styleUrls: ["./recovery.view.css"],
  providers: [MatSnackBar]
})
export class RecoveryView {

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  });

  constructor(private snackBar: MatSnackBar,
              private recoveryUseCase: RecoveryUseCase,
              private translateService: TranslateService) {
  }

  submit() {
    if (this.form.valid) {
      this.recoveryUseCase.recovery(this.form.get("email")?.value);

      this.snackBar.open(
        this.translateService.instant("success.recoveryRequest"),
        this.translateService.instant("close"),
        {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
      );
    } else {
      this.snackBar.open(
        this.translateService.instant("errors.invalidForm"),
        this.translateService.instant("close"),
        {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
      );
    }
  }

}
