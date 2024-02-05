import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventCategory } from 'src/app/Models/event.model';
import { EventService } from 'src/app/services/event.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  events: Event[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortBy = 'dateEvent';
  sortOrder = 'asc';
  totalElements = 0;
  totalPages = 0;


  constructor(private eventService: EventService, private dialog : MatDialog) { }

  ngOnInit(): void {


    this.loadEvents();
  }

  openTicketDialog(event: Event): void {

    const dialogRef = this.dialog.open(TicketDialogComponent, {
      data: { event },

    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (events: Event[]) => {
        this.events = events;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }
}
