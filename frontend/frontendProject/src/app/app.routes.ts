import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Favorites } from './components/favorites/favorites';
import { MyVideos } from './components/my-videos/my-videos';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'my-videos', component: MyVideos },
    { path: 'favorites', component: Favorites },
    
    { path: '**', redirectTo: '' },
    // { path: '', component:  },
];
