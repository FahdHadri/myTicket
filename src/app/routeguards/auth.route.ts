import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { User } from '../Models/user.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthKeyClockGuard extends KeycloakAuthGuard {
  user = new User();
  public userProfile: KeycloakProfile | null = null;

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }




  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    try {
      console.log('AuthKeyClockGuard: Checking access...');

      // Check if the user is authenticated.
      if (!this.authenticated) {
        console.log('AuthKeyClockGuard: User not authenticated. Redirecting to login...');

        // Redirect to login if not authenticated.
        await this.keycloak.login({
          redirectUri: window.location.origin + state.url,
        });

      } else {
        console.log('AuthKeyClockGuard: User authenticated. Loading user profile...');

        // Load user profile if authenticated.
        this.userProfile = await this.keycloak.loadUserProfile();

        if (this.userProfile) {
          console.log('AuthKeyClockGuard: User profile loaded successfully.');

          // Update user details if the user profile is available.
          this.user.authStatus = 'AUTH';
          this.user.name = this.userProfile.firstName || '';
          this.user.email = this.userProfile.email || '';
          window.sessionStorage.setItem("userdetails", JSON.stringify(this.user));
        } else {
          // Handle the case where the user profile is not available.
          console.error('AuthKeyClockGuard: User profile not available.');
          // You may want to redirect to an error page, show a message, or take appropriate action.
        }
      }

      // Get the roles required from the route.
      const requiredRoles = route.data['roles'];

      // Allow the user to proceed if no additional roles are required to access the route.
      if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
        console.log('AuthKeyClockGuard: No additional roles required. Access allowed.');
        return true;
      }

      // Allow the user to proceed if all the required roles are present.
      if (requiredRoles.every((role) => this.roles.includes(role))) {
        console.log('AuthKeyClockGuard: User has required roles. Access allowed.');
        return true;
      } else {
        console.warn('AuthKeyClockGuard: User does not have required roles. Access denied.');
        // You may want to redirect to an error page, show a message, or take appropriate action.
        this.router.navigate(['/404']);
        return false;
      }
    } catch (error) {
      // Handle errors that may occur during the asynchronous operation.
      console.error('AuthKeyClockGuard: Error:', error);
      // You may want to redirect to an error page, show a message, or take appropriate action.
      return false;
    }
  }

}
