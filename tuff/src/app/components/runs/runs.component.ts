import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {
  ListChallengeAnswerResponse,
  ReadChallengeAnswerResponse
} from "../../openapi";
import {interval, startWith, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EventService} from "../../services/event.service";
import {ListAnswersUseCase} from "../../usecases/answer/listanswers.usecase";

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
              private listAnswersUseCase: ListAnswersUseCase) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  ngAfterViewInit(): void {
    this.intervalSubscription = interval(5000).subscribe(() => {
      const page = this.paginator.pageIndex;
      const size = this.paginator.pageSize;
      this.listAnswersUseCase.listAnswers(page, size, this.updateAnswers, this);
    });

    this.paginatorSubscription = this.paginator.page
      .pipe(startWith({pageIndex: 0, pageSize: 10}))
      .subscribe(page => {
        this.listAnswersUseCase.listAnswers(page.pageIndex, page.pageSize, this.updateAnswers, this);
      });
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
    this.paginatorSubscription?.unsubscribe();
  }

  updateAnswers(listAnswerResponse: ListChallengeAnswerResponse) {
    this.data = listAnswerResponse.answers || [];
    this.challengesLength = listAnswerResponse.total || 0;
  }

  information(challengeId: string, answerId: string) {

  }
}
