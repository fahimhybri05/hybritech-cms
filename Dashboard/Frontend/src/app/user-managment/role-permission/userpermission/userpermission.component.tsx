import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonService } from "@app/services/common-service/common.service";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/CheckBox.js";
import "@ui5/webcomponents/dist/Dialog.js";

@Component({
  selector: "app-userpermission",
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./userpermission.component.html",
  styleUrls: ["./userpermission.component.css"],
})
export class UserpermissionComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() selectedRoleId: number | null = null;
  @Input() selectedRoleName: string = "";
  @Output() close = new EventEmitter<void>();
  @Output() permissionsUpdated = new EventEmitter<void>();

  api: boolean = true;
  allPermissions: any[] = [];
  selectedPermissionIds: number[] = [];
  constructor(private commonService: CommonService) {
    this.api = this.commonService.api;
  }

  ngOnInit(): void {
    this.loadAllPermissions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"] && this.isOpen && this.selectedRoleId) {
      this.loadRolePermissions(this.selectedRoleId);
    } else if (
      changes["selectedRoleId"] &&
      this.selectedRoleId &&
      this.isOpen
    ) {
      this.loadRolePermissions(this.selectedRoleId);
    }
  }

  loadAllPermissions() {
    this.commonService.get("permissions", this.api).subscribe(
      (res: any) => {
        this.allPermissions = res;
      },
      (error) => {
        console.error("Error loading all permissions:", error);
      }
    );
  }

  loadRolePermissions(roleId: number) {
    this.commonService.get(`roles/${roleId}/permissions`, this.api).subscribe(
      (res: any) => {
        this.selectedPermissionIds = res.permissions.map((p: any) => p.id);
      },
      (error) => {
        console.error(`Error loading permissions for role ${roleId}:`, error);
        this.selectedPermissionIds = [];
      }
    );
  }

  isPermissionChecked(permission: any): boolean {
    return this.selectedPermissionIds.includes(permission.id);
  }

  togglePermission(permission: any, event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!this.selectedPermissionIds.includes(permission.id)) {
        this.selectedPermissionIds.push(permission.id);
      }
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(
        (id) => id !== permission.id
      );
    }
  }

  saveAssignedPermissions() {
    if (!this.selectedRoleId) {
      console.error("No role selected to assign permissions.");
      return;
    }

    const payload = {
      permissions: this.selectedPermissionIds,
    };

    this.commonService
      .patch(`roles/${this.selectedRoleId}/permissions`, payload, this.api)
      .subscribe(
        () => {
          this.closeDialog();
          this.permissionsUpdated.emit(); 
        },
        (error: any) => {
          console.error("Error saving permissions:", error);
        }
      );
  }

  closeDialog() {
    this.isOpen = false;
    this.close.emit();
    this.selectedPermissionIds = [];
  }
}
