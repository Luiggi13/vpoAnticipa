import { ChangeDetectionStrategy, Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutConfigService } from '../../../../core/services/layout-config.service';
import { SubheaderService } from '../../../../core/services/layout/subheader.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import {formatDate, WeekDay} from '@angular/common';
import { PortalAuthService } from '../../../../core/auth/portal-auth.service';
@Component({
	selector: 'm-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {

	public config: any;
	multiData = [{
		name: 'ANETO / TOWER',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 26
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 29
		}]
	  }, {
		name: 'BUFFALO',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 21
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 24
		}]
	  }, {
		name: 'EMPIRE',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 53
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 192
		}]
	  }, {
		name: 'HERCULES',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 269
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 679
		}]
	  }, {
		name: 'QUASAR',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 506
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 424
		}]
	  }, {
		name: 'TOURMALETE',
		series: [{
		  name: 'PENDIENTE ANALISIS',
		  value: 66
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 0
		}]
	  }]
	  multiData2 = [{
		name: 'SOCIMI | ALBIRANA I',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 63
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 157
		}]
	  }, {
		name: 'SOCIMI | ALBIRANA II',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 147
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 435
		}]
	  }, {
		name: 'SOCIMI | EURIPO',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 6
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 33
		}]
	  }, {
		name: 'SOCIMI TORBELL',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 53
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 192
		}]
	  }, {
		name: 'EDAV',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 19
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 29
		}]
	  }, {
		name: 'TRADER',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 146
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 93
		}]
	  }, {
		name: '(en blanco)',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 55
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 2
		}]
	  }, {
		name: 'SOCIMI',
		series: [{
		  name: 'VPO PENDIENTE CONFIRMAR',
		  value: 505
		}, {
		  name: 'ANALISIS FINALIZADO',
		  value: 424
		}]
	  }]
	
	  multiData3 = [{
		name: 'Perimetro total VPO detectado 2359',
		series: [{
		  name: 'Semana 11',
		  value: 31476
		}, {
		  name: 'Semana 17',
		  value: 36953
		}, {
		  name: 'Semana 18',
		  value: 40632
		}]
	  }, {
		name: 'Perimetro total con VPO detectado 2359',
		series: [{
		  name: 'Semana 11',
		  value: 37060
		}, {
		  name: 'Semana 17',
		  value: 45986
		}, {
		  name: 'Semana 18',
		  value: 49737
		}]
	  }, {
		name: 'Nº IDS con analisis finalizado 1365',
		series: [{
		  name: 'Semana 11',
		  value: 29476
		}, {
		  name: 'Semana 17',
		  value: 34774
		}, {
		  name: 'Semana 18',
		  value: 36745
		}]
	  }, {
		name: 'Nº IDS en estudio 994',
		series: [{
		  name: 'Semana 11',
		  value: 26424
		}, {
		  name: 'Semana 17',
		  value: 32543
		}, {
		  name: 'Semana 18',
		  value: 32543
		}, ]
	  }];
	  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
	 
	  constructor(
		  private router: Router,
		  private configService: LayoutConfigService,
		  private subheaderService: SubheaderService,
		  private authPortal: PortalAuthService
		  ) {
			  this.subheaderService.setTitle('Seguimiento VPO - Task Force ');
			  // this.router.navigate(['bpo/vpo-anticipa']);
			//   this.diasemana = 1 ? this.dia = 'lunes' : false;
  
			 
			}

			
			
			ngOnInit() {
				if ( !this.authPortal.isAutenticated() ) {
					this.router.navigate(['/login']);
				  } else {
					  console.log('logged from dashboard');
				  }
				  

			}

	ngAfterViewInit() {
		
		setTimeout(() => {
		  const resizeCharts = () => this.charts.forEach(chart => chart.chart.resize());
	
		  // Initial resize
		  resizeCharts();

		});
	  }
	
}
