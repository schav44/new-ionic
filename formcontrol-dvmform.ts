
import { FormGroup, FormControl } from '@angular/forms';
//
import { FormControlBase } from './formcontrol-base';
import { LabelControl } from './formcontrol-label'
import { InputControl } from './formcontrol-input'
import { ListboxControl } from './formcontrol-listbox'
import { FullListboxControl } from './formcontrol-fulllistbox'
import { TextAreaControl } from './formcontrol-textarea'
import { ExceptionControl } from './formcontrol-exception'
import { OnSubmitTextControl } from './formcontrol-onsubmittext'
import { PanelTextControl } from './formcontrol-paneltext'
import { FooterActionSheet } from './footeractionsheet';
import { Dvmgrid } from './formcontrol-dvmgrid';
import { Defines } from '../common/defines'
import { PageMenu } from './page-menu'

export class DVMForm {

    def: Defines = new Defines()

    dialogid: string = ''
    dialogType: string = ''
    title: String = ''      // displayed on page banner
    filename: string = ""   // displayed when title bar is clicked

    dvMenu: PageMenu = new PageMenu()
    
    // attributes for the form
    // optionally you can pass parms like:
    // new AttribBase({cssStyle: "cssForm",styleClass: "backgroundColor: red;"})
    attributes: {} = {}
    formControls: FormControlBase<any>[] = []
    formGroup: FormGroup = new FormGroup({})
    buttons: any[] = []             //<-- TODO: change to type {} ????????????????????????????? define Interface ????
    actionsheet: FooterActionSheet= null
    numInputFields = 0;

    miscParms : {} = {
        classWidth : 290,
        classHeight : 300
    }

        // The constructor is passed a formDefinition (JSON) object
    constructor(obj) {
        if (obj) {
            if( obj.miscParms)  // copy miscParms to model
            {
                this.miscParms = obj.miscParms
            }
            this.buildFromObject(obj)
        }
        else {
            // console.log("@@@ DVMForm constructor obj is UNDEFINED!")
        }
    }

    // footerTitle: a special <LABEL> tag that is treated differently
    footerTitle: LabelControl = null

    /**
     * 
     * @param obj Builds an array of Form Controls (extension/ subclasses of FormControlBase objects)
     */
    buildFromObject(obj) {
        let rc = true
        try {
            this.dialogid = obj.dialogid
            this.dialogType = obj.dialogType
            this.title = this.getTitleObject(obj)         // copy title object
            if (obj.filename) {
                this.filename = obj.filename
            }
            else {
                this.filename = ""
            }

            this.dvMenu = obj.headerFormControls[0].PageMenu
            this.dvMenu.id = obj.headerFormControls[0].id

            // get form attributes
            // this.
                // && obj.headerFormControls.length >0
                // && !obj.headerFormControls[0].PageMenu )
                // {
                //     this.dvMenu = obj.headerFormControls[0].PageMenu
                //     this.dvMenu.id = obj.headerFormControls[0].id
                // }


            let aFormControl: FormControlBase<any> = null

            let myFormControls = obj.formControls

            if (myFormControls) {
                if (myFormControls.length > 0) {
                    // let index= 1
                    let renderType: string = ""
                    for (let i = 0; i < myFormControls.length; i++) {
                        renderType = myFormControls[i].type     
                        // convert to string
                        // renderType = renderType.toLowerCase();

                        // switch (myFormControls[i].type) {
                        switch (renderType) {
                            case this.def.DEF_CTL_LABEL:
                                aFormControl = new LabelControl({
                                    id: myFormControls[i].id
                                    , updateable: false
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , order: myFormControls[i].order
                                })
                                // the footer title is specified like a label but it has
                                // a special attribute to tell us to traet it differently.
                                if (aFormControl.attributes && aFormControl.attributes[ this.def.DEF_KEY_FOOTERTITLE])
                                {
                                    // this is the special footerTitle.    
                                    this.setDefaultAttributesForFooterTitle( myFormControls[i])
                                    this.footerTitle = aFormControl
                                }
                                else
                                {
                                   // this is a classic label panem element     
                                   this.setDefaultAttributes(myFormControls[i])
                                   this.formControls.push(aFormControl)
                                   }

                                // console.log(" DVMForm LABEL: " + JSON.stringify(aFormControl))
                                break;

                            case this.def.DEF_CTL_PANELTEXT:
                                aFormControl = new PanelTextControl({
                                    id: myFormControls[i].id
                                    , updateable: false
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , order: myFormControls[i].order
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                            case this.def.DEF_CTL_INPUT:
                                aFormControl = new InputControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , required: myFormControls[i].required
                                    , order: myFormControls[i].order
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                // this.set_ctl_input_Attributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                this.numInputFields++
                                break;

                            case this.def.DEF_CTL_LISTBOX:
                                aFormControl = new ListboxControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , defaultValue: myFormControls[i].defaultValue
                                    , selectItems: myFormControls[i].selectItems
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , required: myFormControls[i].required 
                                    , order: myFormControls[i].order
                                    , options: myFormControls[i].selectItems
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                            case this.def.DEF_CTL_FULLLISTBOX:
                                // before creating the object, add the miscparms
                                // to the attributes
                                let newAttribs : {} = myFormControls[i].attributes
                                newAttribs[this.def.DEF_KEY_CLASSWIDTH] = this.miscParms[this.def.DEF_KEY_CLASSWIDTH]
                                newAttribs[this.def.DEF_KEY_CLASSHEIGHT] = this.miscParms[this.def.DEF_KEY_CLASSHEIGHT]
                                aFormControl = new FullListboxControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , defaultValue: myFormControls[i].defaultValue
                                    , selectItems: myFormControls[i].selectItems
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: newAttribs
                                    , required: myFormControls[i].required
                                    , order: myFormControls[i].order
                                    , options: myFormControls[i].selectItems
                                })

                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                            case this.def.DEF_CTL_TEXTAREA:
                                aFormControl = new TextAreaControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , required: myFormControls[i].required
                                    , order: myFormControls[i].order
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                            case this.def.DEF_CTL_EXCEPTION:
                                aFormControl = new ExceptionControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , required: myFormControls[i].required
                                    , order: myFormControls[i].order
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                            case this.def.DEF_CTL_ONSUBMITTEXT:
                                aFormControl = new OnSubmitTextControl({
                                    id: myFormControls[i].id
                                    , updateable: myFormControls[i].updateable
                                    , saveValue: myFormControls[i].saveValue
                                    , value: myFormControls[i].value
                                    , type: myFormControls[i].type
                                    , attributes: myFormControls[i].attributes
                                    , required: myFormControls[i].required
                                    , order: myFormControls[i].order
                                })
                                this.setDefaultAttributes(myFormControls[i])
                                this.formControls.push(aFormControl)
                                break;

                                case  this.def.DEF_CTL_GRID:
                                let tmpobj = myFormControls[i]
                                aFormControl = new Dvmgrid( myFormControls[i] )
                                this.formControls.push(aFormControl)
                                break;

                            default:

                        }
                    }
                }
            }
            else {
               // console.log("@@@ DVMForm buildFromObject myFormControls IS NOT TRUE !!!!")
            }

            // The autofocus attribute is used to determine if the field receives focus
            // autofocus=1 means first input field gets the focus.

            let index = this.indexOfFirstInputField(this.formControls)
            if (index != -1) {
                if ( this.formControls[index].attributes[ this.def.DEF_KEY_VALIDATION] != this.def.DEF_VAL_ALPHANUMERICSCANPREFERRED &&
                     this.formControls[index].attributes[ this.def.DEF_KEY_VALIDATION] != this.def.DEF_VAL_ALPHANUMERICSCANREQUIRED)
                {
                    this.formControls[index].attributes[ this.def.DEF_KEY_AUTOFOCUS] = "1"
                }
            }

            // set the tabindex attributes for the controls:
            this.setFormTabindexes(this.formControls)

        }
        catch (ex) {
            rc = false
        }
        return rc
    }


    /**
     * This method returns the index for the first input field.
     * If there are no input fields or more than one, an index of -1
     * is returned.
     */
    indexOfFirstInputField(controls: FormControlBase<any>[]): number {
        let index: number = -1
        let count = 0
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].type == this.def.DEF_CTL_INPUT) {
                count++
                if (count == 1) {
                    index = i
                }
                else {
                    index = -1
                }
            }
        }
        return index
    }

    /**
     * Returns a boolean indicating whether or not this form is a single input form.
     * true= it is a single input form, false= otherwise
     * @param controls 
     */
    isSingleInputForm(controls: FormControlBase<any>[]): boolean {
        let rc: boolean = false 
        let count = 0
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].type == this.def.DEF_CTL_INPUT) {
                count++
            }
        }
        if (count == 1) {
            rc= true
        }
        return rc
    }


    /**
     * Loop through the conrols and set the tabindex attribute on each.
     * The first input field=1, subsequent input fileds=0
     * Non input fileds=-1 
     * (-1=not reachable, 1=first to tab, 0=reachable, natural order )
     * @param control 
     */
    setFormTabindexes(controls: FormControlBase<any>[]) {
        let tabindex: number = 1 //for first
        let unreachable: number = -1
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].type == this.def.DEF_CTL_INPUT) {
                // after the first input tabindex will be 0
                controls[i].tabindex = tabindex
                tabindex = 0
            }
            else {
                controls[i].tabindex = unreachable
            }
        }
    }

    getFormControls() {
        return this.formControls
    }


    setDefaultAttributesForFooterTitle(control: FormControlBase<any>) {

        if (!control) return

        if (!control.attributes[ this.def.DEF_KEY_STYLECLASS]) {
            control.attributes[ this.def.DEF_KEY_STYLECLASS] = ""
        }
        if (control.attributes[ this.def.DEF_KEY_STYLECLASS].length == 0) {
            control.attributes[ this.def.DEF_KEY_STYLECLASS] = this.def.DEF_CTL_FOOTERTITLE
        }

        if (!control.attributes[ this.def.DEF_KEY_CSSSTYLE]) {
            control.attributes[this.def.DEF_KEY_CSSSTYLE] = {}
        }
    }


    setDefaultAttributes(control: FormControlBase<any>) {

        if (!control) return

        if (!control.attributes["styleClass"]) {
            control.attributes["styleClass"] = ""
        }
        if (control.attributes["styleClass"].length == 0) {
            control.attributes["styleClass"] = "form_" + control.type
        }

        if (!control.attributes["cssStyle"]) {
            control.attributes["cssStyle"] = {}
        }
        if (!control.attributes["autofocus"]) {
            control.attributes["autofocus"] = "0"
        }
    }

    // set_ctl_input_Attributes(control: FormControlBase<any>) {
    //     // ignored attributes: row, col, displayAttrib
    //     // these are controlled by attributes.cssStyle attribute

    //     /*
    //     <NAME>protectMode</NAME> type="password"
    //     <NAME>respectCase</NAME>
    //     <NAME>operation</NAME>
    //     <NAME>allowEmptyValue</NAME>
    //     <NAME>limit</NAME>
    //     */

    //     if (!control.attributes["protectMode"]) {
    //         control.attributes["protectMode"] = "0"
    //     }
    //     // the default behavior is not to allow empty input
    //     if (!control.attributes["allowEmptyValue"]) {
    //         control.attributes["allowEmptyValue"] = "0"
    //     }
    //     // the default is to have no input limit
    //     if (!control.attributes["limit"]) {
    //         control.attributes["limit"] = "999"
    //     }

    //     // Based on the DView RF-xml file protectMode attribute, create and set
    //     // a new attribute that we can use in the angular html template rendering.
    //     // Also, add a new attribute to indicate if the input field is cleared or not
    //     // when the protectMode is set to 1

    //     if (control.attributes["protectMode"] == "0") {
    //         control.attributes["submitType"] = "text"
    //     }
    //     else {
    //         control.attributes["submitType"] = "password"
    //     }

    //     if (!control.attributes["operation"]) {
    //         control.attributes["operation"] = "1" // default value
    //         control.attributes["operation_cleared"] = "1" // replace input
    //     }

    //     if (control.attributes["operation"] == "0") {
    //         control.attributes["operation_cleared"] = "0"   // remember it was not cleared
    //     }
    //     else {
    //         control.attributes["operation_cleared"] = "1" // replace input    
    //     }

    //     if (!control.attributes["validation"]) {
    //         control.attributes["validation"] = "2"
    //     }
    //     if (control.attributes["validation"] < "0" || control.attributes["validation"] > "6") {
    //         control.attributes["validation"] = "2"
    //     }

    //     if (!control.attributes["respectCase"]) {
    //         control.attributes["respectCase"] = "0"
    //     }

    //     if (!control.attributes["maxlength"]) { control.attributes["maxlength"] = "50" }

    // }

    getFormGroup(): FormGroup {
        let formGroup: FormGroup = new FormGroup({})
        for (let entry of this.formControls) {
            let formCtl: FormControl = new FormControl(entry)
            formGroup.addControl(entry.id, formCtl)
        }

        return formGroup
    }

    clearInputControlAutofocus(controls: FormControlBase<any>[]) {
        for (let i = 0; i < controls.length; i++) {
            if ((controls[i].type == "ctl_input" || controls[i].type == "ctl_listbox")) {
                controls[i]["autofocus"] = "0"
            }
        }
    }

    setButtonFocus(id: string) {
    }

    /**
     * Get the index of a form control element with the given id.
     * An input control can be ctl_inout or ctl_listbox type.
     * 
     * Return the id or "" if no input field found.
     * @param controls 
     * @param id 
     */
    indexOfFormControlWithID(controls: FormControlBase<any>[], id: string): number {
        //let id: string = ""
        // let rc: number = -1
        let index: number = 0
        //let found: boolean = false
        // let numControls: number = controls.length

        // locate the index of the specified starting control in the controls array
        if (id == "")  // start from the beginning
        {
            index = -1
        }
        else 
        {
            try {
                // loop to find this input controls index into the controls array
                for (let i = 0; i < controls.length; i++) 
                {
                    if (controls[i].id == id) 
                    {
                        index = i
                        break
                    }
                }

            }
            catch (ex) {
                // console.log("DVMForm getNextInputControl() exception occured :" + ex)
            }
        }
        return index;
    }

    /**
     * Get the next input control's index following the specifed control with startid.
     * An input control can be ctl_inout or ctl_listbox type.
     * 
     * Return the id or "" if no input field found.
     * @param controls 
     * @param startid 
     */
    getNextInputControl(controls: FormControlBase<any>[], startid: string): number {
        //let id: string = ""
        let rc: number = -1
        let index: number = 0
        //let found: boolean = false
        // let numControls: number = controls.length

        // locate the index of the specified starting control in the controls array
        if (startid == "")  // start from the beginning
        {
            index = 0
        }
        else {
            try {
                // loop to find this input controls index into the controls array
                for (let i = 0; i < controls.length; i++) {
                    if ((controls[i].type == "ctl_input" || controls[i].type == "ctl_listbox")
                        && (controls[i].id == startid)) {
                        //found = true
                        index = i + 1
                        break
                    }
                }

            }
            catch (ex) {
                // console.log("DVMForm getNextInputControl() exception occured :" + ex)
            }
        }

        // start from the index and search for next input
        for (let i = index; i < controls.length; i++) {
            {
                if (controls[i].type == "ctl_input" ||
                    controls[i].type == "ctl_listbox") {
                    //found = true
                    rc = i
                    break
                }
            }
        }

        return rc
    }

    /**
     * Finds the first Submit, or OK button on the form.
     * It is used to determine the autofocus
     * 
     * @param buttons Array of form buttons     */
    getButtonToFocus(buttons: any[]): string {
        let id: string = ""
        if (buttons.length > 0) {
            // by convention the id of the button is the type
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].show == "1" &&
                    (buttons[i].type == "ok" || buttons[i].type == "submit" || buttons[i].type == "yes")) {
                    id = buttons[i].type
                }
            }
        }

        return id
    }

    getTitleObject(obj: any): any {
        // define a default title object
        let title: any = {
            id: "Title",
            type: "title",
            value: "",
            order: "0",
            attributes:
                {
                    styleClass: "form_title",
                    cssStyle: ""
                }
        }
        // override the default values
        if (obj) {
            if (obj.title) {
                if (obj.title.id) { title.id = obj.title.id }
                if (obj.title.type) { title.type = obj.title.type }
                if (obj.title.value) { title.value = obj.title.value }
                if (obj.title.attributes) {
                    if (obj.title.attributes.styleClass) { title.attributes.styleClass = obj.title.attributes.styleClass }
                    if (obj.title.attributes.cssStyle) { title.attributes.cssStyle = obj.title.attributes.cssStyle }
                }
            }
        }
        if (title.value.trim() == "") {
            title.value = "Message"
        }
        return title
    }

    getFormAttributes(obj: any): any {
        let atts: any = {
            styleClass: "form",
            cssStyle: ""
        }

        if (obj) {
            if (obj.attributes) {
                if (obj.attributes.cssStyle) { atts.cssStyle = obj.attributes.cssStyle }
                if (obj.attributes.type) { atts.styleClass = obj.attributes.styleClass }
            }
        }
        return atts
    }


    /**
     * Returns an array of controls that are in the form
     * that matched the specified control type.
     * ie. all ctl_fulllistboxes, etc.
     * If there are none then an empty array is returned.
     */
    getSpecifiedControls( ctlType: string): any[]
    {
        let controls: any[] = []

        for ( let i=0; i <  this.formControls.length; i++)
        {
            if ( ctlType == this.formControls[i]. type)  
            {
                controls.push( this.formControls[i])
            }
        }
        return controls
    }

} // class
