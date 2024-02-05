import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenueListComponent } from './Venue/venue-list/venue-list.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { AcceuilAdminComponent } from './acceuil-admin/acceuil-admin.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { SidebarCatComponent } from './ticketShopping/sidebar-cat/sidebar-cat.component';
import { SessionCardComponent } from './ticketShopping/session-card/session-card.component';
import { EventCardComponent } from './ticketShopping/event-card/event-card.component';
import { EventCardBySessionComponent } from './ticketShopping/event-card-by-session/event-card-by-session.component';
import { EventCardByCategoryComponent } from './ticketShopping/event-card-by-category/event-card-by-category.component';
import { CartPageComponent } from './ticketShopping/cart-page/cart-page.component';
import { CheckoutPageComponent } from './ticketShopping/checkout-page/checkout-page.component';
import { MerciComponent } from './ticketShopping/merci/merci.component';
import { AuthKeyClockGuard } from './routeguards/auth.route';
import { HomePageComponent } from './ticketShopping/home-page/home-page.component';
import { OrderUserComponent } from './ticketShopping/order-user/order-user.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';



const routes: Routes = [
  {path:"admin", component:AcceuilAdminComponent, canActivate: [AuthKeyClockGuard],data: {roles:['ADMIN']

  }, children:[
    { path: "dashboard", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AcceuilAdminComponent },
    { path: "venue", component: VenueListComponent },
    { path: "session", component: SessionListComponent },
    { path: "event", component: EventListComponent },
    { path: "ticket", component: TicketListComponent },
    {path:"order", component:OrderListComponent}
  ]},
  {path:"", component:HomePageComponent, children:[
    { path: "sidebar", component: SidebarCatComponent },
    { path: "sessioncard", component: SessionCardComponent },
    { path: "eventcard", component: EventCardComponent },
    { path: "eventcard/session/:sessionId", component: EventCardBySessionComponent },
    { path: "eventcard/category/:category", component: EventCardByCategoryComponent },
    { path: 'cartpage', component: CartPageComponent },
    {path:'404', component: NotAuthorizedComponent},
    { path: 'checkout', component: CheckoutPageComponent, canActivate: [AuthKeyClockGuard],data: {

    }},
    { path: 'success', component: MerciComponent, canActivate: [AuthKeyClockGuard],data: {

    } },
    { path: 'orderuser', component: OrderUserComponent, canActivate: [AuthKeyClockGuard],data: {

    } }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
