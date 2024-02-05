import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from 'src/app/Models/cart.model';

@Component({
  selector: 'order-cart-icon',
  templateUrl: './order-cart-icon.component.html',
  styleUrls: ['./order-cart-icon.component.css']
})
export class OrderCartIconComponent implements OnInit {
cartCount! :number;
  constructor(private cartService : CartService){}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart=>{
      const cartItems = this.cartService.getCart().items;
      this.cartCount = cartItems!.length;

  })

  }}
