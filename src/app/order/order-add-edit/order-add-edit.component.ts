import { Component, ErrorHandler, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/order.service';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket, TicketCategory } from '../../Models/ticket.model';
import { throwError } from 'rxjs';
import { Order } from 'src/app/Models/order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-add-edit',
  templateUrl: './order-add-edit.component.html',
  styleUrls: ['./order-add-edit.component.css']
})
export class OrderAddEditComponent implements OnInit {

  orderForm!: FormGroup;
  tickets: Ticket[] = [];


  constructor(
    private _fb: FormBuilder,
    private _ticketService: TicketService,
    private _orderService: OrderService,
    private _dialogRef: MatDialogRef<OrderAddEditComponent>,
    private errorHandler: ErrorHandler,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )  {
    this.orderForm = this._fb.group({
      orderStatus: [''],
      data: { }
    });
  }

  ngOnInit(): void {

  }

  onFormSubmit() {
    if (this.data && this.orderForm.valid) {
      const orderId = this.data?.orderId;
      const newStatus = this.orderForm.value.orderStatus;

      this._orderService.updateOrderStatus(orderId, newStatus)
        .subscribe({
          next: (val: Order) => {
            this.alertWithSuccess('Order status updated successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this.handleError(err);
          }
        });
    }
  }

  // Method to display success alert
  alertWithSuccess(message: string): void {
    Swal.fire('Success!', message, 'success');
  }

  // Method to display error alert
  alertWithError(message: string): void {
    Swal.fire('Error!', message, 'error');
  }

  private handleError(error: any) {
    this.alertWithError('An error occurred in OrderService: ' + error.message);
    return throwError('Something went wrong with the order service. Please try again later.');
  }

}
