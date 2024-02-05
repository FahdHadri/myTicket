import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, forkJoin, switchMap, throwError } from 'rxjs';
import { Cart, CartItem } from 'src/app/Models/cart.model';
import { OrderItem } from 'src/app/Models/order-item.model';
import { Order } from 'src/app/Models/order.model';
import { Ticket, TicketCategory } from 'src/app/Models/ticket.model';
import { User } from 'src/app/Models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  user = new User();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrderService,
    private ticketService: TicketService
  ) {}

  checkoutFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  unsubscribe$: Subject<any> = new Subject();

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this.user = JSON.parse(sessionStorage.getItem('userdetails') || '{}') as User;

    this.checkoutForm['email'].setValue(this.user?.email || '');

    console.log('Checkout Page Initialized');
  }

  ngOnDestroy() {
    this.unsubscribe$.next(void 0);
    this.unsubscribe$.complete();
    console.log('Checkout Page Destroyed');
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      orderStatus: ['en cours', Validators.required],
    });

    console.log('Checkout Form Initialized');
  }

  private _getCartItems(): void {
    const cart = this.cartService.getCart();

    if (cart.items) {
      const itemObservables = cart.items.map((item: CartItem) => {
        // Ensure productId is a valid number, or set a default value (e.g., 0)
        const productId = item.productId ? +item.productId : 0;

        return this.ticketService.getTicketById(productId).pipe(
          switchMap((ticket: Ticket) => {
            const orderItem: OrderItem = {
              tickets: ticket,
              quantity: item.quantity || 0,
            };
            return [orderItem];
          }),
          catchError((error) => {
            console.error('Error fetching ticket:', error);
            this.showSweetAlert('error', 'Error fetching ticket');
            return throwError(error);
          })
        );
      });

      // Combine all observables into one and subscribe to get the final array of order items
      forkJoin(itemObservables).subscribe((orderItems: OrderItem[]) => {
        this.orderItems = orderItems;
      });
    } else {
      this.orderItems = [];
      console.log('the new order item is', this.orderItems);
    }
  }

  backToCart() {
    this.router.navigate(['/eventcard']);
    console.log('Navigating back to Cart');
    this.showSweetAlert('info', 'Returning to the Cart page.');
  }

  placeOrder() {
    this.isSubmitted = true;
    console.log('Form Values:', this.checkoutFormGroup.value);
    console.log('Form Errors:', this.checkoutFormGroup.errors);
    if (this.checkoutFormGroup.invalid) {
      console.log('Invalid form. Aborting order placement.');
      this.showSweetAlert('error', 'Invalid form. Aborting order placement.');
      return;
    }

    console.log('Order Items:', this.orderItems);

    const order: Order = {
      orderItems: this.orderItems,
      email: (this.checkoutFormGroup.get('email')?.value || this.user?.email || '') as string,
      city: this.checkoutFormGroup.get('city')?.value as string,
      country: this.checkoutFormGroup.get('country')?.value as string,
      phoneNumber: this.checkoutFormGroup.get('phoneNumber')?.value as string,
      orderStatus: 'encours',
      dateOrdered: new Date().toISOString()
    };

    console.log('Placing order:', order);

    this.ordersService.createOrder(order).subscribe(
      () => {
        console.log('Order placed successfully.');
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
        this.showSweetAlert('success', 'Order placed successfully.');

      },
      (error) => {
        console.error('Error placing order:', error);
     
        this.showSweetAlert('error', 'Error placing order. Please try again.');
      }
    );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  private showSweetAlert(icon: SweetAlertIcon, title: string): void {
    Swal.fire({
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
