import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merci',
  templateUrl: './merci.component.html',
  styleUrls: ['./merci.component.css']
})
export class MerciComponent {
  constructor(private router: Router) {}

  backToShop() {
    Swal.fire({
      title: 'Back to Shop',
      text: 'Are you sure you want to go back to the shop?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, go back!',
      cancelButtonText: 'No, stay here'
    }).then((result) => {
      if (result.isConfirmed) {
      
        this.router.navigate(['/eventcard']);
      }
    });
  }
}
