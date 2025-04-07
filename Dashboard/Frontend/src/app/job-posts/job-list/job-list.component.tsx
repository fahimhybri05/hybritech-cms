import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Button, Icon, TextAlign } from '@ui5/webcomponents-react';
import { ReactAnalyticalTable } from 'app/components/analytical-table/react-table';
import { CommonService } from 'app/services/common-service/common.service';
import React from 'react';
import { JobAddComponent } from '../job-add/job-add.component';


@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [ReactAnalyticalTable,JobAddComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent {

  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  totalJobs: number = 0;
  itemsPerPage: number;
  currentPage = 1;

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

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef 
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "Job List";
    this.tableColum();
  }
  ngOnInit(): void {}

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
        width: 60,
      },
      {
        Header: "Active",
        accessor: "is_active",
        autoResizable: true,
        disableGroupBy: true,
        disableFilters: true,
        width: 60,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) =>
          value ? <Icon name="accept" /> : <Icon name="decline" />,
      },
      {
        Header: " Title",
        accessor: "title",
        autoResizable: true,
        className: "custom-class-name",
        width: 300,
      },
      {
        Header: "Header Description",
        accessor: "header_description",
        autoResizable: true,
        className: "custom-class-name",
        width: 400,
      },
      {
        Header: "Job Description",
        accessor: "job_description",
        autoResizable: true,
        className: "custom-class-name",
        width: 400,
      },
      {
        Header: "Created At",
        accessor: "created_at",
        autoResizable: true,
        className: "custom-class-name",
        width: 75,
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
        width: 150,
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
    console.log("Received isInsertData:", isInsert);
    if (isInsert) {
      this.isInsert = isInsert;
    }
  }
  closeAddJobModal() {
    this.isInsert = false;
    this.refreshTable.emit();
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
        console.log(response);
        this.isSuccess = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.sucessMessage = "Job deleted successfully";
        this.refreshTable.emit();
      },
      error: (error: any) => {
        console.log(error);
        this.isDeleteError = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.refreshTable.emit();
      },
    });
  }


  editJob(original: any) {
    this.isEdit = true;  
    this.selectedJobId = original.id;
    this.selectedJobData = { ...original };  
  }

 
  closeEditJobModal() {
    this.isEdit = false;
  }
}
