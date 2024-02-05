import { Component, Input, OnInit } from '@angular/core';
import { Session } from 'src/app/Models/session.model';
import { SessionService } from 'src/app/services/session.service';
import { EventService } from '../../services/event.service';
import { Event } from 'src/app/Models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.css']
})
export class SessionCardComponent implements OnInit {
  @Input() session!: Session;
  sessions!: Session[];
  events!: Event[];

  constructor(private sessionService: SessionService,
    private eventService:EventService,
    private router:Router) {}

  ngOnInit() {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  showEvents(sessionId: number): void {
    this.eventService.getEventsBySessionId(sessionId).subscribe(
      (events: Event[]) => {
        // Update the events property
        this.events = events;

        // Navigate to the EventListComponent with the session ID as a parameter
        this.router.navigate(['/eventcard/session', sessionId]);
        console.log(sessionId);
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }
}
