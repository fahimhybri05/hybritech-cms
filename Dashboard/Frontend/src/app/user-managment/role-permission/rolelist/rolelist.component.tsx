import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactAnalyticalTable } from "@app/components/analytical-table/react-table";
import { ToastMessageComponent } from "@app/components/toast-message/toast-message.component";
import { AddServicesComponent } from "@app/service-page/add-services/add-services.component";
import { EditServicesComponent } from "@app/service-page/edit-services/edit-services.component";
import { ServiceDetailsComponent } from "@app/service-page/service-details/service-details.component";
import { CommonService } from "@app/services/common-service/common.service";
import { Role } from "@app/shared/Model/Role";
import { Button, Icon, TextAlign } from "@ui5/webcomponents-react";
import React from "react";
import { RoleaddComponent } from "../roleadd/roleadd.component";
import { RoledetailsComponent } from "../roledetails/roledetails.component";
import { RoleeditComponent } from "../roleedit/roleedit.component";

@Component({
  selector: "app-rolelist",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactAnalyticalTable,
    AddServicesComponent,
    EditServicesComponent,
    ToastMessageComponent,
    ServiceDetailsComponent,
    RoleaddComponent,
    RoleeditComponent,
    RoledetailsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./rolelist.component.html",
  styleUrl: "./rolelist.component.css",
})
export class RolelistComponent {
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() IsOpenToastAlert = new EventEmitter<void>();
  ToastType: string = "";
  itemsPerPage: number;
  currentPage = 1;
  api: boolean;
  // odata: boolean;
  loading: boolean = false;
  isInsert: boolean = false;
  isEdit: boolean = false;
  isDeleteOpen: boolean = false;
  isDetails: boolean = false;
  isDeleteLoading: boolean = false;
  isSuccess: boolean = false;
  isDeleteError: boolean = false;
  filter: string = "";
  Title: string;
  type: string | null = null;
  selectedRoleId: number | null = null;
  selectedRoleData: any = null;
  roles = Role;
  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.itemsPerPage = this.commonService.itemsPerPage;
    this.api = this.commonService.api;
    this.Title = "Role";
    this.tableColum();
  }
  ngOnInit(): void {
    console.log(this.commonService.api)
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
        Header: " Name",
        accessor: "name",
        autoResizable: true,
        className: "custom-class-name",
      },
         {
        Header: " Guard Name",
        accessor: "guard_name",
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
                this.deleteRole(row.original);
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
  closeAddModal() {
    this.isInsert = false;
    this.refreshTable.emit();
  }
  deleteRole(original: any) {
    this.isDeleteOpen = true;
    this.selectedRoleId = original.id;
  }

  deleteRoleConfirm() {
    this.isDeleteLoading = true;
    const id = this.selectedRoleId;
    this.commonService.delete(`roles/${id}`, this.api).subscribe({
      next: (response: any) => {
        this.isDeleteOpen = false;
        this.isDeleteLoading = false;
        this.ToastType = "remove";
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

  editRole(original: any) {
    this.isEdit = true;
    this.selectedRoleId = original.id;
    this.selectedRoleData = { ...original };
  }
  details(original: any) {
    this.isDetails = true;
    this.selectedRoleId = original.id;
    this.selectedRoleData = { ...original };
  }

  closeDetailsModal() {
    this.isDetails = false;
    this.selectedRoleId = null;
    this.selectedRoleData = null;
  }
  editservice(original: any) {
    this.isEdit = true;
    this.selectedRoleId = original.id;
    this.selectedRoleData = { ...original };
  }

  closeEditModal() {
    this.isEdit = false;
    this.refreshTable.emit();
  }
  roless = [];
rolePermissions = [];



loadRolePermissions(role: any) {
  this.selectedRoleId = role.id;
  this.selectedRoleData = role;

  // API Call to get permissions of selected role
  this.commonService.post('get-role-permissions', { role_id: role.id }).subscribe(
    (res: any) => {
      this.rolePermissions = res.permissions || [];
    },
    (err) => {
      this.rolePermissions = [];
      console.error(err);
    }
  );
}
;

// // Add this method to your RolelistComponent class
// permissionColumns() {
//   return [
//     {
//       Header: 'Permission Name',
//       accessor: 'name'
//     },
//     {
//       Header: 'Description',
//       accessor: 'description'
//     }
//     // Add more columns as needed
//   ];
// }
permissionColumns() {
  return [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Guard', accessor: 'guard_name' },
    { Header: 'Created', accessor: 'created_at' },
  ];
}

openAddPermissionModal() {
  // Open permission assignment modal
}

}
