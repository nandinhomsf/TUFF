import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ReadChallengeResponse} from "../../openapi";
import {startWith} from "rxjs";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {EventService} from "../../services/event.service";
import {ChallengeUseCase} from "../../usecases/challenge.usecase";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChallengeRankComponent} from "../challenge-rank/challenge-rank.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'challenges',
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent implements AfterViewInit {

  dialog = inject(MatDialog);

  isAdmin: boolean = false;

  loading: boolean = false;

  displayedColumns: string[] = ['id', 'name', 'difficulty', 'challengeVersion', 'rank', 'run'];

  data: ReadChallengeResponse[] = [];

  challengesLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private challengeUseCase: ChallengeUseCase) {
    EventService.get("loading").subscribe(data => this.loading = data);

    if (StorageService.userAdmin()) {
      this.isAdmin = true;
      this.displayedColumns.push("challengeEdit", "challengeDelete");
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.page
        .pipe(startWith({pageIndex: 0, pageSize: 10}))
        .subscribe(page => {
          EventService.get("loading").emit(true);

          this.updateChallenges(page.pageIndex, page.pageSize)
            .finally(() => EventService.get("loading").emit(false));
        });
    }, 10);
  }

  async updateChallenges(index: number, size: number) {
    await this.challengeUseCase
      .list(index, size)
      .then(response => {
        this.data = response.challenges || [];
        this.challengesLength = response.totalEntries || 0;
      })
      .catch(() => {
        this.snackBar.open(
          this.translateService.instant("errors.listChallenge"),
          this.translateService.instant("close"),
          {duration: 2000, horizontalPosition: "right", verticalPosition: "top"}
        );
      });
  }

  run(challengeId: string) {
    this.router
      .navigate(["/challenge/run"], {queryParams: {challengeId: challengeId}})
      .then(r => r || console.info("Redirect to run challenge failed"));
  }

  rank(challengeId: string) {
    const challenge = this.data.find(c => c.id === challengeId);
    if (challenge) {
      this.dialog.open(ChallengeRankComponent, {
        data: challenge.rank,
        width: "80%",
      });
    }
  }

  edit(challengeId: string) {
    this.router
      .navigate(["/challenge"], {queryParams: {challengeId: challengeId}})
      .then(r => r || console.info("Redirect to edit challenge failed"));
  }

  delete(challengeId: string) {
    EventService.get("loading").emit(true);

    this.challengeUseCase
      .delete(challengeId)
      .then(() => this.updateChallenges(0, 10))
      .catch(() => console.error("Delete challenge failed"))
      .finally(() => EventService.get("loading").emit(false));
  }
}
