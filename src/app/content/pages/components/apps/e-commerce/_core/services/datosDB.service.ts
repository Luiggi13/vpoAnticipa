import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { CustomerModel } from '../models/customer.model';
import { datosDB } from '../models/datosDB.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';

// const API_CUSTOMERS_URL = 'api/customers';
const API_CUSTOMERS_URL = 'http://localhost:1414/tt/users/';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class datosDBService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new customer to the server
	// createCustomer(customer: CustomerModel): Observable<CustomerModel> {
	createCustomer(customer: datosDB): Observable<datosDB> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// return this.http.post<CustomerModel>(API_CUSTOMERS_URL, customer, { headers: httpHeaders});
		return this.http.post<datosDB>(API_CUSTOMERS_URL, customer, { headers: httpHeaders});
	}

	// READ
	// getAllCustomers(): Observable<CustomerModel[]> {
	// 	return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL);
	// }

	// getCustomerById(customerId: number): Observable<CustomerModel> {
	// 	return this.http.get<CustomerModel>(API_CUSTOMERS_URL + `/${customerId}`);
	// }
	getAllCustomers(): Observable<datosDB[]> {
		return this.http.get<datosDB[]>('http://localhost:1414/tt/users/');
	}

	getCustomerById(customerId: number): Observable<datosDB> {
		return this.http.get<datosDB>(API_CUSTOMERS_URL + `/${customerId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findCustomers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_CUSTOMERS_URL;
		// return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL).pipe(
		return this.http.get<datosDB[]>(API_CUSTOMERS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the customer on the server
	// updateCustomer(customer: CustomerModel): Observable<any> {
	updateCustomer(customer: datosDB): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_CUSTOMERS_URL, customer, { headers: httpHeader });
	}

	// UPDATE Status
	// updateStatusForCustomer(customers: CustomerModel[], status: number): Observable<any> {
	updateStatusForCustomer(customers: datosDB[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < customers.length; i++) {
			const _customer = customers[i];
			_customer.status = status;
			tasks$.push(this.updateCustomer(_customer));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the customer from the server
	// deleteCustomer(customerId: number): Observable<CustomerModel> {
	// 	const url = `${API_CUSTOMERS_URL}/${customerId}`;
	// 	return this.http.delete<CustomerModel>(url);
	// }
	deleteCustomer(customerId: number): Observable<datosDB> {
		const url = `${API_CUSTOMERS_URL}/${customerId}`;
		return this.http.delete<datosDB>(url);
	}

	deleteCustomers(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteCustomer(ids[i]));
		}
		return forkJoin(tasks$);
	}
	getUsersJson() {
		let headers = new HttpHeaders({
		// 'Content-Type': 'application/json',
		 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE1NTYxOTgzNTIsImV4cCI6MTU1NjgwMzE1MiwiaWF0IjoxNTU2MTk4MzUyfQ.O-H0b9fDS8RVhCpJH94rUVVqacfoQ1K1RvIR4M_MqfY'
		// 'Authorization': 'Bearer adadasda'
	});
	let options = {
		headers: headers
	}
	// return this.http.get('http://localhost:1414/tt/users/',{headers:headers});
		 return this.http.get(API_CUSTOMERS_URL,{headers:headers}); 
	  }
}
