import { Component, OnInit, ViewChild, ErrorHandler } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from 'src/app/core/core.service';
import { VenueService } from 'src/app/services/venue.service';
import { VenueAddEditComponent } from '../venue-add-edit/venue-add-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css']
})
export class VenueListComponent implements OnInit {
  totalItems: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;


  displayedColumns: string[] = ['id', 'venueName', 'capacity','action'];

  dataSource! : MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ErrorHandler: any;

  constructor(private _dialog:MatDialog,
              private _venueService:VenueService,
              private _coreService : CoreService,
              private errorHandler: ErrorHandler)
              {}


  ngOnInit():void{
    this.getVenueList();
  }
  alertWithSuccess(message: string): void {
    Swal.fire('Success!', message, 'success');
  }

  // Method to display error alert
  alertWithError(message: string): void {
    Swal.fire('Error!', message, 'error');
  }

    openAddEditVenueForm(){
      const dialogRef = this._dialog.open(VenueAddEditComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getVenueList();
          }
        },
      });
    }

    getVenueList(pageIndex: number = 0, pageSize: number = 5): void {
      this._venueService.getAllVenues(pageIndex, pageSize, 'venueId', 'asc').subscribe({
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
          this.ErrorHandler.handleError(err);
        }
      });
    }
    updateTotalItems() {
      this.totalItems = this.dataSource.data.length;
    }

    // Method to handle page change events
    onPageChange(event: PageEvent): void {
      this.getVenueList(event.pageIndex, event.pageSize);
      this.updateTotalItems();
    }

    // Method to handle previous page
    previousPage(): void {
      if (this.pageIndex > 0) {
        this.getVenueList(this.pageIndex - 1, this.pageSize);
      }
    }
    nextPage(): void {
      const remainingItems = this.totalItems - (this.pageIndex + 1) * this.pageSize;

      if (remainingItems > 0) {
        const nextPageSize = Math.min(this.pageSize, remainingItems);
        this.getVenueList(this.pageIndex + 1, nextPageSize);
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
    deleteVenue(id: number): void {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this venue!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.performDeleteVenue(id);
        }
      });
    }

    private performDeleteVenue(id: number): void {
      this._venueService.deleteVenue(id).subscribe({
        next: (res) => {
          this.alertWithSuccess('Venue deleted successfully!');
          this.getVenueList();
        },
        error: (err: any) => {
          console.error(err);
          this.errorHandler.handleError(err);
          this.alertWithError('Error deleting venue!');
        }
      });
    }
    openEditVenueForm(data: any): void {
      const dialogRef = this._dialog.open(VenueAddEditComponent, {
        data,
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.alertWithSuccess('Venue updated successfully!');
            this.getVenueList();
          }
        },
      });
    }




  }

