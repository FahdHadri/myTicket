import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardByCategoryComponent } from './event-card-by-category.component';

describe('EventCardByCategoryComponent', () => {
  let component: EventCardByCategoryComponent;
  let fixture: ComponentFixture<EventCardByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCardByCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCardByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
