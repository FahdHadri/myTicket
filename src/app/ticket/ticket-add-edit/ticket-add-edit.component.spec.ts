import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAddEditComponent } from './ticket-add-edit.component';

describe('TicketAddEditComponent', () => {
  let component: TicketAddEditComponent;
  let fixture: ComponentFixture<TicketAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
