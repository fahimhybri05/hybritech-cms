import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service'; // Import the DataService
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FAQComponent implements OnInit {
  faq: any[] = [];
  isLoading = false;
  activeIndex: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchFAQs();
  }

  fetchFAQs() {
    this.dataService.getFaqData().subscribe(
      (response) => {
        this.faq = response?.value || [];
      },
      (error) => {
        console.error('Error fetching FAQs:', error);
      }
    );
  }

  toggleFaq(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
