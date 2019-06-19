import { FormControlBase } from './formcontrol-base';

export class FullListboxControl extends FormControlBase<string> {
  public options: { id: string, value: string }[] = []; // te selection options for the listbox

  myselector: string = "ctl_fulllistbox" 

  constructor(parms: {} = {}) {
    super(parms);
    this.options = parms['options'] || [];

    // The following will always be hardcoded for this ontrol by design:
    this.attributes["enumBorder"] = "0"
    this.attributes["style"] = "0"

    // The following are default values, they can be overridden by for definitions
    if (!this.attributes["autoSelect"]) {
      this.attributes["autoSelect"] = "0"
    }
    if (!this.attributes["itemCssStyle"]) {
      this.attributes["itemCssStyle"] = ""
    }
    if (!this.attributes["itemStyleClass"]) {
      this.attributes["itemStyleClass"] = "form_" + this.myselector + "_item"
    }
    if (!this.attributes["cssStyle"]) {
      this.attributes["cssStyle"] = {}
    }
    if (!this.attributes["styleClass"]) {
      this.attributes["syleClass"] = "form_" + this.myselector
    }

    if (!this.attributes["statusLine"]) {
      this.attributes["statusLine"] = ""
    }
    if (!this.attributes["statusLineStyle"]) {
      this.attributes["statusLineStyle"] = ""
    }
    if (!this.attributes["statusLineClass"]) {
      this.attributes["statusLineClass"] = "form_" + this.myselector + "_statusLine"  // default class for status line
    }
    if (!this.attributes["statusCssStyle"]) {
      this.attributes["statusCssStyle"] = {}
    }
    if (!this.attributes["listBoxType"])  // can be text or button (default is text)
    {
      this.attributes["listBoxType"] = "text"
    }
    if (!this.attributes["widthPercentage"])  // a multiplier to modify the css width width
    {
      this.attributes["widthPercentage"] = "100"
    }
    if (!this.attributes["heightPercentage"])  // a multiplier to modify the css width height 
    {
      this.attributes["heightPercentage"] = "100"
    }

    if (!this.attributes["classWidth"])       
    {
      this.attributes["classWidth"] = "290"
    }
    if (!this.attributes["classHeight"])  
    {
      this.attributes["classHeight"] = "300"
    }


  }

  // getTabIndex() {
  //   return 1
  // }

  // getListboxCalculatedHeight(): number {
  //   let h = 300   // arbitrary default
  //   let pcnt = this.attributes["heightPercentage"]

  //     try {
  //       pcnt = Number(pcnt)
  //       pcnt = Math.abs(pcnt)
  //       h = Math.round((pcnt * Number(this.attributes["classHeight"]) ) / 100)
  //     }
  //     catch (ex) {
  //       console.log("FullListboxControl height Calculation exception" )
  //     }
  //   return h
  // }

  // getListboxCalculatedWidth(): number {
  //   let w = 290   // arbitrary default
  //   let pcnt = this.attributes["widthPercentage"]
  //     try {
  //       pcnt = Number(pcnt)
  //       pcnt = Math.abs(pcnt)
  //       w = Math.round((pcnt * Number(this.attributes["classWidth"]) ) / 100)
  //     }
  //     catch (ex) {
  //       console.log("FullListboxControl width Calculation exception" )
  //     }
  //   return w
  // }

  // getStyles() : any{

  //   let styles : {} = this.attributes["cssStyle"]  // preserve specified styles

  //   if ( !styles["width"] )
  //   {
  //     styles["width"] =  this.getListboxCalculatedWidth().toString()+ "px"
  //   }
  //   if ( !styles["height"] )
  //   {
  //     styles["height"] =  this.getListboxCalculatedHeight().toString()+ "px"
  //   }
    
  //   return styles
  // }
  
  // getXWidth()
  // { 
  //   // <!-- style="overflow-x: scroll;" (from above)-->
  //   // let xwidth = 'width : 400px'
  //   return 
  // }

} // class