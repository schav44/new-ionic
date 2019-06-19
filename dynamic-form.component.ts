//
import { Component, Input } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { App } from 'ionic-angular/components/app/app';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ViewChild } from '@angular/core';
//
import { FormProvider } from '../../providers/dynamic-form/dynamic-form';
import { FormControlBase } from '../../models/formcontrol-base'
import { DVMForm } from '../../models/formcontrol-dvmform'
import { DvrestProvider } from '../../providers/dvrest/dvrest';
import { CordovaProvider } from '../../providers/cordova/cordova';
import { ActionSheetController } from 'ionic-angular'
import { FooterComponent } from '../footer/footer'
import { Defines } from '../../common/defines'
//

@Component({
  selector: 'dynamic-form-comp',
  templateUrl: './dynamic-form.component.html'

})
export class DynamicFormComponent {

  def: Defines = new Defines()

  @Input() formControls: FormControlBase<any>[] = [];
  @Input() dvmform: DVMForm
  @Input() formGroup: FormGroup = new FormGroup({})

  @ViewChild('footer') myfooter: FooterComponent

  @Output() submitted = new EventEmitter<string>();   // Event to tell parent to submit form

  payloadObj: Object = {
    submitType: "",
    formGroupValues: ""
  }
  payload: string = ''  // stringified version of the payloadObj

  submitButtonType: String = ''  // [submit, cancel, ok, yes, no, any]
  butActionSheet = false

  constructionTime: number = -1
  private _datawedgeBarcodeListener: (event: any) => void


  constructor(public navCtrl: NavController, public app: App, private alertCtrl: AlertController,
    private cordova: CordovaProvider, public actionSheetCtrl: ActionSheetController,
    // private barcodeProvider: BarcodeProvider, 
    public events: Events,
    public forms: FormProvider, public dvrest: DvrestProvider
    // private cfg: CfgProvider
  ) {
    this.constructionTime = new Date().getTime()
    this.mylog(1, '@@@ constructor: DynamicFormComponent: ' + this.constructionTime);

    //Get the DView form definition it should be in localStorage
    let requestedFormStr: string = window.localStorage.getItem(this.def.DEF_KEY_REQUESTEDFORM)
    let requestedFormObj = JSON.parse(requestedFormStr)
    if (requestedFormObj) {
      if (requestedFormObj.status == this.def.DEF_STATUS_COMPLETED) {
        this.dvmform = new DVMForm(requestedFormObj.formDefinition)
        this.mylog(0, '@@@ constructor: DynamicFormComponent: dialogid' + this.dvmform.dialogid);
        this.formControls = this.dvmform.getFormControls()
        for (let entry of this.dvmform.formControls) {
          let formCtl: FormControl = new FormControl({ value: entry.value, disabled: false })
          this.formGroup.addControl(entry.id, formCtl)
          
        }
      }
      else {
        this.mylog(0, '@@@ constructor: dynamic-form.component.ts DynamicFormComponent COULD NOT FIND FORM IN LOCAL STORAGE !!!!!!: ');
      }
    }
    this.payload = ''


  }

  ngOnInit(): void {
    this.mylog(0, 'DynamicFormConponent: ngOnInit()...');
    this.events.unsubscribe('datawedge:scan', null)
    this._datawedgeBarcodeListener = undefined
    this.mylog(0, 'DynamicFormConponent: onPageWillLeave()... UNSUBSCRIBED LISTENER');

    if (!this._datawedgeBarcodeListener) {
      this._datawedgeBarcodeListener = (event) => {
        this.datawedgeBarcodeListener(event)
      }
      this.events.subscribe('datawedge:scan', this._datawedgeBarcodeListener)
      this.mylog(0, 'DynamicFormConponent: ngOnInit() ADDED LISTENER...');
    }
  }

  ionViewDidLoad() {
    this.mylog(1, '@@@ ionViewDidLoad: dynamic-form.component.ts');
  }

  mylog(flag, msg) {
    if (flag > 0) {
      console.log("DynamicFormComponent: " + msg)
    }
  }

  /**
   * Trims the leading and terminating blanks from the values entered into the form.
   * @param obj 
   * 
   */
  trimFromInputValues(obj: any): any {
    let rc: any = obj
    if (obj && obj.formGroupValues) {
      let keys: any = Object.keys(obj.formGroupValues)
      keys.forEach(element => {
        if (obj && obj.formGroupValues && obj.formGroupValues[element]) {
          obj.formGroupValues[element] = obj.formGroupValues[element].trim()
        }
      });
    }
    return rc
  }

  onSubmit(event) {
    // TODO: when enter is hit the form automaticatically submits and the payload is not filled with the submit type
    // ***   because a button has not been clicked. 
    this.mylog(0, "DynamicFormComponent: FORM on Submit : " + JSON.stringify(this.payload))
  }

  /**
  * EVENT HANDLER FUNCTION:
  * intended for a form-control originated emit() to call.
  * @param event 
  */
  onAutoSubmit(event: any) {
    this.mylog(0, "DynamicFormComponent: AUTOSUBMIT event: " + JSON.stringify(event))
    this.formGroup.get(event.id).setValue(event.value)
    this.onFormProcess(this.def.DEF_BUTTON_SUBMIT, null, null)
  }

  /**
  * EVENT HANDLER FUNCTION:
  * intended for a form-control list select emit() to call.
  * @param event 
  */
  receiveSelectedItem(event: string) {
    let inObj = JSON.parse(event)
    this.formGroup.get(inObj.id).setValue(inObj.value)
    this.onFormProcess(this.def.DEF_BUTTON_SUBMIT, null, null)
  }

  showPageID() {
    this.mylog(0, "DynamicFormComponent: showPageID(): ")
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'Screen/Device Info:',
      message:
        "Filename:  " + this.dvmform.filename
        + "<br/>Dialog ID: " + this.dvmform.dialogid
        + "<br/>Dialog Type:  " + this.dvmform.dialogType
        + this.cordova.getDeviceInfo()
      ,
      buttons:
        [
          { text: 'OK', role: 'cancel' }
        ]
    });
    alert.present();

  }

  hasFullListBoxControl() {
    let rc: boolean = false
    for (let entry of this.dvmform.formControls) {
      if (entry.type == this.def.DEF_CTL_FULLLISTBOX) {
        rc = true
        break
      }
    }
    return rc

  }

  onButtonPressed(parm: any) {
    this.mylog(1, "DynamicFormComponent: SUBMIT Type: " + parm.type)
    if (parm.type == this.def.DEF_SUBMITTYPE_ACTIONSHEET) {
      this.onFormProcess(parm.type, null, parm)
    }
    else {
      this.onFormProcess(parm.type, null, null)
    }
  }

  onFormProcess(type: string, event: any, actionSheetParms) {
    this.submitButtonType = type  // [submit, cancel, ok, yes, no, any]
    this.mylog(0, "DynamicFormComponent: SUBMIT Type: " + type)
    this.mylog(0, "DynamicFormComponent: SUBMIT PAYLOAD: " + JSON.stringify(this.payload))
    let localPayloadObj = {}
    if (type == this.def.DEF_SUBMITTYPE_ACTIONSHEET) {
      localPayloadObj = {
        submitType: type,
        formGroupValues: this.formGroup.value,
        actionValue: actionSheetParms.actionValue,
        swProcessorRC: actionSheetParms.swProcessorRC,
      }
    }
    else {
      localPayloadObj = {
        submitType: type,
        formGroupValues: this.formGroup.value
      }
    }

    this.payloadObj = localPayloadObj
    this.payloadObj = this.trimFromInputValues(this.payloadObj)

    this.payload = JSON.stringify(this.payloadObj)
    this.submitted.emit(this.payload)
  }

  /**
     * This function receives a barcode from the datawedge interface
     * 
     * @param ev  
     */

  datawedgeBarcodeListener(event) {

    console.log("DynamicFormComponent LISTENER TRIGGERED: " + new Date().getTime() + " event: " + JSON.stringify(event))

    // !!!! THIS WORKS FOR SINGLE INPUT FORMS ONLY !!!!
    let index = this.dvmform.indexOfFirstInputField(this.dvmform.formControls)
    // let control: any = this.dvmform.formControls[index]
    if (index > -1)    //got the index of the input forms only input field and set the value
    {
      this.dvmform.formControls[index].setValue(event.scannedData)
      this.formGroup.controls[this.dvmform.formControls[index].id].setValue(event.scannedData)
      // TODO Should we pass ev ??????????????????????????????????????????????????????????????
      let ev: any =
      {
        "id": this.dvmform.formControls[index].id
        , "value": event.scannedData
      }
      this.onFormProcess(this.def.DEF_BUTTON_SUBMIT, null, null)
    }
  }

  formComponentCommand(target: string, parm: string) {
    this.mylog(0, "formComponentCommand RECEIVED: " + target + " :" + parm);
    if (target == "footer") {
      this.myfooter.footerCommand(target, parm)
    }
  }

  // ngOnDestroy() {
  //   console.log(" DynamicFormComponent: ngOnDestroy ..........................................")
  // }

} // class