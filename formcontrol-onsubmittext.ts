import { FormControlBase } from './formcontrol-base';
import { Defines } from '../common/defines';

export class OnSubmitTextControl extends FormControlBase<string> {
  // public options: {id: string, value: string}[] = []; // te selection options for the listbox

  def: Defines = new Defines()
  
  constructor(parms: {} = {}) {
    super(parms);
  
    // this.options = parms['options'] || [];

    // The following are default values, they can be overridden by for definitions
    if (!this.attributes["cssStyle"]) {
      this.attributes["cssStyle"] = ""
      }
      if (!this.attributes["styleClass"]) {
      this.attributes["syleClass"] = "form_" + this.def.DEF_KEY_ONSUBMITTEXT
      }
  
  }
}