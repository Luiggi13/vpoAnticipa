import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

let ELEMENT_DATA: Element[] = [];

@Component({
  selector: 'm-christian',
  templateUrl: './christian.component.html',
  styleUrls: ['./christian.component.scss']
})
export class ChristianComponent implements OnInit {
// variables
valueidFilter = '1';
displayedColumns: string[] = [
  'select',
  'X_ID',
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
_tmp = [];

columnDefinitions = [
  { def: 'select', showItem: true },
  { def: 'X_ID', showItem: true },
  { def: 'X_CODI_IMMOBLE', showItem: true },
  { def: 'X_CODI_SOCIETAT', showItem: true },
  { def: 'X_DIRECCIO_COMPLERTA', showItem: true },
  { def: 'X_POBLACIO_UBICACIO', showItem: true },
  { def: 'X_PROVINCIA', showItem: true },
  { def: 'X_CALIFICACION_REVISADO_05002', showItem: true },
  { def: 'X_N_EXPD_CALIF_REVISADO_05003', showItem: true },
  { def: 'X_REGIMEN_1_Revisado_05006', showItem: true },
  { def: 'X_FECHA_EXPD_CALIF_REVISADO_05004', showItem: true },
  { def: 'X_PRECIO_MAX_VENTA_REVISADO_05011', showItem: true },
  { def: 'X_COMERCIALIZACION_REVISADO_05009', showItem: true },
  { def: 'X_PRECIO_MAX_RENTA_REVISADO_05013', showItem: true },
  { def: 'actions', showItem: true }
];
val: any;
todos$: any;
showDetails: boolean = false;
kindUser = 'admin';
public progress: number;
public message: string;
public message1: string;
// selected = '';
isLoading = true;
apiUrl = 'http://10.0.0.40';
private mytoken = window.localStorage.getItem('token');

// variables

// form binding
idFilter = new FormControl('');
codiImmobleFilter = new FormControl('');
direccioComplertaFilter = new FormControl('');
poblacioFilter = new FormControl('');

provinciaFilter = new FormControl('');
_05002Filter = new FormControl('');
_05003Filter = new FormControl('');
_05006Filter = new FormControl('');
_05004Filter = new FormControl('');
_05011Filter = new FormControl('');
_05009Filter = new FormControl('');
_05013Filter = new FormControl('');
// form binding

// table instances and vars for it
  dataSource = new MatTableDataSource();
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay = [
    'X_ID',
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
    'X_PRECIO_MAX_RENTA_REVISADO_05013'
  ];
  filterValues = {
    X_ID: '',
    X_CODI_SOCIETAT: '',
    X_DIRECCIO_COMPLERTA: '',
    X_POBLACIO_UBICACIO: '',
    X_PROVINCIA: '',
    X_CALIFICACION_REVISADO_05002: '',
    X_N_EXPD_CALIF_REVISADO_05003: '',
    X_REGIMEN_1_Revisado_05006: '',
    X_FECHA_EXPD_CALIF_REVISADO_05004: '',
    X_PRECIO_MAX_VENTA_REVISADO_05011: '',
    X_COMERCIALIZACION_REVISADO_05009: '',
    X_PRECIO_MAX_RENTA_REVISADO_05013: ''
  };
// table instances and vars for it

  // inputs and outputs
	@Output() public onUploadFinished = new EventEmitter();
  // inputs and outputs

  constructor(private http: HttpClient) {
    this.getBackend();
    this.showFilteredColumns();
    this.dataSource.data = this.val;
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.idFilter.valueChanges
      .subscribe(
        name => {
          this.filterValues.X_ID = name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.codiImmobleFilter.valueChanges
      .subscribe(
        codiImmoble => {
          this.filterValues.X_CODI_SOCIETAT = codiImmoble;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.direccioComplertaFilter.valueChanges
      .subscribe(
        direccioComplerta => {
          this.filterValues.X_DIRECCIO_COMPLERTA = direccioComplerta;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.poblacioFilter.valueChanges
      .subscribe(
        poblacioRebuda => {
          this.filterValues.X_POBLACIO_UBICACIO = poblacioRebuda;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.provinciaFilter.valueChanges
      .subscribe(
        provinciaRebuda => {
          this.filterValues.X_PROVINCIA = provinciaRebuda;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
      this._05002Filter.valueChanges
      .subscribe(
        _05002 => {
          this.filterValues.X_CALIFICACION_REVISADO_05002 = _05002;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05003Filter.valueChanges
      .subscribe(
        _05003 => {
          this.filterValues.X_N_EXPD_CALIF_REVISADO_05003 = _05003;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05006Filter.valueChanges
      .subscribe(
        _05006 => {
          this.filterValues.X_REGIMEN_1_Revisado_05006 = _05006;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05004Filter.valueChanges
      .subscribe(
        _05004 => {
          this.filterValues.X_FECHA_EXPD_CALIF_REVISADO_05004 = _05004;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05011Filter.valueChanges
      .subscribe(
        _05011 => {
          this.filterValues.X_PRECIO_MAX_VENTA_REVISADO_05011 = _05011;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05009Filter.valueChanges
      .subscribe(
        _05009 => {
          this.filterValues.X_COMERCIALIZACION_REVISADO_05009 = _05009;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this._05013Filter.valueChanges
      .subscribe(
        _05013 => {
          this.filterValues.X_PRECIO_MAX_RENTA_REVISADO_05013 = _05013;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );

      this.valueidFilter = '1';
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.X_ID.toString().toLowerCase().indexOf(searchTerms.X_ID) !== -1
        && data.X_CODI_SOCIETAT.toString().toLowerCase().indexOf(searchTerms.X_CODI_SOCIETAT) !== -1
        && data.X_DIRECCIO_COMPLERTA.toLowerCase().indexOf(searchTerms.X_DIRECCIO_COMPLERTA) !== -1
        && data.X_POBLACIO_UBICACIO.toLowerCase().indexOf(searchTerms.X_POBLACIO_UBICACIO) !== -1
        && data.X_PROVINCIA.toLowerCase().indexOf(searchTerms.X_PROVINCIA) !== -1
        && data.X_CALIFICACION_REVISADO_05002.toLowerCase().indexOf(searchTerms.X_CALIFICACION_REVISADO_05002) !== -1
        && data.X_N_EXPD_CALIF_REVISADO_05003.toLowerCase().indexOf(searchTerms.X_N_EXPD_CALIF_REVISADO_05003) !== -1
        && data.X_REGIMEN_1_Revisado_05006.toLowerCase().indexOf(searchTerms.X_REGIMEN_1_Revisado_05006) !== -1
        && data.X_FECHA_EXPD_CALIF_REVISADO_05004.toLowerCase().indexOf(searchTerms.X_FECHA_EXPD_CALIF_REVISADO_05004) !== -1
        && data.X_PRECIO_MAX_VENTA_REVISADO_05011.toLowerCase().indexOf(searchTerms.X_PRECIO_MAX_VENTA_REVISADO_05011) !== -1
        && data.X_COMERCIALIZACION_REVISADO_05009.toLowerCase().indexOf(searchTerms.X_COMERCIALIZACION_REVISADO_05009) !== -1
        && data.X_PRECIO_MAX_RENTA_REVISADO_05013.toLowerCase().indexOf(searchTerms.X_PRECIO_MAX_RENTA_REVISADO_05013) !== -1;
    }
    return filterFunction;
  }
  getBackend() {


    ELEMENT_DATA = [];

     return this.http.get(`http://5ccbddde08622a00147aa73b.mockapi.io/v1/immobles`).subscribe(data => {
      // this.isLoading = false;
      this.val = data;
      // this.dataSource = new MatTableDataSource(this.val);
      this.dataSource.data = this.val;
      // this.dataSource.filterPredicate = this.createFilter();
    },
      error => {
        console.log('mi error en getval() : ', error);
      });
  }
  // upload
  public uploadFile = (files) => {
		this.progress = 0;

		if (files.length === 0) {
			return;
		}
		let headers = new HttpHeaders({
			// 'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.mytoken
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
				if (event.type === HttpEventType.UploadProgress) {
					// this.progress = Math.round(100 * event.loaded / event.total);
					this.message = '';
					this.message1 = 'Cargando archivo';
				} else if (event.type === HttpEventType.Response) {
					this.message1 = '';
					this.message = 'Archivo procesado';
					this.onUploadFinished.emit(event.body);
					this.progress = 0;
					this.getBackend();
				}
			});
	}
  // upload

  // from customer list methods
  applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		console.log('filtro: ' + this.dataSource.filter);
		console.log(this.dataSource.filteredData);
	}

exportToExcel(json: any[], excelFileName: string): void {

		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = {
			Sheets: { 'data': worksheet },
			SheetNames: ['data']
		};
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcel(excelBuffer, excelFileName);
  }
  private saveAsExcel(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXT);
  }
  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		// this.isAllSelected() ?
		// 	this.selection.clear() :
		// 	this.dataSource.data.forEach(row => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: MyOwnData): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.X_ID + 1}`;
  }
  
  lanzarUnRegistro(flat) {
		console.log(flat);
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.mytoken
		});
		headers.append('Accept', '*/*');
		this.showDetailsProperty();
		return this.todos$ = this.http.get(`${this.apiUrl}/api/report/anticipa/item?id=${flat}`, { headers: headers });
		//  return this.todos$ = this.userService.getUsersJsonone(flat,this.mytoken);
		// http://10.0.0.40/api/Report/anticipa/item?id=4000
  }
  showDetailsProperty() {
		this.showDetails = !this.showDetails;
  }
  
  showFilteredColumns() {
		this.displayedColumns.length = 0;

		this._tmp = this.columnDefinitions.filter(column => {
			if (column.showItem !== false) {
				this.displayedColumns.push(column.def);
				console.log(this.displayedColumns);
				this._tmp = this.columnsToDisplay;
				this._tmp = this.displayedColumns;

			}
			return column.showItem;
		});
	}
  
	rePintarCols() {
		this.displayedColumns.length = 0;

		this.columnDefinitions = this.columnDefinitions.map(column => {
			column.showItem = true;
			if (column.showItem) {
				this.displayedColumns.push(column.def);
				console.log(this.displayedColumns);
				this._tmp = this.columnsToDisplay;
				this._tmp = this.displayedColumns;

			}
			return column;
		});
		this._tmp = this.displayedColumns;
		this._tmp = this.columnDefinitions;
	}
  // from suctomer list methods
}


export interface Element {
  name: string;
  X_ID: number;
  X_CODI_SOCIETAT: number;
  X_DIRECCIO_COMPLERTA: string;
  X_POBLACIO_UBICACIO: string;
  X_PROVINCIA: string;
}
export interface MyOwnData {
  name: string;
  X_ID: number;
  X_CODI_SOCIETAT: number;
  X_DIRECCIO_COMPLERTA: string;
  X_POBLACIO_UBICACIO: string;
  X_PROVINCIA: string;
}
