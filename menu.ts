import { ActionSheetController } from 'ionic-angular'
import { Component } from '@angular/core';
import { PageMenu } from "../../models/page-menu";

@Component({
  selector: 'pagemenu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  dvMenu: PageMenu;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  public menuOptions = {  
    "formDefinition":{  
       "dialogType":"XMLFile",
       "dialogid":"SWMenu",
       "footerFormControls":[  
          {  
             "actionsheet":{  
                "buttons":[  
                   {  
                      "value":"cancel",
                      "cssClass":"",
                      "role":"destructive",
                      "icon":"",
                      "text":"Cancel",
                      "swProcessorRC":"4"
                   }
                ],
                "enableBackdropDismiss":"true",
                "cssClass":"",
                "subTitle":"",
                "title":"Unplanned Operation"
             },
             "type":"ctl_ActionSheet",
             "id":"FooterActionSheet"
          }
       ],
       "attributes":{  
       },
       "title":{  
          "value":"Inbound",
          "attributes":{  
 
          },
          "type":"title",
          "id":"Title",
          "order":"0"
       },
       "formControls":[  
          {  
             "defaultValue":"",
             "value":"SW_ScanWAIO",
             "selectItems":[  
                {  
                   "value":"SW_ScanWAIO",
                   "description":"Scan WA or IO"
                },
                {  
                   "value":"PUT_UserDirected",
                   "description":"User Directed"
                },
                {  
                   "value":"PUT_MultiContainerDirected",
                   "description":"Multi Ctr Putaway"
                },
                {  
                   "value":"IB_PrintContainerRoutingLabel",
                   "description":"Prt Contr Rt Label"
                },
                {  
                   "value":"IB_ViewContainerRouting",
                   "description":"View Contr Routing"
                },
                {  
                   "value":"IB_BuildPutPallet",
                   "description":"Build Put Pallet"
                },
                {  
                   "value":"IB_CheckInTask",
                   "description":"Check In Task"
                },
                {  
                   "value":"IB_LocAdminScanBarcode",
                   "description":"Location Admin"
                },
                {  
                   "value":"IB_RequestTasksByContainer",
                   "description":"Request Tasks"
                }
             ],
             "saveValue":"true",
             "updatable":"true",
             "attributes":{  
                "style":"0",
                "autoSelect":"0",
                "enumBorder":"1",
                "cssStyle":{  
                   "background-color":"#e7f9c7"
                }
             },
             "type":"ctl_fulllistbox",
             "id":"Operation",
             "order":"1",
             "required":"true"
          }
       ],
       "pagemenu":{  
          "content":[  
             {  
                "value":"cancel",
                "text":"Cancel"
             },
             {  
                "value":"option1",
                "text":"Option #1"
             },
             {  
                "value":"option2",
                "text":"Option #2"
             },
             {  
                "value":"option3",
                "text":"Option #3"
             }
          ],
          "enabled": true,
          "persistent": true,
          "title":"My Page Menu",
          "side":"left",
          "swipeEnabled": true,
          "type":"overlay",
          "maxEdgeStart": 50,
          "id":"PageMenu1"
       }
    }
 } 

  constructor(public actionSheetCtrl: ActionSheetController) {
    console.log('Hello MenuComponent Component');
    this.dvMenu = this.menuOptions.formDefinition.pagemenu;
    console.log(this.dvMenu);
  }
} // class


