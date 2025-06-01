import { Component } from '@angular/core';
import { FormComponent } from '../components/form/form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '@app/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [FormComponent, CommonModule],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css',
})
export class AboutUsPageComponent {
  projects: any[] = [];
  teams: any[] =[];
  pages: any;
  projectSection:any;
   teamSection: any;
  isActive = false;
  constructor(
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getProjectData();
    this.getTeamData();
    this.getWebpageData();
  }

  getProjectData() {
    this.dataService.getProjectData().subscribe(
      (response) => {
        this.projects = Array.isArray(response) ? response : [];
      },
      (error) => {
        console.error('Error fetching services:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }

  //for team
  getTeamData() {
    this.dataService.getTeamData().subscribe(
      (response) => {
        this.teams = Array.isArray(response) ? response : [];
      },
      (error) => {
        console.error('Error fetching services:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }

  getSanitizedIcon(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
  getWebpageData() {
  this.dataService.getWebPageData().subscribe(
    (response) => {
      const sections = response.value || [];

      this.projectSection = sections.find((item: any) => item.id === 1);
      this.teamSection = sections.find((item: any) => item.id === 2);
      
      console.log("Project Section:", this.projectSection);
      console.log("Team Section:", this.teamSection);
    },
    (error) => {
      console.error('Error fetching services:', error);
      if (error.error) console.error('Error details:', error.error);
    }
  );
}
}
