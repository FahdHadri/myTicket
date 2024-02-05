import { Component, Inject, OnInit, ErrorHandler, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/core.service';
import { SessionService } from 'src/app/services/session.service';
import { VenueService } from 'src/app/services/venue.service';
import { Venue } from 'src/app/Models/venue.model';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-session-add-delete',
  templateUrl: './session-add-delete.component.html',
  styleUrls: ['./session-add-delete.component.css']
})
export class SessionAddDeleteComponent implements OnInit {
 // uploadProgress: number = 0;
  task!: AngularFireUploadTask;
  sessionForm :FormGroup;
venues: any;
@ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _fb:FormBuilder ,
     private _venueService : VenueService,
     private _sessionService:SessionService,
      private _dialogRef:MatDialogRef<SessionAddDeleteComponent>,
      private errorHandler:ErrorHandler,
      @Inject(MAT_DIALOG_DATA) public data : any,
     private fireStorage:AngularFireStorage


    )
    {
    this.sessionForm=this._fb.group({
      sessionName: ['', Validators.required],
      startDate: ['', Validators.required],
      finishDate: [''],
      imgUrl: [''],
      venue: [null, Validators.required],
      file:['']
        });
  }
  async onFileChange(event: any): Promise<void> {
    console.log('Event:', event);

    const file = event?.target?.files?.[0];

    if (file) {
      const path = `yt/${file.name}`;
      this.task = this.fireStorage.upload(path, file);

      try {
        const snapshot = await this.task;
        const url = await snapshot.ref.getDownloadURL();

        console.log(url);
        this.sessionForm.patchValue({
          imgUrl: url,
        });

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }


  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {

      this.sessionForm.patchValue(this.data);

    }
    else{
      this.sessionForm = this._fb.group({
        sessionName: ['', Validators.required],
        startDate: ['', Validators.required],
        finishDate: [''],
        imgUrl: [''],
        venue: [null, Validators.required]
        })
        }

   this._venueService.getVenues().subscribe((venues) => {
      this.venues = venues;

    });
  }
  async onFormSubmit() {
    if (this.sessionForm.valid) {
      console.log(this.sessionForm.value);

      try {
        // Wait for the onFileChange promise to resolve before continuing
        await this.onFileChange(event);
        if (this.data) {
          this._sessionService.updateSession(this.data.sessionId, this.sessionForm.value).subscribe({
            next: (val: any) => {
              console.log('Session detail updated ');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              this.errorHandler.handleError(err);
            },
          });
        } else {
          this._sessionService.saveSession(this.sessionForm.value).subscribe({
            next: (val: any) => {
              console.log('Session Added successfully');
              this._dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error saving session:', error);
              this.errorHandler.handleError(error);
            },
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);

      }
    }
  }

}
