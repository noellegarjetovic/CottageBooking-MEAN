import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { PasswordChangeAdminComponent } from './password-change-admin/password-change-admin.component';
import { TuristaProfilComponent } from './turista-profil/turista-profil.component';
import { TouristCottagesComponent } from './tourist-cottages/tourist-cottages.component';
import { CottageDetailsComponent } from './cottage-details/cottage-details.component';
import {TouristReservationsComponent} from './tourist-reservations/tourist-reservations.component'
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { VlasnikProfilComponent } from './vlasnik-profil/vlasnik-profil.component';
import { VlasnikRezervacijeComponent } from './vlasnik-rezervacije/vlasnik-rezervacije.component';
import { StatistikaComponent } from './statistika/statistika.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MojeVikendiceComponent } from './moje-vikendice/moje-vikendice.component';
import { guestGuard } from './guest.guard';
import { turistaGuard } from './turista.guard';
import { vlasnikGuard } from './vlasnik.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
    {path:"",component:LoginComponent },
    {path:"register",component:RegisterComponent},
    {path:"loginAdmin",component:AdminComponent},
    {path:"passwordChange",component:PasswordChangeComponent},
    {path:"passwordChangeAdmin",component:PasswordChangeAdminComponent},
    {path:"unregistered",component:UnregisteredComponent},
    {path: "profilTurista", component: TuristaProfilComponent, canActivate: [turistaGuard] },
    {path: "cottages",component:TouristCottagesComponent, canActivate: [turistaGuard]},
    {path: "cottage/:naziv", component: CottageDetailsComponent, canActivate: [turistaGuard]},
    {path:"rezervacije",component:TouristReservationsComponent, canActivate: [turistaGuard]},
    {path: "profilVlasnik", component: VlasnikProfilComponent, canActivate: [vlasnikGuard] },
    {path: "rezervacijeVlasnik", component: VlasnikRezervacijeComponent, canActivate: [vlasnikGuard] },
    {path: "statistika", component: StatistikaComponent, canActivate: [vlasnikGuard] },
    {path:"admin",component:AdminPageComponent, canActivate: [adminGuard]},
    {path:"mojeVikendice",component:MojeVikendiceComponent, canActivate: [vlasnikGuard]},
];
