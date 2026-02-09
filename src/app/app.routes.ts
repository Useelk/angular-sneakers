import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.routes').then((m) => m.HomeRoutes),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./pages/favorites/favorites.routes').then(
        (m) => m.FavoritesRoutes,
      ),
  },
  { path: '**', redirectTo: 'home' },
];
