import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VenueAddEditComponent } from './Venue/venue-add-edit/venue-add-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VenueListComponent } from './Venue/venue-list/venue-list.component';
import { SessionAddDeleteComponent } from './session/session-add-delete/session-add-delete.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { MatSelectModule } from '@angular/material/select';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventAddEditComponent } from './event/event-add-edit/event-add-edit.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketAddEditComponent } from './ticket/ticket-add-edit/ticket-add-edit.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { environment } from 'src/environments/environment.development';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AcceuilAdminComponent } from './acceuil-admin/acceuil-admin.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderAddEditComponent } from './order/order-add-edit/order-add-edit.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from './ticketShopping/header/header.component';
import { FooterComponent } from './ticketShopping/footer/footer.component';
import { SidebarCatComponent } from './ticketShopping/sidebar-cat/sidebar-cat.component';
import { SessionCardComponent } from './ticketShopping/session-card/session-card.component';
import { EventCardComponent } from './ticketShopping/event-card/event-card.component';
import { MatCardModule } from '@angular/material/card';
import { EventCardBySessionComponent } from './ticketShopping/event-card-by-session/event-card-by-session.component';
import { EventCardByCategoryComponent } from './ticketShopping/event-card-by-category/event-card-by-category.component';
import { TicketDialogComponent } from './ticketShopping/ticket-dialog/ticket-dialog.component';
import { CartService } from './services/cart.service';
import { OrderCartIconComponent } from './ticketShopping/order-cart-icon/order-cart-icon.component';
import { CartPageComponent } from './ticketShopping/cart-page/cart-page.component';
import { OrderSummaryComponent } from './ticketShopping/order-summary/order-summary.component';
import { CheckoutPageComponent } from './ticketShopping/checkout-page/checkout-page.component';
import { MerciComponent } from './ticketShopping/merci/merci.component';
import { HomePageComponent } from './ticketShopping/home-page/home-page.component';
import { CarouselComponent } from './carousel/carousel.component';
import { OrderUserComponent } from './ticketShopping/order-user/order-user.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';





function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8086/',
        realm: 'ticketClient',
        clientId: 'publicclient',
      },
      initOptions: {
        pkceMethod: 'S256',
        redirectUri: 'http://localhost:4200/eventcard'
      }, loadUserProfileAtStartUp: false
    });
}

@NgModule({
  declarations: [
    AppComponent,
    VenueAddEditComponent,
    VenueListComponent,
    SessionAddDeleteComponent,
    SessionListComponent,
    EventListComponent,
    EventAddEditComponent,
    TicketListComponent,
    TicketAddEditComponent,
    AcceuilAdminComponent,
    OrderListComponent,
    OrderAddEditComponent,
    OrderDetailsComponent,
    HeaderComponent,
    FooterComponent,
    SidebarCatComponent,
    SessionCardComponent,
    EventCardComponent,
    EventCardBySessionComponent,
    EventCardByCategoryComponent,
    TicketDialogComponent,
    OrderCartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    MerciComponent,
    HomePageComponent,
    CarouselComponent,
    OrderUserComponent,
    NotAuthorizedComponent,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    MatProgressBarModule,
    KeycloakAngularModule,
    MatDividerModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    KeycloakAngularModule,






  ],
  providers: [CartService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],

    }]
  ,
  bootstrap: [AppComponent],

})
export class AppModule {
  constructor(cartService: CartService) {
    cartService.initCartLocalStorage();
  }
}
