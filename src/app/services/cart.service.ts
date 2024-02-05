import { Injectable } from '@angular/core';
import { Cart, CartItem, CartItemDetailed } from '../Models/cart.model';
import { BehaviorSubject } from 'rxjs';
export const CART_KEY = 'cart';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }
  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initialCart: Cart = {
        items: []
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CART_KEY, initialCartJson);
    }
  }


  getCart(): Cart {
    const cartJson = localStorage.getItem(CART_KEY);
    const cart = cartJson ? JSON.parse(cartJson) : { items: [] };
    return cart;
  }

  setCart(cart: Cart): void {
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
  }

 /* setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();

    if (!cart.items) {
      cart.items = [];
    }

    const cartItemExistIndex = cart.items.findIndex((item) => item.productId === cartItem.productId);

    if (cartItemExistIndex !== -1) {
      const existingItem = cart.items[cartItemExistIndex];

      if (cartItem.quantity !== undefined) {
        existingItem.quantity = updateCartItem ? cartItem.quantity : (existingItem.quantity ?? 0) + cartItem.quantity;
      }

      // Create a new array with the modified item
      cart.items = [...cart.items.slice(0, cartItemExistIndex), existingItem, ...cart.items.slice(cartItemExistIndex + 1)];
    } else {
      if (cartItem.quantity !== undefined) {
        cart.items.push(cartItem);
      }
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }*/

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();

    if (!cart.items) {
      cart.items = [];
    }

    const existingItem = cart.items.find(item => String(item.productId) === String(cartItem.productId));

    if (existingItem) {
      // If the item exists, update the quantity
      existingItem.quantity = updateCartItem ? cartItem.quantity || 0 : (existingItem.quantity || 0) + (cartItem.quantity || 0);
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }




  deleteCartItem(productId: string) {
    const cart = this.getCart();
    if (cart.items) {
      const newCart = cart.items.filter(item => String(item.productId) !== String(productId));

      cart.items = newCart;

      const cartJsonString = JSON.stringify(cart);
      localStorage.setItem(CART_KEY, cartJsonString);

      this.cart$.next(cart);
    }
  }



  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }



}
