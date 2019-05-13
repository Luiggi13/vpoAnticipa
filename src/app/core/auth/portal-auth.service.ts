import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class PortalAuthService {


    private mytoken = window.localStorage.getItem('token');
    private usertype = window.localStorage.getItem('usertype');
	constructor(
		private router: Router

    ) {
	}

isAutenticated(param){
		if( !this.mytoken || this.mytoken == null || this.mytoken == undefined || this.mytoken == ''||
		!this.usertype || this.usertype == null || this.usertype == undefined || this.usertype == ''
		){
            this.router.navigate([param]);
            console.log('no autenticado');
		} else{
            console.log('autenticado');
		}
    }
    wantLogout(param: string){
        if(param == 'yes'){
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('usertype');        
            window.localStorage.removeItem('email');        
            window.localStorage.removeItem('usuario');        
            this.router.navigate(['login']);

        }else{
            this.isAutenticated('login');
        }

    }
}
