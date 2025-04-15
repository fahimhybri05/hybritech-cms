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
import { CommonService } from "@app/services/common-service/common.service";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { Button } from "@ui5/webcomponents-react";
import { FormDetailsComponent } from "@app/form-data/form.details/form.details.component";
import { Forms } from "@app/shared/Model/forms";
@Component({
  selector: "app-contactus-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactAnalyticalTable,
    FormDetailsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./contact.us.form.component.html",
  styleUrl: "./contact.us.form.component.css",
})
export class ContactUsFormComponent implements OnInit {
  @Output() refreshTrigger = new EventEmitter();
  itemsPerPage: number;
  currentPage = 1;

  odata: boolean;
  loading: boolean = false;
  isDetails: boolean = false;
  is_read: boolean = false;

  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedFormId: number | null = null;
  selectedFormData: any = null;
  isOpen: boolean = false;
  FormsData = Forms;
  constructor(
    private commonService: CommonService
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "Common Form Data:";
    this.tableColum();
  }

  ngOnInit(): void {}
  refresh($event: any) {
    this.refreshTrigger.emit();
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
        Cell: ({ row }: { row: { index: number } }) => (
          <span>{row.index + 1}</span>
        ),
        width: 60,
      },
      {
        Header: "Read",
        accessor: "is_active",
        autoResizable: true,
        disableGroupBy: true,
        disableFilters: true,
        className: "custom-class-name",
        width: 100,
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: { value: boolean }) =>
          value ? <Icon name="accept" /> : <Icon name="decline" />,
      },
      {
        Header: "Name",
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
        Header: "Subject",
        accessor: "subject",
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
        Header: "Created At",
        accessor: "created_at",
        autoResizable: true,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ value }: { value: string | undefined }) =>
          value ? new Date(value).toLocaleDateString() : "-",
      },
      {
        Header: "Actions",
        accessor: ".",
        cellLabel: () => "Actions",
        disableFilters: true,
        disableGroupBy: true,
        disableSortBy: true,
        autoResizable: true,
        id: "actions",
        width: 150,
        className: "custom-class-name",
        hAlign: "Center" as TextAlign,
        Cell: ({ row }: { row: { original: Forms } }) => (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <Button
              icon="information"
              design="Transparent"
              aria-label="View details"
              onClick={() => this.formDetails(row.original)}
            />
          </div>
        ),
      },
    ];
    return columns;
  }

  formDetails(original: any) {
    this.selectedFormId = original.id;
    this.selectedFormData = { ...original };
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }
}
