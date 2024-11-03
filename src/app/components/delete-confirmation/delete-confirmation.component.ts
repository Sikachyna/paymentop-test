import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'delete-confirmation.component',
  templateUrl: 'delete-confirmation.component.html',
  styleUrl: 'delete-confirmation.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DeleteConfirmation {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { bookId: number, bookTitle: string }) {
  }
}
