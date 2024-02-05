import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionService } from 'src/app/services/session.service';
import { VenueService } from 'src/app/services/venue.service';
import { EventAddEditComponent } from '../event-add-edit/event-add-edit.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  totalItems: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;

  displayedColumns: string[] = ['eventId','description','cat','dateEvent','available','imgEvent','session', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _venueService: VenueService,
    private _sessionService: SessionService,
    private _eventService:EventService,
    private errorHandler: ErrorHandler
    ) { }


  ngOnInit(): void {
    this.getEventList();
  }

  openAddEditEventForm() {
    const dialogRef = this._dialog.open(EventAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEventList();
        }
      },
    });
  }

  getEventList(pageIndex: number = 0, pageSize: number = 5): void {
    this._eventService.getAllEvents(pageIndex, pageSize, 'eventId', 'asc').subscribe({
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
    this.getEventList(event.pageIndex, event.pageSize);
    this.updateTotalItems();
  }

  // Method to handle previous page
  previousPage(): void {
    if (this.pageIndex > 0) {
      this.getEventList(this.pageIndex - 1, this.pageSize);
    }
  }

  
  nextPage(): void {
    const remainingItems = this.totalItems - (this.pageIndex + 1) * this.pageSize;

    if (remainingItems > 0) {
      const nextPageSize = Math.min(this.pageSize, remainingItems);
      this.getEventList(this.pageIndex + 1, nextPageSize);
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
    deleteEvent(id: number) {
    let confirmation = confirm('Are you sure to delete the event?')
    if (!confirmation) { return; }
    else {
      this._eventService.deleteEvent(id).subscribe({
        next: (res) => {
          console.log("Deleted Successfully", 'done');
          //this.route.navigate(['/venuelist']);
          this.getEventList();
        },
        error: (err: any) => {
          console.error('Error occurred while deleting event:', err);
          this.errorHandler.handleError(err);
        }
      })
    }
  }
  openEditEventForm(data: any) {
    const dialogRef = this._dialog.open(EventAddEditComponent, {
      data: {
        ...data,
        sessionId: data.session.sessionId,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEventList();
        }
      },
    });
  }
  }
