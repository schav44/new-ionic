import { FormControlBase } from './formcontrol-base';


export class PanelTextControl extends FormControlBase<string> {
  public options: { id: string, value: string }[] = []; // te selection options for the listbox

  myselector: string = "ctl_paneltext"

  constructor(parms: {} = {}) {
    super(parms);
    this.options = parms['options'] || [];

    // The following are default values, they can be overridden by for definitions
    if (!this.attributes["cssStyle"]) {
      this.attributes["cssStyle"] = ""
    }
    if (!this.attributes["styleClass"]) {
      this.attributes["syleClass"] = "form_" + this.myselector
    }
  }


} // class