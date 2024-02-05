import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CartItem } from "src/app/Models/cart.model";
import { Event } from "src/app/Models/event.model";
import { Ticket } from "src/app/Models/ticket.model";
import { CartService } from "src/app/services/cart.service";
import { TicketService } from "src/app/services/ticket.service";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.css']
})
export class TicketDialogComponent implements OnInit {
  event: Event;
  tickets: Ticket[] = [];
  selectedTicket!: Ticket;

  constructor(
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ticketService: TicketService,
    private _cartService: CartService
  ) {
    console.log('TicketDialogComponent created');
    this.event = data.event;
    this.selectedTicket = data.selectedTicket || null;
  }

  ngOnInit(): void {
    console.log('Event ID:', this.event.eventId);
    console.log('Selected Ticket:', this.selectedTicket);

    this._ticketService.getTicketsByEventId(this.event.eventId).subscribe(
      tickets => {
        console.log('Tickets:', tickets);
        this.tickets = tickets;
      },
      error => console.error(error)
    );
  }

  buyTicket(ticketType: string): void {

    this.showSweetToast('success', 'Ticket purchased successfully!');
  }

  addTicketToCart(selectedTicket: Ticket): void {
    console.log('addTicketToCart method called');
    console.log('Selected Ticket:', selectedTicket);

    if (selectedTicket && selectedTicket.id) {
      const cartItem: CartItem = {
        productId: selectedTicket.id.toString(),
        quantity: 1,
      };
      console.log(cartItem);
      this._cartService.setCartItem(cartItem);

      // Show a success toast when the ticket is added to the cart successfully
      this.showSweetToast('success', 'Ticket added to cart successfully!', 'You can view your cart in the shopping cart page.');
    } else {
      console.warn('Selected Ticket is invalid.');

      // Show an error toast when the selected ticket is invalid
      this.showSweetToast('error', 'Invalid selected ticket. Please try again.');
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  private showSweetToast(icon: SweetAlertIcon, title: string, additionalInfo?: string): void {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    toast.fire({
      icon,
      title,
      html: additionalInfo ? `<div>${additionalInfo}</div>` : undefined,
    });
  }
}
