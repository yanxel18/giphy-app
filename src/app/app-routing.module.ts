import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CHomegiphyComponent } from 'src/components/c-homegiphy/c-homegiphy.component';
const routes: Routes = [
  { path: '', component: CHomegiphyComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
