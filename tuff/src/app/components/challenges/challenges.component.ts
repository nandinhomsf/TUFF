import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ListChallengeUseCase} from "../../usecases/listchallenge.usecase";
import {MatPaginator} from "@angular/material/paginator";
import {EventService} from "../../services/event.service";
import {ListChallengeResponse, ReadChallengeResponse} from "../../openapi";
import {startWith} from "rxjs";

@Component({
  selector: 'challenges',
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'challengeVersion'];

  data: ReadChallengeResponse[] = [];

  loading = false;
  challengesLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private listChallengeUseCase: ListChallengeUseCase) {
    EventService.get("loading").subscribe(data => this.loading = data);
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
}
