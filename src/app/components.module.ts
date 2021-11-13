import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListMusicsComponent } from './list-musics/list-musics.component';

@NgModule({
	declarations: [ListMusicsComponent],
	imports: [IonicModule],
	exports: [ListMusicsComponent]
})
export class ComponentsModule {}