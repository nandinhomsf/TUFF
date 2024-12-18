import {AfterViewInit, Component, ElementRef, inject, ViewChild} from "@angular/core";
import {EventService} from "../../services/event.service";
import {ReadChallengeAnswerResponse, ReadChallengeResponse, ReadChallengeResultResponse} from "../../openapi";
import {ActivatedRoute} from "@angular/router";

import * as ace from "ace-builds";
import {ThemeService} from "../../services/theme.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {AnswersUseCase} from "../../usecases/answers.usecase";
import {ChallengeUseCase} from "../../usecases/challenge.usecase";
import {MatDialog} from "@angular/material/dialog";
import {LinesInfoComponent, LinesInfoData} from "../../components/lines-info/lines-info.component";

@Component({
  selector: "answer",
  templateUrl: "./answer.view.html",
  styleUrls: ["./answer.view.css"],
})
export class AnswerView implements AfterViewInit {

  dialog = inject(MatDialog);

  loading: boolean = false;

  public answerId: string | undefined;

  public answer: ReadChallengeAnswerResponse | undefined;

  public result: ReadChallengeResultResponse | undefined;

  public challengeId: string | undefined;

  public challenge: ReadChallengeResponse | undefined;

  public mutationsCoverage: number = 0;

  public mutationsTotal: number = 0;

  @ViewChild("codeReader")
  private codeReader!: ElementRef<HTMLElement>;

  @ViewChild("testReader")
  private testReader!: ElementRef<HTMLElement>;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private answersUseCase: AnswersUseCase,
              private translateService: TranslateService,
              private challengeUseCase: ChallengeUseCase) {
    this.route.params.subscribe(() => {
      this.route.queryParams.subscribe(params => {
        this.answerId = params['answerId'];
        this.challengeId = params['challengeId'];
      });
    });

    EventService.get("darkMode").subscribe(data => {
      const aceCodeReader = ace.edit(this.codeReader.nativeElement);
      const aceTestEditor = ace.edit(this.testReader.nativeElement);

      this.setAceTheme(aceCodeReader, data);
      this.setAceTheme(aceTestEditor, data);
    });

    EventService.get("loading").subscribe(data => this.loading = data);
  }

  openDialog(type: string) {
    this.dialog.open(LinesInfoComponent, {
      data: {
        lineList: this.result?.lineResults,
        type: type,
        mutationList: this.result?.mutationResults
      } as LinesInfoData,
      width: "80%",
    });
  }

  async ngAfterViewInit() {
    ace.config.set("basePath", "assets/ace");

    await this.loadInformation();
  }

  async loadInformation() {
    const answerValid = await this.answersUseCase
      .get(this.answerId!)
      .then((answer) => {
        this.answer = answer;
        this.result = answer.challengeResult;
        this.mutationsCoverage = this.result?.mutationResults?.filter(m => m.isKilled).length || 0;
        this.mutationsTotal = this.result?.mutationResults?.length || 0;
        return true;
      })
      .catch(() => {
        console.log("Error reading answer");
        return false;
      });

    const challengeValid = await this.challengeUseCase.get(this.challengeId!)
      .then((challenge) => {
        this.challenge = challenge;
        return true;
      })
      .catch(() => {
        console.log("Error reading challenge");
        return false;
      });


    if (!answerValid || !challengeValid) {
      this.snackBar.open(
        this.translateService.instant("errors.errorReadingAnswer"),
        this.translateService.instant("close"),
        {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
      return;
    }

    const aceCodeReader = ace.edit(this.codeReader.nativeElement);
    const aceTestReader = ace.edit(this.testReader.nativeElement);

    this.setAceTheme(aceCodeReader, ThemeService.isDarkMode());
    this.setAceTheme(aceTestReader, ThemeService.isDarkMode());

    aceCodeReader.session.setValue(this.answer?.challengeCode!);
    aceCodeReader.session.setMode("ace/mode/java");
    aceCodeReader.session.setTabSize(4);
    aceCodeReader.setReadOnly(true);

    this.highlightCoverage(aceCodeReader.session, this.answer!);

    aceTestReader.session.setValue(this.answer?.userTest!);
    aceTestReader.session.setMode("ace/mode/java");
    aceTestReader.session.setTabSize(4);
    aceTestReader.setReadOnly(true);
  }

  private highlightCoverage(aceSession: ace.Ace.EditSession, answer: ReadChallengeAnswerResponse) {
    if ((answer.challengeResult?.lineResults?.length || 0) > 0) {
      answer.challengeResult?.lineResults?.forEach(lineResult => {
        const row = lineResult.lineNumber! - 1;
        const Range = ace.require('ace/range').Range;
        const range = new Range(row, 0, row, 1);

        aceSession.addMarker(range, lineResult.covered ? "covered" : "uncovered", "fullLine");
      });
    }
  }

  private setAceTheme(aceEditor: ace.Ace.Editor, darkMode: boolean) {
    aceEditor.setTheme("ace/theme/" + (darkMode ? "merbivore" : "github"));
  }
}
