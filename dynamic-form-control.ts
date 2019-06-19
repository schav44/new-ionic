import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { HostListener } from "@angular/core"
//
import { FormControlBase } from '../../models/formcontrol-base';
import { DVMForm } from '../../models/formcontrol-dvmform'
import { Defines } from '../../common/defines'
import { CfgProvider } from '../../providers/cfg/cfg';
//

@Component({
  selector: 'dynamic-form-control-comp',
  templateUrl: 'dynamic-form-control.html'
})
export class DynamicFormControlComponent {

  def: Defines = new Defines()

  @Input() control: FormControlBase<any>;
  @Input() formControls: FormControlBase<any>[] = [];
  @Input() dvmform: DVMForm // = new DVMForm({});
  @Input() formGroup: FormGroup = new FormGroup({})

  @Output() itemSelected = new EventEmitter<string>();   // Event to tell parent an item has been selcted
  @Output() autoSubmitInput = new EventEmitter<string>();   // Event to tell parent to submit form

  nextInputID: string = ""
  myValue: string = ""

  singleInputString: string = "";
  processScanFlag: boolean = false
  private scannedInput: string = ""

  constructor( private cfg: CfgProvider) {
    let requestedFormStr: string = window.localStorage.getItem(this.def.DEF_KEY_REQUESTEDFORM)
    this.mylog(0, '@@@$$$$$$$$$$$$ DynamicFormPage: dynamic-form.component.ts requestedFormStr: ' + requestedFormStr)
    let requestedForm = JSON.parse(requestedFormStr)
    if (requestedForm) {
      if (requestedForm.status == this.def.DEF_STATUS_COMPLETED) {
        this.mylog(0, '@@@ DynamicFormPage: dynamic-form.component.ts DynamicFormComponent GOT FORM FROM LOCAL STORAGE: formid ' + requestedForm.formDefinition.dialogid);
        this.dvmform = new DVMForm(requestedForm.formDefinition)
        this.formGroup = this.dvmform.formGroup
        this.formControls = this.dvmform.getFormControls()
        this.mylog(0, "'@@@ DynamicFormPage: this.DVForm CREATED: " + JSON.stringify(this.dvmform))
      }
      else {
        this.mylog(0, '@@@ DynamicFormPage: dynamic-form.component.ts DynamicFormComponent COULD NOT FIND FORM IN LOCAL STORAGE !!!!!!: ');
      }
    }
    console.log("DynamicFormControlComponent constructor() created control from input def:\n" + requestedFormStr)
  }

  mylog(flag: number, msg: string) {
    if (flag > 0) {
      console.log("DynamicFormControlComponent: " + msg);
    }
  }

  get isValid() {
    return false;
  }

  ctl_input_onKeyPress(event, control) {
    if (event.keyCode == 13)  // Enter pressed (or came in as a scanner string when control had in focus )
    {
      event.preventDefault()
      console.log("ctl_input_onKeyPress: FormControlComponent KEY-LISTENER-- SUBMIT HERE IF VALIDATION ALLOWS!")
      // this is a single input form, auto submit when enter is pressed.
      //autoSubmitInput

      let okToSubmit = false
      okToSubmit = this.ctl_input_onKeyPress_isOkToSubmit(control)
      if (okToSubmit) {
        let ev: any =
        {
          "id": this.control.id
          , "value": this.control.value
        }
        this.mylog(1, "onKeyPress(): ACCEPTED value: " + JSON.stringify(ev))
        this.autoSubmitInput.emit(ev)
        this.control.value = ""
      }
      else {
        this.control.value = ""
        this.mylog(1, "onKeyPress(): REJECTED value because it does not meet validation criteria.")
      }

      return
    }

  } // end_func


  // TODO: idx is not passed - can remove from the caller page   ????????????????????????????
  listSelected(event, control, val, id, idx) {
    this.control.value = val
    this.myValue = val
    if (this.control.saveValue == "true") {
      let s: string = JSON.stringify(this.control)
      this.itemSelected.emit(s)
    }
    for (let x of control.options) {
      x.clicked = false
      if (val == x.value) {
        x.clicked = true
      }
    }
  }

  getPanelTextRows() {
    return this.def.DEF_PARM_PANELTEXTROWS
  }

  getPanelTextCols() {
    return this.def.DEF_PARM_PANELTEXTCOLS
  }

  onInputFieldFocus(event, control) {
    // left here for future use. Will be called when the input field is clicked or receives focus.
    let index: number = this.dvmform.indexOfFormControlWithID(this.dvmform.getFormControls(), this.control.id)
    this.dvmform.formControls[index].inFocus = true
  }

  offInputFieldFocus(event, control) {
    // left here for future use. Will be called when the input field is clicked or receives focus.
    let index: number = this.dvmform.indexOfFormControlWithID(this.dvmform.getFormControls(), this.control.id)
    this.dvmform.formControls[index].inFocus = false
  }

  /**
   * 
   * @param control Determines whether or not the keyboard input should be accepted and submitted to the server.
   * If in lab mode keyboard input can be accepted in place of expexted scanned input.
   * If not in lab mode the scan input must come from the scanner.
   */
  ctl_input_onKeyPress_isOkToSubmit(control: any): boolean {
    let okToSubmit: boolean = false
    let bracket = this.control.value.indexOf("]")

    if (this.cfg.labMode == 1) {
      okToSubmit = true
      return okToSubmit
    }

    if (this.control.attributes["validation"] == "6") {  //scanned input only is ok
      if (bracket >= 0) {
        // inputType = "scanner"
        okToSubmit = true
      }
    }
    else if (this.control.attributes["validation"] == "5") //scanned or typed input is ok
    {
      okToSubmit = true
    }
    else  // validation = 0-4, keyboard input only is ok
    {
      if (bracket == -1) {
        okToSubmit = true
      }
    }
    return okToSubmit
  }

  /**
   * Decide if the input field should be disabled for keyboard typing (versus scanning) or not.
   * If in lab mode, don't disable input field, let typing and scanning be acceptable.
   * If not in lab mode, disable input field for typing if the field validation is 6 (scan only)
   * @param control 
   *    */
  isInputDisabled(control: any): boolean {
    let rc: boolean = false
    if (this.cfg.labMode == 1) {
      rc = false
    }
    else {
      if (control.attributes.validation == '6') {
        rc = true
      }
    }
    return rc
  }

  onGridCellClick(controlid, rowval, cellval) {
    console.log("Dvmgrid: onGridCellClick: control.id=" + controlid + " rowval=" + rowval + " cellval=" + cellval)
    // get the specific control definition from the DVMForm
    let tmpObj: any = null
    for (let i = 0; i < this.dvmform.formControls.length; i++) {
      if (this.dvmform.formControls[i].id == controlid) {
        tmpObj = this.dvmform.formControls[i]
        break
      }
    }
    if (tmpObj) {

      if (tmpObj["saveValueType"] == "cell") {
        this.control.value = cellval
        this.myValue = cellval
      }
      else {
        this.control.value = rowval
        this.myValue = rowval

      }


      if (tmpObj["autoSubmit"] != "0") {     // anything but 0, will autosubmit
        let s: string = JSON.stringify(this.control)
        this.itemSelected.emit(s)

      }
    }
    console.log(" DynamicFormControlComponent: onGridCellClick:\n saveValueType: [" + tmpObj["saveValueType"] + "] value=[" + this.myValue + "] autoSubmit:  [" + tmpObj["autoSubmit"] + "]")

  }

  // ngOnDestroy() {
  //   console.log(" DynamicFormControlComponent: ngOnDestroy ..........................................")
  // }

  @HostListener('document:keydown', ['$event'])
  processScannerInput(event) {

    console.log("@HostListener: KEY=" + event.key + " code=" + event.keyCode)

    if (this.canContinue(event) == false) return

    if (this.control.type != "ctl_input") return   //JV******************************
    // this.dvrest.log_post ( "(" + event.keyCode + "):" + event.key +" ")

    // is this a single input form?
    if (this.dvmform.isSingleInputForm(this.dvmform.formControls) == false) {
      console.log("IGNORING input - not a single input form.: ")
      return
    }

    let excludeKeyCodes: Array<number> = [0, 16];  // don't convert these to string 16=Shift

    if (excludeKeyCodes.indexOf(event.keyCode) != -1) {
      console.log("@submitted: IGNORING keyCode : " + event.keyCode + "-" + event.key)
      return  // skip special key code
    }

    console.log(" @HostListener: getting first input control...")

    // This a single input form, get the input
    let inputIndex: number = this.dvmform.indexOfFirstInputField(this.dvmform.getFormControls())
    let theInput: any = this.dvmform.formControls[inputIndex]

    if (theInput.inFocus == true) {
      // the input field is inFocus, it will be handled by 
      console.log(" @HostListener: Skip.. first input control inFocus")
      return
    }

    // collect the input including the "]"
    console.log(" @HostListener: for the input control: " + theInput.id)
    if (theInput.attributes["validation"] == 5 || theInput.attributes["validation"] == 6) {
      if (event.key == "]" && this.processScanFlag == false) {
        this.scannedInput = event.key
        this.processScanFlag = true;
        console.log("@HostListener: KEYBOARD SCANNER INPUT (assign to field): " + this.scannedInput)
      }
      else {
        if (event.keyCode != 13 && this.processScanFlag == true) {
          this.control.value = ""
          this.scannedInput += event.key
          console.log(" @HostListener: SCANNED: " + this.scannedInput)
        }

        if (event.keyCode == 13 && this.processScanFlag == true) {
          event.preventDefault()
          console.log("@HostListener: KEYBOARD SCANNER INPUT (assign to field): " + this.scannedInput)

          this.control.value = this.scannedInput

          // this is a single input form, auto submit when enter is pressed.
          //autoSubmitInput
          let ev: any = {
            "id": theInput.id
            , "value": this.scannedInput
          }
          console.log("@HostListener: EMITTING autoSubmit event")
          this.autoSubmitInput.emit(ev)
          this.scannedInput = ""
          this.processScanFlag = false
        }
      }
    }
  }

  // must have only one instance of the following controls in the form
  // otherwise it may not work correctly

  canContinue(event): boolean {
    let rc: boolean = false

    if (this.control.type == this.def.DEF_CTL_EXCEPTION ||
      this.control.type == this.def.DEF_CTL_TEXTAREA ||
      this.control.type == this.def.DEF_CTL_PANELTEXT) {
      if (event.keyCode == 13) {
        //autoSubmitInput
        let ev: any = {
          "id": this.dvmform.formControls[0].id
          , "value": ""
        }
        console.log("@HostListener: EMITTING autoSubmit event")
        this.autoSubmitInput.emit(ev)
      }
      rc = false

    }
    else {
      rc = true
    }

    return rc

  }


} // class
