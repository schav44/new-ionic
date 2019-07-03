

import { FormControlBase } from './formcontrol-base';
import { Gcol } from '../models/gcol'
import { Grow } from '../models/grow'

export class Dvmgrid extends FormControlBase<string> {

  id: string = ""
  type: string = "ctl_grid"
  value: string = ""
  attributes: any = {}
  saveValue: string = ""
  defaultValue: string = ""
  autoSubmit: string = "1"    // "0"= don't auto submit when cell clicked,  anything else=autosubmit.
  saveValueType: string = "cell"    // cell= return cell value, row= return row as value

  /*
   a grid is an array of Grows,
   a Grow contains row attributes and an array of Gcols
  */
  rows: Array<Grow> = []     // where each element is a Grow
  headers: Array<Gcol> = []
  showHeader: string = "1"        // "1" show header, anything else = don't show
  gridFrameCssStyle: any = {}

  constructor(obj: any = {}) {
    super(obj);

    if (obj.id) this.id = obj.id
    if (obj.showHeader) this.showHeader = obj.showHeader
    if (obj.rows) this.rows = obj.rows
    if (obj.headers) this.headers = obj.headers
    if (obj.autoSubmit) this.autoSubmit = obj.autoSubmit
    if (obj.saveValueType) this.saveValueType = obj.saveValueType

    // this.mockInit()
  }



  mockInitHeader(nrow: number, ncol: number) {
    // init grid heheaders
    let NO_COLS = ncol
    // let NO_ROWS = nrow

    // let headerCols: Array<Gcol> = []
    let mysize = "auto"
    let tmpCols: Array<Gcol> = []
    // let tmpRow: Grow = new Grow({})

    for (let c = 0; c < NO_COLS; c++) {
      let aColobj = {
        id: c.toString()
        , description: "HDR: " + c.toString()
        , value: "c.toString()"
        , size: mysize
        , cssStyle: {}
        , styleClass: "form_ctl_grid_header_col"
      }
      tmpCols.push(aColobj)
      this.headers = tmpCols
    }

  }

  /**
* This methods filheadersock data that can be used for testing.
*/

  mockInit() {
    let NO_COLS = 3
    let NO_ROWS = 4

    // init grid heheaders
    this.mockInitHeader(NO_ROWS, NO_COLS)
    this.mockInitRows(NO_ROWS, NO_COLS)

    console.log("Dvmgrid: grid definition:")
    console.log(JSON.stringify(this))
  }

  mockInitRows(nrow: Number, ncol: number) {
    let NO_COLS = ncol
    let NO_ROWS = nrow

    let mysize = "auto"
    let tmpRow: Grow = new Grow({})
    let tmpCols: Array<Gcol> = []

    for (let r = 0; r < NO_ROWS; r++) {
      for (let c = 0; c < NO_COLS; c++) {
        let aColobj = {
          id: c.toString()
          , description: "R: " + r.toString() + "C" + c.toString()
          , value: c.toString()
          , size: mysize
          , cssStyle: {}
          , styleClass: "form_ctl_grid_col"
        }
        tmpCols.push(aColobj)
      } // end for columns

      tmpRow = new Grow({
        id: 'row' + r.toString()
        , value: 'rowValue' + r.toString()
        , cols: tmpCols
        , styleClass: "form_ctl_grid_row"
      })
      this.rows.push(tmpRow)
      tmpCols = new Array<Gcol>()

    } // end for row

  }

  /**
  * Returns a boolean indicating that a header is present or absent.
  */
  hasHeader(): boolean {
    let rc = false
    if (this.headers && this.headers && this.headers.length > 0) {
      rc = true
    }
    return rc
  }

  /**
 * Determines wheter or not a header should be displayed
*/
  displayHeader(): boolean {
    let rc = false
    if (this.hasHeader() && this.showHeader == "1") {
      // it has a header and it can be displayed
      rc = true
    }
    else {
      // no header given
      rc = false
    }
    return rc
  }


  /**
    *  Gets the row in the grid that has a matching rowid.
    * @param rowid
    */
  getRowByID(rowid: string) {
    // let id: string = ""
    let row: Grow = null

    if (rowid == "") return row
    for (let i = 0; i < this.rows.length; i++) {
      if (rowid == this.rows[i].id) {
        row = this.rows[i]
      }
    }
    return row
  }


  /**
   * Get the Gcol object from the grid using the speciied rowid and colis.
   * @param rowid 
   * @param colid 
   */
  getColByRowColIDs(rowid: string, colid: string) {
    // let id: string = ""
    let col: Gcol = null
    let row: Grow = null

    if (colid == "") return col

    row = this.getRowByID(rowid)
    if (row) {
      col = this.getColFromRowByID(row, colid)
    }

    return col
  }

  /**
  * Get the specied column by id from the specified Grow
  * 
  * @param row 
  * @param colid 
  */
  getColFromRowByID(row: Grow, colid: string) {
    let col: Gcol = null
    if (!Grow) return col
    if (colid == "") return col

    for (let i = 0; i < row.cols.length; i++) {
      if (colid == row.cols[i].id) {
        col = row.cols[i]
      }
    }
    return col
  }

  /**
   * Call back function for row click in the body
   * @param aRow 
   */
  onRowClick(rowid) {

    let aRow: Grow = this.getRowByID(rowid)
    console.log("DvmgridComponent ROW CLICKED: " + JSON.stringify(rowid) + " value=" + aRow.value)
    // get the value of the row clicked
    let val: string = ""
    let row: Grow = this.getRowByID(rowid)
    if (row) {
      val = row.value
    }
    // console.log("DvmgridComponent ROW VALUE: " + val)

    return val

  }


  /**
     * 
     * Returns a a cssStyle object by combining the cssStyle coming from the
     * form defition with the flex attribute generated locally based on the size specified
     * for the  row/column cell.
     * 
     * * @param colid 
     */
  getHeaderColStyleByID(colid: string): any {

    // let col: any = {}
    let obj: any = {}

    if (this.headers) {
      for (let i = 0; i < this.headers.length; i++) {
        if (colid == this.headers[i].id) {
          if (this.headers[i].cssStyle) {
            obj = this.headers[i].cssStyle
          }

          if (this.headers[i].size) {
            if (this.headers[i].size == "0" || this.headers[i].size == "" || this.headers[i].size.toLowerCase() == "auto") {
              // col.size = "auto"
            }
            else {
              obj.flex = "0 0 " + this.headers[i].size + "%" // ie: 'flex': '0 0 60%'
            }

          }
          break
        }

      }
    }
    //console.log ( "Header Col style for id: "+ colid+ " is: " + JSON.stringify(obj) )
    return obj
  }

  /** 
     * Returns a CSS style object that is assigned to the specified cell at the row and column.
     * The CSS style object will be augmented with flex attributes for proper sizing
    */
  getStyleObjectForRowColID(rowid: string, colid: string): any {
    let col: Gcol = null
    let obj: any = null

    col = this.getColByRowColIDs(rowid, colid)
    if (col) {
      obj = {}
      if (col.cssStyle) {
        // set to the col style
        obj = col.cssStyle
      }
      // add flex attribute
      if (col.size == "0" || col.size == "" || col.size.toLowerCase() == "auto") {
        // col.size = "auto"
      }
      else {
        obj.flex = "0 0 " + col.size + "%" // ie: 'flex': '0 0 60%'
      }


    }

    //console.log ( "Body Col style: colid: "+ colid + " is " + JSON.stringify(obj) )
    return obj
  }



} // class
