import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {
  ListChallengeAnswerResponse,
  ReadChallengeAnswerResponse
} from "../../openapi";
import {interval, startWith, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EventService} from "../../services/event.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AnswersUseCase} from "../../usecases/answers.usecase";

@Component({
  selector: 'runs',
  templateUrl: './runs.component.html',
  styleUrl: './runs.component.css'
})
export class RunsComponent implements AfterViewInit, OnDestroy {

  intervalSubscription: Subscription | undefined;

  paginatorSubscription: Subscription | undefined;

  loading: boolean = false;

  displayedColumns: string[] = ['date', 'name', 'status', 'score', 'run'];

  data: ReadChallengeAnswerResponse[] = [];

  challengesLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private answersUseCase: AnswersUseCase,
              private translateService: TranslateService) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  ngAfterViewInit(): void {
    this.intervalSubscription = interval(5000)
      .subscribe(() => this.updateAnswers(this.paginator.pageIndex, this.paginator.pageSize));

    this.paginatorSubscription = this.paginator.page
      .pipe(startWith({pageIndex: 0, pageSize: 10}))
      .subscribe(page => this.updateAnswers(page.pageIndex, page.pageSize));
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
    this.paginatorSubscription?.unsubscribe();
  }

  updateAnswers(page: number, size: number) {
    const listAnswerPromise: Promise<ListChallengeAnswerResponse> = this.answersUseCase.list(page, size);

    listAnswerPromise
      .then((listAnswerResponse: ListChallengeAnswerResponse) => {
        this.data = listAnswerResponse.answers || [];
        this.challengesLength = listAnswerResponse.total || 0;
      })
      .catch(() => {
        this.snackBar.open(
          this.translateService.instant("errors.listChallenge"),
          this.translateService.instant("close"),
          {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          }
        );
      });
  }

  information(challengeId: string, answerId: string) {
    console.log("Redirect to read answer");
    this.router
      .navigate(["/answer"], {queryParams: {challengeId, answerId}})
      .then(r => r || console.info("Redirect to read answer"));
  }
}
