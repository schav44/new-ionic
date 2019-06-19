
export class UserInputParms {


  type: string = ""
  swProcessorRC: number = 0
  actionValue: string = ""

  /**
   * Represents a structure that is filled by different input sources.
   * Button Pressed, ActionSheet action selection.
   */
  constructor(obj: any) {
    this.type = (obj.type) ? obj.type : ""
    this.swProcessorRC = (obj.swProcessorRC) ? obj.swProcessorRC : 0
    this.actionValue = (obj.actionValue) ? obj.actionValue : ""
  } // constructor


} // class