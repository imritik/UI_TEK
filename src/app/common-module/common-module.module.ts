import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './component/menu/menu.component';
import { FooterComponent } from './component/footer/footer.component';



@NgModule({
  declarations: [
    MenuComponent, 
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
      MenuComponent,
      FooterComponent
    ]
})
export class CommonModuleModule { }
