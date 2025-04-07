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
import { Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { Button } from "@ui5/webcomponents-react";
import { FormDetailsComponent } from "../form.details/form.details.component";

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
  templateUrl: './contact.us.form.component.html',
  styleUrl: './contact.us.form.component.css'
})
export class ContactUsFormComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();  
    @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  itemsPerPage: number;
  currentPage = 1;

  odata: boolean;
  loading: boolean = false;
  isDetails: boolean = false;

  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedFormId: number | null = null;
  selectedFormData: any = null;
  isOpen: boolean = false; 

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.odata = this.commonService.odata;
    this.Title = "Common Form Data:";
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
        Cell: ({ value }: any) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Actions",
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
              icon="information"
              design="Transparent"
              onClick={() => {
                this.formDetails(row.original);
              }}
            ></Button>
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
    this.cdr.detectChanges();
  }

  closeModal() {
	this.isOpen = false;	
    this.close.emit();  
    this.refreshTable.emit();
  }
}
