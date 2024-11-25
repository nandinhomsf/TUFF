import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {EventService} from "../../services/event.service";
import {ReadChallengeResponse} from "../../openapi";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

import * as ace from "ace-builds";
import {ThemeService} from "../../services/theme.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {ChallengeUseCase} from "../../usecases/challenge.usecase";

@Component({
  selector: "challenge",
  templateUrl: "./challenge.view.html",
  styleUrls: ["./challenge.view.css"],
})
export class ChallengeView implements AfterViewInit {

  loading: boolean = false;

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    difficulty: new FormControl('', [Validators.required]),
  });

  public challengeId: string | undefined;

  public challenge: ReadChallengeResponse | undefined;

  public code: string | undefined = `public class Main {
    public int sum(int a, int b) {
        return a + b;
    }\n}`;

  public description: string | undefined = `<p>The sum method should return the sum of two integers.</p>`;

  @ViewChild("codeEditor")
  private codeEditor!: ElementRef<HTMLElement>;

  @ViewChild("descriptionEditor")
  private descriptionEditor!: ElementRef<HTMLElement>;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private challengeUseCase: ChallengeUseCase) {
    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        this.challengeId = params['challengeId'];
      });
    });

    EventService.get("darkMode").subscribe(data => {
      const aceCodeEditor = ace.edit(this.codeEditor.nativeElement);
      const aceDescriptionEditor = ace.edit(this.descriptionEditor.nativeElement);

      this.setAceTheme(aceCodeEditor, data);
      this.setAceTheme(aceDescriptionEditor, data);
    });

    EventService.get("loading").subscribe(data => this.loading = data);
  }

  async ngAfterViewInit() {
    ace.config.set("basePath", "assets/ace");

    await this.loadInformation();
  }

  async loadInformation() {
    if (this.challengeId) {
      await this.challengeUseCase.get(this.challengeId)
        .then((challenge) => {
          this.form.get("name")?.setValue(challenge.name);
          this.form.get("difficulty")?.setValue(challenge.difficulty);
          this.code = challenge.code;
          this.description = challenge.description;
        })
        .catch(() => {
          this.snackBar.open(
            this.translateService.instant("errors.readChallenge"),
            this.translateService.instant("close"),
            {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            }
          );
        });
    }

    const aceCodeEditor = ace.edit(this.codeEditor.nativeElement);
    const aceDescriptionEditor = ace.edit(this.descriptionEditor.nativeElement);

    this.setAceTheme(aceCodeEditor, ThemeService.isDarkMode());
    this.setAceTheme(aceDescriptionEditor, ThemeService.isDarkMode());

    aceCodeEditor.session.setValue(this.code!);
    aceCodeEditor.session.setMode("ace/mode/java");
    aceCodeEditor.session.setTabSize(4);

    aceDescriptionEditor.session.setValue(this.description!);
    aceDescriptionEditor.session.setMode("ace/mode/html");
    aceDescriptionEditor.session.setTabSize(4);
  }

  save() {
    if (this.form.valid && this.code && this.description) {
      const aceCodeEditor = ace.edit(this.codeEditor.nativeElement);
      const aceDescriptionEditor = ace.edit(this.descriptionEditor.nativeElement);

      this.code = aceCodeEditor.session.getValue();
      this.description = aceDescriptionEditor.session.getValue();

      EventService.get("loading").next(true);

      this.challengeUseCase
        .upsert(
          this.form.get("name")?.value,
          this.description,
          this.code,
          this.form.get("difficulty")?.value,
          this.challengeId
        )
        .then(challengeId => {
          this.snackBar.open(
            this.translateService.instant("success.createOrUpdateChallenge"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );

          this.challengeId = challengeId;
          this.loadInformation().then(() => console.log('page reloaded'));
        })
        .catch(() => {
          this.snackBar.open(
            this.translateService.instant("errors.createOrUpdateChallenge"),
            this.translateService.instant("close"),
            {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
          );
        })
        .finally(() => EventService.get("loading").next(false));
    } else {
      this.snackBar.open(
        this.translateService.instant("errors.createOrUpdateChallenge"),
        this.translateService.instant("close"),
        {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "top"
        }
      );
    }
  }

  private setAceTheme(aceEditor: ace.Ace.Editor, darkMode: boolean) {
    aceEditor.setTheme("ace/theme/" + (darkMode ? "merbivore" : "github"));
  }
}
