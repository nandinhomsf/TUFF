import {Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReadChallengeRankResponse} from "../../openapi";

@Component({
  selector: 'challenge-rank',
  templateUrl: 'challenge-rank.component.html',
  styleUrls: ['challenge-rank.component.css'],
})
export class ChallengeRankComponent {

  data: Array<ReadChallengeRankResponse> = inject(MAT_DIALOG_DATA);


  readonly dialogRef = inject(MatDialogRef<ChallengeRankComponent>);

  close() {
    this.dialogRef.close();
  }
}
