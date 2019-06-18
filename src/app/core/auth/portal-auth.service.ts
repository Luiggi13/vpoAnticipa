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

isAutenticated() {
    if ( localStorage.getItem('token') == null) {
        console.warn('false desde isAuthenticated');
        return false;
    } else {
        console.warn('true desde isAuthenticated');
        return true;
    }
}
isAutenticatedLogin() {
    if ( localStorage.getItem('token') !== null) {
        console.log('no autenticado');
        this.router.navigate(['/']);
    }
}
    wantLogout(param: string) {
        if (param === 'yes') {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('usertype');
            window.localStorage.removeItem('email');
            window.localStorage.removeItem('usuario');
            this.router.navigate(['login']);

        } else {
            this.isAutenticated();
        }

    }
}
