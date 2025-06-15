import { CommonModule } from "@angular/common";
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
import { EmailList } from "@app/shared/Model/interviewlist";

@Component({
  selector: "app-email-list",
  standalone: true,
  imports: [ReactAnalyticalTable, ToastMessageComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./email-list.component.html",
  styleUrl: "./email-list.component.css",
})
export class EmailListComponent {
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
  EmailLists = EmailList;
  
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.api = this.commonService.api;
    this.Title = "Email Sent Log";
  }

  refresh($event: any) {
    this.refreshTable.emit();
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
        Header: "Invitation sent",
        accessor: "is_email_sent",
        autoResizable: true,
        disableFilters: true,
        disableGroupBy: true,
        disableSortBy: true,
        className: "custom-class-name",
        width: 130,
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) =>
          value ? <Icon name="accept" /> : <Icon name="decline" />,
      },
      {
        Header: "Full Name",
        accessor: "name",
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
        Header: "Address",
        accessor: "address",
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
        Header: "Interview Time",
        accessor: "interview_date",
        autoResizable: true,
        className: "custom-class-name",
      },
      {
        Header: "Submitted At",
        accessor: "created_at",
        autoResizable: true,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) =>
          value ? new Date(value).toLocaleDateString() : "-",
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

  deleteJobs(original: any) {
    this.isDeleteOpen = true;
    this.selectedJobId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedJobId;
    this.commonService
      .delete(`emailed-candidate-list-delete/${id}`, this.api)
      .subscribe({
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
        },
      });
  }
}
