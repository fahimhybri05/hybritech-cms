import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonService } from "../../services/common-service/common.service";
import { ReactAnalyticalTable } from "../../components/analytical-table/react-table";
import { Button, Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { ToastMessageComponent } from "@app/components/toast-message/toast-message.component";
import { AddUserComponent } from "@app/user-managment/add-user/add-user.component";
import { User } from "@app/shared/Model/user";
@Component({
	selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactAnalyticalTable,
    ToastMessageComponent,
    AddUserComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  itemsPerPage: number;
  currentPage = 1;
  odata: boolean;
  loading: boolean = false;
  isInsert: boolean = false;
  isEdit: boolean = false;

  isDeleteOpen: boolean = false;
  isDeleteLoading: boolean = false;
  isSuccess: boolean = false;
  isDeleteError: boolean = false;
  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedUserId: number | null = null;
  selectedUserData: any = null;
  Users = User;
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "User Managment";
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
        hAlign: "Center" as TextAlign,
        width: 70,
      },
      {
        Header: " Name",
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
        Header: "Position",
        accessor: "position",
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
        width: 150,
        hAlign: "Center" as TextAlign,
        Cell: ({ row }: any) => (
          <div>
            <Button
              icon="edit"
              design="Transparent"
              onClick={() => {
                this.editFaq(row.original);
              }}
            />
            <Button
              icon="delete"
              design="Transparent"
              onClick={() => {
                this.deleteFaqs(row.original);
              }}
            ></Button>
          </div>
        ),
      },
    ];
    return columns;
  }

  handleInsertData(isInsert: boolean): void {
    if (isInsert) {
      this.isInsert = isInsert;
      this.refreshTable.emit();
    }
  }
  closeAddFaqModal() {
    this.isInsert = false;
    this.refreshTable.emit();
  }

  deleteFaqs(original: any) {
    this.isDeleteOpen = true;
    this.selectedUserId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedUserId;
    this.commonService.delete(`Users/${id}`, this.odata).subscribe({
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
        console.log(error);
        this.isDeleteError = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.refreshTable.emit();
      },
    });
  }

  editFaq(original: any) {
    this.isEdit = true;
    this.selectedUserId = original.id;
    this.selectedUserData = { ...original };
  }

  closeEditFaqModal() {
    this.isEdit = false;
  }
}
