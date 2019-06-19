import { FormControlBase } from './formcontrol-base';


/**
 * This class is used to represent a button in the action sheet.
 * It can be extended and reused for other types of buttons in the future.
 */
export class ButtonControl extends FormControlBase<string> 
{

  text: string =""
  icon: string = ""
  cssClass: string = ""
  role: string ="destructive"
  value: string = ""
  swProcessorRC: number = 0

  constructor(parms: any = {}) {
    super(parms);
    
    this.label = ""  // No preceeding label allowed for this control
    if (parms.text) this.text = parms.text
    if (parms.icon) this.icon = parms.icon
    if (parms.cssClass) this.cssClass = parms.cssClass
    if (parms.role) this.role = parms.role
    if (parms.value) this.value = parms.value
    if (parms.swProcessorRC) this.swProcessorRC = parms.swProcessorRC
  }

 
}