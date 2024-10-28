import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ListChallengeResponse, ReadChallengeResponse} from "../../openapi";
import {startWith} from "rxjs";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {DeleteChallengeUseCase} from "../../usecases/challenge/deletechallenge.usecase";
import {ListChallengeUseCase} from "../../usecases/challenge/listchallenge.usecase";

@Component({
  selector: 'challenges',
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent implements AfterViewInit {

  isAdmin: boolean = false;

  displayedColumns: string[] = ['id', 'name', 'challengeVersion', 'run'];

  data: ReadChallengeResponse[] = [];

  challengesLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
              private listChallengeUseCase: ListChallengeUseCase,
              private deleteChallengeUseCase: DeleteChallengeUseCase) {
    if (StorageService.userAdmin()) {
      this.isAdmin = true;
      this.displayedColumns.push("challengeEdit", "challengeDelete");
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(startWith({pageIndex: 0, pageSize: 10}))
      .subscribe(page => {
        this.listChallengeUseCase.list(page.pageIndex, page.pageSize, this.updateChallenges, this);
      });
  }

  updateChallenges(listChallengeResponse: ListChallengeResponse) {
    this.data = listChallengeResponse.challenges || [];
    this.challengesLength = listChallengeResponse.totalEntries || 0;
  }

  run(challengeId: string) {
    this.router
      .navigate(["/challenge/run"], {queryParams: {challengeId: challengeId}})
      .then(r => r || console.info("Redirect to run challenge failed"));
  }

  edit(challengeId: string) {
    this.router
      .navigate(["/challenge"], {queryParams: {challengeId: challengeId}})
      .then(r => r || console.info("Redirect to edit challenge failed"));
  }

  delete(challengeId: string) {
    this.deleteChallengeUseCase.delete(challengeId)
      .then(() => this.listChallengeUseCase.list(0, 10, this.updateChallenges, this))
      .catch(() => console.error("Delete challenge failed"));
  }
}
