// swal.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {

  constructor() {}

  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', confirmButtonText: string = 'Ok') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
      customClass: {
        popup: 'swal-popup-custom',
        title: 'swal-title-custom',
      }
    });
  }

  showSuccess(message: string) {
    this.showAlert('Success', message, 'success');
  }

  showError(message: string) {
    this.showAlert('Error!', message, 'error');
  }

  showWarning(message: string) {
    this.showAlert('Warning', message, 'warning');
  }

  showInfo(message: string) {
    this.showAlert('Info', message, 'info');
  }
}
