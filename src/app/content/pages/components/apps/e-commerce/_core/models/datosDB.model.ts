import { BaseModel } from './_base.model';

export class datosDB  extends BaseModel {
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

	clear() {
		this.X_ID = '';
		this.codi_immoble = '';
		this.X_SOCIETAT = '';
		this.X_DIRECCIO_COMPLERTA = '';
		this.X_POBLACIO_UBICACIO = '';
		this.X_PROVINCIA = '';
		this.X_CALIFICACION_REVISADO_05002 = '';
		this.X_N_EXPEDIENTE_CALIFICACION = '';
		this.type = 1;
		this.status = 1;
	}
}
