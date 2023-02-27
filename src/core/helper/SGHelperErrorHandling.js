/**
* MAG Core Helper for Error and Handling
* manage error respon and handling error
* Message : 
* SG-A = Busy || unstable connection
* SG-B = fix data then try again (messages are using localize )
* SG-C = please call developer  
* SG-D = no Respone
* @format 
* @flow 
*/

import { SGBaseScreen } from "../screen/SGBaseScreen"
import {SGDialogBox} from "../../core/control/SGDialogBox"
import {SGHelperGlobalVar, SGHelperNavigation,SGHelperType} from "../../core/helper"
import {SGLocalize} from '../../visitor/locales/SGLocalize'
import {  mode } from '../../../app.json'
export class SGHelperErrorHandling extends SGBaseScreen{
  static errorMessage = {
    ID: {
        title: "Gagal",
        titleA:"Koneksi Gagal",
        messageA:"Sepertinya ada gangguan dengan koneksi internet kamu. Cek sinyal seluler atau wifi kamu lalu coba kembali yah.",
        messageB:"Ada kesalahan data, coba perbaiki data input",
        messageC:"Terjadi kesalahan di sistem, tolong email admin kami di contact@spotgue.com",
        messageD:"Server tidak merespon",
        messageUnauthorized:"Sesi anda telah habis, silahkan login lagi",
        messageForbidden:"Anda tidak memiliki izin untuk melakukan ini",
        messageNoInternetConnection:"Tidak ada koneksi internet",
        tryAgain:"Coba lagi",
        tryLater: "Nanti",
        OK:"OK",
    },
    EN: {
        title: "Fail",
        titleA:'Error Connecting Server',
        messageA:"Looks like there's a issue with your internet connection. Check your mobile signal or wifi and try again.",
        messageB:"There is something wrong in data, try to fix your input",
        messageC:"Something went wrong in the system, please email our admin at contact@spotgue.com",
        messageD:"Server is not responding",
        messageUnauthorized:"Your session has ended, you need to login again",
        messageForbidden:"You have no permission to do this action",
        messageNoInternetConnection:"No internet connection",
        
        tryAgain:"Try Again",
        tryLater: "Later",
        OK:"OK",

    },
    CN: {
      title: "失败",
      titleA:"连接服务器时出错",
      messageA:"看来你的互联网连接有故障了检查您的移动信号或 wifi，再试一次。",
      messageB:"数据有误，请尝试修正您的输入",
      messageC:"系统出了点问题，请给我们的管理员发送电子邮件至contact@spotgue.com",
      messageD:"服务器没有响应",
      messageUnauthorized:"您的会话已结束，您需要重新登录",
      messageForbidden:"您无权执行此操作",
      messageNoInternetConnection:"没有网络连接",
      tryAgain:"再试一次",
      tryLater: "之后",
      OK:"好的",

    }
}
static  _popUpError(type,callback){
    
    var language= SGHelperGlobalVar.getVar("GlobalLanguage") ? SGHelperGlobalVar.getVar("GlobalLanguage").toUpperCase() : "EN"
    var errorMessage=this.errorMessage
    console.log('A')
    console.warn(type)
    if(type==='SG-A' || type==="The request timed out." || type==="Session Expired"){
      // SGDialogBox.showConfirmation(null, errorMessage[language].titleA,errorMessage[language].messageA ,
      //   errorMessage[language].tryLater, () => {  }, errorMessage[language].tryAgain, () => { callback() },true
      // )
       SGDialogBox.showWarning(null, errorMessage[language].titleA,errorMessage[language].messageA ,
        errorMessage[language].tryAgain, () => {callback()  },true
      )
    }else if(type.substring(0, 4)==='SG-B'){
      var localize = type.slice(9,type.length)
      console.log(callback);
      SGDialogBox.showWarning(null, errorMessage[language].title,SGLocalize.translate(localize) ,
        errorMessage[language].OK, () => { if(SGHelperType.isDefined(callback))callback() },true
      )
    }else if (type==='SG-C'){
        SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC +" " +(mode!=='live' ? type:""),
            errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.goBack(SGHelperGlobalVar.getVar("Navigation")) },true
        )

    }else if (type.substring(0, 4)==='SG-D'){
      var localize = type.slice(9,type.length)
      var message = JSON.parse(localize)
      SGDialogBox.showWarning(null, errorMessage[language].title,message[language] ,
        errorMessage[language].OK, () => {  },true
      )

    }else if(type==="ERROR: Unauthorized"){
        SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageUnauthorized ,
          errorMessage[language].OK, () => {  SGHelperNavigation.navigateReset(SGHelperGlobalVar.getVar("Navigation"),  SGHelperGlobalVar.getVar("SplashScreen")) },true
        ) 
    }
    else if(type==="ERROR: Forbidden token"){
      SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageForbidden ,
        errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.goBack(SGHelperGlobalVar.getVar("Navigation")) },true
      )
    }
    else if(type==="The Internet connection appears to be offline." ){
      SGDialogBox.showWarning(null, errorMessage[language].titleA, errorMessage[language].messageNoInternetConnection, errorMessage[language].tryAgain,
        () => { callback() }, false);
    }
    else{
      SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC +" " +(mode!=='live' ? type:""),
        errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.goBack(SGHelperGlobalVar.getVar("Navigation")) },true
      )
    }
  }
static  Handling(exception,callbackA,callbackB,showPopUpError=true,apiName){
    console.log(exception)
    console.log(apiName)
    if(showPopUpError){
      if(SGHelperType.isDefined(exception) ){
        if(SGHelperType.isDefined(exception.respInfo)){
          if(exception.respInfo.status===500  || exception.respInfo.status===417 ||exception.respInfo.status===501){
            var errorRes = JSON.parse(exception.data)
            var codeMessage = errorRes.respInfo.message.substring(0, 4)
            if(codeMessage==="SG-A"){
                console.log(errorRes.respInfo.message)
                this._popUpError(codeMessage,callbackA)
            }else if(codeMessage==="SG-B" || codeMessage==="SG-D"){
                console.log(errorRes.respInfo.message)
                this._popUpError(errorRes.respInfo.message,callbackB)
            }else if( codeMessage==="SG-C"){
              console.log(codeMessage)
              this._popUpError(codeMessage)
            }
            else{
              console.log("Unknown")
              console.log(errorRes)
    
              this._popUpError(exception.data)
            }
          }else{
            if(exception.respInfo.status===400)this._popUpError("Error: wrongDTO "+ apiName +" " + exception.data)
            else if(exception.respInfo.status===401)this._popUpError("ERROR: Unauthorized" )
            else if(exception.respInfo.status===403)this._popUpError("ERROR: Forbidden token")
            else if(exception.respInfo.status===440 && exception.data.includes("Session Expired"))this._popUpError("SG-A",callbackA)
            else{
              this._popUpError("Unexpected Error: "+exception.data)
            }
          }
        }else if(exception.message==="The Internet connection appears to be offline." ||exception.message=== "SG-A") this._popUpError(exception.message,callbackA) 
        else if(exception==="The request timed out.")this._popUpError(exception,callbackA) 
        else  this._popUpError("Unexpected Error: "+exception)
        
      }else  this._popUpError("Unexpected Error: "+exception)
    }
   

     
    
}

static  multiHandling(arrError,callback){
  var errorLevel = arrError[0]
  for(var i=1;i<arrError.length;i++){
    if(errorLevel< arrError[i])errorLevel= arrError[i]
  }
  if(errorLevel==="SG-A"){
    this._popUpError(errorLevel,callback)
  }else{
    this._popUpError(errorLevel)

    // this._popUpError(errorLevel,callback)
  }
}
static  getMultiError(exception,arrError){
  console.log('getMultiError')
  console.log(exception)
  var errorRes = JSON.parse(exception.data)
  var codeMessage = errorRes.respInfo.message.substring(0, 4)
  if(arrError.length===0)arrError.push(codeMessage)
  for(var i=0;i<arrError.length;i++){

    if(arrError[i]!==codeMessage){
      arrError.push(codeMessage)
      break;
    }
  }
}

  static   executeRespon(res){
      if(res.respInfo.status===200) {
        try {
        
          return JSON.parse(res.data)
        } catch (error) {
          return res.data
        }
      }
      if(res.respInfo.status===204) return res
      throw res
  }
}

