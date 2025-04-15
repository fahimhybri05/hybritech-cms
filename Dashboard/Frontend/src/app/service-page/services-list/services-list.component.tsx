import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef 
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./services-list.component.html",
  styleUrl: "./services-list.component.css",
})
export class ServicesListComponent implements OnInit {
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  totalFaqs: number = 0;
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
  selectedFaqId: number | null = null;
  selectedFaqData: any = null;
  Services = Services;
  services = new Services().deserialize({});
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.api = this.commonService.api;
    this.Title = "Our Services";
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
        Cell: ({ row }: any) => (
          <img
            src={row.service.imageUrl}
            alt="Signature"
            style={{ width: "120px", height: "80px", objectFit: "cover" }}
            width="40"
            height="40"
          />
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
                this.editFaq(row.original);
              }}
            />
            <Button
              icon="information"
              design="Transparent"
              onClick={() => {
                this.FaqsDetails(row.original);
              }}
            ></Button>

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
  FaqsDetails(original: any) {
    this.selectedFaqId = original.id;
    this.selectedFaqData = { ...original };
    this.isDetails = true;
    this.cdr.detectChanges();
  }

  closeFaqDetailsModal() {
    this.isDetails = false;
    this.selectedFaqId = null;
    this.selectedFaqData = null;
  }
  // insert modal
  handleInsertData(isInsert: boolean): void {
    console.log("Received isInsertData:", isInsert);
    if (isInsert) {
      this.isInsert = isInsert;
      this.cdr.detectChanges();
    }
  }
  closeAddFaqModal() {
    this.isInsert = false;
    this.refreshTable.emit();
  }
  // delete modal
  deleteFaqs(original: any) {
    this.isDeleteOpen = true;
    this.selectedFaqId = original.id;
  }

  deleteItemConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedFaqId;
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

  editFaq(original: any) {
    this.isEdit = true;
    this.selectedFaqId = original.id;
    this.selectedFaqData = { ...original };
  }

  closeEditFaqModal() {
    this.isEdit = false;
  }
}