import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from 'src/app/services/event.service';
import { SessionService } from 'src/app/services/session.service';
import { TicketService } from 'src/app/services/ticket.service';
import { TicketAddEditComponent } from '../ticket-add-edit/ticket-add-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  totalItems: number = 0; //
  pageIndex: number = 0; //
  pageSize: number = 5;
  displayedColumns: string[] = ['id','ticketCat','price','quantity','imgUrlTicket','event','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _ticketService: TicketService,
    private _sessionService: SessionService,
    private _eventService:EventService,
    private errorHandler: ErrorHandler
    ) { }


  ngOnInit(): void {
    this.getTicketList();
  }

  openAddEditTicketForm() {
    const dialogRef = this._dialog.open(TicketAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTicketList();
        }
      },
    });
  }


  simpleAlert(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: 'Signed in successfully'
    })
  }

  alertWithSuccess(){
    Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
  }


  getTicketList (pageIndex: number = 0, pageSize: number = 5): void {
      this._ticketService.getAllTicket(pageIndex, pageSize, 'id', 'asc').subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.totalItems = res.totalElements;

          this.pageIndex = pageIndex;

          console.log('API Response:', res);
          console.log('DataSource Data:', this.dataSource.data);
        },
        error: (err: any) => {
          console.log(err, 'Error occurred while fetching events');
          this.errorHandler.handleError(err);
        }
      });
    }
    updateTotalItems() {
      this.totalItems = this.dataSource.data.length;
    }

    // Method to handle page change events
    onPageChange(event: PageEvent): void {
      this.getTicketList(event.pageIndex, event.pageSize);
      this.updateTotalItems();
    }

    // Method to handle previous page
    previousPage(): void {
      if (this.pageIndex > 0) {
        this.getTicketList(this.pageIndex - 1, this.pageSize);
      }
    }
    nextPage(): void {
      const remainingItems = this.totalItems - (this.pageIndex + 1) * this.pageSize;

      if (remainingItems > 0) {
        const nextPageSize = Math.min(this.pageSize, remainingItems);
        this.getTicketList(this.pageIndex + 1, nextPageSize);
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
    deleteTicket(id: number): void {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this ticket!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.performDelete(id);
        }
      });
    }

    private performDelete(id: number): void {
      this._ticketService.deleteTicket(id).subscribe({
        next: (res) => {
          if (res === null) {
            console.log('Deletion was successful. API response is null.');
          } else {
            console.log('API Response:', res);
            console.log('Deleted Successfully', 'done');
            this.getTicketList();
            Swal.fire('Deleted!', 'Your ticket has been deleted.', 'success');
          }
        },
        error: (err: any) => {
          console.error('Error occurred while deleting ticket:', err);
          this.errorHandler.handleError(err);
        }
      });
    }

  openEditTicketForm(ticket: any): void {
    const dialogConfig: MatDialogConfig = {
      data: ticket,
      // Add other configurations if needed
    };

    const dialogRef = this._dialog.open(TicketAddEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val !== undefined) {
          console.log('Dialog closed with value:', val);
          this.getTicketList();
        } else {
          console.log('Dialog closed without emitting a value');
        }
      },
    });
  }

  }
