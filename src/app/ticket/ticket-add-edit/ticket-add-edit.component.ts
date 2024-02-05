import { Component, ElementRef, ErrorHandler, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketCategory } from 'src/app/Models/ticket.model';
import { EventAddEditComponent } from 'src/app/event/event-add-edit/event-add-edit.component';
import { EventService } from 'src/app/services/event.service';
import { TicketService } from 'src/app/services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-add-edit',
  templateUrl: './ticket-add-edit.component.html',
  styleUrls: ['./ticket-add-edit.component.css']
})
export class TicketAddEditComponent implements OnInit {
task!: AngularFireUploadTask;
ticketForm :FormGroup;
events: any;
ticketCategoryValues = Object.values(TicketCategory);
@ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _fb:FormBuilder ,
    private _ticketService:TicketService,
     private _eventService:EventService,
      private _dialogRef:MatDialogRef<TicketAddEditComponent>,
      private errorHandler:ErrorHandler,
      @Inject(MAT_DIALOG_DATA) public data : any,
      private fireStorage:AngularFireStorage



    ){
    this.ticketForm=this._fb.group({
      ticketCat: [null, Validators.required],
      price:['',Validators.required],
      quantity:['',Validators.required],
      imgUrlTicket:['',Validators.required],
      event: ['', Validators.required],
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
        this.ticketForm.patchValue({
          imgUrlTicket: url,
        });

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
  ngOnInit(): void {
    console.log('Dialog Data:', this.data);

    if (this.data) {
      const eventId = this.data.event.eventId;

      this.ticketForm.patchValue({
        ticketCat: this.data.ticketCat,
        price: this.data.price,
        quantity: this.data.quantity,
        imgUrlTicket: this.data.imgUrlTicket,
        event: eventId,
      });

      console.log('Form Patched:', this.ticketForm.value);
    } else {
      this._eventService.getEvents().subscribe((events) => {
        this.events = events;
        console.log('Events Loaded:', this.events);
      });
    }
    this._eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }



  async onFormSubmit() {
    if (this.ticketForm.valid) {
      console.log(this.ticketForm.value);

      try {
        // Wait for the onFileChange promise to resolve before continuing
        await this.onFileChange(event);

        if (this.data) {
          this._ticketService.updateTicket(this.data.id, this.ticketForm.value).subscribe({
            next: (val: any) => {
              console.log('ticket detail updated ');
              this._dialogRef.close(true);
              this.alertWithSuccess('Ticket details updated successfully!');
            },
            error: (err: any) => {
              console.error(err);
              this.errorHandler.handleError(err);
              this.alertWithError('Error updating ticket details!');
            },
          });
        } else {
          this._ticketService.saveTicket(this.ticketForm.value).subscribe({
            next: (val: any) => {
              console.log('ticket Added successfully');
              this._dialogRef.close(true);
              this.alertWithSuccess('Ticket added successfully!');
            },
            error: (error) => {
              console.error('Error saving ticket:', error);
              this.errorHandler.handleError(error);
              this.alertWithError('Error saving ticket!');
            },
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        this.alertWithError('Error uploading file!');
      }
    }
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

