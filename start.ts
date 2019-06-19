import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Platform } from 'ionic-angular';
//
import { DvrestProvider } from '../../providers/dvrest/dvrest';
import { CfgProvider } from '../../providers/cfg/cfg';
import { FormProvider } from '../../providers/dynamic-form/dynamic-form';
import { CordovaProvider } from '../../providers/cordova/cordova';
import { DynamicFormPage } from '../dynamic-form/dynamic-form';
import { Defines } from '../../common/defines'

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  def: Defines = new Defines()

  requestedFormObj = {
    idRequested: "0"
    , status: this.def.DEF_STATUS_WAITING
    , formDefinition: {}
  }

  // TODO: MAKE LOGO IMAGE NAME COMPANY-SITE-CONFIGURABLE
  imageSrc: string = "assets/imgs/DViewDiamond.gif"

  imageH: number = 320

  obsForm: Observable<any> = new Observable()

  constructor( public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams, @Inject(DOCUMENT) private document: any,
    public dvrest: DvrestProvider, public cordova: CordovaProvider, private cfg: CfgProvider,
    private file: File, private alertCtrl: AlertController, public forms: FormProvider) {

  }

  initSuccess(data) {
    var jsonStr = data[this.def.DEF_KEY_BODY]
    // console.log("StartPage RESPONSE BODY DATA: " + JSON.stringify(jsonStr))
    console.log(">>>> StartPage RESPONSE RECEIVED login data: " + data)
    console.log(data.headers)
    try {
      var jsonObj = JSON.parse(jsonStr)
      var defClasses: any = {}
      if (jsonObj.rc == 0) {
        // save device configuration if passed
        if (jsonObj.body[this.def.DEF_KEY_CFG]) {
          this.cfg.updateDeviceCfg(jsonObj.body[this.def.DEF_KEY_CFG])
          defClasses = jsonObj.body.configuration[this.def.DEF_KEY_DEFAULTSTYLECLASSESS]
        }
        else {
          this.config_unspecified("")
        }
        this.setDefaultStyleClasses(defClasses)
        this.login_process()
      }
      else {
        jsonObj.msg = (null == jsonObj.msg) ? "" : jsonObj.msg
        this.login_failure(jsonObj.msg)
      }
    }
    catch (ex) {
      console.log("StartPage RESPONSE BODY DATA JSON parse exception: " + ex)
      this.alertDisplay("Message Error", "", "Received bad message format.\nCan't display the next page.")
      return
    }

  } // initSuccess

  createDefaultPlaceholderConfigurationFile(path: string, filename: string) {
    console.log("HomePage: Creating default placeholder device configuration file...")
    console.log("HomePage: Current file paths:")
    this.cfg.showDirectoryPathNames()
    console.log("HomePage: Trying to create file: " + path + filename)
    this.file.createFile(path, filename, false)

      .then(fileStr => {               // File created successfully
        let msg = "Created file: " + path + filename + ". Please edit file with appropriate values..."
        console.log("HomePage: " + msg)
        let st: string = "Configuration File Issue"
        // this.deviceConfigurationAlert(st, msg)
        this.alertDisplay("Configuration Error", st, msg)
      })
      .catch(exc => {                   // File create error
        let msg = "Could not create file: " + path + filename
        console.log("HomePage: " + msg)
        let st: string = "Configuration File Issue"
        // this.deviceConfigurationAlert(st, msg)
        this.alertDisplay("Configuration Error", st, msg)
      })

  }

  login_process() {
    // Request the first form
    let firstFormID: string = "0"
    this.requestedFormObj.idRequested = firstFormID
    this.requestedFormObj.status = this.def.DEF_STATUS_WAITING
    this.requestedFormObj.formDefinition = {}
    window.localStorage.setItem(this.def.DEF_KEY_REQUESTEDFORM, JSON.stringify(this.requestedFormObj))

    this.obsForm = this.forms.requestForm(firstFormID)
    this.obsForm.subscribe(
      (data) => {
        let inStr = data[this.def.DEF_KEY_BODY]
        let inObj = JSON.parse(inStr)  // full message body (rc, msg, body.formDefinition)
        inObj.body.formDefinition = this.forms.addMiscParmsToForm(inObj.body.formDefinition) // add Parms to formDefinition
        this.requestedFormObj.idRequested = firstFormID
        this.requestedFormObj.status = this.def.DEF_STATUS_COMPLETED
        this.requestedFormObj.formDefinition = inObj.body.formDefinition
        window.localStorage.setItem(this.def.DEF_KEY_REQUESTEDFORM, JSON.stringify(this.requestedFormObj))
        console.log("@@@ dynamic-form.ts GOT FORM DEFINITION...: WILL REFRESH PAGE")
      },
      (err) => {
        // console.log('@@@ FormProvider Provider requestForm() ERROR: ' + err);
      },
      () => {  // COMPLETED
        this.navCtrl.push(DynamicFormPage)
      }
    )
  }

  setDefaultStyleClasses(classes: string) {
    if (!classes) {
      this.alertDisplay("Stylesheet error", "", "Can't display page stylesheets.")
    }
    else {
      this.document.head.innerHTML = this.document.head.innerHTML + classes
      this.cfg.saveCssParms(classes)
    }

  }

  config_unspecified(msg) {
    console.log("@@@ StartPage config_unspecified(): " + msg);
    let alert = this.alertCtrl.create({
      title: 'Configuration',
      subTitle: 'Missing Device Configuration!',
      message: 'Please define appropriate DVMobile.json device file.',
      buttons:
        [
          { text: 'OK', role: 'cancel' }
        ]
    });
    alert.present();
  }

  login_failure(msg) {
    console.log("@@@ StartPage login_failure(): " + msg);
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: 'Error:',
      message: msg,
      buttons:
        [
          { text: 'OK', role: 'cancel' }
        ]
    });
    alert.present();
  }

  alertDisplay(ts: string, st: string, msg: string) {
    console.log("@@@StartPage config_unspecified(): ");
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

  onStart(event) {
    console.log("StartPage: onStart event...")
    if (!this.cordova.isCordova())   // browser mode gets url from address
    {
      this.onStart_browser()
    }
    else {
      this.platform.ready().then((readySource) => {
        this.onStart_cordova()
      } )
    }
  }

  /**
   * We are starting to run in Browser Mode.
   * Determine host URL, device type and save them.
   */
  onStart_browser() {
      let url_root: string = window.location.protocol + "//"
       + window.location.hostname + ":"
      + window.location.port + "/"
      + "DVMobile/jaxrs/"

    this.dvrest.setUrlRoot(url_root)
    let type: string = this.cfg.getDeviceTypeFromURL()
    console.log("StartPage:onStart_browser url_root: " + url_root)
    console.log("StartPage:onStart_browser deviceType: " + type)
    this.cfg.setDeviceType(type)

    this.contactHost()
  }

  contactHost() {
    let observable = this.dvrest.init_post()
    observable.subscribe(
      data => {
        this.initSuccess(data)
      }
      ,
      err => {
        // this.initError(err)
        this.alertDisplay("Message Error", "", err)
      }
      ,
      () => {
        // this.initComplete()
      })

  }

  onStart_cordova() {
    console.log("StartPage onStart_cordova...")
    this.getHostURLFromCfgFile()
  }

  getHostURLFromCfgFile() {
    let hostURL: string = null

    // this is a cordova app so read it from the cfg file
    this.cfg.showDirectoryPathNames()
    let path = this.file.externalDataDirectory
    let filename: string = 'DVMobile.json'
    console.log("StartPage: Using Configuration filename=" + path + filename)

    let errTitle = "Configuration Error:"
    let msg = path + filename
    let st = ""

    this.file.checkFile(path, filename).then(
      _ => {                        // File found
        console.log("StartPage: then checkfile...")
        this.file.readAsText(path, filename)
          .then(fileStr => {               // File read successfully
            console.log("StartPage: then readAsText...")
            try {
              let obj: any = JSON.parse(fileStr)
              if (obj) {
                if (obj.urlroot) {
                  this.dvrest.setUrlRoot(obj.urlroot)
                }
                else {
                  // ERROR:
                  st = "Can't get URL from Configuration."
                  this.alertDisplay(errTitle, st, msg)
                  return
                }
                if (!obj.devicetype) {
                  obj.devicetype = this.def.DEF_PARM_DEFDEVICE
                }
                this.cfg.setDeviceType(obj.devicetype)
                console.log("StartPage:onStart_browser url_root: " + obj.urlroot)
                console.log("StartPage:onStart_browser deviceType: " + obj.devicetype)
                console.log("StartPage: calling contactHost()...")
                this.contactHost()
              }
              else {
                // ERROR:
                st = "Can't get Configuration from File."
                this.alertDisplay(errTitle, st, msg)
                return
              }
              // this.login_process()
            }
            catch (ex1) {
              let st: string = "Configuration File Format/Parse Error:"
              // let msg: string = path + filename
              // this.deviceConfigurationAlert(st, msg)
              this.alertDisplay(errTitle, st, msg)
            }

            // this.contactHost()

          })
          .catch(exc => {                   // File read error
            let st: string = "Configuration File Read Error:"
            // let msg: string = path + filename
            // this.deviceConfigurationAlert(st, msg)
            this.alertDisplay(errTitle, st, msg)
          })
      })
      .catch(err => {                     // File not found
        let st: string = "Missing Configuration file:"
        // let msg: string = path + filename
        // this.deviceConfigurationAlert(st, msg)
        this.alertDisplay(errTitle, st, msg)
        this.createDefaultPlaceholderConfigurationFile(path, filename)
        this.alertDisplay("", "Created default place holder file: Please edit :", path + filename)
      });

  }




} // class
