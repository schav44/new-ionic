import { FormControlBase } from './formcontrol-base';

export class ExceptionControl extends FormControlBase<string> {
  options: {id: string, value: string}[] = [];

  constructor(parms: {} = {}) {
    super(parms);
    this.options = parms['options'] || [];
  }
}