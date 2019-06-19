import { MenuItem } from "./menu-item";

export class PageMenu
{
   title: string = ""            // Menu title
   enabled:boolean = false        //If  true, the menu is enabled. Default true.
   id: string = ""               // An id for the menu.
   persistent:boolean = false    // If true, the menu will persist on child pages.
   side:string = "left"          // Which side of the view the menu should be placed. Default "left".
   swipeEnabled:boolean =  false  // If true, swiping the menu is enabled. Default true.
   type:string = "overlay"       // The display type of the menu. Default varies based on the mode, see the menuType in the config. Available options: "overlay", "reveal", "push".
   maxEdgeStart: number = 50     //The edge threshold for dragging the menu open. If a drag/swipe happens over this value, the menu is not triggered.
   content: MenuItem []     // A reference to the content element the menu should use.
        // A reference to the content element the menu should use.
}