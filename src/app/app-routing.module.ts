import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CHomegiphyComponent } from 'src/components/c-homegiphy/c-homegiphy.component';
import { CSearchbarComponent } from 'src/components/c-searchbar/c-searchbar.component';
const routes: Routes = [
  { path: 'gif', component: CSearchbarComponent },
  {path: '', redirectTo: '/gif', pathMatch: 'full'},
  {path: '**', component: CSearchbarComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
