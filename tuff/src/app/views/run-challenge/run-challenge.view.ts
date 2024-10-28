import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {EventService} from "../../services/event.service";
import {CreateChallengeAnswerRequest, ReadChallengeResponse} from "../../openapi";
import {ReadChallengeUseCase} from "../../usecases/challenge/readchallenge.usecase";
import {ActivatedRoute, Router} from "@angular/router";

import * as ace from "ace-builds";
import {ThemeService} from "../../services/theme.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {AnswerUseCase} from "../../usecases/answer/answer.usecase";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: "run-challenge",
  templateUrl: "./run-challenge.view.html",
  styleUrls: ["./run-challenge.view.css"],
})
export class RunChallengeView implements AfterViewInit {

  loading: boolean = false;

  running: boolean = false;

  public challengeId: string | undefined;

  public challenge: ReadChallengeResponse | undefined;

  public test: string | undefined = `import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class MainTest {

    @Test
    void test() {
        Main main = new Main();
    }\n}`;

  @ViewChild("codeReader")
  private codeReader!: ElementRef<HTMLElement>;

  @ViewChild("testEditor")
  private testEditor!: ElementRef<HTMLElement>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private readChallengeUseCase: ReadChallengeUseCase,
              private answerUseCase: AnswerUseCase) {
    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        this.challengeId = params['challengeId'];
      });
    });

    EventService.get("darkMode").subscribe(data => {
      const aceCodeReader = ace.edit(this.codeReader.nativeElement);
      const aceTestEditor = ace.edit(this.testEditor.nativeElement);

      this.setAceTheme(aceCodeReader, data);
      this.setAceTheme(aceTestEditor, data);
    });

    EventService.get("loading").subscribe(data => this.loading = data);
  }

  async ngAfterViewInit() {
    ace.config.set("basePath", "assets/ace");

    await this.loadInformation();
  }

  async loadInformation() {
    const valid = await this.readChallengeUseCase.read(this.challengeId!)
      .then((challenge) => {
        this.challenge = challenge;
        return true;
      })
      .catch(() => {
        this.snackBar.open(
          this.translateService.instant("errors.readChallenge"),
          this.translateService.instant("close"),
          {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          });
        return false;
      });

    if (!valid) {
      return;
    }

    const aceCodeReader = ace.edit(this.codeReader.nativeElement);
    const aceTestEditor = ace.edit(this.testEditor.nativeElement);

    this.setAceTheme(aceCodeReader, ThemeService.isDarkMode());
    this.setAceTheme(aceTestEditor, ThemeService.isDarkMode());

    aceCodeReader.session.setValue(this.challenge?.code!);
    aceCodeReader.session.setMode("ace/mode/java");
    aceCodeReader.session.setTabSize(4);
    aceCodeReader.setReadOnly(true);

    aceTestEditor.session.setValue(this.test!);
    aceTestEditor.session.setMode("ace/mode/java");
    aceTestEditor.session.setTabSize(4);
  }

  submit() {
    const aceTestEditor = ace.edit(this.testEditor.nativeElement);
    this.test = aceTestEditor.session.getValue();

    if (this.test) {
      this.running = true;
      const answerRequest: CreateChallengeAnswerRequest = {
        challengeId: this.challengeId!,
        userId: StorageService.getUser()?.userId,
        username: StorageService.getUser()?.username,
        testAnswer: this.test
      }
      this.answerUseCase.answer(answerRequest)
        .then(() => {
          this.snackBar.open(
            this.translateService.instant("challenge-text.test-running"),
            this.translateService.instant("close"),
            {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            });
          this.router.navigate([""]).then(r => console.log(r));
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      this.snackBar.open(
        this.translateService.instant("errors.emptyTest"),
        this.translateService.instant("close"),
        {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
    }
  }

  private setAceTheme(aceEditor: ace.Ace.Editor, darkMode: boolean) {
    aceEditor.setTheme("ace/theme/" + (darkMode ? "merbivore" : "github"));
  }
}
