import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../services/preloader.service';
@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css'],
})
export class PreloaderComponent implements OnInit {
  isLoading = true;

  constructor(private preloaderService: PreloaderService) {}

  ngOnInit() {
    this.preloaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    setTimeout(() => {
      this.preloaderService.hide();
    }, 1000);
  }
}
