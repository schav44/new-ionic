
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
// 
import { App } from 'ionic-angular/components/app/app';
import { FormProvider } from '../../providers/dynamic-form/dynamic-form';
import { DvrestProvider } from '../../providers/dvrest/dvrest';
import { CfgProvider } from '../../providers/cfg/cfg';
import { FormControlBase } from '../../models/formcontrol-base'
import { DVMForm } from '../../models/formcontrol-dvmform'
import { RequestedForm } from '../../models/requestedForm';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component'
import { Defines } from '../../common/defines'
import { StartPage } from '../../pages/start/start';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu';
import { PageMenu } from '../../models/page-menu';

@IonicPage()
@Component({
  selector: 'df-page',
  templateUrl: 'dynamic-form.html',
})
export class DynamicFormPage implements OnInit, AfterViewInit {

  def: Defines = new Defines()

  @ViewChild('formcomp') formComp: DynamicFormComponent;

  formControls: FormControlBase<any>[] = [];
  dvmform: DVMForm = new DVMForm({})
  dvMenu: PageMenu = new PageMenu()
  formGroup: FormGroup = new FormGroup({})

  formSubmitMsg: string = ""

  plaftormWidth: number = 0
  platformHeight: number = 0


  constructor(public navCtrl: NavController, public app: App, public forms: FormProvider,
    private alertCtrl: AlertController, public dvrest: DvrestProvider,
    private cfg: CfgProvider, 
    public events: Events,
    private platform: Platform

  ) {
    this.mylog(1, '@@@$$$$$$$$$$$$ DynamicFormPage constructor : started...');

    this.platform.ready().then((readySource) => {
      console.log('DynamicFormPage %%%%%%%%%%%% Width: ' +this. platform.width());
      console.log('DynamicFormPage %%%%%%%%%%%% Height: ' + this.platform.height());
    });

    this.disableBrowserBackButton()


    let requestedFormStr: string = window.localStorage.getItem("requestedForm")
    // this.mylog(0, '@@@ DynamicFormPage: dynamic-form.component.ts requestedFormStr: ' + requestedFormStr)
    //???????????????????????? PUT CHECKS HERE FOR STATUS NOT FOUND ETC ??????????????????
    let requestedFormObj: RequestedForm = JSON.parse(requestedFormStr)

    if (requestedFormObj) {
      if (requestedFormObj.status == this.def.DEF_STATUS_COMPLETED) {
        this.dvmform = new DVMForm(requestedFormObj.formDefinition)
        this.formControls = this.dvmform.getFormControls()
        this.dvMenu = this.dvmform.dvMenu;
        console.log(this.dvmform);
        for (let entry of this.dvmform.formControls) {
          this.mylog(0, ">>>> DynamicFormPage component entry added: " + JSON.stringify(entry)) // 1, "string", false
          let formCtl: FormControl = new FormControl({ value: entry.value, disabled: false })
          this.formGroup.addControl(entry.id, formCtl)
        }
        this.formControls = this.dvmform.getFormControls()
      }
      else {
        this.mylog(0, '@@@ DynamicFormPage: dynamic-form.component.ts DynamicFormComponent COULD NOT FIND FORM IN LOCAL STORAGE !!!!!!: ');
        // TODO: ??????????????????????????????
        // DISPLAY SOME ERROR ON THE SCREEN ????????????????????????????
      }
    }
    this.mylog(0, '@@@ DynamicFormPage constructor : ended...');
  }

  ngOnInit() {
    this.mylog(0, '@@@ DynamicFormPage ngOnInit : ...');
  }

  ionViewDidLoad() {
    // console.log('@@@ DynamicFormPage dynamic-form.ts ionViewDidLoad:  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    if (this.dvmform.dialogType == this.def.DEF_KEY_ONSUBMITTEXT) {
      this.sendOnSubmitTextResponse()
    }
  }

  // ionViewWillEnter()
  // {
  //   this.mylog(1, '@@@ DynamicFormPage ionViewWillEnter : ...');
  // }

  // ionViewDidEnter()
  // {
  //   this.mylog(1, '@@@ DynamicFormPage ionViewDidEnter : ...');
  // }

  ngAfterViewInit() {
    this.mylog(1, '@@@ DynamicFormPage ngAfterViewInit : ...');
    
    this.disableSingleInputScanOnlyInput()

    // get the ctl_fulllistboxes from the form (if any)
    // and adjust the width and the heights
    let controls: any[] = this.dvmform.getSpecifiedControls( this.def.DEF_CTL_FULLLISTBOX)
    
    if ( controls.length > 0)
    {
      this.mylog(1, '@@@ DynamicFormPage ngAfterViewInit FOUND ctl_fullistboxes:')
    }

    for (let control of controls) 
    {
      this.mylog(1, '@@@ DynamicFormPage ngAfterViewInit id : ' + control.id)
    }
  
  }

  sendOnSubmitTextResponse() {
    //console.log('@@@ DynamicFormPage dynamic-form.ts sendOnSubmitTextResponse()');
    /*
    {"submitType":"submit","formGroupValues":{"CT":"Container:","Container":"123456789012345","Tck":"Ticket Barcode:","TicketBC":"1234567890","Loc":"Location:","PutLocation":"1234567890123","PartDescription:":"Part description","ItemBK":"A123 TTE 678 90"}}
    */

    let payloadObj = {
      submitType: this.def.DEF_SUBMITTYPE_SUBMIT,
      formGroupValues: this.formGroup.value
    }

    this.onFormProcess(JSON.stringify(payloadObj))
  }

  mylog(flag: number, msg: string) {
    if (flag > 0) {
      console.log("DynamicFormPage: " + msg);
    }
  }

  /**
  * EVENT HANDLER FUNCTION:
  * intended for a form-component originated emit() to call.
  * @param event 
   
  */
  onFormProcess(event) {
    //console.log("DynamicFormPage: onVoted: event: " + event)
    let eventObj = JSON.parse(event)
    // check for logout
    if (eventObj.submitType == this.def.DEF_SUBMITTYPE_LOGOUT) {
      let obsLogout: Observable<any> = this.dvrest.logout_post()
      obsLogout.subscribe(
        (data) => {
          //console.log("@@@ DynamicFormPage received response to logout: "+ data["_body"])
        },
        (err) => {
        },
        () => {  // COMPLETED
          // This is executed when the logout completes.
          // this.navCtrl.setRoot(HomePage)
          this.navCtrl.setRoot(StartPage)
        }
      )

      return
    }

    // only validate if submitting, don't validate cancelled forms
    if (eventObj.submitType == this.def.DEF_SUBMITTYPE_SUBMIT) {
      // Validate the Form
      let validationRc = this.formValidator(event)
      if (validationRc != null) {
        this.formValidationError(validationRc)
        return;
      }
    }
    this.formComp.formComponentCommand( "footer", this.def.DEF_FOOTCMD_HIDESUBMIT) 


    // get the form components payload and submit type from the event and
    // build a form submit structure
    let formSubmitObj = this.convertInPayloadToFormResultObject(event)
    this.formSubmitMsg = JSON.stringify(formSubmitObj)
    this.mylog(0, "onFormProcess formSubmitMsg: ..." + this.formSubmitMsg)

    // save the next requested form
    let requestedFormObj: RequestedForm = new RequestedForm()
    requestedFormObj.idRequested = this.def.DEF_KEY_NEXT
    requestedFormObj.status = this.def.DEF_STATUS_WAITING
    requestedFormObj.formDefinition = {}
    window.localStorage.setItem(this.def.DEF_KEY_REQUESTEDFORM, JSON.stringify(requestedFormObj))

    let observablePost: Observable<any> = this.forms.submitForm(this.formSubmitMsg)
    observablePost.subscribe(
      data => {

        try{
          //this.mylog( 0, "DynamicFormPage POST FORM RESPONSE DATA RECEIVED..."+ data)
          let inmsg: string = data[this.def.DEF_KEY_BODY]
          //console.log( "DynamicFormPage POST FORM RESPONSE DATA RECEIVED..." + inmsg)

          let inObj = JSON.parse(inmsg)
          let formObj = inObj.body.formDefinition
          formObj = this.forms.addMiscParmsToForm( formObj)  

          window.localStorage.removeItem(this.def.DEF_KEY_REQUESTEDFORM)
          let requestedFormObj: RequestedForm = new RequestedForm()
          requestedFormObj.idRequested = formObj.dialogid
          requestedFormObj.status = this.def.DEF_STATUS_COMPLETED
          requestedFormObj.formDefinition = formObj


          window.localStorage.setItem(this.def.DEF_KEY_REQUESTEDFORM, JSON.stringify(requestedFormObj))
          // console.log("@@@ dynamic-form.ts GOT FORM DEFINITION...")

          this.dvmform = new DVMForm(formObj)
          this.formGroup = this.dvmform.formGroup
          this.formControls = this.dvmform.getFormControls()

          //this.dvmform = new DVMForm(requestedFormObj.formDefinition)
          //console.log( "'@@@ DynamicFormPage: this.DVForm CREATED FROM POST RESPONSE: " + JSON.stringify(this.dvmform))
          for (let entry of this.dvmform.formControls) {
            //console.log( ">>>> DynamicFormPage component entry added: "+ JSON.stringify(entry)) // 1, "string", false
            let formCtl: FormControl = new FormControl({ value: entry.value, disabled: false })
            this.formGroup.addControl(entry.id, formCtl)
          }
        }
        catch( ex)
        {
          console.log("DynamicFromPage RESPONSE BODY DATA JSON parse exception: " + ex)
          this.alertDisplay( "Message Error", "", "Received bad message format.\nCan't display the next page.")
          this.navCtrl.push(StartPage)
          return
        }

      },
      error => {
        this.mylog(1, "DynamicFormPage POST FORMinmsg RESPONSE ERROR RECEIVED..." + error)

      },
      () => {
        //console.log("DynamicFormPage POST FORM RESPONSE COMPLETE RECEIVED...")
        
        this.navCtrl.setRoot(DynamicFormPage)
      }
    )

  }

  convertInPayloadToFormResultObject(inPayload: string) {

    /* Example PAYLOAD:
      { "submitType":"submit",
        "formGroupValues":
            { "label_1":"Type in something",
              "input1":"",
              "label_2":"Pick a Letter",
              "listbox1":"C"
            }
      }
    */
    //console.log("#### PAYLOAD: " + inPayload)
    let inPayloadObj: any = JSON.parse(inPayload)
    // GET THE KEYS(Attributes) IN AN OBJECT 
    //const objectKeys: Array<keyof any> = Object.keys(this.formGroup.controls)
    /////////let payloadObj = JSON.parse(inPayload)


    let formEntries = new Array<any>()

    for (let i = 0; i < this.formControls.length; i++) {
      let myVal = this.convertToUppercaseIfNecessary(inPayloadObj, this.formControls[i])
      let formEntry = {
        id: this.formControls[i].id
        , type: this.formControls[i].type
        , saveValue: this.formControls[i].saveValue
        , value: myVal  /////////////////////////inPayloadObj.formGroupValues[this.formControls[i].id]
      }
      //console.log("$$$$$$ fromEntry: " + JSON.stringify(formEntry))
      formEntries.push(formEntry)
      //console.log("----------->> " + this.formControls[i].id + "  -->> " + this.formControls[i].value)
    }

    let formSubmitObj: any = {
      dialogid: this.dvmform.dialogid,
      deviceType: this.cfg.getDeviceType(),
      dialogType: this.dvmform.dialogType,
      submitType: inPayloadObj.submitType,
      formControls: formEntries
    }
    if (inPayloadObj.submitType == this.def.DEF_SUBMITTYPE_ACTIONSHEET) {
      formSubmitObj = {
        dialogid: this.dvmform.dialogid,
        dialogType: this.dvmform.dialogType,
        submitType: inPayloadObj.submitType,
        actionValue: inPayloadObj.actionValue,
        swProcessorRC: inPayloadObj.swProcessorRC,
        formControls: formEntries
      }
    }

    return formSubmitObj

  }

  convertToUppercaseIfNecessary(aPayloadObj: any, aFormControl: any): string {
    let myValue = aPayloadObj.formGroupValues[aFormControl.id]
    // only convert ctl_inputs
    if (aFormControl.type == this.def.DEF_CTL_INPUT) {
      if (aFormControl && aFormControl.attributes && aFormControl.attributes[this.def.DEF_KEY_RESPECTCASE] && aFormControl.attributes[this.def.DEF_KEY_RESPECTCASE] == "0") {
        myValue = myValue.toUpperCase()
      }
    }
    return myValue
  }

  formValidationError(error) {
    //console.log("@@@ DynamicFormPage formValidationError(): " + error);
    let alert = this.alertCtrl.create({
      title: 'Validation Error',
      subTitle: '',
      message: error,
      buttons:
        [
          { text: 'OK', 
            role: 'cancel',
            handler: data => {
              this.mylog(1, " Validation Error alert dismissed.")
            } 
          }
        ]
    });
    alert.present();
  }

  /**
   * Validates an input, returns null if no error, or an error message if
   * there is an error.
   * Validates the data type (alpha, numeric, alphanumeric)
   * based on the validation type.
   *    validation: 0 = Numeric, 1 = Alpha, 2 = Alphanumeric,  3 = Template, 
   *                4 = NumericKeypadOnly (not scanned)
   *                5 = AlphanumericScanPreferred   // for mobile treat as =2 (maybe scanned or typed)
   *                6 = AlphanumericScanRequired    // must be scanned not keyboard entry
   * 
   * @param inPayload 
   */
  formValidator(inPayload: string): any {
    let err = null;
    //console.log("------------------------------------------@@@ DVMForm formValidator CALLED....")
    let inPayloadObj = JSON.parse(inPayload)
    let myFormControls = this.dvmform.getFormControls()

    for (let i = 0; i < this.formControls.length; i++) {
      if (myFormControls[i].type == this.def.DEF_CTL_INPUT) {
        let value = inPayloadObj.formGroupValues[myFormControls[i].id]
        value = value.trim()

        // Strip the leading ] for scanned values:
        if (value.charAt[0] == "]") {
          value = value.substring(1, value.length);
        }
        // Check for empty field
        if (myFormControls[i].attributes[ this.def.DEF_KEY_ALLOWEMPTYVALUE] == "0") {
          if (value == "") {
            err = new Error("A value is required for: " + myFormControls[i].id)
            return err
          }
        }
        // Conditionally Convert to uppercase
        if (myFormControls[i].attributes[ this.def.DEF_KEY_RESPECTCASE] == this.def.DEF_VAL_NUMERIC) {
          value = value.toUpperCase()
        }
        // check numeric values
        if (myFormControls[i].attributes[ this.def.DEF_KEY_VALIDATION] ==  this.def.DEF_VAL_NUMERIC ||
          myFormControls[i].attributes[this.def.DEF_KEY_VALIDATION] == this.def.DEF_VAL_NUMERICKEYPADONLY) {
          if (value != "") {
            let rc = this.isNumber(value)
            if (rc == false) {
              err = new Error("The input must be numeric only: " + myFormControls[i].id)
              return err
            }
          }
        }
        // check alpha values
        else if (myFormControls[i].attributes[this.def.DEF_KEY_VALIDATION] == this.def.DEF_VAL_ALPHA) {
          if (value != "") {
            let rc = this.isAlpha(value)
            if (rc == false) {
              err = new Error("The input must be alpha only: " + myFormControls[i].id)
              return err
            }
          }
        }
        // check alphanumeric values
        else if (myFormControls[i].attributes[this.def.DEF_KEY_VALIDATION] == this.def.DEF_VAL_ALPHANUMERIC ||
          myFormControls[i].attributes[this.def.DEF_KEY_VALIDATION] == this.def.DEF_VAL_ALPHANUMERICSCANPREFERRED ||
          myFormControls[i].attributes[this.def.DEF_KEY_VALIDATION] == this.def.DEF_VAL_ALPHANUMERICSCANREQUIRED) {
          if (value != "") {
            let rc = this.isAlphaNumeric(value)
            if (rc == false) {
              err = new Error("The input must be alpha numeric only: " + myFormControls[i].id)
              return err
            }
          }
        }
        else {
          err = new Error("The validation type specified in the form XML definition: " + myFormControls[i].attributes["validation"] + " is not yet supported ")
          return err
        }
      }
      else {
        // no validation required
      }
    }
    //console.log("------------------------------------------@@@ DVMForm formValidator: " + err);
    return err;
  } //end_func

  isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
  }

  isAlphaNumeric(str) {
    var code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (code < 32 || code > 126)
      {
        return false;
      }
    }
    return true;
  }

  isAlpha(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) && // lower alpha (a-z)
        !(code == 32)             // blank is ok
      ) {
        return false;
      }
    }
    return true;
  }

  disableSingleInputScanOnlyInput() {
    // is this a single input form?
    if (this.dvmform.isSingleInputForm(this.dvmform.formControls) == false) {
      return
    }
    let inputIndex: number = this.dvmform.indexOfFirstInputField(this.dvmform.getFormControls())
    let theInput: any = this.dvmform.formControls[inputIndex]
    if (theInput.attributes.validation == '6') {
    }
  }

  setInputControlValue(index: number, val: string) {
    this.dvmform.formControls[index].value = val
  }

  /**
   * Disable the browser back button so that the only way to move away from the dynamic form 
   * page is hitting the toolbar back button.
   * 
   */
  disableBrowserBackButton()
  {
    history.pushState( null, null, location.href)
    window.onpopstate = function(){
      history.go(1)
    }
  }

  alertDisplay(ts: string, st: string, msg: string) {
    console.log("@@@ home.ts config_unspecified(): ");
      let alert = this.alertCtrl.create({
        title: ts,
        subTitle: st,
        message: msg,
        buttons:
          [
            { text: 'OK', role: 'cancel' }
          ]
      });
      alert.present();
   }
  
} // class
