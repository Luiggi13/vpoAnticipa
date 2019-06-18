import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layout/layout.module';
import { PartialsModule } from '../../../partials/partials.module';
import { ListTimelineModule } from '../../../partials/layout/quick-sidebar/list-timeline/list-timeline.module';
import { WidgetChartsModule } from '../../../partials/content/widgets/charts/widget-charts.module';
import { PortalAuthService } from '../../../../core/auth/portal-auth.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
	imports: [
		CommonModule,
		NgxChartsModule,

    Ng2ChartsModule,
		LayoutModule,
		PartialsModule,
		ListTimelineModule,
		WidgetChartsModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			}
		])
	],
	providers: [PortalAuthService],
	declarations: [DashboardComponent]
})
export class DashboardModule {}
