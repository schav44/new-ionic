import { FormControlBase } from './formcontrol-base';

export class ListboxControl extends FormControlBase<string> {
  public options: { id: string, value: string }[] = []; // te selection options for the listbox

  // ATTRIBUTES SPECIFIC TO THIS CONTROL:
  //enumBorder: string = "0" // 0=none, 1=std line, 2=custom IGNORED BY MOBILE APP
  //autoSelect: string = "0" // 0= no, 1=yes. Automatically select option if the is only one option in the listbox
  //statusLine: string = ""  // a line label to display after the listbox
  //statusLineStyle : string = "" // a style statatment to override default style class attributes
  //style: string ="0"       // Highlighted=0, Numbered = 1 (no border screen) 
  // This control is 0 always, passed values are ignored.
  myselector: string = "ctl_listbox"

  constructor(parms: {} = {}) {
    super(parms);
    this.options = parms['options'] || [];
    //console.log ( "ListboxControl: parms passed:>>> " +JSON.stringify( parms))           

    // The following will always be hardcoded for this ontrol by design:
    this.attributes["enumBorder"] = "0"
    this.attributes["style"] = "0"

    // The following are default values, they can be overridden by for definitions
    if (!this.attributes["autoSelect"]) {
      this.attributes["autoSelect"] = "0"
    }


    if (!this.attributes["statusLine"]) {
      this.attributes["statusLine"] = ""
    }
    if (!this.attributes["statusLineStyle"]) {
      this.attributes["statusLineStyle"] = ""
    }
    if (!this.attributes["statusLineClass"]) {
      this.attributes["statusLineClass"] = "form_" + this.myselector + "_statusLine"  // default class for status line
    }
    if (!this.attributes["statusCssStyle"]) {
      this.attributes["statusCssStyle"] = {}
    }
    if (!this.attributes["size"]) {
      this.attributes["size"] = "1"
    }




  }

  getTabIndex() {
    return 1
  }
}