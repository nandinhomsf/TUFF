import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ListUserRankResponse, UserRankResponse} from "../../openapi";
import {interval, startWith, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserUseCase} from "../../usecases/user.usecase";

@Component({
  selector: 'rank',
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.css'
})
export class RankComponent implements AfterViewInit, OnDestroy {

  intervalSubscription: Subscription | undefined;

  paginatorSubscription: Subscription | undefined;

  loading: boolean = false;

  displayedColumns: string[] = ['index', 'userName', 'score'];

  data: UserRankResponse[] = [];

  ranksLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private snackBar: MatSnackBar,
              private userUseCase: UserUseCase,
              private translateService: TranslateService) {
    EventService.get("loading").subscribe(data => this.loading = data);
  }

  ngAfterViewInit(): void {
    this.intervalSubscription = interval(5000)
      .subscribe(() => this.updateRank(this.paginator.pageIndex, this.paginator.pageSize));

    this.paginatorSubscription = this.paginator.page
      .pipe(startWith({pageIndex: 0, pageSize: 10}))
      .subscribe(page => this.updateRank(page.pageIndex, page.pageSize));
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
    this.paginatorSubscription?.unsubscribe();
  }

  updateRank(page: number, size: number) {
    const listRankPromise: Promise<ListUserRankResponse> = this.userUseCase.rank(page, size);

    listRankPromise
      .then((listUserRank: ListUserRankResponse) => {
        this.data = listUserRank.users || [];
        this.ranksLength = listUserRank.totalEntries || 0;
      })
      .catch(() => {
        this.snackBar.open(
          this.translateService.instant("errors.listRank"),
          this.translateService.instant("close"),
          {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          }
        );
      });
  }
}
