import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormComponent } from '../components/form/form.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '@app/services/data.service';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  is_active: boolean;
  category?: string;
  media: Array<{
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
    thumbnail_url?: string | null;
  }>;
}

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [FormComponent, CommonModule],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css',
})
export class AboutUsPageComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  teams: any[] = [];
  pages: any;
  projectSection: any;
  teamSection: any;
  isActive = false;
  currentSlide = 0;
  selectedProject: Project | null = null;
  currentImageIndex: number = 0;
  private autoSlideInterval: any;

  @ViewChild('teamSlider') teamSlider!: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getProjectSectionData();
    this.getTeamSectionData();
    this.getWebpageData();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  truncateText(text: string, charLimit: number): string {
    if (!text) return '';
    return text.length <= charLimit ? text : text.slice(0, charLimit) + '...';
  }

  openProjectModal(event: Event, project: Project, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProject = project;
    this.currentImageIndex = 0;
  }

  prevImage(): void {
    if (this.selectedProject && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (
      this.selectedProject &&
      this.currentImageIndex < this.selectedProject.media.length - 1
    ) {
      this.currentImageIndex++;
    }
  }

  getProjectSectionData() {
    this.dataService.getProjectSectionData().subscribe(
      (response) => {
        this.projects = Array.isArray(response) ? response : [];
      },
      (error) => {
        console.error('Error fetching projects:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }

  getTeamSectionData() {
    this.dataService.getTeamSectionData().subscribe(
      (response) => {
        this.teams = Array.isArray(response) ? response : [];
        if (this.teams.length > 3) {
          this.startAutoSlide();
        }
      },
      (error) => {
        console.error('Error fetching teams:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }

  getSanitizedIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  getWebpageData() {
    this.dataService.getWebPageData().subscribe(
      (response) => {
        const sections = response.value || [];
        this.projectSection = sections.find((item: any) => item.id === 1);
        this.teamSection = sections.find((item: any) => item.id === 2);
      },
      (error) => {
        console.error('Error fetching webpage data:', error);
        if (error.error) console.error('Error details:', error.error);
      }
    );
  }

  slide(direction: number) {
    const slider = this.teamSlider.nativeElement;
    const slides = slider.querySelectorAll('.team-slide');
    const slideCount = this.teams.length;
    const slidesPerView = 3;
    const maxSlideIndex = slideCount;
    this.currentSlide += direction;

    if (this.currentSlide >= maxSlideIndex) {
      this.currentSlide = 0;
      slider.style.transition = 'none';
      slider.style.transform = `translateX(0)`;
      slider.offsetHeight;
      slider.style.transition = 'transform 0.5s ease';
    } else if (this.currentSlide < 0) {
      this.currentSlide = maxSlideIndex - 1;
      const slideWidth = slides[0].offsetWidth;
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${
        this.currentSlide * slideWidth
      }px)`;
      slider.offsetHeight;
      slider.style.transition = 'transform 0.5s ease';
    } else {
      const slideWidth = slides[0].offsetWidth;
      slider.style.transform = `translateX(-${
        this.currentSlide * slideWidth
      }px)`;
    }
  }

  private startAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.autoSlideInterval = setInterval(() => {
      this.slide(1);
    }, 3000);
  }

  shouldShowSlider(): boolean {
    return this.teams.length > 3;
  }
}
