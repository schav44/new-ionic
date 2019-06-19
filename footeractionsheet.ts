import { FormControlBase } from './formcontrol-base';

/**
 * This class represents an action sheet that can optionall be present in a forms footer section.
 * Not all forms have action sheets. If they do, then an instance of this class becomes part of the form definition.
 */
export class FooterActionSheet extends FormControlBase<string> {
  title: string = ""
  subTitle: string = ""
  cssClass: string = ""
  enableBackdropDismiss: boolean = true
  buttons: any[] = []

  /*
  EXAMPLE STRUCTURE PASSED TO THE CONSTRUCTOR
  "footerFormControls": [
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
                  "id": "FooterActionSheet"
              }
          ],
          [ ,,,]
  */

  /**
   * Create an object from the footerFormControls (ffc_) array object 
   * (that is part of the form definition.)
   * Only the first occurence of the action sheet is considered. 
   * If the  footer form controls have more than one action sheet the first will be used
   * the rest will be ignored.
   * 
   * @param obj 
   */
  constructor(ffc_obj: any) {
    super(ffc_obj)
    this.tabindex = 0   // 0= reachable in normal order

    if (!ffc_obj) return
    for (let i = 0; i < ffc_obj.length; i++) {
      if (ffc_obj[i] && ffc_obj[i].actionsheet) {
        // this is the first element in the ffc array that is an actionsheet
        this.title = ffc_obj[i].actionsheet.title ? ffc_obj[i].actionsheet.title : ""
        this.subTitle = ffc_obj[i].actionsheet.subTitle ? ffc_obj[i].actionsheet.subTitle : ""
        this.cssClass = ffc_obj[i].actionsheet.cssClass ? ffc_obj[i].actionsheet.cssClass : ""
        this.enableBackdropDismiss = ffc_obj[i].actionsheet.enableBackdropDismiss ? ffc_obj[i].actionsheet.enableBackdropDismiss : true
        if (ffc_obj[i].actionsheet.buttons) {
          for (let j = 0; j < ffc_obj[i].actionsheet.buttons.length; j++) {

            let tmpParms = {
              "value":           ffc_obj[i].actionsheet.buttons[j].value ? ffc_obj[i].actionsheet.buttons[j].value : ""
              , "cssClass":      ffc_obj[i].actionsheet.buttons[j].cssClass ? ffc_obj[i].actionsheet.buttons[j].cssClass : ""
              , "role":          ffc_obj[i].actionsheet.buttons[j].role ? ffc_obj[i].actionsheet.buttons[j].role : "destructive"
              , "icon":          ffc_obj[i].actionsheet.buttons[j].icon ? ffc_obj[i].actionsheet.buttons[j].icon : ""
              , "text":          ffc_obj[i].actionsheet.buttons[j].text ? ffc_obj[i].actionsheet.buttons[j].text : ""
              , "swProcessorRC": ffc_obj[i].actionsheet.buttons[j].swProcessorRC ? ffc_obj[i].actionsheet.buttons[j].swProcessorRC : "4"
            }
            
            this.buttons.push(tmpParms)
          } // for
        } // if
      } // if
      break;
    }
  }

} // class