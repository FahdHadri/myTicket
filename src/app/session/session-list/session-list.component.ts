import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from 'src/app/core/core.service';
import { SessionService } from 'src/app/services/session.service';
import { VenueService } from 'src/app/services/venue.service';
import { SessionAddDeleteComponent } from '../session-add-delete/session-add-delete.component';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {


  displayedColumns: string[] = ['sessionId','sessionName','startDate','finishDate','imgUrl','venue', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _venueService: VenueService,
    private _sessionService: SessionService,
    private errorHandler: ErrorHandler
    ) { }


  ngOnInit(): void {
    this.getSessionList();
  }

  openAddEditSessionForm() {
    const dialogRef = this._dialog.open(SessionAddDeleteComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getSessionList();
        }
      },
    });
  }

  getSessionList() {
    this._sessionService.getAllSessions(0, 5, 'sessionId', 'asc').subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.content); // Use res.content directly
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log('API Response:', res);
        console.log('DataSource Data:', this.dataSource.data);
      },
      error: (err: any) => {
        console.log(err, 'Error occurred while fetching events');
        this.errorHandler.handleError(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteSession(id: number) {
    let confirmation = confirm('Are you sure to delete the session?')
    if (!confirmation) { return; }
    else {
      this._sessionService.deleteSession(id).subscribe({
        next: (res) => {
          console.log("Deleted Successfully", 'done');
          //this.route.navigate(['/venuelist']);
          this.getSessionList();
        },
        error: (err: any) => {
          console.error('Error occurred while deleting session:', err);
          this.handleDeleteError(err);
        }
      })
    }
  }

  private handleDeleteError(error: any): void {
    if (error.status === 400) {
      // Handle foreign key constraint violation
      alert('Error: This session is associated with other entities and cannot be deleted.');
    } else {
      // Handle other errors
      this.errorHandler.handleError(error);
    }
  }

  openEditSessionForm(data: any) {
    const dialogRef = this._dialog.open(SessionAddDeleteComponent, {
      data: {
        ...data,
        venueId: data.venue ? data.venue.venueId : null,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getSessionList();
        }
      },
    });
  }

  }






