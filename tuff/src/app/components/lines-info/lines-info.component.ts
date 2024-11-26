import {Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReadLineResultResponse, ReadMutationResultResponse} from "../../openapi";

export interface LinesInfoData {
  lineList: ReadLineResultResponse[] | undefined,
  mutationList: ReadMutationResultResponse[] | undefined,
  type: string
}

@Component({
  selector: 'lines-info',
  templateUrl: 'lines-info.component.html',
  styleUrls: ['lines-info.component.css'],
})
export class LinesInfoComponent {

  data: LinesInfoData = inject(MAT_DIALOG_DATA);


  readonly dialogRef = inject(MatDialogRef<LinesInfoComponent>);

  close() {
    this.dialogRef.close();
  }
}
