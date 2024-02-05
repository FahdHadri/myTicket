import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/order.service';
import { TicketService } from 'src/app/services/ticket.service';
import { OrderAddEditComponent } from '../order-add-edit/order-add-edit.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { Order } from 'src/app/Models/order.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  order:any;



  displayedColumns: string[] = ['orderId','email','dateOrdered','city','country','phoneNumber','totalAmount','orderStatus','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalItems: number = 0; // Assuming you have a property to store the total number of items
  pageIndex: number = 0; // Assuming you have a property to store the current page index
  pageSize: number = 5;


  constructor(
    private _dialog: MatDialog,
    private _ticketService: TicketService,
    private _orderService:OrderService,
    private _eventService:EventService,
    private errorHandler: ErrorHandler
    ) { }

  ngOnInit(): void {
    this.getOrderList();

  }

  alertWithSuccess(message: string): void {
    Swal.fire('Success!', message, 'success');
  }

  alertWithError(message: string): void {
    Swal.fire('Error!', message, 'error');
  }

  updateTotalItems() {

    if (this.dataSource && this.dataSource.data) {
      this.totalItems = this.dataSource.data.length;
    }}

  openUpdateShowOrderForm(orderId: number) {
    const dialogRef = this._dialog.open(OrderAddEditComponent, {
      data: {
        orderId: orderId,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getOrderList();
        }
      },
    });
  }

  getOrderList(pageIndex: number = 0, pageSize: number = 5): void {
    this._orderService.getAllOrder(pageIndex, pageSize, 'orderId', 'asc').subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.totalItems = res.totalElements;

        this.pageIndex = pageIndex;

        console.log('API Response:', res);
        console.log('DataSource Data:', this.dataSource.data);
        this.updateTotalItems();
      },
      error: (err: any) => {
        console.log(err, 'Error occurred while fetching events');
        this.errorHandler.handleError(err);
      }
    });
  }


  onPageChange(event: PageEvent): void {
    this.getOrderList(event.pageIndex, event.pageSize);
    this.updateTotalItems();
  }

  // Method to handle previous page
  previousPage(): void {
    if (this.pageIndex > 0) {
      this.getOrderList(this.pageIndex - 1, this.pageSize);
    }
  }

  nextPage(): void {
    const remainingItems = this.totalItems - (this.pageIndex + 1) * this.pageSize;

    if (remainingItems > 0) {
      const nextPageSize = Math.min(this.pageSize, remainingItems);
      this.getOrderList(this.pageIndex + 1, nextPageSize);
    }
  }

hasPreviousPage(): boolean {
  return this.pageIndex > 0;
}

  // Method to check if there is a next page
  hasNextPage(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.totalItems;
  }  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteOrder(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDeleteOrder(id);
      }
    });
  }

  private performDeleteOrder(id: number): void {
    this._orderService.deleteOrder(id).subscribe({
      next: (res) => {
        this.alertWithSuccess('Order deleted successfully!');
        this.getOrderList();
      },
      error: (err: any) => {
        console.error('Error occurred while deleting order:', err);
        this.errorHandler.handleError(err);
        this.alertWithError('Error deleting order!');
      }
    });
  }
  openShowOrder(orderId: number): void {
    this._orderService.getOrderByIdWithDetails(orderId).subscribe(
      (order: Order) => {
        const dialogRef: MatDialogRef<OrderDetailsComponent> = this._dialog.open(OrderDetailsComponent, {
          data: {
            order: order,
          },
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching order details:', error);
        this.alertWithError('Error fetching order details!');
      }
    );
  }
  }
