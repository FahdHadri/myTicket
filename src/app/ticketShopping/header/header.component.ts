import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { EventCategory } from 'src/app/Models/event.model';
import { User } from 'src/app/Models/user.model';
import { EventService } from 'src/app/services/event.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  eventCategories = Object.values(EventCategory);
  events: Event[] = [];
  event!: Event;
  user = new User();
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(private readonly keycloak: KeycloakService,private eventService: EventService, private router:Router) { }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.user.authStatus = 'AUTH';
      this.user.name = this.userProfile.firstName || '';
      window.sessionStorage.setItem("userdetails", JSON.stringify(this.user));

      // Show a success toast when the user is logged in
      this.showSweetToast('success', `Logged in successfully. Welcome, ${this.user.name}!`);
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    const redirectUri = 'http://localhost:4200/sessioncard';
    this.keycloak.logout(redirectUri);

    // Show a success toast when the user logs out
    this.showSweetToast('success', `Logged out successfully. Goodbye, ${this.user.name}!`);
  }

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

        // Show a success toast when events are fetched successfully
        this.showSweetToast('success', `Events fetched successfully. Welcome back, ${this.user.name}!`);
      },
      (error) => {
        console.error('Error fetching events', error);

        // Show an error toast when there is an error fetching events
        this.showSweetToast('error', `Error fetching events. Sorry, ${this.user.name}.`);
      }
    );
  }

  private showSweetToast(icon: SweetAlertIcon, title: string): void {
    Swal.fire({
      icon,
      title,
      toast: true,
      position: 'top-start',  
      showConfirmButton: false,
      timer: 3000
    });
  }
}
