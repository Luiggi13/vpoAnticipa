import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
import { CustomersService } from '../../components/apps/e-commerce/_core/services/index';
import { datosDBService } from '../../components/apps/e-commerce/_core/services/index';
import { LayoutUtilsService, MessageType } from '../../components/apps/e-commerce/_core/utils/layout-utils.service';
import { HttpUtilsService } from '../../components/apps/e-commerce/_core/utils/http-utils.service';
// Models
import { QueryParamsModel } from '../../components/apps/e-commerce/_core/models/query-models/query-params.model';
// import { CustomerModel } from '../../components/apps/e-commerce/_core/models/customer.model';
import { datosDB } from '../../components/apps/e-commerce/_core/models/datosDB.model';
import { CustomersDataSource } from '../../components/apps/e-commerce/_core/models/data-sources/customers.datasource';
import { datosDBDataSource } from '../../components/apps/e-commerce/_core/models/data-sources/datosDB.datasource';
// Components
// import { CustomerEditDialogComponent } from '../../components/apps/e-commerce/customers/customer-edit/customer-edit.dialog.component';
@Component({
  selector: 'm-profile',
	templateUrl: './profile.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  // dataSource: CustomersDataSource;
  dataSource: datosDBDataSource;
  users: datosDB[];

  user;
  datass;
  // displayedColumns = ['select', 'id', 'lastName', 'firstName', 'email', 'gender', 'status', 'type', 'actions'];
  displayedColumns: string[] = [
    'X_ID',
    'X_CODI_IMMOBLE',
    'X_SOCIETAT',
    'X_DIRECCIO_COMPLERTA',
    'X_POBLACIO_UBICACIO',
    'X_PROVINCIA',
    'X_CALIFICACION_REVISADO_05002',
    'X_N_EXPEDIENTE_CALIFICACION'
  ];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = '';
	filterType: string = '';
	// Selection
	// // selection = new SelectionModel<CustomerModel>(true, []);
	selection = new SelectionModel<datosDB>(true, []);
	// // customersResult: CustomerModel[] = [];
	customersResult: datosDB[] = [];
  // constructor(private customersService: CustomersService,
  constructor(private datosService: datosDBService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService) { }
/*
model anticipa

X_ID: string;
codi_immoble: string;
X_SOCIETAT: string;
X_DIRECCIO_COMPLERTA: string;
X_POBLACIO_UBICACIO: string;
X_PROVINCIA: string;
X_CALIFICACION_REVISADO_05002: string;
X_N_EXPEDIENTE_CALIFICACION: string;
status: number; // 0 = Active | 1 = Suspended | Pending = 2
type: number; // 0 = Business | 1 = Individual

*/
    ngOnInit() {
      // If the user changes the sort order, reset back to the first page.
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  
      /* Data load will be triggered in two cases:
      - when a pagination event occurs => this.paginator.page
      - when a sort event occurs => this.sort.sortChange
      **/
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => {
            this.loadCustomersList();
          })
        )
        .subscribe();
  
      // Filtration, bind to searchInput
      fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
          // tslint:disable-next-line:max-line-length
          debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
          distinctUntilChanged(), // This operator will eliminate duplicate values
          tap(() => {
            this.paginator.pageIndex = 0;
            this.loadCustomersList();
          })
        )
        .subscribe();
  
      // Init DataSource
      const queryParams = new QueryParamsModel(this.filterConfiguration(false));
      // this.dataSource = new datosDBDataSource(this.datosService);
      this.getList();
      // First load
      this.dataSource.loadCustomers(queryParams);
      this.dataSource.entitySubject.subscribe(res => (this.customersResult = res));
    }
  
    loadCustomersList() {
      this.selection.clear();
      const queryParams = new QueryParamsModel(
        this.filterConfiguration(true),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      this.dataSource.loadCustomers(queryParams);
      this.selection.clear();
    }
  
    /** FILTRATION */
    filterConfiguration(isGeneralSearch: boolean = true): any {
      const filter: any = {};
      const searchText: string = this.searchInput.nativeElement.value;
  
      if (this.filterStatus && this.filterStatus.length > 0) {
        filter.status = +this.filterStatus;
      }
  
      if (this.filterType && this.filterType.length > 0) {
        filter.type = +this.filterType;
      }
  
      filter.lastName = searchText;
      if (!isGeneralSearch) {
        return filter;
      }
  
      filter.firstName = searchText;
      filter.email = searchText;
      filter.ipAddress = searchText;
      return filter;
    }
  
    /** ACTIONS */
    /** Delete */
    // // deleteCustomer(_item: CustomerModel) {
    deleteCustomer(_item: datosDB) {
      // const _title: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.TITLE');
      // const _description: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.DESCRIPTION');
      // const _waitDesciption: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.WAIT_DESCRIPTION');
      // const _deleteMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.MESSAGE');
  
      // const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      // dialogRef.afterClosed().subscribe(res => {
      //   if (!res) {
      //     return;
      //   }
  
      //   this.customersService.deleteCustomer(_item.id).subscribe(() => {
      //     this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      //     this.loadCustomersList();
      //   });
      // });
    }
  
    deleteCustomers() {
      // const _title: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.TITLE');
      // const _description: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.DESCRIPTION');
      // const _waitDesciption: string = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.WAIT_DESCRIPTION');
      // const _deleteMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.MESSAGE');
  
      // const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      // dialogRef.afterClosed().subscribe(res => {
      //   if (!res) {
      //     return;
      //   }
  
      //   const idsForDeletion: number[] = [];
      //   for (let i = 0; i < this.selection.selected.length; i++) {
      //     idsForDeletion.push(this.selection.selected[i].id);
      //   }
      //   this.customersService
      //     .deleteCustomers(idsForDeletion)
      //     .subscribe(() => {
      //       this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      //       this.loadCustomersList();
      //       this.selection.clear();
      //     });
      // });
    }
  
    /** Fetch */
    fetchCustomers() {
      // const messages = [];
      // this.selection.selected.forEach(elem => {
      //   messages.push({
      //     text: `${elem.codi_immoble}, ${elem.X_DIRECCIO_COMPLERTA}`,
      //     id: elem.X_ID.toString(),
      //     status: elem.status
      //   });
      // });
      // this.layoutUtilsService.fetchElements(messages);
    }
  
    /** Update Status */
    updateStatusForCustomers() {
      // const _title = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.TITLE');
      // const _updateMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.MESSAGE');
      // const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
      // const _messages = [];
  
      // this.selection.selected.forEach(elem => {
      //   _messages.push({
      //     text: `${elem.codi_immoble}, ${elem.X_DIRECCIO_COMPLERTA}`,
      //     id: elem.X_ID.toString(),
      //     status: elem.status,
      //     statusTitle: this.getItemStatusString(elem.status),
      //     statusCssClass: this.getItemCssClassByStatus(elem.status)
      //   });
      // });
  
      // const dialogRef = this.layoutUtilsService.updateStatusForCustomers(_title, _statuses, _messages);
      // dialogRef.afterClosed().subscribe(res => {
      //   if (!res) {
      //     this.selection.clear();
      //     return;
      //   }
  
      //   this.datosService
      //     .updateStatusForCustomer(this.selection.selected, +res)
      //     .subscribe(() => {
      //       this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
      //       this.loadCustomersList();
      //       this.selection.clear();
      //     });
      // });
    }
  
    addCustomer() {
      // // const newCustomer = new CustomerModel();
    //  const newCustomer = new datosDB();
      //newCustomer.clear(); // Set all defaults fields
      //this.editCustomer(newCustomer);
    }
  
    /** Edit */
    // // editCustomer(customer: CustomerModel) {
    editCustomer(customer: datosDB) {
      // let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
      // saveMessageTranslateParam += customer.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
      // const _saveMessage = this.translate.instant(saveMessageTranslateParam);
      // const _messageType = customer.id > 0 ? MessageType.Update : MessageType.Create;
      // const dialogRef = this.dialog.open(CustomerEditDialogComponent, { data: { customer } });
      // dialogRef.afterClosed().subscribe(res => {
      //   if (!res) {
      //     return;
      //   }
  
      //   this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, false);
      //   this.loadCustomersList();
      // });
    }
  
    /** SELECTION */
    isAllSelected(): boolean {
      const numSelected = this.selection.selected.length;
      const numRows = this.customersResult.length;
      return numSelected === numRows;
    }
  
    masterToggle() {
      if (this.selection.selected.length === this.customersResult.length) {
        this.selection.clear();
      } else {
        this.customersResult.forEach(row => this.selection.select(row));
      }
    }
  
    /** UI */
    getItemCssClassByStatus(status: number = 0): string {
      switch (status) {
        case 0:
          return 'metal';
        case 1:
          return 'success';
        case 2:
          return 'danger';
      }
      return '';
    }
  
    getItemStatusString(status: number = 0): string {
      switch (status) {
        case 0:
          return 'Suspended';
        case 1:
          return 'Active';
        case 2:
          return 'Pending';
      }
      return '';
    }
  
    getItemCssClassByType(status: number = 0): string {
      switch (status) {
        case 0:
          return 'accent';
        case 1:
          return 'primary';
        case 2:
          return '';
      }
      return '';
    }
  
    getItemTypeString(status: number = 0): string {
      switch (status) {
        case 0:
          return 'Business';
        case 1:
          return 'Individual';
      }
      return '';
    }

  getList() {
    return this.datosService.getUsersJson()
    .subscribe((users: datosDB[]) => {
      this.users = users;
      this.datass = users;
      this.dataSource = new datosDBDataSource(this.datass);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;


      // filtro
      // this.dataSource.filterPredicate = this.createFilter();
      // filtro
      // console.log(this.data);
      // console.table(this.data);

    })
  }

}
