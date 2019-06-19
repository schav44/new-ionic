import { FormControlBase } from './formcontrol-base';

export class DropdownControl extends FormControlBase<string> {
  options: {id: string, value: string}[] = [];

  constructor(parms: {} = {}) {
    super(parms);
   // console.log ( "DropdownControl: parms passed:>>> " +JSON.stringify( parms))            
    this.options = parms['options'] || [];
  }
}