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
import { FormsModule } from "@angular/forms";
import { CommonService } from "@app/services/common-service/common.service";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { Button } from "@ui5/webcomponents-react";
import { AddServicesComponent } from "@app/service-page/add-services/add-services.component";
import { EditServicesComponent } from "@app/service-page/edit-services/edit-services.component";
import { ToastMessageComponent } from '@app/components/toast-message/toast-message.component';

import { Services } from "@app/shared/Model/services";
import { ServiceDetailsComponent } from "@app/service-page/service-details/service-details.component";
@Component({
  selector: "app-services-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactAnalyticalTable,
    AddServicesComponent,
    EditServicesComponent,
    ToastMessageComponent,
    ServiceDetailsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./services-list.component.html",
  styleUrl: "./services-list.component.css",
})
export class ServicesListComponent implements OnInit {
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  totalItems: number = 0;
  itemsPerPage: number;
  currentPage = 1;
  odata: boolean;
  api: boolean;
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
  selectedItemId: number | null = null;
  selectedItemData: any = null;
  Services = Services;
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
    this.Title = "Our Services";
    this.tableColum();
  }
  ngOnInit(): void {
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
        Header: "Title",
        accessor: "title",
        autoResizable: true,
        className: "custom-class-name",
      },
      {
        Header: "Description",
        accessor: "description",
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
              alt="Service"
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
                this.editservice(row.original);
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
  details(original: any) {
    this.isDetails = true;
    this.selectedItemId = original.id;
    this.selectedItemData = { ...original };
  }

  closeDetailsModal() {
    this.isDetails = false;
    this.selectedItemId = null;
    this.selectedItemData = null;
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

  deleteItem(original: any) {
    this.isDeleteOpen = true;
    this.selectedItemId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedItemId;
    this.commonService.delete(`service-pages/${id}`, this.api).subscribe({
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

  editservice(original: any) {
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
}
