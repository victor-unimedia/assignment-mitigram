import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-add-external-dialog',
  templateUrl: './add-external-dialog.component.html',
  styleUrls: ['./add-external-dialog.component.scss']
})
export class AddExternalDialogComponent implements OnInit {

  externalEmailForm!: FormGroup<{
    email: FormControl<string | null>
  }>
  constructor(
    public dialogRef: MatDialogRef<AddExternalDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.externalEmailForm = new FormGroup( {
      email: new FormControl<string | null>(null, [Validators.required, Validators.email])
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
