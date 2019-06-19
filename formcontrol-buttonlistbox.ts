import { FormControlBase } from './formcontrol-base';

export class ButtonListboxControl extends FormControlBase<string> {
  public options: {id: string, value: string}[] = []; // te selection options for the listbox

  constructor(parms: {} = {}) {
    super(parms);
    this.options = parms['options'] || [];
    //console.log ( "ButtonListboxControl: parms passed:>>> " +JSON.stringify( parms))            
  }
}