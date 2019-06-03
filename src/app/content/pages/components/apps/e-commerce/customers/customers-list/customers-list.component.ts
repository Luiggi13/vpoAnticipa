import { Component,Input, Output,OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, AfterViewInit, EventEmitter } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio'; 
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
import { CustomersService } from '../../_core/services/index';
import { LayoutUtilsService, MessageType } from '../../_core/utils/layout-utils.service';
import { HttpUtilsService } from '../../_core/utils/http-utils.service';
// Models
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import { CustomerModel } from '../../_core/models/customer.model';
import { CustomersDataSource } from '../../_core/models/data-sources/customers.datasource';
// Components
import { CustomerEditDialogComponent } from '../customer-edit/customer-edit.dialog.component';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { PortalAuthService } from '../../../../../../../core/auth/portal-auth.service';
import { AuthNoticeService } from '../../../../../../../core/auth/auth-notice.service';
import { AuthNotice } from '../../../../../../../core/auth/auth-notice.interface';
import { TableFuncs } from './table-funcs';

const EXCEL_TYPE ='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT ='.xlsx';
export interface MyOwnData {
	X_ID: string;
	X_CODI_IMMOBLE: number;
	X_ID_CURT: number;
	X_TIPUS_IMMOBLE: string;
  }
  
  let ELEMENT_DATA: MyOwnData[] = [];

  @Component({
		selector: 'button-view',
		template: `
			<button (click)="onClick()">{{ renderValue }}</button>
		`,
	})
	export class ButtonViewComponent implements OnInit {
		renderValue: string;
	
		@Input() value: string | number;
		@Input() rowData: any;
	
		@Output() save: EventEmitter<any> = new EventEmitter();
	
		ngOnInit() {
			this.renderValue = this.value.toString().toUpperCase();
		}
	
		onClick() {
			this.save.emit(this.rowData);
		}
	}
// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'm-customers-list',
	templateUrl: './customers-list.component.html',
	styleUrls: ['./customers-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomersListComponent implements AfterViewInit, OnInit {
	
	
	rows = [];

  temp = [];

  columns = [
    { prop: 'name' },
    { name: 'Company' },
    { name: 'Gender' }
  ];
	// @ViewChild(DatatableComponent) table: DatatableComponent;claseColumna = 'idRegistreCol';
	@ViewChild(DatatableComponent) table: DatatableComponent;

	apiUrl = 'http://10.0.0.40';
	showPos = true;
	// api online
	// apiUrl = 'https://5ccbddde08622a00147aa73b.mockapi.io/v1';
	todos$: any; // para detalle de immueble
	length = 100;
  pageSize = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  hasFormErrors: boolean = false;
  idImmueble: string = '';
  codiImmoble: string = '';
  showDetails: boolean = false;
	kindUser = 'admin';
	checkboxValue: string;
   estadoPropio: boolean = null;

  @Output() public onUploadFinished = new EventEmitter();

  public progress: number;
  public message: string;
  public message1: string;
  private mytoken = window.localStorage.getItem('token');
	@Output() type: any;
	@Output() messageNotif: any = '';
	settings = {
		actions: {
			add: false,
  edit: false,
  delete: false,
			custom: [
				{
					name: 'prova',
					title: 'Ver',
					type: 'html',
					valuePrepareFunction:(cell,row)=>{
						return `<a title="See Detail Product" (click)="prova(${row.X_ID})"> ${row} / ${cell}<i class="ion-edit"></i></a>`
					},
					filter:false       
				},
				{
					X_ID:{
						title: 'X_ID',
						type: 'number'
					}
				}
			]
		},
		columns: {
			X_ID: {
				title: 'ID',
				filter: false
			},
			X_CODI_IMMOBLE: {
				title: 'CODI_IMMOBLE'
			},
			X_CODI_SOCIETAT: {
				title: 'CODI_SOCIETAT'
			},
			X_DIRECCIO_COMPLERTA: {
				title: 'DIRECCIO_COMPLERTA'
			},
			X_POBLACIO_UBICACIO: {
				title: 'POBLACIO_UBICACIO'
			},
			X_PROVINCIA: {
				title: 'PROVINCIA'
		},
		X_CALIFICACION_REVISADO_05002: {
				title: 'CALIFICACION_REVISADO_05002'
		},
		X_N_EXPD_CALIF_REVISADO_05003: {
				title: 'N_EXPD_CALIF_REVISADO_05003'
		},
		X_REGIMEN_1_Revisado_05006: {
				title: 'REGIMEN_1_Revisado_05006'
		},
		X_FECHA_EXPD_CALIF_REVISADO_05004: {
				title: 'FECHA_EXPD_CALIF_REVISADO_05004'
		},
		X_PRECIO_MAX_VENTA_REVISADO_05011: {
				title: 'PRECIO_MAX_VENTA_REVISADO_05011'
		},
		X_COMERCIALIZACION_REVISADO_05009: {
				title: 'COMERCIALIZACION_REVISADO_05009'
		},
		X_PRECIO_MAX_RENTA_REVISADO_05013: {
				title: 'PRECIO_MAX_RENTA_REVISADO_05013'
		}
		}
	};
	
	
	constructor(
		private authNoticeService: AuthNoticeService,
		private customersService: CustomersService,
		private fb: FormBuilder,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private http: HttpClient,
		private authPortal: PortalAuthService,
		private serviceTables: TableFuncs
	) {
		this.fetch((data) => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows2 = data;
    });
	
	}
	displayedColumns: string[] = [
		'select',
		// 'X_ID',
		'X_CODI_IMMOBLE',
		'X_CODI_SOCIETAT',
		'X_DIRECCIO_COMPLERTA',
		'X_POBLACIO_UBICACIO',
		'X_PROVINCIA',
		'X_CALIFICACION_REVISADO_05002',
		'X_N_EXPD_CALIF_REVISADO_05003',
		'X_REGIMEN_1_Revisado_05006',
		'X_FECHA_EXPD_CALIF_REVISADO_05004',
		'X_PRECIO_MAX_VENTA_REVISADO_05011',
		'X_COMERCIALIZACION_REVISADO_05009',
		'X_PRECIO_MAX_RENTA_REVISADO_05013',
		'actions'];
	checkboxes = [
    {
      id: 1,
			name: 'Value1',
			color: '#34bfa3',
			classColor: 'numero1'
    },
    {
      id: 2,
			name: 'Value2',
			color: '#716aca',
			classColor: 'numero2'
    },
    {
      id: 3,
			name: 'Value3',
			color: '#df0000',
			classColor: 'numero3'
    },
    {
      id: 4,
			name: 'Value4',
			color: '#fff70f',
			classColor: 'numero4'
    },
    {
      id: 5,
			name: 'Value5',
			color: '#248f00',
			classColor: 'numero5'
    },
    {
      id: 6,
			name: 'Value6',
			color: '#00028f',
			classColor: 'numero6'
    }
	];
	displayedColumnsNew = [];
  valores$: any;
  val:any;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<MyOwnData>(true, []);
	isLoading = true;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('check1') check1: ElementRef;

  @ViewChild('t') t: ElementRef;
filterStatus: string = '';
filterType: string = '';
// MatPaginator Output
pageEvent: PageEvent;
selected = '';
selectedProvincias = '';
favoriteSeason: string;
seasons: string[] = ['A Coruña',
'Álava',
'Albacete',
'Alicante',
'Almería',
'Asturias',
'Ávila',
'Badajoz',
'Baleares',
'Barcelona',
'Burgos',
'Cáceres',
'Cádiz',
'Cantabria',
'Castellón',
'Ciudad Real',
'Córdoba',
'Cuenca',
'Girona',
'Granada',
'Guadalajara',
'Gipuzkoa',
'Huelva',
'Huesca',
'Jaén',
'La Rioja',
'Las Palmas',
'León',
'Lérida',
'Lugo',
'Madrid',
'Málaga',
'Murcia',
'Navarra',
'Ourense',
'Palencia',
'Pontevedra',
'Salamanca',
'Segovia',
'Sevilla',
'Soria',
'Tarragona',
'Santa Cruz de Tenerife',
'Teruel',
'Toledo',
'Valencia',
'Valladolid',
'Vizcaya',
'Zamora',
'Zaragoza'];
seasonsRadio: string[] = ['ID COL',
'VAT COL',
'Price COL'];
misProvincias: string[] = [];
rows2 = [
	{
		name: 'Claudine Neal',
		gender: 'female',
		company: 'Sealoud'
	},
	{
		name: 'Beryl Rice',
		gender: 'female',
		company: 'Velity'
	}
];

columns2 = [
	{ name: 'Nombre' },
	{ name: 'Gender' },
	{ name: 'Company' }
];

allColumns2 = [
	{ name: 'Nombre' },
	{ name: 'Gender' },
	{ name: 'Company' }
];
orderCols = [
	{
		'colId': 1,
		'nameCol': 'adsad',
		'order': 1,
		'visible': true
	},
	{
		'colId': 2,
		'nameCol': 'adsad',
		'order': 2,
		'visible': false
	}
];
	arraychecks = [];
	updateItem(e, type) {
		this.myNotice();
    if (e.target.checked) {
			// this.checkboxes.push(type);
			this.checkboxValue = type.name;

			this.arraychecks.push(this.checkboxValue);
			console.warn(this.arraychecks);


    } else {
// eliminar del array el checkbox descheckeado

for (let i = this.arraychecks.length - 1; i >= 0; i--) {
    if (this.arraychecks[i] === type.name) {
        this.arraychecks.splice(i, 1);
        // break;
    }
}

// eliminar del array el checkbox descheckeado
      this.checkboxValue = '';
      console.log('no' + this.arraychecks);
    }
  }

  findIndexToUpdate(type) {
    return type.id === this;
	}
	
	myNotice(){
		this.authNoticeService.onNoticeChanged$.subscribe(
			(notice: AuthNotice) => {
				this.messageNotif = notice.message;
				this.type = 'alert-danger';
			}
		);
	}
	/** LOAD DATA */
// displayedColumns: string[] = ['select','X_CODI_IMMOBLE','X_CODI_SOCIETAT', 'X_DIRECCIO_COMPLERTA' ,'X_ID_CURT','X_TIPUS_IMMOBLE','X_CODI_PROMOCIO','X_PROMOCIO','actions'];


setPageSizeOptions(setPageSizeOptionsInput: string) {
  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
}
ngOnInit() {
	this.authPortal.isAutenticated('login');
	// this.checkboxValue = this.check1.nativeElement.value;
}
// upload
refreshValueCheck() {

	if (this.check1.nativeElement.checked) {
		this.checkboxValue = this.check1.nativeElement.value;
	} else {
		this.checkboxValue = '';
	}

}
public uploadFile = (files) => {
    this.progress = 0;

    if (files.length === 0) {
      return;
    }
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.mytoken
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE1NTY1MTg2NDIsImV4cCI6MTU1NzEyMzQ0MiwiaWF0IjoxNTU2NTE4NjQyfQ.cnSj_DXMI-9nxWNT7djX1ExkFQ8EM96eMyPDb1ZjlR8'
    });
    headers.append('Accept', '*/*');
    // let headers = new HttpHeaders().set('Accept', '*/*');

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    console.warn(fileToUpload.name);
    this.http.post(`${this.apiUrl}/api/upload/`, formData, { headers, reportProgress: true, observe: 'events' })
      .subscribe(event => {
        this.message1 = 'Cargando archivo';
        if (event.type === HttpEventType.UploadProgress){
          // this.progress = Math.round(100 * event.loaded / event.total);
          this.message = '';
          this.message1 = 'Cargando archivo';
		}else if (event.type === HttpEventType.Response) {
			this.message1 = '';
          this.message = 'Archivo procesado';
          this.onUploadFinished.emit(event.body);
          this.progress = 0;
		  location.reload;
	  this.getval();
		  
        }
      });
  }
// upload


  deleteRow(itemId){
    let headers = new HttpHeaders().set('Accept', '*/*');
    headers.append('Content-Type', 'application/json');
    this.http.delete(`${this.apiUrl}/immoble/${itemId}`,{headers: headers});
  }

  getval(){
		this.isLoading = true;

	ELEMENT_DATA=[];
	let headers = new HttpHeaders({
		'Content-Type': 'application/json',
		 'Authorization': 'Bearer ' + this.mytoken
		// 'Authorization': 'Bearer adadasda'
	});
    this.http.get<MyOwnData>(`${this.apiUrl}/api/report/anticipa/`, {headers: headers}).subscribe(data => {
			this.isLoading = false;
			this.val = data;
			
      this.dataSource = new MatTableDataSource(this.val);
    // this.dataSource = new MatTableDataSource(this.val);
	this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    },
    error =>{
			this.isLoading = false;
      console.log('mi error en getval() : ', error);
    });

    
  }
  ngAfterViewInit() {
		this.getval();
		console.log('breakpoint');


  }
  applyFilter(filterValue: string) {
	this.dataSource.filter = filterValue.trim().toLowerCase();
	console.log(this.dataSource.filteredData);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MyOwnData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.X_ID + 1}`;
  }

  loadCustomersList() {
	// this.selection.clear();
	// const queryParams = new QueryParamsModel(
	// 	this.filterConfiguration(true),
	// 	this.sort.direction,
	// 	this.sort.active,
	// 	this.paginator.pageIndex,
	// 	this.paginator.pageSize
	// );
	// this.dataSource.loadCustomers(queryParams);
	// this.selection.clear();
}
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
tt(valuestring){
	// this.searchInput.nativeElement.value = valuestring.value;
	// this.applyFilter(this.searchInput.nativeElement.value);
	this.applyFilter(valuestring.value);
}
filtreTipusImmoble(valuestring){
	// this.searchInput.nativeElement.value = valuestring.value;
	// this.applyFilter(this.searchInput.nativeElement.value);
	this.applyFilter(valuestring.value);
}
viewProperty(idProperty,codiImmoble) {
	console.warn('mi propiedad es: ' + idProperty);
	this.onAlertOpen(idProperty,codiImmoble);
	this.showDetailsProperty();
}

exportToExcel(json:any[],excelFileName:string): void{

		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = {
			Sheets: {'data' : worksheet},
			SheetNames: ['data']
		};
		const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
		this.saveAsExcel(excelBuffer, excelFileName);
}

	private saveAsExcel(buffer:any, fileName:string): void {
		const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXT);
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	
	}
	onAlertOpen(idMostrada,codiImmoble) {
		this.hasFormErrors = true;
		this.idImmueble = idMostrada;
		this.codiImmoble = codiImmoble;
	
	}
	showDetailsProperty(){
		this.showDetails = !this.showDetails;
	}

	lanzarUnRegistro(flat){
		console.log(flat);
		// console.log(window.localStorage.getItem('token'));
			// this.todos$ = this.peopleService.fetchUnRegistro2();
			let headers = new HttpHeaders({
			  'Content-Type': 'application/json',
			  'Authorization': 'Bearer ' + this.mytoken
			  // 'Authorization': 'Bearer ' + this.mytoken
			});
			headers.append('Accept', '*/*');
			//return this.todos$ = this.http.get(`http://localhost:1414/tt/users/${flat}/`);
			this.showDetailsProperty();
			return this.todos$ = this.http.get(`${this.apiUrl}/api/report/anticipa/item?id=${flat}`,{headers:headers});
			//  return this.todos$ = this.userService.getUsersJsonone(flat,this.mytoken);
			// http://10.0.0.40/api/Report/anticipa/item?id=4000
		 }
		 
		 toggleCols(colId, estado) {
			 var select: string = 'select';
			 var actions: string = 'actions';
 this.displayedColumnsNew = this.displayedColumns;
 console.log(this.displayedColumnsNew);


	}

	setupTable(param) {
		this.displayedColumns = [
			'select',
			 'X_ID',
			 'X_CODI_IMMOBLE',
			'X_CODI_SOCIETAT',
			 'X_DIRECCIO_COMPLERTA',
			'X_ID_CURT',
			'X_TIPUS_IMMOBLE',
			'X_CODI_PROMOCIO',
			'X_PROMOCIO',
			'actions'];
		console.log(param);

		 }


  toggle(col) {
    const isChecked = this.isChecked(col);

    if(isChecked) {
      this.columns2 = this.columns2.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns2 = [...this.columns2, col];
    }
  }

  isChecked(col) {
    return this.columns2.find(c => {
      return c.name === col.name;
    });
}

fetch(cb) {
	const req = new XMLHttpRequest();
	req.open('GET', `assets/data/company.json`);

	req.onload = () => {
		cb(JSON.parse(req.response));
	};

	req.send();
}

updateFilter(event) {
	const val = event.target.value.toLowerCase();

	// filter our data
	const temp = this.temp.filter( function(d) {
		return d.name.toLowerCase().indexOf(val) !== -1 || !val;
	});

	// update the rows
	this.rows2 = temp;
	// Whenever the filter changes, always go back to the first page
	this.table.offset = 0;
}

prova(idCol) {
console.log(idCol.data.X_ID);
this.lanzarUnRegistro(idCol.data.X_ID)
}
}
