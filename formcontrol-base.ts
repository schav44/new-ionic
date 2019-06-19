
import { FormControl } from '@angular/forms'

export class FormControlBase<T> extends FormControl {

  id: string;
  type: string;    // the tpe of control (label, ctl_input, ctl_listbox, ctl_button, textbox, dropdown)
  value: T;
  updateable: true
  attributes: {};  // a collection of {name: '', value: ''} objects that are maningful to the subclass 

  // the following are not used by all controls
  label: string;
  saveValue: string
  defaultValue: string
  text: string
  icon: string

  styleClass: string = ""
  cssStyle: any = {}
  

  // the following are web only attributes
  // not used by XML panel files
  required: boolean = false
  order: number = 1
  tabindex: number = -1  // -1=not reachable 

  inFocus: boolean = false
  
  constructor(parms: {
    id?: string,
    value?: T,
    type?: string,
    updateable?: boolean
    attributes?: {},

    label?: string,
    saveValue?: string,
    defaultValue?: string,
    text?: string,
    icon?: string,
    required?: boolean,
    order?: number,
    styleClass?: string,
    cssStyle?: any 
    inFocus?: false

  } = {}) {

    super()
        
    this.id = parms.id || ''
    this.value = parms.value
    this.type = parms.type || ''
    this.updateable = true
    this.attributes = parms.attributes;

    this.label = parms.label || ''
    this.saveValue = parms.saveValue || ''
    this.defaultValue = parms.defaultValue || ''
    this.text = parms.text || ''
    this.icon = parms.icon || ''

    this.required = parms.required
    this.order = parms.order === undefined ? 1 : parms.order
    this.styleClass = parms.styleClass === undefined ? "" : parms.styleClass
    this.cssStyle = parms.cssStyle === undefined ? {} : parms.cssStyle
    this.inFocus = parms.inFocus || false
  }

} // class


