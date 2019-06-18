import {
	Component,
	OnInit,
	Output,
	Input,
	ViewChild,
	ElementRef,
	OnDestroy,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	HostBinding
} from '@angular/core';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthNoticeService } from '../../../../core/auth/auth-notice.service';
import { NgForm } from '@angular/forms';
import * as objectPath from 'object-path';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerButtonOptions } from '../../../partials/content/general/spinner-button/button-options.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PortalAuthService } from '../../../../core/auth/portal-auth.service';

@Component({
	selector: 'm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {

	/* colores console */

	/* colores console */
	public model: any = { email: '', password: '' };
	// public model: any = { email: 'eribes', password: 'ukA5uLqc8k' };

	errorResponse = '';
	showErrorLogin = false;
	ErrorLogin = 'Compruebe que los datos de acceso sean correctos';
	@HostBinding('class') classes: string = 'm-login__signin';
	@Output() actionChange = new Subject<string>();
	public loading = false;
	value400: boolean = false;
	value401: boolean = false;
	value200: boolean = false;
	@Input() action: string;

	@ViewChild('f') f: NgForm;
	@ViewChild('myInput') myInput: ElementRef;
	@ViewChild('myPass') myPass: ElementRef;


	errors: any = [];

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false
	};
	private rojo = 'black';
	constructor(
		private authService: AuthenticationService,
		private router: Router,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
    private cdr: ChangeDetectorRef,
		private authPortal: PortalAuthService,
		private http: HttpClient
	) {

		window.localStorage.setItem('language', 'es');
		// console.log('%c Oh my heavens! ', 'background:'+ this.rojo+'; color: '+ this.rojo);

	}

	submit() {
		this.toAPI(this.myInput.nativeElement.value, this.myPass.nativeElement.value);

	}


	loginPropio() {
		// this.router.navigate(['/anticipa']);

	}

	toAPI(user, pass) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		const options = {
			headers: headers
		}
		window.localStorage.setItem('email', this.myInput.nativeElement.value);

		const myUserPass = '{ "username":"' + user + '","password":"' + pass + '"}';
		// console.log('what: ' + myUserPass);

		//  return this.router.navigate(['anticipa']);
		return this.http.post(`http://10.0.0.40/api/login/login`, myUserPass, options)
			.subscribe(data => {
				this.value200 = true;
				this.value401 = false;
				this.value400 = false;
				const myTok = data;
				//   console.log(myTok['token']);
				window.localStorage.setItem('token', myTok['token']);
				window.localStorage.setItem('usertype', 'user');

				if (this.myInput.nativeElement.value === 'eferro@arnal.es' || this.myInput.nativeElement.value === 'dplanas@arnal.es'
				|| this.myInput.nativeElement.value === 'eribes@arnal.es') {
					// this.errorResponse = data['message'];
					localStorage.setItem('usertype', 'admin');
				} else {
					localStorage.setItem('usertype', 'user');
					this.errorResponse = data['message'];
					// this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');


				}
				let nombreUsuario;
				switch (user) {
					case 'dplanas@arnal.es':
						nombreUsuario = 'Daniel Planas';
						break;
					case 'eferro@arnal.es':
						nombreUsuario = 'Eva Ferro';
						break;
					case 'eribes@arnal.es':
						nombreUsuario = 'Eva Ribes';
						break;
						case 'jestevan@arnal.es':
						nombreUsuario = 'Josep Estevan';
						break;
					case 'rserra@arnal.es':
						nombreUsuario = 'Rosa Serra';
						break;
					case 'arodrigues@arnal.es':
						nombreUsuario = 'Ana Rodrigues';
						break;
					case 'mredondo@arnal.es':
						nombreUsuario = 'Maria Redondo';
						break;
					case 'admin':
						nombreUsuario = 'Administrador Arnal';
						break;

					default:
						// console.log('no tienes acceso con el mail : ' + user);
						break;

        }
        // this.authPortal.isAutenticated('/');
        
				window.localStorage.setItem('email', this.myInput.nativeElement.value);
				window.localStorage.setItem('usuario', nombreUsuario);

				this.router.navigate(['/']);


			},
				error => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');
					this.myInput.nativeElement.focus();



					if (error.status === 400) {
						this.value200 = false;
						this.value400 = true;
						this.value401 = false;
						//   this.authNoticeService.setNotice(this.translate.instant(error.status), 'error');
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');
						this.myInput.nativeElement.focus();

						//   console.log('oops', error.status)
					} else if (error.status === 401) {
						this.value200 = false;
						this.value400 = false;
						this.value401 = true;
						//   this.authNoticeService.setNotice(this.translate.instant(error.status), 'error');
						//   console.log('oops', error.status)
					}

					//   console.log('oops', error.status)
					this.myInput.nativeElement.focus();
					// this.showErrorLogin = this.showErrorLogin;window.location.reload;
				});



				

		// if(window.localStorage.getItem('token') && window.localStorage.getItem('usertype')){
		// 			  this.router.navigate(['anticipa']);

		// }

	}
	ngOnInit() {
    // demo message to show
    if ( this.authPortal.isAutenticated() ) {
      this.router.navigate(['/']);
    } else {
      console.log('false desde propi login comp');
    }
    
        // this.router.navigate(['/']);
    
    
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>admin@demo.com</strong> and password
			<strong>demo</strong> to continue.`;
			// this.authNoticeService.setNotice(initialNotice, 'success');
			this.authNoticeService.setNotice(null);

		}
	}

	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
	}

	validate(f: NgForm) {
		if (f.form.status === 'VALID') {
			return true;
		}

		this.errors = [];
		if (objectPath.get(f, 'form.controls.email.errors.email')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.INVALID', { name: this.translate.instant('AUTH.INPUT.EMAIL') }));
		}
		if (objectPath.get(f, 'form.controls.email.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', { name: this.translate.instant('AUTH.INPUT.EMAIL') }));
		}

		if (objectPath.get(f, 'form.controls.password.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.INVALID', { name: this.translate.instant('AUTH.INPUT.PASSWORD') }));
		}
		if (objectPath.get(f, 'form.controls.password.errors.minlength')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.MIN_LENGTH', { name: this.translate.instant('AUTH.INPUT.PASSWORD') }));
		}

		if (this.errors.length > 0) {
			this.authNoticeService.setNotice(this.errors.join('<br/>'), 'error');
			this.spinner.active = false;
		}

		return false;
	}

	forgotPasswordPage(event: Event) {
		this.action = 'forgot-password';
		this.actionChange.next(this.action);
	}

	register(event: Event) {
		this.action = 'register';
		this.actionChange.next(this.action);
	}
}
