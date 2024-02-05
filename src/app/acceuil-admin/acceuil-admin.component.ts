import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { User } from '../Models/user.model';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-acceuil-admin',
  templateUrl: './acceuil-admin.component.html',
  styleUrls: ['./acceuil-admin.component.css']
})


export class AcceuilAdminComponent implements OnInit {

  user = new User();
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;


  constructor(private readonly keycloak: KeycloakService) {

  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userdetails')||'');
  }

  public login() {

       // Get the user's name
  const userName = this.user.name || 'User';



  }

  public logout() {

    const redirectUri = 'http://localhost:4200/eventcard';


    const userName = this.user.name || 'User';

  Swal.fire(`Goodbye, ${userName}!`, 'You have been successfully logged out.', 'success');

    this.keycloak.logout(redirectUri);

  }



}
