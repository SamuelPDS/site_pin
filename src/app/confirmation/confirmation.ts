import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<h1>Inscrição concluída</h1>',
})
export class Confirmation {}
