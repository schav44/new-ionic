import { FormControlBase } from './formcontrol-base';

export class InputControl extends FormControlBase<string> {


  constructor(parms: {} = {}) {
    super(parms);
    this.tabindex = 0   // 0= reachable in normal order

    // set default attributes
    if (!this.attributes["respectCase"]) {
      this.attributes["respectCase"] = "0"
    }
    if (!this.attributes["autofocus"]) {
      this.attributes["autofocus"] = "0"
    }
    if (!this.attributes["placeholder"]) {
      this.attributes["placeholder"] = " "
    }

    if (!this.attributes["protectMode"]) {
      this.attributes["protectMode"] = "0"
    }
    // the default behavior is not to allow empty input
    if (!this.attributes["allowEmptyValue"]) {
      this.attributes["allowEmptyValue"] = "1"
    }
    // the default is to have no input limit
    if (!this.attributes["limit"]) {
      this.attributes["limit"] = "999"
    }

    // Based on the DView RF-xml file protectMode attribute, create and set
    // a new attribute that we can use in the angular html template rendering.
    // Also, add a new attribute to indicate if the input field is cleared or not
    // when the protectMode is set to 1

    if (this.attributes["protectMode"] == "0") {
      this.attributes["submitType"] = "text"
    }
    else {
      this.attributes["submitType"] = "password"
    }

    if (!this.attributes["operation"]) {
      this.attributes["operation"] = "1" // default value
      this.attributes["operation_cleared"] = "1" // replace input
    }

    if (this.attributes["operation"] == "0") {
      this.attributes["operation_cleared"] = "0"   // remember it was not cleared
    }
    else {
      this.attributes["operation_cleared"] = "1" // replace input    
    }

    if (!this.attributes["validation"]) {
      this.attributes["validation"] = "2"
    }
    if (this.attributes["validation"] < "0" || this.attributes["validation"] > "6") {
      this.attributes["validation"] = "2"
    }

    if (!this.attributes["respectCase"]) {
      this.attributes["respectCase"] = "0"
    }

    if (!this.attributes["maxlength"]) { this.attributes["maxlength"] = "50" }

  }


  set_ctl_input_Attributes(control: FormControlBase<any>) {
    // ignored attributes: row, col, displayAttrib
    // these are controlled by attributes.cssStyle attribute

    /*
    <NAME>protectMode</NAME> type="password"
    <NAME>respectCase</NAME>
    <NAME>operation</NAME>
    <NAME>allowEmptyValue</NAME>
    <NAME>limit</NAME>
    */


  }

} // class