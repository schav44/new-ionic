
import { Gcol} from './gcol'

/**
 * This class represents a row in a grid.
 * The row is an array of cells of Gcol objects.
 */
export class Grow {

  id: string = ""
  cols: Array <Gcol> = []
  value: ""
  cssStyle: any  = {}
  styleClass: string = "form_ctl_grid_header_row"


  
  constructor( obj: any ) {
  // console.log( "Grow constructor()...")
  if ( obj.id) this.id = obj.id
  if ( obj.value) this.value = obj.value
  if ( obj.styleClass) this.styleClass = obj.styleClass
  if ( obj.cssStyle) this.cssStyle = obj.cssStyle
  if ( obj.cols) this.cols = obj.cols
  }


} // class