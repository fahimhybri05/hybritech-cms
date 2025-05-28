import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { CommonService } from "@app/services/common-service/common.service";
import { Team } from "@app/shared/Model/team";
import { Button, Icon, TextAlign } from "@ui5/webcomponents-react";
import { ToastMessageComponent } from "@app/components/toast-message/toast-message.component";
import React from "react";
import { AddTeamComponent } from "../add-team/add-team.component";
import { EditTeamComponent } from "../edit-team/edit-team.component";
import { TeamDetailsComponent } from "../team-details/team-details.component";

@Component({
  selector: "app-team-list",
  standalone: true,
  imports: [
    ReactAnalyticalTable,
    CommonModule,
    ToastMessageComponent,
    AddTeamComponent,
    EditTeamComponent,
    TeamDetailsComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./team-list.component.html",
  styleUrl: "./team-list.component.css",
})
export class TeamListComponent implements OnInit {
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  totalItems: number = 0;
  itemsPerPage: number;
  currentPage = 1;
  odata: boolean;
  api: boolean;
  Team = Team;
  isInsert: boolean = false;
  selectedItemId: any;
  selectedItemData: any;
  isEdit: boolean = false;
  isDetails: boolean = false;
  isDeleteError: boolean = false;
  isDeleteLoading: boolean = false;
  isDeleteOpen: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
    this.tableColum();
  }
  ngOnInit(): void {}
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
        width: 60,
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
        Header: "Name",
        accessor: "name",
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
        Header: "Image",
        accessor: "media",
        autoResizable: true,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: any) =>
          value?.[0]?.original_url ? (
            <img
              src={value[0].original_url}
              alt="Team Image"
              style={{ margin: "5px" }}
              width="90"
              height="70"
            />
          ) : (
            <span>No Image</span>
          ),
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
        width: 150,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ row }: any) => (
          <div>
            <Button
              icon="edit"
              design="Transparent"
              onClick={() => {
                this.editTeam(row.original);
              }}
            />
            <Button
              icon="information"
              design="Transparent"
              onClick={() => {
                this.details(row.original);
              }}
            ></Button>

            <Button
              icon="delete"
              design="Transparent"
              onClick={() => {
                this.deleteItem(row.original);
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
      this.cdr.detectChanges();
    }
  }
  closeAddModal() {
    this.isInsert = false;
    this.refreshTable.emit();
  }
  editTeam(original: any) {
    this.isEdit = true;
    this.selectedItemId = original.id;
    this.selectedItemData = { ...original };
  }

  closeEditModal() {
    this.isEdit = false;
  }
  handleRefresh() {
    this.refreshTable.emit();
  }
  details(original: any) {
    this.isDetails = true;
    this.selectedItemId = original.id;
    this.selectedItemData = { ...original };
  }

  closeDetailsModal() {
    this.isDetails = false;
    this.selectedItemId = null;
    this.selectedItemData = null;
    this.cdr.detectChanges();
  }
  deleteItem(original: any) {
    this.isDeleteOpen = true;
    this.selectedItemId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedItemId;
    this.commonService.delete(`teams/${id}`, this.api).subscribe({
      next: (response: any) => {
        console.log(response);
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
        console.log(error);
        this.isDeleteError = true;
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.refreshTable.emit();
      },
    });
  }
}
