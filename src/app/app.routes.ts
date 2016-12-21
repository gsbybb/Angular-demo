import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',redirectTo:'login',pathMatch:'full' }
  /*{ path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
      .then((comp: any) => comp.default),
  },*/
  //{ path: '**',    component: NoContentComponent },
];
