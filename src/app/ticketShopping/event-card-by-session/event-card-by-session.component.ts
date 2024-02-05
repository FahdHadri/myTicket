import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/Models/event.model';
import { EventService } from 'src/app/services/event.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-card-by-session',
  templateUrl: './event-card-by-session.component.html',
  styleUrls: ['./event-card-by-session.component.css']
})
export class EventCardBySessionComponent implements OnInit {
  events: Event[] = [];

  constructor(private route: ActivatedRoute, private eventService: EventService, private dialog : MatDialog) {}

  ngOnInit() {

    this.loadEvents();
    this.route.params.subscribe(params => {
      const sessionIdParam = params['sessionId'];

      if (sessionIdParam) {
        const sessionId = +sessionIdParam;
        this.eventService.getEventsBySessionId(sessionId).subscribe(
          (events: Event[]) => {
            this.events = events;
          },
          (error) => {
            console.error('Error fetching events', error);
          }
        );
      } else {
        console.error('Session ID is null.');
      }
    });
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
