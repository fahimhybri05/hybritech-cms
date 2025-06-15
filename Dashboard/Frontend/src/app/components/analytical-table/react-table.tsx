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
import { CommonModule, DatePipe } from "@angular/common";
import { createRoot } from "react-dom/client";
import {
  Button,
  AnalyticalTable,
  Title,
  SegmentedButton,
  SegmentedButtonItem,
  Icon,
  Input as Ui5Input,
  ThemeProvider,
  Label,
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
  @Input() isSyncPermission: boolean = false;
  @Input() isSortable: boolean = false;
  @Input() isTableTree: boolean = false;
  @Input() isInfiniteScroll: boolean = false;
  @Input() infiniteScrollNumber: number = 0;
  @Input() fatchLimit: number = 0;
  @Input() minRowsNumber: number = 0;
  @Input() isInitialLoadData: boolean = true;
  @Input() headerHeight: number = 0;
  @Input() model: any;
  @Input() rowHeight: number = 0;
  @Input() selectionMode: "None" | "Single" | "Multiple" | undefined = "None";
  @Input() emptyDataText: string = "";
  @Input() isSegmentedState: boolean = true;
  @Input() isStatic: boolean = false;
  @Input() isSetting: boolean = true;
  @Input() filterquery: string = "";
  @Input() public button1Text: string = "";
  @Input() public button2Text: string = "";
  @Input() public button3Text: string = "";
  @Output() isInsertDataChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() refreshTrigger: EventEmitter<void> = new EventEmitter<void>();
  @Output() rowDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResponseData: EventEmitter<any> = new EventEmitter();
  @Output() Click = new EventEmitter<any>();
  @Input() showStatusFilter?: boolean;
  isSettingOpen: boolean = false;
  settingSearchText: string = "";
  segmentedState: string = "all";
  customTableColumns: any[] = [];
  status: string = "";
  searchFilter: string = "";
  offset = 0;
  limit = 30;
  tableDataCount: number = 0;
  data: any[] = [];
  dataList: any[] = [];
  loading = false;
  private debounceTimeout: any = null;
  private lastClickTime: number = 0;

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}
  get isStatusFilterEnabled(): boolean {
    if (typeof this.showStatusFilter === "boolean") {
      return this.showStatusFilter;
    }
    if (!this.tableColumn || !Array.isArray(this.tableColumn)) return false;

    return this.tableColumn.some((col) => col && col.accessor === "is_active");
  }
  ngOnInit(): void {
    this.customTableColumn();
    if (!this.isStatusFilterEnabled) {
      this.segmentedState = "all";
      this.status = "";
    }

    this.loadInitialData();
    this.refreshTrigger.subscribe(() => {
      this.offset = 0;
      this.data = [];
      this.fetchData(this.offset, this.limit, this.status).subscribe({
        next: (response: any) => {
          if (this.isSyncPermission) {
            this.data = response.syncPermissions;
          } else if (this.isOdata) {
            this.data = response.value;
          } else {
            this.data =
              response.data || response.items || response.results || response;
          }
          if (Array.isArray(this.data)) {
            const data = this.data.map((item: any) =>
              new this.model().deserialize(item)
            );
            this.dataList = data;
            this.tableDataCount = response["@count"] || this.data.length;
          }
          this.offset += this.limit;
          this.loading = false;
          this.onResponseData.emit(this.data);
          this.render();
        },
        error: (error: any) => {
          this.loading = false;
          this.render();
        },
      });
    });
  }

  ngAfterViewInit() {
    if (!this.root) {
      this.root = createRoot(this.containerRef.nativeElement);
    }
    this.render();
  }
  customTableColumn() {
    this.customTableColumns = this.tableColumn.map((column: any) => {
      if (column.accessor === "created_at") {
        return {
          ...column,
          Cell: ({ value }: any) =>
            value ? this.datePipe.transform(value, "dd/MM/yyyy") : "N/A",
        };
      }
      return column;
    });
  }
  openAddModal(): void {
    this.isInsertDataChange.emit(true);
    this.render();
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  onDialogFilter() {
    this.isSettingOpen = !this.isSettingOpen;
  }
  fetchData(offset: number, limit: number, status: string) {
    let apiUrl = this.apiUrl;
    if (apiUrl.includes("?")) {
      apiUrl = apiUrl.split("?")[0];
    }
    if (this.isOdata) {
      apiUrl += "?";
      if (status && this.isStatusFilterEnabled) {
        apiUrl += `$filter=(is_active eq ${status})&`;
      }
      apiUrl += `$skip=${offset}&$top=${limit}`;
    } else {
      const page = Math.floor(offset / limit) + 1;
      apiUrl += `?page=${page}&per_page=${limit}`;
      if (status && this.isStatusFilterEnabled) {
        apiUrl += `&is_active=${status}`;
      }
    }
    return this.commonService.get(apiUrl, this.isOdata);
  }

  loadInitialData() {
    this.loading = true;
    this.render();
    this.fetchData(this.offset, this.limit, this.status).subscribe({
      next: (response: any) => {
        this.data = [];
        this.dataList = [];

        if (this.isSyncPermission) {
          this.data = response.syncPermissions;
        } else if (this.isOdata) {
          this.data = response.value || [];
          this.tableDataCount =
            response["@odata.count"] || response.value?.length || 0;
        } else {
          this.data = response.data || response || [];
          this.tableDataCount = response.total || response.length || 0;
        }
        this.dataList = this.data.map((item: any) => {
          const deserialized = new this.model().deserialize(item);
          return deserialized;
        });

        this.offset += this.limit;
        this.loading = false;
        this.onResponseData.emit(this.data);
        this.render();
      },
      error: (error: any) => {
        this.loading = false;
        this.render();
      },
    });
  }
  handleSearch(event: any) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const filter = event.target.value.toString();
      this.searchFilter = filter;
      this.filterData(filter);
    }, 300);
  }
  filterData(filter: string) {
    this.offset = 0;
    this.loading = true;
    this.render();
    this.searchFilter = filter;

    let url = "";
    const queryParams: string[] = [];

    if (this.isOdata) {
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
      let filterParam = filters.length ? `(${filters.join(" or ")})` : "";
      if (this.status !== "") {
        const statusFilter = `is_active eq ${this.status === "true"}`;
        filterParam = filterParam
          ? `$filter=${filterParam} and ${statusFilter}`
          : `$filter=${statusFilter}`;
      } else if (filterParam) {
        filterParam = `$filter=${filterParam}`;
      }
      const orderBy = "&$orderby=created_at desc";
      url = `${this.apiUrl}${filterParam ? `&${filterParam}` : ""}&$skip=${
        this.offset
      }&$top=${this.limit}${orderBy}`;
    } else {
      url = `${this.apiUrl}`;

      queryParams.push(`per_page=${this.limit}`);
      queryParams.push(`page=${Math.floor(this.offset / this.limit) + 1}`);

      if (this.status !== "") {
        queryParams.push(`is_active=${this.status === "true"}`);
      }
      if (filter) {
        queryParams.push(`search=${encodeURIComponent(filter)}`);
      }
      queryParams.push(`sort_by=created_at`);
      queryParams.push(`sort_dir=desc`);
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }
    }

    this.commonService.get(url, this.isOdata).subscribe({
      next: (response: any) => {
        if (this.isSyncPermission) {
          this.data = response.syncPermissions;
        } else if (this.isOdata) {
          this.data = response.value;
          this.tableDataCount =
            response["@odata.count"] || response.value.length;
        } else {
          this.data = response.data || response.items || response;
          this.tableDataCount =
            response.total ||
            (response.data ? response.data.length : response.length);
        }

        if (Array.isArray(this.data)) {
          const data = this.data.map((item: any) =>
            new this.model().deserialize(item)
          );
          this.dataList = data;
        }

        this.offset += this.limit;
        this.loading = false;
        this.onResponseData.emit(this.data);
        this.render();
      },
      error: (error: any) => {
        this.loading = false;
        this.render();
      },
    });
  }
  private handleClick = (event: any) => {
  const rowData = event?.detail?.row?.original;

  if (rowData) {
    console.log('Row clicked:', rowData);
    this.Click.emit(rowData); 
  }
};
  handleLoadMore = () => {
    if (this.searchFilter !== "")
      this.handleSearch({ target: { value: this.searchFilter } });
  };

  // private handleRowClick = (event: any) => {
  //   const currentTime = new Date().getTime();
  //   const rowData = event.detail.row.original;

  //   if (currentTime - this.lastClickTime < 300) {
  //     this.rowDoubleClick.emit(rowData);
  //   }

  //   this.lastClickTime = currentTime;
  // };

  checkSegement(status: string) {
    this.offset = 0;
    this.data = [];
    this.searchFilter = "";
    this.render();
    if (status === "active") {
      this.segmentedState = "active";
      this.status = "true";
      this.dataList = [];
      this.loadInitialData();
    } else if (status === "inactive") {
      this.segmentedState = "inactive";
      this.status = "false";
      this.dataList = [];
      this.loadInitialData();
    } else {
      this.segmentedState = "all";
      this.status = "";
      this.dataList = [];
      this.loadInitialData();
    }
  }

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
                }}
              >
                <Title level="H5">
                  {this.headerTitle} ({this.tableDataCount})
                </Title>
                <ToolbarSpacer />
                {this.isSearchFilter && (
                  <Ui5Input
                    data-accessible-name
                    icon={<Icon name="search" />}
                    showClearIcon
                    value={this.searchFilter}
                    onInput={(event) => this.handleSearch(event)}
                    placeholder="Search"
                  />
                )}
                {this.isInsertData && (
                  <Button
                    data-accessible-name
                    design="Emphasized"
                    onClick={() => this.openAddModal()}
                  >
                    {this.insertTitle}
                  </Button>
                )}
                {this.isSegmentedState && !this.isStatic && (
                  <SegmentedButton
                    accessibleName="Segmented Button Example"
                    onSelectionChange={function Js() {}}
                  >
                    <React.Fragment>
                      <SegmentedButtonItem
                        selected={this.segmentedState === "all"}
                        onClick={() => this.checkSegement("all")}
                      >
                        {this.button1Text || "All"}
                      </SegmentedButtonItem>
                      <SegmentedButtonItem
                        selected={this.segmentedState === "active"}
                        onClick={() => this.checkSegement("active")}
                      >
                        {this.button2Text || "Active"}
                      </SegmentedButtonItem>
                      <SegmentedButtonItem
                        selected={this.segmentedState === "inactive"}
                        onClick={() => this.checkSegement("inactive")}
                      >
                        {this.button3Text || "Inactive"}
                      </SegmentedButtonItem>
                    </React.Fragment>
                  </SegmentedButton>
                )}
              </Toolbar>

              <AnalyticalTable
                style={{
                  border: "1px solid #dbdbdb",
                  minHeight: "100%",
                  borderBottomRightRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
                data={this.dataList}
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
                onRowSelect={(e) => this.handleClick(e)}
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
