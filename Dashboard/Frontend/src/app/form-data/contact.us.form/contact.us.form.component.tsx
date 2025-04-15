import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ChangeDetectorRef,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonService } from "@app/services/common-service/common.service";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { Button } from "@ui5/webcomponents-react";
import { FormDetailsComponent } from "@app/form-data/form.details/form.details.component";
import { Forms } from '@app/shared/Model/forms'; 

@Component({
  selector: "app-common-form",
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
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();

  ToastType: string = "";
  itemsPerPage: number;
  currentPage = 1;
  tableData: Forms[] = [];

  odata: boolean;
  loading: boolean = false;
  isDetails: boolean = false;

  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedFormId: number | null = null;
  selectedFormData: Forms | null = null;
  isOpen: boolean = false;
  FormsData = Forms;
  // forms = new Forms().deserialize({});
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "Contact Us Form Data:";
  }

  ngOnInit(): void {
    this.tableColum();
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
        accessor: "is_read",
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

  formDetails(form: Forms) {
    this.selectedFormId = form.id ?? null;
    this.selectedFormData = form;
    this.isOpen = true;
    this.cdr.detectChanges();
  }
  onFormUpdated(updatedForm: Forms) {
    const index = this.tableData.findIndex(
      (form) => form.id === updatedForm.id
    );
    if (index !== -1) {
      this.tableData[index] = updatedForm;
    }
    this.refreshTable.emit();
  }
  closeModal() {
    this.isOpen = false;
    this.cdr.detectChanges();
    this.selectedFormId = null;
    this.selectedFormData = null;
  }
}
