import { Component, ElementRef, ErrorHandler, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventCategory } from 'src/app/Models/event.model';
import { TicketCategory } from 'src/app/Models/ticket.model';
import { EventService } from 'src/app/services/event.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-add-edit',
  templateUrl: './event-add-edit.component.html',
  styleUrls: ['./event-add-edit.component.css']
})
export class EventAddEditComponent implements OnInit {
  dateEvent!: Date;
  eventForm :FormGroup;
sessions: any;
available: boolean = false;
eventCategoryValues = Object.values(EventCategory);
ticketCategories!: string[];

task!: AngularFireUploadTask;

@ViewChild('fileInput') fileInput!: ElementRef;


  constructor(private _fb:FormBuilder ,
     private _sessionService:SessionService,
     private _eventService:EventService,
      private _dialogRef:MatDialogRef<EventAddEditComponent>,
      private errorHandler:ErrorHandler,
      @Inject(MAT_DIALOG_DATA) public data : any,
      private fireStorage:AngularFireStorage


    ){
    this.eventForm=this._fb.group({
      description: ['', Validators.required],
      cat: [null, Validators.required],
      dateEvent: [null],
      available: [''],
      session: [null, Validators.required],
      file:[''],
      imgEvent:['']
        });

        this.ticketCategories = Object.values(TicketCategory);
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
        this.eventForm.patchValue({
          imgEvent: url,
        });

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
  ngOnInit(): void {
    console.log (this.eventCategoryValues)
    console.log(this.data);
    if (this.data) {

      this.eventForm.patchValue(this.data);

    }
    else{
      this.eventForm = this._fb.group({
       description: ['', Validators.required],
      cat: ['', Validators.required],
      dateEvent: [''],
      available: [''],
      file:[''],
      imgEvent:[''],
      session: [null, Validators.required],
        });
        }

   this._sessionService.getSessions().subscribe((sessions) => {
      this.sessions = sessions;

    });
  }
  async onFormSubmit() {
    if (this.eventForm.valid) {
      console.log(this.eventForm.value);

      try {
        await this.onFileChange(event);
        if (this.data) {
          this._eventService.updateEvent(this.data.sessionId, this.eventForm.value).subscribe({
            next: (val: any) => {
              console.log('Event detail updated ');
              this.alertWithSuccess('Event detail updated successfully!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              this.handleError(err);
            },
          });
        } else {
          this._eventService.saveEvent(this.eventForm.value).subscribe({
            next: (val: any) => {
              console.log('Event Added successfully');
              this.alertWithSuccess('Event added successfully!');
              this._dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error saving session:', error);
              this.handleError(error);
            },
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        this.alertWithError('Error uploading file. Please try again later.');
      }
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    this.alertWithError('Error occurred. Please try again later.');
  }

  // Method to display success alert
  alertWithSuccess(message: string): void {
    Swal.fire('Success!', message, 'success');
  }

  // Method to display error alert
  alertWithError(message: string): void {
    Swal.fire('Error!', message, 'error');
  }
}
