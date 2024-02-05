import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event, EventCategory } from 'src/app/Models/event.model';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-sidebar-cat',
  templateUrl: './sidebar-cat.component.html',
  styleUrls: ['./sidebar-cat.component.css']
})
export class SidebarCatComponent  {
  eventCategories = Object.values(EventCategory);
  events: Event[] = [];
  constructor(private eventService: EventService, private router:Router) {}

  getEventsByCategory(category: EventCategory): void {
    // Check if category is null or empty
    if (!category) {
      // Show an alert
      alert('Category is null or empty');
      return;
    }

    this.eventService.getEventsByCategory(category).subscribe(
      (events: Event[]) => {
        // Update the events property
        this.events = events;

        // Navigate to the EventListComponent with the category as a parameter
        this.router.navigate(['/eventcard/category', { category: category }]);
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  sidebarWidth: string = '0';
  mainMarginLeft: string = '0';
  bodyBackgroundColor: string = 'white';

  toggleSidebar() {
    if (this.sidebarWidth === '0') {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  openNav() {
    this.sidebarWidth = '250px';
    this.mainMarginLeft = '250px';
    this.bodyBackgroundColor = 'rgba(0,0,0,0.4)';
  }

  closeNav() {
    this.sidebarWidth = '0';
    this.mainMarginLeft = '0';
    this.bodyBackgroundColor = 'white';
  }
}
