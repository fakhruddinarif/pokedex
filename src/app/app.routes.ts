import { Routes } from '@angular/router';

import { Shell } from '@shared/layouts';

export const routes: Routes = [
  { path: '', component: Shell, title: 'Pokédex' },
  { path: '**', redirectTo: '' },
];