import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//
import { CfgProvider } from '../../providers/cfg/cfg';
import { CordovaProvider } from '../../providers/cordova/cordova'
import { Defines } from '../../common/defines'


/*
  This provider class is responsible for maintaining the communication information
  about the server and building the appropriate REST calls sent to the server.
  When a page/moudule makes a request it will call a method in theis class
  associated with the function it is trying to perform, such as login(), logout()), etc.
  
  This method will set the appropriate parameters and make the appropriate request (GET, PUT, etc)grep 
  and return an observable object to the caller. The caller then can attach the methods that handle
  the success, error, and completion events and process these events in its own module.
  This provider will not need to know the internals of the callers processing.
*/

@Injectable()
export class DvrestProvider {

    url_root: string = ""
    poller: any = null
    lastPollTime: number = 0       // save last poll time to use for not sending subsequent polls prematurely
    def: Defines = new Defines()
    private messageSource = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();

    constructor(public http: Http, private cfg: CfgProvider, public cordova: CordovaProvider) {
        console.log("DvrestProvider constructor()")
    }

    getHeaders() {
        let headers: Headers = new Headers()
        headers.append('Content-Type', 'application/json');   // works for POST
        return headers
    }

    // #### login_post is not used since we made the login page a form ####
    // login_post(): Observable<any> {
    //     let userid = (null == window.localStorage.getItem(this.def.DEF_KEY_USERID)) ? "" : window.localStorage.getItem("userid")
    //     let token = (null == window.localStorage.getItem(this.def.DEF_KEY_TOKEN)) ? "" : window.localStorage.getItem("token")
    //     let newToken = (null == window.localStorage.getItem(this.def.DEF_KEY_NEWTOKEN)) ? "" : window.localStorage.getItem("newToken")
    //     let confirmToken = (null == window.localStorage.getItem(this.def.DEF_KEY_CONFIRMTOKEN)) ? "" : window.localStorage.getItem("confirmToken")

    //     // TODO: determine the device type from CORDOVA or something!!!
    //     let deviceTypeStr: string = this.cfg.getDeviceType()

    //     let postParms = { userid: userid, token: token, newToken: newToken, confirmToken: confirmToken, deviceType: deviceTypeStr }
    //     let options = new RequestOptions({ headers: this.getHeaders() })
    //     let url_target = this.url_root + "auth/login"
    //     let observable = this.http.post(url_target, postParms, options)
    //     // this.cfg.setLastMsgTime()
    //     this.initPolling()
    //     return observable
    // }

    logout_post(): Observable<any> {
        let postParms = { userid: this.getUserID() }
        let options = new RequestOptions({ headers: this.getHeaders() })
        let url_target = this.url_root + "auth/logout"
        let observable = this.http.post(url_target, postParms, options)
        window.localStorage.clear();
        this.stopPolling()

        return observable
    }

    requestForm_get(id: string): Observable<any> {
        let options = new RequestOptions({ headers: this.getHeaders() })
        let devType: string = this.cfg.getDeviceType()
        let url_target = this.url_root + "form?id=" + id.trim() + "&" + this.def.DEF_KEY_DEVICETYPE + "=" + devType.trim()
        let observable: Observable<any> = null;
        observable = this.http.get(url_target, options)
        return observable
    }

    submitForm_post(result: string): Observable<any> {
        let options = new RequestOptions({ headers: this.getHeaders() })
        let url_target = this.url_root + "form/submit"
        let postParms = JSON.parse(result)
        let observable = this.http.post(url_target, postParms, options)
        return observable
    }

    poll_post() {

        let pollInfoStr: string = window.localStorage.getItem(this.def.DEF_KEY_POLLINFO)
        if (!pollInfoStr) {
            pollInfoStr = '{ "deviceID" : "","deviceType" : "PC","user": "ibm","time" : ' + new Date().getTime() + '}'
        }
        let pollInfoObj = JSON.parse(pollInfoStr)
        pollInfoObj = {
            deviceID: "",
            deviceType: this.cfg.deviceParms[this.def.DEF_KEY_DEVICETYPE],
            user: this.getUserID(),
            time: new Date().getTime()
        }

        window.localStorage.setItem(this.def.DEF_KEY_POLLINFO, JSON.stringify(pollInfoObj))
        let options = new RequestOptions({ headers: this.getHeaders() })
        let url_target = this.url_root + "auth/poll"
        this.lastPollTime = (new Date()).getTime()
        console.log(">>> dvrest.ts poll_post() sending form POST at: " + this.lastPollTime)
        let observable = this.http.post(url_target, pollInfoObj, options)
        // this.cfg.setLastPollTime()
        observable.subscribe(
            (data) => {
                // console.log(" dvrest.ts submitForm_post() received response to poll: " + data["_body"])
            },
            (err) => {
            },
            () => {  // COMPLETED
            }
        )

    }

    /**
     * Send a message to be logged at the server side.
     * This code is uncommented only when debugging.
     */
    log_post(msg: string) {
        // if (msg) {
        //     let logObj = {
        //         logmsg: msg,
        //         time: (new Date().getTime()).toString()
        //     }
        //     let options = new RequestOptions({ headers: this.getHeaders() })
        //     let url_target = this.url_root + "log"
        //     let observable = this.http.post(url_target, logObj, options)
        //     observable.subscribe(
        //         (data) => {
        //             console.log(" dvrest.ts log_post() received response to poll: " + data["_body"])
        //         },
        //         (err) => {
        //         },
        //         () => {  // COMPLETED
        //         }
        //     )
        // }
    }

    getUserID(): string {
        let s: string = ""
        s = localStorage.getItem(this.def.DEF_KEY_USERID)
        return s
    }

    setUrlRoot(s: string) {
        this.url_root = s
        window.localStorage.setItem(this.def.DEF_KEY_URL_ROOT, s)
    }

    initPolling() {
        if (this.poller == null) {
            this.poller = Observable.interval(this.cfg.deviceParms.pollInterval).subscribe((data) => {
                this.pollEvent(this.poller)
            });
        }
    }

    pollEvent(poller) {
        // prevent sending polls to soon.
        // 90% of the configured polling interval must elapse before sending another poll  
        let diff = (new Date().getTime() - this.lastPollTime)
        if (diff >= this.cfg.deviceParms.pollInterval * 0.90) {
            this.poll_post()
        }
    }

    stopPolling() {
        this.poller.unsubscribe()
    }

    init_post(): Observable<any> {
        let deviceTypeStr: string = this.cfg.getDeviceType()
        let initParms = { deviceType: deviceTypeStr }
        let options = new RequestOptions({ headers: this.getHeaders() })
        let url_target = "http://localhost:9080/DVMobile/jaxrs/auth/init"
        let observable = this.http.post(url_target, initParms, options)
        this.initPolling()
        return observable
    }

} //class