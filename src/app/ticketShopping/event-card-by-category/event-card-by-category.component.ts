import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/Models/event.model';
import { EventService } from 'src/app/services/event.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-card-by-category',
  templateUrl: './event-card-by-category.component.html',
  styleUrls: ['./event-card-by-category.component.css']
})
export class EventCardByCategoryComponent implements OnInit {
  events: Event[] = [];

  constructor(private route: ActivatedRoute, private eventService: EventService, private dialog : MatDialog) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.loadEvents();
    this.route.params.subscribe(params => {
      const category = params['category'];

      if (category) {
        this.eventService.getEventsByCategory(category).subscribe(
          (events: Event[]) => {
            this.events = events;
          },
          (error) => {
            console.error('Error fetching events', error);
          }
        );
      } else {
        console.error('Category is null.');
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
