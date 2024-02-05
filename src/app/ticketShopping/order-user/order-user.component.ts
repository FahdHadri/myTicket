import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs';
import { Order } from 'src/app/Models/order.model';
import { User } from 'src/app/Models/user.model';
import { OrderDetailsComponent } from 'src/app/order/order-details/order-details.component';
import { EventService } from 'src/app/services/event.service';
import { OrderService } from 'src/app/services/order.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // Récupérez l'utilisateur connecté depuis la session
    const user = JSON.parse(sessionStorage.getItem('userdetails') || '{}') as User;

    // Récupérez les commandes de l'utilisateur connecté
    this.orderService.getOrdersByEmail(user.email)
      .subscribe(orders => {
        this.orders = orders;
      });
  }
}
