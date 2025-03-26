import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DataService } from "../../services/data.service";
import Swal from "sweetalert2";
import { BusyindicatorComponent } from "../../components/busyindicator/busyindicator.component";

@Component({
	selector: "app-user-list",
	standalone: true,
	imports: [
		RouterLink,
		CommonModule,
		FormsModule,
		BusyindicatorComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
	isOpen: boolean = false;
	isOpenAdd: boolean = false;
	selectedBranchId: number | null = null;
	loading: boolean = true;
	// branches: Branch[] = [];
	displayedBranches: any[] = [];
	filteredBranches: any[] = [];
	totalBranches: number = 0;
	itemsPerPage = 15;
	currentPage = 1;

	constructor(
	private dataService: DataService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getBranches();
		this.getRowIndexes();
		const type = localStorage.getItem("type");
		if (type == "Trainer") {
			this.router.navigate(["/home"]);
		}
	}

	getRowIndexes(): number[] {
		return Array.from({ length: 15 }, (_, i) => i);
	}

	getBranches() {
		// this.dataService.getBranches().subscribe((res: any) => {
		// 	this.branches = res.value.map((branch: any) => new Branch().deserialize(branch));
		// 	this.filteredBranches = this.branches;
		// 	this.totalBranches = this.branches.length;
		// 	this.updateDisplayedBranch();
		// 	this.loading = false;
		// });
	}

	deleteItem(id: number) {
		// Swal.fire({
		// 	title: "Are you sure?",
		// 	text: "You won’t be able to revert this!",
		// 	icon: "warning",
		// 	showCancelButton: true,
		// 	confirmButtonColor: "#3085d6",
		// 	cancelButtonColor: "#d33",
		// 	confirmButtonText: "Yes, delete it!",
		// }).then(result => {
		// 	if (result.isConfirmed) {
		// 		this.dataService.deleteBranches(id).subscribe({
		// 			next: () => {
		// 				const index = this.branches.findIndex(branch => branch.id === id);
		// 				if (index > -1) {
		// 					this.branches.splice(index, 1);
		// 					this.filteredBranches = this.branches;
		// 					this.totalBranches = this.filteredBranches.length;
		// 					this.updateDisplayedBranch();
		// 					Swal.fire("Deleted!", "Your item has been deleted.", "success");
		// 				}
		// 			},
		// 			error: error => {
		// 				Swal.fire("Error!", "There was an error deleting the item.", "error");
		// 			},
		// 		});
		// 	}
		// });
	}

	openAddBranchModal(): void {
		this.isOpenAdd = true;
	}
	openEditBranchModal(branch: any): void {
		// this.branches = branch;
		this.isOpen = true;
	}

	closeEditBranchModal(): void {
		// this.dataService.getBranches().subscribe(res => {
		// 	this.branches = res.value.map((branch: any) => new Branch().deserialize(branch));
		// 	this.filteredBranches = this.branches;
		// 	this.totalBranches = this.branches.length;
		// 	this.updateDisplayedBranch();
		// 	this.loading = false;
		// });

		// this.isOpen = false;
		// this.branches = [];
	}
	closeAddBranchModal(): void {
		// this.dataService.getBranches().subscribe(res => {
		// 	this.branches = res.value.map((branch: any) => new Branch().deserialize(branch));
		// 	this.filteredBranches = this.branches;
		// 	this.totalBranches = this.branches.length;
		// 	this.updateDisplayedBranch();
		// 	this.loading = false;
		// });

		// this.isOpenAdd = false;
		// this.branches = [];
	}
}
