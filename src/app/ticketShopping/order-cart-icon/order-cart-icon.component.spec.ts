import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCartIconComponent } from './order-cart-icon.component';

describe('OrderCartIconComponent', () => {
  let component: OrderCartIconComponent;
  let fixture: ComponentFixture<OrderCartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCartIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
