import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../../core/core.service';

@Component({
  selector: 'app-venue-add-edit',
  templateUrl: './venue-add-edit.component.html',
  styleUrls: ['./venue-add-edit.component.css']
})
export class VenueAddEditComponent implements OnInit {
  venueForm: FormGroup;

  constructor(private _fb: FormBuilder,
    private _venueService: VenueService,
    private _dialogRef: MatDialogRef<VenueAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService

  ) {
    this.venueForm = this._fb.group({
      venueName: '',
      capacity: ''
    })
  }
  ngOnInit(): void {
    this.venueForm.patchValue(this.data);
  }
  onFormSubmit() {
    if (this.venueForm.valid) {
      if (this.data) {
        this._venueService.updateVenue(this.data.venueId, this.venueForm.value).subscribe({
          next: (val: any) => {
            this._dialogRef.close(true);

          },
          error: (err: any) => {
            console.error(err);
          }
        })

      }
      else {
        this._venueService.saveVenue(this.venueForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Venue Added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }


    }
  }
}
