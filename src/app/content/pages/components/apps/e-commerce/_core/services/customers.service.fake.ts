import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { CustomerModel } from '../models/customer.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';

const API_CUSTOMERS_URL = 'api/customers';

// Fake REST API (Mock)
// This code emulates server calls
@Injectable()
export class CustomersService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new customer to the server
	// createCustomer(customer: CustomerModel): Observable<CustomerModel> {
	createCustomer(customer: CustomerModel): Observable<CustomerModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// return this.http.post<CustomerModel>(API_CUSTOMERS_URL, customer, { headers: httpHeaders});
		return this.http.post<CustomerModel>(API_CUSTOMERS_URL, customer, { headers: httpHeaders});
	}

	// READ
	// getAllCustomers(): Observable<CustomerModel[]> {
	// 	return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL);
	// }

	// getCustomerById(customerId: number): Observable<CustomerModel> {
	// 	return this.http.get<CustomerModel>(API_CUSTOMERS_URL + `/${customerId}`);
	// }
	getAllCustomers(): Observable<CustomerModel[]> {
		return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL);
	}

	getCustomerById(customerId: number): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(API_CUSTOMERS_URL + `/${customerId}`);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findCustomers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const url = API_CUSTOMERS_URL;
		// return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL).pipe(
		return this.http.get<CustomerModel[]>(API_CUSTOMERS_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'type']);
				return of(result);
			})
		);
	}


	// UPDATE => PUT: update the customer on the server
	// updateCustomer(customer: CustomerModel): Observable<any> {
	updateCustomer(customer: CustomerModel): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_CUSTOMERS_URL, customer, { headers: httpHeader });
	}

	// UPDATE Status
	// updateStatusForCustomer(customers: CustomerModel[], status: number): Observable<any> {
	updateStatusForCustomer(customers: CustomerModel[], status: number): Observable<any> {
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
	deleteCustomer(customerId: number): Observable<CustomerModel> {
		const url = `${API_CUSTOMERS_URL}/${customerId}`;
		return this.http.delete<CustomerModel>(url);
	}

	deleteCustomers(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteCustomer(ids[i]));
		}
		return forkJoin(tasks$);
	}
}