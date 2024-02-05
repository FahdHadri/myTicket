import { Component,OnInit,ViewChild } from '@angular/core';
import { VenueAddEditComponent } from './Venue/venue-add-edit/venue-add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { VenueService } from './services/venue.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { CoreService } from './core/core.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
   }

