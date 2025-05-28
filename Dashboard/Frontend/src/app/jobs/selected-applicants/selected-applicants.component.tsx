import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { Button, Icon, TextAlign } from "@ui5/webcomponents-react";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { CommonService } from "@app/services/common-service/common.service";
import React from "react";
import { ToastMessageComponent } from "@app/components/toast-message/toast-message.component";
import { JobApplication } from "@app/shared/Model/jobapplication";


@Component({
  selector: 'app-selected-applicants',
  standalone: true,
  imports: [
    ReactAnalyticalTable,
    ToastMessageComponent,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './selected-applicants.component.html',
  styleUrl: './selected-applicants.component.css'
})
export class SelectedApplicantsComponent {
  @Input() model: any;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  totalJobs: number = 0;
  itemsPerPage: number;
  currentPage = 1;
  jobData: any[] = [];
  api: boolean;
  loading: boolean = false;
  isApplicantDetails: boolean = false;
  isDeleteOpen: boolean = false;
  isDeleteLoading: boolean = false;
  filter: string = "";
  Title: string;
  selectedJobId: number | null = null;
  selectedJobData: any = null;
  JobApplications = JobApplication;
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.api = this.commonService.api;
    this.Title = "Selected Applications";
  }
  tableColum() {
      const columns = [
        {
          Header: "Sl No.",
          accessor: ".",
          autoResizable: true,
          disableFilters: true,
          disableGroupBy: true,
          disableSortBy: true,
          className: "custom-class-name",
          Cell: ({ row }: { row: any }) => {
            return React.createElement("span", null, row.index + 1);
          },
          hAlign: "Center" as TextAlign,
          width: 70,
        },
              {
                Header: "Invitaion sent",
                accessor: "is_email_sent",
                autoResizable: true,
                disableFilters: true,
                disableGroupBy: true,
                disableSortBy: true,
                className: "custom-class-name",
                width: 100,
                hAlign: "Center" as TextAlign,
                Cell: ({ value }: any) =>
                  value ? <Icon name="accept" /> : <Icon name="decline" />,
              },
        {
          Header: "Full Name",
          accessor: "full_name",
          autoResizable: true,
          className: "custom-class-name",
        },
        {
          Header: "Email",
          accessor: "email",
          autoResizable: true,
          className: "custom-class-name",
        },
        {
          Header: "Number",
          accessor: "number",
          autoResizable: true,
          className: "custom-class-name",
        },
        {
          Header: "Designation",
          accessor: "designation",
          autoResizable: true,
          className: "custom-class-name",
        },
        {
          Header: "Experience",
          accessor: "experience",
          autoResizable: true,
          className: "custom-class-name",
        },
               {
          Header: "Selected At",
          accessor: "selected_at",  
          autoResizable: true,
          className: "custom-class-name",
          hAlign: "Center" as TextAlign,
          Cell: ({ value }: any) => new Date(value).toLocaleDateString(),
        },
        {
          Header: "Submitted At",
          accessor: "created_at",
          autoResizable: true,
          className: "custom-class-name",
          hAlign: "Center" as TextAlign,
          Cell: ({ value }: any) => value? new Date(value).toLocaleDateString():"-",
        },
        {
          Header: "   Actions",
          accessor: ".",
          cellLabel: () => "",
          disableFilters: true,
          disableGroupBy: true,
          disableSortBy: true,
          autoResizable: true,
          id: "actions",
          className: "custom-class-name",
          hAlign: "Center" as TextAlign,
          Cell: ({ row }: any) => (
            <div>
              <Button
                icon="information"
                design="Transparent"
              ></Button>
  
              <Button
                icon="delete"
                design="Transparent"
                onClick={() => {
                  this.deleteJobs(row.original);
                }}
              ></Button>
            </div>
          ),
        },
      ];
      return columns;
    }

  JobsDetails(original: any) {
    this.isApplicantDetails = false;
    this.cdr.detectChanges(); 
    this.selectedJobId = original.id;
    this.selectedJobData = { ...original };
    this.isApplicantDetails = true;
    this.cdr.detectChanges();
    this.refreshTable.emit();
  }

  closeJobDetailsModal() {
    this.isApplicantDetails = false;
    this.selectedJobId = null;
    this.selectedJobData = null;
    this.cdr.detectChanges(); 
  }


      deleteJobs(original: any) {
    this.isDeleteOpen = true;
    this.selectedJobId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedJobId;
    this.commonService.delete(`job-applications/${id}`, this.api).subscribe({
      next: (response: any) => {
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.ToastType = "delete";
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.refreshTable.emit();
      },
      error: (error: any) => {
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.refreshTable.emit();
      },
    });
  }
}
