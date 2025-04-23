import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit{
  footer: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchFooter();
  }

  fetchFooter() {
    this.dataService.getFooterData().subscribe(
      (response) => {
        this.footer = response.value;
      },
      (error) => {
        console.error('Error fetching FAQs:', error);
      }
    );
  }
}
