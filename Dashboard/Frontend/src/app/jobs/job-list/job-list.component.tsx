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
import { JobAddComponent } from "@app/jobs/job-add/job-add.component";
import { JobDetailsComponent } from "@app/jobs/job-details/job-details.component";
import { ToastMessageComponent } from "@app/components/toast-message/toast-message.component";
import { Joblist } from "@app/shared/Model/joblist";
<<<<<<< HEAD:Dashboard/Frontend/src/app/jobs/job-list/job-list.component.tsx
import { JobEditComponent } from "@app/jobs/job-edit/job-edit.component";
=======
import { JobEditComponent } from "@app/job-posts/job-edit/job-edit.component";
>>>>>>> 29be46d44a7490c344a15d0f65bc45001d92c994:Dashboard/Frontend/src/app/job-posts/job-list/job-list.component.tsx
@Component({
  selector: "app-job-list",
  standalone: true,
  imports: [
    ReactAnalyticalTable,
    JobAddComponent,
    JobDetailsComponent,
    ToastMessageComponent,
    JobEditComponent,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./job-list.component.html",
  styleUrl: "./job-list.component.css",
})
export class JobListComponent {
  @Input() model: any;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  totalJobs: number = 0;
  itemsPerPage: number;
  currentPage = 1;
  jobData: any[] = [];
  odata: boolean;
  loading: boolean = false;
  isInsert: boolean = false;
  isEdit: boolean = false;
  isDetails: boolean = false;
  isDeleteOpen: boolean = false;
  isDeleteLoading: boolean = false;
  isSuccess: boolean = false;
  isDeleteError: boolean = false;
  sucessMessage: string = "";
  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedJobId: number | null = null;
  selectedJobData: any = null;
  Joblists = Joblist;
  joblists = new Joblist().deserialize({});
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "Job List";
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
        Header: "Active",
        accessor: "is_active",
        autoResizable: true,
        disableGroupBy: true,
        disableFilters: true,
        className: "custom-class-name",
        width: 100,
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) =>
          value ? <Icon name="accept" /> : <Icon name="decline" />,
      },
      {
        Header: " Title",
        accessor: "title",
        autoResizable: true,
        className: "custom-class-name",
      },
      {
        Header: "Header Description",
        accessor: "header_description",
        autoResizable: true,
        className: "custom-class-name",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        autoResizable: true,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) => new Date(value).toLocaleDateString(),
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
              icon="edit"
              design="Transparent"
              onClick={() => {
                this.editJob(row.original);
              }}
            />
            <Button
              icon="information"
              design="Transparent"
              onClick={() => {
                this.JobsDetails(row.original);
              }}
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
    this.selectedJobId = original.id;
    this.selectedJobData = { ...original };
    this.isDetails = true;
    this.cdr.detectChanges();
  }

  closeJobDetailsModal() {
    this.isDetails = false;
    this.selectedJobId = null;
    this.selectedJobData = null;
  }

  handleInsertData(isInsert: boolean): void {
    if (isInsert) {
      this.isInsert = isInsert;
    }
  }
  closeAddJobModal() {
    this.isInsert = false;
    this.refreshTable.emit();
    // this.loadJobs();
  }

  deleteJobs(original: any) {
    this.isDeleteOpen = true;
    this.selectedJobId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedJobId;
    this.commonService.delete(`JobLists/${id}`, this.odata).subscribe({
      next: (response: any) => {
        this.isSuccess = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.ToastType = "delete";
        setTimeout(() => {
          this.IsOpenToastAlert.emit();
        }, 1000);
        this.refreshTable.emit();
      },
      error: (error: any) => {
        this.isDeleteError = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.refreshTable.emit();
      },
    });
  }
  editJob(original: any): void {
    this.selectedJobId = original.id;
    this.selectedJobData = original;
    this.isEdit = true;
    this.cdr.detectChanges();
  }
  closeEditJobModal(): void {
    this.isEdit = false;
    this.selectedJobId = null;
    this.selectedJobData = null;
    this.refreshTable.emit();
    // this.loadJobs();
  }
}
