import { ActionSheetController } from 'ionic-angular'
import { EventEmitter, Output } from '@angular/core';
import { Component } from '@angular/core';
//
import { DVMForm } from '../../models/formcontrol-dvmform'
import { Defines } from '../../common/defines'

/**
  The Footer is defined with the following JSON example:
    "footerFormControls": 
    [
      {
          "actionsheet": {
              "buttons": [
                  {
                      "value": "cancel",
                      "cssClass": "",
                      "role": "destructive",
                      "icon": "",
                      "text": "Cancel",
                      "swProcessorRC": "4"
                  }
              ],
              "enableBackdropDismiss": "true",
              "cssClass": "",
              "subTitle": "",
              "title": "Unplanned Operation"
          },
          "type": "ctl_ActionSheet",
          "id": "actionSheet"
      }
    ],
    [ ... more in the future ...]

 */
@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {

  def: Defines = new Defines()
  @Output() buttonPressed = new EventEmitter<string>();
  idvmform: DVMForm = null

  butSubmit: boolean = true
  butCancel: boolean = true
  butOK: boolean = false
  butYes: boolean = false
  butNo: boolean = false
  butLogout: boolean = false
  butBack: boolean = false
  butActionSheet = false

  constructor(public actionSheetCtrl: ActionSheetController) {
    console.log('Hello FooterComponent Component');

    let requestedFormStr: string = window.localStorage.getItem(this.def.DEF_KEY_REQUESTEDFORM)
    let requestedFormObj = JSON.parse(requestedFormStr)
    if (requestedFormObj) {
      if (requestedFormObj.status == this.def.DEF_STATUS_COMPLETED) {
        this.idvmform = new DVMForm(requestedFormObj.formDefinition)
        // this.mylog(0, '@@@ constructor: dialogid: '+ JSON.stringify(this.idvmform.actionsheet) )
      }
    }
    this.setButtonFlags()
  }

  mylog(flag, msg) {
    if (flag > 0) {
      console.log("FooterComponent: " + msg)
    }
  }

  setButtonFlags() {
    // Set buttonflags. If a bottons section is defined do what it says, otherwise
    // default to the submit and Cancel buttons

    let buttons: any[] = []
    if (this.idvmform && this.idvmform.buttons) {
      buttons = this.idvmform.buttons

    }

    if (this.idvmform && this.idvmform.buttons && this.idvmform.buttons.length > 0) {
      this.mylog(0, "DynamicFormComponent: setButtomFlags: using DEFAULT FORM SETTINGSS!")
      this.disableButtons()

      for (let button of buttons) {
        switch (button.type) {
          case this.def.DEF_BUTTON_OK:
            this.butOK = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_CANCEL:
            this.butCancel = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_SUBMIT:
            this.butSubmit = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_YES:
            this.butYes = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_NO:
            this.butNo = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_LOGOUT:
            this.butLogout = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_BACK:
            this.butBack = button.show == 1 ? true : false
            break;
          case this.def.DEF_BUTTON_ACTIONSHEET:
            this.setActionSheetButtonFlag()
            break;

          default:

        }
      }
    }
    else {
      //if this is a full list box (used for menus) then don't show submit button
      let isSpecialListBox: boolean = this.hasFullListBoxControl()
      if (isSpecialListBox == true) {
        this.butSubmit = false
      }
      else {
        this.butSubmit = true
        let newButton = { type: "submit", show: "1" }
        buttons.push(newButton)
      }
      this.butCancel = true
      let newButton = { type: "cancel", show: "1" }
      buttons.push(newButton)
      this.butYes = false
      this.butNo = false
      this.butOK = false
      this.butLogout = false
      this.butBack = false
      this.setActionSheetButtonFlag()
    }

    // check to see if this form has only a Cancel button
    // if so replace it with a back icon button 
    if (buttons.length == 1 && this.butCancel == true) {
      this.butCancel = false
      this.butBack = true
    }

  }

  disableButtons() {
    this.butSubmit = false
    this.butCancel = false
    this.butYes = false
    this.butNo = false
    this.butOK = false
    this.butLogout = false
    this.butBack = false
  }

  setActionSheetButtonFlag(): boolean {
    // check if we show action sheet button
    // some form controls like texte box etc.
    // don't use actionsheets
    let rc: boolean = false
    try {
      if (this.idvmform.actionsheet && this.idvmform.actionsheet.buttons.length > 0) {
        if (this.idvmform.actionsheet.buttons.length == 1
          && this.idvmform.actionsheet.buttons[0].value == "cancel") {
          // don't show actionsheet if we just have cancel.
        }
        else {
          rc = true
        }

      }
    }
    catch (ex) {

    }
    this.butActionSheet = rc
    return rc

  }

  hasFullListBoxControl() {
    let rc: boolean = false
    if (this.idvmform && this.idvmform.formControls) {
      for (let entry of this.idvmform.formControls) {
        if (entry.type == this.def.DEF_CTL_FULLLISTBOX && entry.saveValue == "true") {
          rc = true
          break
        }
      }

    }
    return rc

  }

  /**
   * Display the footer or not.
   * If the form has buttons display the footer
   * If the form has an action sheet with actions display the footer.
   * If no buttons and no action sheet actions dont display footer.
   */
  isFooterPresent(): boolean {
    let rc: boolean = false
    if (this.idvmform && this.idvmform.buttons && this.idvmform.buttons.length > 0) {
      rc = true
    }
    else {
      if (
        this.idvmform.actionsheet
        && this.idvmform.actionsheet.buttons
        && this.idvmform.actionsheet.buttons.length > 0) {
        rc = true
      }
    }
    return rc
  }

  /**
   * Build and display the action sheet menu for the page.
   */
  actionSheetClicked(event) {
    let actionSheet = this.actionSheetCtrl.create(this.idvmform.actionsheet);
    let buttons = this.idvmform.actionsheet.buttons
    // assign handlers
    for (let i = 0; i < buttons.length; i++) {
      actionSheet.data.buttons[i].handler = () => {
        this.onActionSheetSelection(actionSheet.data.buttons[i])
      }
    }
    actionSheet.present();
  }

  onActionSheetSelection(obj): boolean {
    let rc: boolean = true // default to close the sheet
    if (!obj || obj.value == "cancel") {
      // do nothing - the sheet will be closed
      return rc
    }

    // process the action selected
    let actionSheetParmsParms: any = {
      type: this.def.DEF_SUBMITTYPE_ACTIONSHEET,
      swProcessorRC: obj.swProcessorRC,
      actionValue: obj.value
    }
    this.buttonPressed.emit(actionSheetParmsParms)
    return rc
  }

  onButtonPress(event: any, type: string, actionSheetParms) {
    this.mylog(1, "'@@@ onButtonPress: " + type)
    // Build object to pass with the emit
    let buttonPressParms: any = {
      type: type
    }
    this.buttonPressed.emit(buttonPressParms)
  }

  footerCommand(target: string, parm: string) {
    this.mylog(1, "footerCommand RECEIVED: " + target + ":" + parm)
    if (parm == this.def.DEF_FOOTCMD_HIDESUBMIT) {
      this.butSubmit = false
    }
    else {
      this.butSubmit = true
    }
  }

  getFooterTitle(): string {
    let s: string = ""
    if (this.idvmform && this.idvmform.footerTitle && this.idvmform.footerTitle.value) {
      s = this.idvmform.footerTitle.value
    }
    return s
  }

  getFooterTitleClass(): string {
    let s: string = ""
    if (this.idvmform && this.idvmform.footerTitle
      && this.idvmform.footerTitle.attributes && this.idvmform.footerTitle.attributes[this.def.DEF_KEY_STYLECLASS]) {
      s = this.idvmform.footerTitle.attributes[this.def.DEF_KEY_STYLECLASS]
    }
    return s
  }

  getFooterTitleStyle(): any {
    let obj: any = {}
    if (this.idvmform && this.idvmform.footerTitle
      && this.idvmform.footerTitle.attributes && this.idvmform.footerTitle.attributes[this.def.DEF_KEY_CSSSTYLE]) {
      obj = this.idvmform.footerTitle.attributes[this.def.DEF_KEY_CSSSTYLE]
    }
    return obj

  }

} // class


