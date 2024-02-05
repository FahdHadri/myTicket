import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardBySessionComponent } from './event-card-by-session.component';

describe('EventCardBySessionComponent', () => {
  let component: EventCardBySessionComponent;
  let fixture: ComponentFixture<EventCardBySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCardBySessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCardBySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
