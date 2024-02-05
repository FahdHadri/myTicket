import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from 'src/app/Models/order.model';
import {Event} from 'src/app/Models/event.model'

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {

  constructor(
  public dialogRef: MatDialogRef<OrderDetailsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { order: Order}
) {}

onClose(): void {
  this.dialogRef.close();
}
}
