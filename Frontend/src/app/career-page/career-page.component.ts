import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQComponent } from "../components/faq/faq.component";
import { FormComponent } from "../components/form/form.component";

@Component({
  selector: 'app-career-page',
  standalone: true,
  imports: [FAQComponent, FormComponent,CommonModule],
  templateUrl: './career-page.component.html',
  styleUrl: './career-page.component.css'
})
export class CareerPageComponent {
    jobs = [
      {
        title: 'Full-Stack Web Developer',
        headerdesc: 'Hybritech Innovations Ltd. is a dynamic and innovative Software company that is committed to delivering high-quality solutions to our clients. We are currently expanding our development team and seeking a talented Jr. Level, Mid-Level and Sr. Level Angular and Laravel Developer to join our growing team.',
        location: 'On Site',
        experience: '5 years experience',
        description: 'Hybritech Innovations Ltd. is a dynamic and innovative software company seeking talented Angular and Laravel Developers to join our growing team.',
        responsibilities: [
          'Develop, test, and deploy web applications using Angular and Laravel.',
          'Collaborate with cross-functional teams to design and implement new features.',
          'Write clean, maintainable, and efficient code.',
          'Troubleshoot and debug issues.',
          'Stay up to date with latest industry trends.'
        ],
        requirements: [
          'Proven experience with Angular and Laravel.',
          'Strong knowledge of HTML, CSS, and JavaScript.',
          'Experience with RESTful APIs and third-party integrations.',
          'Knowledge of Git version control.',
          'Bachelor\'s degree or equivalent work experience.'
        ],
        salary: 'Jr Level 20k-30k, Sr Level 50K-80K+ (based on skills)',
        benefits: [
          'Competitive salary',
          'Fully Subsidized Lunch',
          'Flexible work hours',
          'Two Festival Bonus',
          'Leave Encashment',
          'Professional development opportunities'
        ],
        applyInstructions: 'Submit your resume and cover letter to hrd@hybri.tech with "Angular and Laravel Developer Application" in the subject line.'
      },
      {
        title: 'Software Quality Assurance (SQA)',
        headerdesc:'xyz',
        location: 'On Site',
        experience: '2-3 years experience',
        description: 'As an SQA Engineer at Hybritech Innovations, you will play a critical role in ensuring the quality of our software products.',
        responsibilities: [
          'Design, develop, and execute test cases, scripts, and plans.',
          'Perform functional, regression, and performance testing.',
          'Collaborate with developers to troubleshoot and resolve issues.',
          'Track and report testing progress and issues.',
          'Contribute to the development of automated testing frameworks.'
        ],
        requirements: [
          'Bachelor\'s degree in Computer Science or related field.',
          '2-3 years of SQA experience.',
          'Familiarity with automated testing tools like Selenium.',
          'Experience with Agile methodologies.',
          'Excellent communication skills.'
        ],
        salary: 'Based on skills',
        benefits: [
          'Competitive salary',
          'Fully Subsidized Lunch',
          'Flexible work hours',
          'Two Festival Bonus',
          'Leave Encashment',
          'Professional development opportunities'
        ],
        applyInstructions: 'Submit your resume and cover letter to hrd@hybri.tech with "CV For Software Quality Assurance (SQA)" in the subject line.'
      }
    ];
  
    activeIndex: number | null = -1;
  
    constructor() {}
  
    ngOnInit(): void {
      this.activeIndex = -1;
    }
  
    toggleJob(index: number): void {
      if (this.activeIndex === index) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = index;
      }
    }
  }
  
