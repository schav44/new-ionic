
export class Gcol {

    id: string = ""
    description: string = ""
    value: string = ""  
    size: string = "auto"   // i.e: 50 for 50% of the grid width or auto
    cssStyle: any  = {}
    styleClass: string = "form_ctl_grid_header_col"
    
    constructor( parms: any = {} ) {
      // console.log( "Gcol constructor()...")  

      if (parms)
      {
        if (parms.id) this.id = parms.id
        if (parms.description) this.description = parms.description
        if (parms.value) this.value = parms.value
        if (parms.size) this.size = parms.size
        if (parms.cssStyle) this.cssStyle = parms.cssStyle
        if (parms.styleClass) this.styleClass = parms.styleClass

      }
      
    }
  
  
  }