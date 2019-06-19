import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
//
import { DvrestProvider } from '../../providers/dvrest/dvrest';
import { CfgProvider } from '../cfg/cfg';
import { Defines } from '../../common/defines'

@Injectable()
export class FormProvider {

  def: Defines = new Defines()

  requestedFormObj =
    {
      idRequested: ""
      , status: "waiting"
      , formDefinition: {}
    }

  constructor(public dvrest: DvrestProvider, private cfg: CfgProvider) {
    console.log("FormProvider constructor()")
  }

  requestForm(id: string) {
    //console.log('@@@ FormProvider Provider requestForm() id=' + id);
    this.requestedFormObj.idRequested = id
    this.requestedFormObj.status = this.def.DEF_STATUS_WAITING
    let observable: Observable<any> = this.dvrest.requestForm_get(id)   //FIRST TIME GET - SUBSEQUENT POST AND WAIT FOR RESPONSE
    return observable
  }

  submitForm(result: string) {
    //console.log('@@@ FormProvider Provider submitForm() result=' + result);
    let observable: Observable<any> = this.dvrest.submitForm_post(result)
    return observable
  }


  /**
   * Adds the miscParms object to the form definition.
   * These are parameters that don't come from the server with the form definition but
   * are parameters that are needed when processing the form.
   * @param obj 
   */
  addMiscParmsToForm(obj: {}) {
    let miscParms: {} = {}
    if (obj) {
      miscParms[ this.def.DEF_KEY_CLASSWIDTH] = this.cfg.defFullListboxWidth
      miscParms[this.def.DEF_KEY_CLASSHEIGHT] = this.cfg.defFullListboxHeight
      obj[this.def.DEF_KEY_MISCPARMS] = miscParms
    }
    return obj

  }

} // class


