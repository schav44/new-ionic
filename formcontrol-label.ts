import { FormControlBase } from './formcontrol-base';

export class LabelControl extends FormControlBase<string> {
  
  constructor(parms: any = {}) {
    super(parms);
    this.label = ""  // No preceeding label allowed for this control
  }

  


} // class