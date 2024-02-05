import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemDetailed } from 'src/app/Models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._getCartDetails();
  }
  ngOnDestroy() {
    this.endSubs$.next(void 0);
    this.endSubs$.complete();
  }
  private showSuccessToast(title: string): void {
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
    });

    Toast.fire({
      icon: 'success',
      title,
    });
  }

  private showErrorToast(title: string): void {
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
    });

    Toast.fire({
      icon: 'error',
      title,
    });
  }

  _getCartDetails(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((respCart) => {
        this.cartItemsDetailed = [];
        this.cartCount = respCart?.items?.length ?? 0;

        if (respCart?.items) {
          respCart.items.forEach((cartItem) => {
            if (cartItem.productId) {
              const productIdAsNumber = Number(cartItem.productId);

              if (!isNaN(productIdAsNumber)) {
                this.ordersService.getTicketById(productIdAsNumber).subscribe(
                  (respProduct) => {
                    if (respProduct) {
                      this.cartItemsDetailed.push({
                        product: respProduct,
                        quantity: cartItem.quantity,
                      });
                    }
                  },
                  (error) => {
                    console.error('Error fetching product:', error);
                    this.showErrorToast('Error fetching product');
                  }
                );
              } else {
                console.error('Invalid productId:', cartItem.productId);
                this.showErrorToast('Invalid productId');
              }
              this.cdr.detectChanges();
            }
          });
        }
      });
  }

  backToShop() {
    this.router.navigate(['/eventcard']);
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);
    this.showSuccessToast('Item deleted successfully');
  }

  updateCartItemQuantity(event: Event, cartItem: CartItemDetailed) {
    if (cartItem?.product?.id !== undefined) {
      const quantity = +event; // Use the event directly as it contains the quantity
      this.cartService.setCartItem({
        productId: cartItem.product.id,
        quantity,
      }, true);
      this.showSuccessToast('Quantity updated successfully');
    } else {
      console.error('Invalid cartItem:', cartItem);
      this.showErrorToast('Invalid cartItem');
    }
  }
}
