import {
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Input,
	ViewChild,
	ViewEncapsulation,
	output,
	Output,
	EventEmitter,
} from "@angular/core";
import "@ui5/webcomponents/dist/Input.js";
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
	Button,
	AnalyticalTable,
	Title,
	Icon,
	Input as Ui5Input,
	ThemeProvider,
} from "@ui5/webcomponents-react";
import { Toolbar, ToolbarSpacer } from "@ui5/webcomponents-react-compat";
import { CommonService } from "../../services/common-service/common.service";

const containerElementRef = "ReactComponentContainer";
@Component({
	selector: "react-analytical-table",
	template: `<span #${containerElementRef}></span>`,
	standalone: true,
	styleUrls: ["./analytical-table.component.css"],
	encapsulation: ViewEncapsulation.None,
})
export class ReactAnalyticalTable implements OnDestroy, AfterViewInit, OnInit {
	@ViewChild(containerElementRef, { static: true }) containerRef!: ElementRef;
	private root: ReturnType<typeof createRoot> | null = null;
	@Input() headerTitle: string = "";
	@Input() insertTitle: string = "";
	@Input() apiUrl: string = "";
	@Input() isOdata: boolean = true;
	@Input() tableColumn: any;
	@Input() isInsertData: boolean = true;
	@Input() isSearchFilter: boolean = false;
	@Input() isFilterable: boolean = false;
	@Input() isGroupable: boolean = false;
	@Input() isSortable: boolean = false;
	@Input() isTableTree: boolean = false;
	@Input() isInfiniteScroll: boolean = false;
	@Input() infiniteScrollNumber: number = 0;
	@Input() fatchLimit: number = 0;
	@Input() minRowsNumber: number = 0;
	@Input() headerHeight: number = 0;
	@Input() rowHeight: number = 0;
	@Input() selectionMode: "None" | "Single" | "Multiple" | undefined = "None";
	@Input() emptyDataText: string = "";

	@Output() isInsertDataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() refreshTrigger: EventEmitter<void> = new EventEmitter<void>();
	@Output() rowDoubleClick: EventEmitter<any> = new EventEmitter<any>();
	private lastClickTime: number = 0;
	data: any[] = [];
	loading = false;
	searchFilter: string = "";
	offset = 0;
	limit = 30;

	constructor(private commonService: CommonService) {}

	ngOnInit(): void {
		this.loadInitialData();
		this.refreshTrigger.subscribe(() => {
			this.offset = 0;
			this.data = [];
			this.fetchData(this.offset, this.limit).subscribe({
				next: (response: any) => {
					this.data = [...this.data, ...response.value];
					this.offset += this.limit;
					this.loading = false;
					this.render();
				},
				error: (error: any) => {
					console.log(error);
					this.loading = false;
					this.render();
				},
			});
			console.log("Refresh triggered");
		});
	}

	ngAfterViewInit() {
		if (!this.root) {
			this.root = createRoot(this.containerRef.nativeElement);
		}
		this.render();
	}
	openAddModal(): void {
		this.isInsertDataChange.emit(true);
		this.render();
		console.log("isInsertData emitted:", true);
	}
	ngOnDestroy() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}

	loadInitialData() {
		this.loading = true;
		this.render();
		this.fetchData(this.offset, this.limit).subscribe({
			next: (response: any) => {
				const responseData = this.isOdata ? response.value : response;
				this.data = [...this.data, ...(Array.isArray(responseData) ? responseData : [])];
				this.offset += this.limit;
				this.loading = false;
				console.log('Response:', response);
				this.render();
			},
			error: (error: any) => {
				console.log(error);
				this.loading = false;
				this.render();
			},
		});
	}

	fetchData(offset: number, limit: number) {
		this.loading = true;

		let apiUrl = "";
		if (this.isOdata) {
			apiUrl = `${this.apiUrl}&$skip=${offset}&$top=${limit}&$orderby=created_at desc`;
		} else {
			apiUrl = `${this.apiUrl}`;
		}
		console.log(apiUrl);
		return this.commonService.get(apiUrl, this.isOdata);
	}

	handleSearch(event: any) {
		this.offset = 0;
		this.loading = true;
		this.render();
		const filter = event.target.value.toString();
		this.searchFilter = filter;
		console.log(filter);
		const filters: string[] = [];

		if (filter) {
			const encodedFilter = encodeURIComponent(filter);
			this.tableColumn.forEach((column: any) => {
				if (
					column.accessor &&
					column.accessor !== "." &&
					column.accessor !== "id" &&
					column.accessor !== " "
				) {
					filters.push(`contains(${column.accessor}, '${encodedFilter}')`);
				}
			});
		}

		const filterParam = filters.length ? `&$filter=${filters.join(" or ")}` : "";

		const orderBy = "&$orderby=created_at desc";
		const apiUrl = `${this.apiUrl}${filterParam}&$skip=${this.offset}&$top=${this.limit}${orderBy}`;
		let url = "";
		if (this.isOdata) {
			url = apiUrl;
		} else {
			url = `${this.apiUrl}?filter=${filter}`;
		}

		console.log(url);

		this.commonService.get(url, this.isOdata).subscribe({
			next: (response: any) => {
				const responseData = this.isOdata ? response.value : response;
				console.log('Search Response:', response);
				this.data = Array.isArray(responseData) ? responseData : [];
				this.offset += this.limit;
				this.loading = false;
				this.render();
			},
			error: (error: any) => {
				this.loading = false;
				this.render();
			},
		});
	}

	handleLoadMore = () => {
		if (this.searchFilter !== "") this.handleSearch({ target: { value: this.searchFilter } });
		else this.loadInitialData();
		console.log("Load more data");
	};
	private handleRowClick = (event: any) => {

		const currentTime = new Date().getTime();
		const rowData = event.detail.row.original;
		console.log(rowData)
	  
	   
		if (currentTime - this.lastClickTime < 300) {
		  this.rowDoubleClick.emit(rowData); 
		}
	  
		this.lastClickTime = currentTime; 
	  };
	private render() {
		if (this.root) {
			this.root.render(
				<React.StrictMode>
					<ThemeProvider>
						<div className="analytical-table">
							<Toolbar
								toolbarStyle="Standard"
								design="Auto"
								style={{
									height: "40px",
									border: "1px solid #dbdbdb",
									borderTopRightRadius: "10px",
									borderTopLeftRadius: "10px",
								}}>
								<Title level="H5">{this.headerTitle}</Title>
								<ToolbarSpacer />
								{this.isSearchFilter && (
									<Ui5Input
										data-accessible-name
										icon={<Icon name="search" />}
										showClearIcon
										onInput={event => this.handleSearch(event)}
										placeholder="Search"
									/>
								)}
								{this.isInsertData && (
									<Button
										data-accessible-name
										design="Emphasized"
										onClick={() => this.openAddModal()}>
										{this.insertTitle}
									</Button>
								)}
							</Toolbar>

							<AnalyticalTable
								style={{
									border: "1px solid #dbdbdb",
									minHeight: "100%",
									borderBottomRightRadius: "10px",
									borderBottomLeftRadius: "10px",
								}}
								data={this.data}
								columns={this.tableColumn}
								filterable={this.isFilterable}
								groupable={this.isGroupable}
								sortable={this.isSortable}
								isTreeTable={this.isTableTree}
								infiniteScroll={this.isInfiniteScroll}
								loading={this.loading}
								loadingDelay={100}
								rowHeight={this.rowHeight}
								headerRowHeight={this.headerHeight}
								minRows={this.minRowsNumber}
								visibleRowCountMode="AutoWithEmptyRows"
								highlightField="status"
								infiniteScrollThreshold={this.infiniteScrollNumber}
								onLoadMore={this.handleLoadMore}
								onAutoResize={function Ki() {}}
								onColumnsReorder={function Ki() {}}
								onRowExpandChange={function Ki() {}}
								onRowSelect={(e)=> this.handleRowClick(e)}
								selectionMode={this.selectionMode}
								subComponentsBehavior="IncludeHeight"
								subRowsKey="subRows"
								noDataText={this.emptyDataText}
							/>
						</div>
					</ThemeProvider>
				</React.StrictMode>
			);
		}
	}
}
