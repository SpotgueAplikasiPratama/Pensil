import React from 'react';
import { SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperNavigation,SGHelperOneSignal } from '../helper';
import { Dimensions, Platform, Animated, Linking } from 'react-native';
import { SGBaseControl } from '../control/SGBaseControl';
import { SGDialogBox } from '../control/SGDialogBox';
import {SGLocalize} from '../../visitor/locales/SGLocalize'
import RNExitApp from 'react-native-exit-app';

import {  mode } from '../../../app.json'
export class SGBaseScreen extends SGBaseControl {
  

  /**
   * Base class for screen object. Able to get window component by accessing property .WHP
   * @param {*} props 
   * @param {*} context 
   * @param  {...any} args 
   */
   constructor(props, context, ...args) {
    super(props, context, ...args);
    this._whp = SGHelperWindow.getWHP();
    this._whpNoHeader = SGHelperWindow.getWHPNoHeader();
    this._language = SGHelperGlobalVar.getVar('GlobalLanguage');
    // this.props.navigation.setOptions({
    //   headerShown: false,
    // });
    this._baseAnimY = new Animated.Value(0);
    this._baseLastY = 0;
    this._baseFlag = true;
    this._baseIsAnimating = false;
    this._baseIsMomentumScroll = false;
    // this._shareMessage=false;
    this._deepLinkingHandlerPushNotification = null;
    this._deepLinkingHandlerShareMessage = null;
    this._pushNotification = false;
    this._shareMessage = false;
    this._canGoBack = SGHelperNavigation.canGoBack(this.props.navigation);    
    this._baseAnimVar = new Animated.Value(0);
  }

  clearDeepLinking(){
    if (!this._canGoBack) {
      SGHelperOneSignal.clearHandlers()
      Linking.removeListener('url', () => { })
    }
  }

  setDeepLinking(){
    if (!this._canGoBack) {
      console.log2('setDeepLinking')
      console.log('canGoBack')
      if(SGHelperGlobalVar.isVar('deepLinkingURL')){
        var url = SGHelperGlobalVar.getVar('deepLinkingURL')
        this._pushNotification = url.includes(SGHelperGlobalVar.getVar('UriScheme1')) ? true:false
      }
     
      SGHelperOneSignal.setNotificationOpenedHandler( n => {      
        /* ByGH do nothing, already handled by Linking listener*/

        // if (!SGHelperGlobalVar.isVar('deepLinkingURL')) {
        //   SGHelperGlobalVar.addVar('deepLinkingURL', n.notification.launchURL)
        // }
        // else {
        //   SGHelperGlobalVar.setVar('deepLinkingURL', n.notification.launchURL)
        // }
        // if (this._deepLinkingHandlerPushNotification !== null) {
        //   this._deepLinkingHandlerPushNotification();
        // }
      });

      Linking.removeAllListeners('url');
      Linking.addEventListener('url', ((u) => {
        if (!SGHelperGlobalVar.isVar('deepLinkingURL') && !this._pushNotification) {
          console.log('a')
          SGHelperGlobalVar.addVar('deepLinkingURL', u.url)
        }
        else if (!this._pushNotification) {
          console.log('b')
          SGHelperGlobalVar.setVar('deepLinkingURL', u.url)
        }
        if (this._deepLinkingHandlerShareMessage !== null && !this._pushNotification) {
          console.log('c')
          this._deepLinkingHandlerShareMessage(u.url);
          this._pushNotification = false;
        }
      }).bind(this));
    }
  }

  baseCreateAnimation(duration, onEnd) {
    this._baseAnimVar.setValue(0);
    Animated.timing(this._baseAnimVar, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false
    }).start((res) => {
      if (onEnd) { onEnd(); }
    });
  }

  componentWillUnmount() {
  }

  baseAnimateSlideOut() {
    if (!this._baseIsAnimating) {
      this._baseIsAnimating = true;
      Animated.timing(this._baseAnimY, {
        toValue: -1,
        duration: 200,
        useNativeDriver: false
      }).start((res) => {
        this._baseIsAnimating = false;
        this._baseFlag = false;
        this.forceUpdate();
      });
    } else {
      //
    }
  }

  baseAnimateSlideIn() {
    if (!this._baseIsAnimating) {
      this._baseIsAnimating = true;
      Animated.timing(this._baseAnimY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start((res) => {
        this._baseIsAnimating = false;
        this._baseFlag = true;
        this.forceUpdate();
      });
    } else {
      //
    }
  }

  baseOnScrollHandler(v) {
    // console.log(this._baseFlag)
    var h = SGHelperWindow.getWHPNoHeader().h;
    var y = v.nativeEvent.contentOffset.y;
    if (this._baseFlag && y > (SGHelperWindow.getHeaderHeight()) * 1.1 && !this._baseIsAnimating && y > this._baseLastY) {
      this.baseAnimateSlideOut();
    }
    else if (!this._baseFlag && y > (SGHelperWindow.getHeaderHeight()) * 1.1 && !this._baseIsAnimating && this._baseLastY > y) {
      this.baseAnimateSlideIn();
    } else if (!this._baseFlag && y < (SGHelperWindow.getHeaderHeight()) * 0.9 && !this._baseIsAnimating) {
      // this.baseAnimateSlideIn();
    }
    this._baseLastY = y;
  }
  baseOnScrollEndDragHandler(v) {
    var y = v.nativeEvent.contentOffset.y;
    this._baseLastY = y;
  }
  baseOnMomentumScrollBeginHandler(v) {
    this._baseIsMomentumScroll = true;
  }
  baseOnMomentumScrollEndHandler(v) {
    this._baseIsMomentumScroll = false;
    var y = v.nativeEvent.contentOffset.y;
    this._baseLastY = y;
  }

  isAllowed(fTaskType, userAccessRight, fTaskSubType = "Maker") {
    for (var i = 0; i < userAccessRight.length; i++) {
      if (userAccessRight[i].fTaskType === fTaskType && userAccessRight[i].fTaskSubType === fTaskSubType) {
        return true;
      }
    }
    return false;
  }

  getAllGlobalVar(app) {
    this.userData = SGHelperGlobalVar.getVar('dataUser')
    this.userDataApp = SGHelperGlobalVar.getVar(app)
    this.userAccessRight = SGHelperGlobalVar.getVar('userAccessRight')
    this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    this.imageSetting = this.userData.fImageSetting !== '' ? this.userData.fImageSetting : 'low'
    this.cardImageSetting = this.userData.fImageSetting !== '' ? 'thumbnail' + this.imageSetting.charAt(0).toUpperCase() + this.imageSetting.slice(1) : 'thumbnailLow'
    this.photoProfile = this.userData.fImageProfileJSON[0][this.imageSetting].uri
    this.GMTValue = SGHelperType.isDefined(this.userDataApp.fGMTValue)? this.userDataApp.fGMTValue:7
  }
  /**
   * 
   * @param {*} FunctionDAOName tbUserDAO.getGlobalVarUser
   * @param {*} email this.userData.fEmail
   * @param {*} fID this.userDataApp.fID
   * @param {*} userDataApp userDataBuilding/userDataStore
   */
  setGetAllGlobalVar(FunctionDAOName, email, fID, userDataApp) {
    var globalVar = FunctionDAOName(email, fID)
    globalVar.dataUser.fLanguage = this._language
    if (SGHelperGlobalVar.isVar('dataUser') && SGHelperGlobalVar.isVar('userAccessRight') && SGHelperGlobalVar.isVar(userDataApp)) {
      SGHelperGlobalVar.setVar('dataUser', globalVar.dataUser)
      SGHelperGlobalVar.setVar(userDataApp, globalVar[userDataApp])
      SGHelperGlobalVar.setVar('userAccessRight', globalVar.userAccessRight)
    }
    else {
      SGHelperGlobalVar.addVar('dataUser', globalVar.dataUser)
      SGHelperGlobalVar.addVar(userDataApp, globalVar[userDataApp])
      SGHelperGlobalVar.addVar('userAccessRight', globalVar.userAccessRight)
      this.getAllGlobalVar(userDataApp);
    }
    this.getAllGlobalVar(userDataApp)
  }
  async setGetAllGlobalVarAPI(FunctionAPIName, userDataApp) {
    var globalVar = await FunctionAPIName()

    if (SGHelperGlobalVar.isVar('dataUser') && SGHelperGlobalVar.isVar('userAccessRight') && SGHelperGlobalVar.isVar(userDataApp)) {
      SGHelperGlobalVar.setVar('dataUser', globalVar.dataUser)
      SGHelperGlobalVar.setVar(userDataApp, globalVar[userDataApp])
      SGHelperGlobalVar.setVar('userAccessRight', globalVar.userAccessRight)
    }
    else {
      SGHelperGlobalVar.addVar('dataUser', globalVar.dataUser)
      SGHelperGlobalVar.addVar(userDataApp, globalVar[userDataApp])
      SGHelperGlobalVar.addVar('userAccessRight', globalVar.userAccessRight)
    }
    this.getAllGlobalVar(userDataApp)
  }
  initTask2(fTaskType, fScreen, tbTaskDAO, dataApp,dataAPI) {
    this.userDataApp = SGHelperGlobalVar.getVar(dataApp)
    this.userData = SGHelperGlobalVar.getVar('dataUser')
    // console.log(this.userDataApp)
    this.userAccessRight = SGHelperGlobalVar.getVar('userAccessRight')
    this.photoProfile = this.userData.fImageProfileJSON[0].med.uri
    this.formDisabled = false;
    this.buttonDisabled = false;
    this.isDualControl = tbTaskDAO.isDualControl(fTaskType, this.userDataApp)

    this.isTask = SGHelperType.isDefined(this.props.route.params.task) ? true : false
    if (this.isDualControl || this.isTask) {
      this.taskType = fTaskType
      this.taskData = SGHelperType.isDefined(dataAPI) ? dataAPI : tbTaskDAO.getNewTaskData(this.taskType, fScreen, this.userDataApp.fID)
      console.log(this.taskData);
      this.mode = "submit"
      if (this.taskData.fStatus === "submitted") {
        this.mode = "approve"
        this.formDisabled = true;
      }
      else if (this.taskData.fStatus === "rejected") {
        this.mode = "resubmit"
      }
      else if (this.taskData.fStatus === "approved" || this.taskData.fStatus === "cancelled") {
        this.mode = ""
        this.formDisabled = true;
        this.hideComment = true;
      }
      if (this.props.route.params.fTaskTab === "inprogress") {
        this.formDisabled = true;
        this.buttonDisabled = true;
      }
      if (this.isTask && this.mode !== "") {
        this.taskData.fComment.push(tbTaskDAO.getNewTaskCommentData());
        this.commentData = []
        for (var i = 0; i < this.taskData.fComment.length - 1; i++) {
          this.commentData.push(this.taskData.fComment[i])
        }
        this.currentComment = this.taskData.fComment[this.taskData.fComment.length - 1]
      }
      else {
        if (this.isDualControl && this.mode !== "") {
          this.commentData = []
          for (var i = 0; i < this.taskData.fComment.length - 1; i++) {
            this.commentData.push(this.taskData.fComment[i])
          }
          this.currentComment = this.taskData.fComment[this.taskData.fComment.length - 1]
        } else {
          this.commentData = []
          for (var i = 0; i < this.taskData.fComment.length; i++) {
            this.commentData.push(this.taskData.fComment[i])
          }
          this.currentComment = null;
        }
      }
    } else {
      this.taskData = tbTaskDAO.getNewTaskData(fTaskType, fScreen, this.userDataApp.fID)
      this.mode = "save"
    }
  }
  initTask(fTaskType, fScreen, tbTaskDAO, dataApp) {
    this.userDataApp = SGHelperGlobalVar.getVar(dataApp)
    this.userData = SGHelperGlobalVar.getVar('dataUser')
    // console.log(this.userDataApp)
    this.userAccessRight = SGHelperGlobalVar.getVar('userAccessRight')
    this.photoProfile = this.userData.fImageProfileJSON[0].med.uri
    this.formDisabled = false;
    this.buttonDisabled = false;
    this.isDualControl = tbTaskDAO.isDualControl(fTaskType, this.userDataApp)

    this.isTask = SGHelperType.isDefined(this.props.route.params.task) ? true : false
    if (this.isDualControl || this.isTask) {
      this.taskType = fTaskType
      this.taskData = this.isTask ? SGHelperType.copyJSON(this.props.route.params.taskData) : tbTaskDAO.getNewTaskData(this.taskType, fScreen, this.userDataApp.fID)

      this.mode = "submit"
      if (this.taskData.fStatus === "submitted") {
        this.mode = "approve"
        this.formDisabled = true;
      }
      else if (this.taskData.fStatus === "rejected") {
        this.mode = "resubmit"
      }
      else if (this.taskData.fStatus === "approved" || this.taskData.fStatus === "cancelled") {
        this.mode = ""
        this.formDisabled = true;
        this.hideComment = true;
      }
      if (this.props.route.params.fTaskTab === "inprogress") {
        this.formDisabled = true;
        this.buttonDisabled = true;
      }
      if (this.isTask && this.mode !== "") {
        this.taskData.fComment.push(tbTaskDAO.getNewTaskCommentData());
        this.commentData = []
        for (var i = 0; i < this.taskData.fComment.length - 1; i++) {
          this.commentData.push(this.taskData.fComment[i])
        }
        this.currentComment = this.taskData.fComment[this.taskData.fComment.length - 1]
      }
      else {
        if (this.isDualControl && this.mode !== "") {
          this.commentData = []
          for (var i = 0; i < this.taskData.fComment.length - 1; i++) {
            this.commentData.push(this.taskData.fComment[i])
          }
          this.currentComment = this.taskData.fComment[this.taskData.fComment.length - 1]
        } else {
          this.commentData = []
          for (var i = 0; i < this.taskData.fComment.length; i++) {
            this.commentData.push(this.taskData.fComment[i])
          }
          this.currentComment = null;
        }
      }
    } else {
      this.mode = "save"
    }
  }

  /**
   * get standard window/screen width, height, and padding
   * {w, h, p}
   */
  get WHP() {
    return this._whp;

  }
  get WHPNoHeader() {
    return this._whpNoHeader;
  }
  get Language() {
    return this._language;
  }
  errorMessage() {
    return (
      {
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
          OK:"Okay",
          exitApp:"Keluar"
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
            OK:"Okay",
            exitApp:"Exit"
    
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
          exitApp:"出口"
    
        }
      }

    )
  }
  //Call Parallel API with Option to Redo ONLY Failed API 
  //or exceed certain timeout limit
  //All API should be equivalent and Read Only Query
  baseInitAPIParallel(timeOutLimit, onDone, onTryAgain=()=>{}, multiFlag = false,hideErrorMessage = false) {
    var varObj = multiFlag?{}:this; 
    varObj._baseAPIParallelObject = {};
    varObj._baseAPIParallelCounter = 0;
    varObj._baseAPIParallelCount = 0;
    varObj._baseAPIParallelTimeOutLimit = timeOutLimit;
    varObj._baseAPIParallelOnDone = onDone;
    varObj._baseAPIParallelOnTryAgain = onTryAgain;
    varObj._baseAPIParallelTimeOutID = null;
    varObj._baseAPIParallelGUID = null;  
    varObj._hideErrorMessage = hideErrorMessage;
    return varObj;
  }

  baseAddAPIParallel(apiName, asyncApi, onThen, onCatch, varObj = null) {
    if(!SGHelperType.isDefined(varObj)){varObj = this;} 
    varObj._baseAPIParallelObject[varObj._baseAPIParallelCount] = ({ status: 'initial', apiName: apiName, asyncAPI: asyncApi, onThen: onThen, onCatch: onCatch });      
    varObj._baseAPIParallelCount++;  
  }
  
  baseRunAPIParallel(varObj = null) {
    if(!SGHelperType.isDefined(varObj)){varObj = this;} 
    varObj._baseAPIParallelCounter = 0;
    varObj._baseAPIParallelErrorShown = false;
    varObj._baseAPIParallelGUID = SGHelperType.getGUID();
    var _guid = varObj._baseAPIParallelGUID.toString()
    varObj._baseAPIParallelTimeOutID = setTimeout((() => {
      this.baseAPIParallelErrorHandler(_guid, {message:'Auto PARALLEL API cut off time limit'},'', varObj);
    }).bind(this,varObj,_guid), varObj._baseAPIParallelTimeOutLimit);

    for (var i = 0; i < varObj._baseAPIParallelCount; i++) {
      if (varObj._baseAPIParallelObject[i].status !== 'success') {
        varObj._baseAPIParallelObject[i].status = 'inprogress';
        // console.log(this._baseAPIParallelObject[i].apiName + ' start');
        varObj._baseAPIParallelObject[i].asyncAPI()
          .then(((i, guid,varObj, v) => {
            // console.log(this._baseAPIParallelObject[i].apiName + ' response');
            if (varObj._baseAPIParallelGUID === guid) {
              if (SGHelperType.isDefined(varObj._baseAPIParallelObject[i].onThen)) {
                varObj._baseAPIParallelObject[i].onThen(v);
              }
              varObj._baseAPIParallelObject[i].status = 'success';
              varObj._baseAPIParallelCounter++;
              // console.log(this._baseAPIParallelObject[i].apiName + ' done');
              this._baseAPIParallelCheckAllDone(guid,varObj);
            }
          }).bind(this, i, _guid, varObj))
          .catch(((i, guid,varObj, e) => {
            console.log(varObj._baseAPIParallelObject[i].apiName + ' failed');
            if (varObj._baseAPIParallelGUID === guid) {
              if (SGHelperType.isDefined(varObj._baseAPIParallelObject[i].onCatch)) {  
                varObj._baseAPIParallelObject[i].onCatch(e);
              }
                varObj._baseAPIParallelObject[i].status = 'failed';
                this.baseAPIParallelErrorHandler(guid, e,varObj._baseAPIParallelObject[i].apiName,varObj);

            }
          }).bind(this, i, _guid,varObj));
      } else {
        varObj._baseAPIParallelCounter++;
      }
    }
  }

  baseAPIParallelErrorHandler(guid, e,apiName='',varObj=null) {
    //GERRY HASANG please localize 
    if(!SGHelperType.isDefined(varObj)){varObj = this;} 
    if (varObj._baseAPIParallelCounter !== varObj._baseAPIParallelCount && varObj._baseAPIParallelGUID === guid && !varObj._baseAPIParallelErrorShown) {
      console.log(e);
      varObj._baseAPIParallelErrorShown = true;
      if (SGHelperType.isDefined(varObj._baseAPIParallelTimeOutID)) {
        clearTimeout(varObj._baseAPIParallelTimeOutID);
        varObj._baseAPIParallelTimeOutID = null;
      }

     if(SGHelperType.isDefined(e.respInfo)){
      if(e.respInfo.status===500  || e.respInfo.status===417 ||e.respInfo.status===501){
        var errorRes = JSON.parse(e.data)
        varObj.errorMessageData = errorRes.respInfo.message
        varObj.codeMessage = varObj.errorMessageData.substring(0, 4) 
      
      }else{

        console.log("YOHANES")
        console.log(typeof(e.message))
        varObj.errorMessageData=errorRes.data
        if(e.respInfo.status===400)varObj.codeMessage = "Error: wrongDTO "+ apiName +" " + e.data 
        else if(e.respInfo.status===401)varObj.codeMessage = "ERROR: Unauthorized"
        else if(e.respInfo.status===403)varObj.codeMessage = "ERROR: Forbidden token" 
        else if(e.message==="The Internet connection appears to be offline." || e.message==="SG-A"||e.message==="Auto PARALLEL API cut off time limit") varObj.codeMessage = e.message
        else{
          varObj.codeMessage = "Unexpected Error: "+e.data
        }
      }
     }else if(e.message==="The Internet connection appears to be offline."||e.message=== "SG-A"||e.message==="Auto PARALLEL API cut off time limit") varObj.codeMessage = e.message
     else if(e==="The request timed out.") varObj.codeMessage = e
     else  varObj.codeMessage = "Unexpected Error: "+e
      
      var language = SGHelperGlobalVar.isVar("GlobalLanguage") ? SGHelperGlobalVar.getVar("GlobalLanguage").toUpperCase() : "EN"
      var errorMessage = this.errorMessage()
      console.warn(varObj.codeMessage)
      if(!varObj._hideErrorMessage){
      if(varObj.codeMessage==='SG-A' || varObj.codeMessage==="The request timed out." || varObj.codeMessage==="Auto PARALLEL API cut off time limit" || varObj.codeMessage==="Session Expired" ){
        SGDialogBox.showWarning(null, errorMessage[language].titleA, errorMessage[language].messageA, errorMessage[language].tryAgain,
          (() => {varObj._baseAPIParallelOnTryAgain(); this.baseRunAPIParallel(varObj); }).bind(this,varObj), false);
      }else if(varObj.codeMessage==='SG-B'){
        var localize = varObj.errorMessageData.slice(9,varObj.errorMessageData.length)
        SGDialogBox.showWarning(null, errorMessage[language].title,SGLocalize.translate(localize) ,
          errorMessage[language].OK, () => {  },true
        )
      }else if (varObj.codeMessage==='SG-C'){
          SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC +" "+ " "+(mode!=='live' ? varObj.errorMessageData+" " +varObj.codeMessage:"") ,
              errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.navigatePop(SGHelperGlobalVar.getVar("Navigation")) },true
          )
      
      }else if(varObj.codeMessage==="Unauthorized"){
          SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageUnauthorized ,
            errorMessage[language].OK, () => {  SGHelperNavigation.navigateReset(SGHelperGlobalVar.getVar("Navigation"),  SGHelperGlobalVar.getVar("SplashScreen")) },true
          )
          // SGHelperNavigation.navigateReset(SGHelperGlobalVar.getVar("Navigation"),  SGHelperGlobalVar.getVar("SplashScreen"))
          
      }else if(varObj.codeMessage==="The Internet connection appears to be offline."){
        SGDialogBox.showWarning(null, errorMessage[language].titleA, errorMessage[language].messageNoInternetConnection, errorMessage[language].OK,
          (() => {varObj._baseAPIParallelOnTryAgain();  this.baseRunAPIParallel(varObj); }).bind(this,varObj), false);
      }else if(varObj.codeMessage==="SG-D"){
          var localize = varObj.errorMessageData.slice(9,varObj.errorMessageData.length)
          var message = JSON.parse(localize)
          SGDialogBox.showWarning(null, errorMessage[language].title, message[language],
          errorMessage[language].OK, () => {  },true
        )
      }
      else{
        SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC +" "+ (mode!=='live' ?  varObj.errorMessageData +" " +varObj.codeMessage:""),
          errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.navigatePop(SGHelperGlobalVar.getVar("Navigation")) },true
        )
        }
      }
    }
  }
  _baseAPIParallelCheckAllDone(guid, varObj=null) {
    if(!SGHelperType.isDefined(varObj)){varObj = this;} 
    if (varObj._baseAPIParallelGUID === guid) {
      if (varObj._baseAPIParallelCounter === varObj._baseAPIParallelCount) {
        console.log('API Parallel all done');
        if (SGHelperType.isDefined(varObj._baseAPIParallelTimeOutID)) {
          clearTimeout(varObj._baseAPIParallelTimeOutID);
          varObj._baseAPIParallelTimeOutID = null;
        }
        if (SGHelperType.isDefined(varObj._baseAPIParallelOnDone)) {
          varObj._baseAPIParallelOnDone();
        }
      }
    }
  }


  //Call Single API with Option to Redo if API Fail 
  //or exceed certain timeout limit
  //The API should be Read Only Query
  /**
   * Run Single API with redo option on error
   * @param {*} guid 
   * @param {*} asyncApi 
   * @param {*} onThen 
   * @param {*} onCatch 
   * @param {*} timeOutLimit 
   * @param {*} e 
   */
  _baseRunSingleAPIErrorHandler(guid, apiName, asyncApi, onThen = (v) => { }, onCatch = () => { }, timeOutLimit = 0, e,ShowPopUp) {
    if (this._baseSingleAPIGUID === guid && this._baseSingleAPIStatus === 'inprogress') {
      if (SGHelperType.isDefined(this._baseSingleAPITimeOutID)) {
        clearTimeout(this._baseSingleAPITimeOutID);
        this._baseSingleAPITimeOutID = null;
      }
      console.log(e);
      this._baseSingleAPIStatus = 'failed';
      if(SGHelperType.isDefined(e)){
        if(SGHelperType.isDefined(e.respInfo)){
          var errorRes = JSON.parse(e.data)
          if(e.respInfo.status===500 || e.respInfo.status===417 ||e.respInfo.status===501){
            this.errorMessageData = errorRes.respInfo.message
            this.codeMessage = this.errorMessageData.substring(0, 4) 
          
          }else{

            this.errorMessageData=errorRes.data
            if(e.respInfo.status===400)this.codeMessage = "Error: wrongDTO "+ apiName +" " + e.data 
            else if(e.respInfo.status===401)this.codeMessage = "ERROR: Unauthorized"
            else if(e.respInfo.status===403)this.codeMessage = "ERROR: Forbidden token" 
            else if(e.message==="The Internet connection appears to be offline." ||e.message=== 'SG-A') this.codeMessage = e.message
            else{
              this.codeMessage = "Unexpected Error: "+e.data
            }
          }
        }else if(e.message==="The Internet connection appears to be offline." ||e.message=== 'SG-A'||e.message=== 'Auto SINGLE RUN cut off time limit') this.codeMessage = e.message
        else if(e==="The request timed out.") this.codeMessage = e
        else this.codeMessage = "Unexpected Error: "+e
      }else this.codeMessage = "Unexpected Error: " +e
      

      var language = SGHelperGlobalVar.getVar("GlobalLanguage") ? SGHelperGlobalVar.getVar("GlobalLanguage").toUpperCase() : "EN"
      var errorMessage = this.errorMessage()
      console.log(this.codeMessage)
      if(this.codeMessage==='SG-A' || this.codeMessage==="Auto SINGLE RUN cut off time limit" || this.codeMessage==="The request timed out."||this.codeMessage==="Session Expired"){
        SGDialogBox.showWarning(null, errorMessage[language].titleA, errorMessage[language].messageA, errorMessage[language].tryAgain,
          () => { this.baseRunSingleAPIWithRedoOption(apiName, asyncApi, onThen, onCatch, timeOutLimit,ShowPopUp); }, false);
      }else if(this.codeMessage==='SG-B'){
        var localize = this.errorMessageData.slice(9,this.errorMessageData.length)
        SGDialogBox.showWarning(null, errorMessage[language].title,SGLocalize.translate(localize) ,
          errorMessage[language].OK, () => {  },true
        )
      }else if (this.codeMessage==='SG-C'){
        // console.log(SGHelperGlobalVar.getVar("Navigation"))
          SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC + (mode!=='live' ? this.errorMessageData+" " +this.codeMessage:""),
              errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.navigatePop(SGHelperGlobalVar.getVar("Navigation")) },true
          )
      }else if (this.codeMessage==='SG-D'){
          var localize =this.errorMessageData.slice(9,this.errorMessageData.length)
          var message = JSON.parse(localize)
          SGDialogBox.showWarning(null, errorMessage[language].title, message[language],
          errorMessage[language].OK, () => {  },true
        )
      }else if(this.codeMessage==="Unauthorized"){
          SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageUnauthorized ,
            errorMessage[language].OK, () => {  SGHelperNavigation.navigateReset(SGHelperGlobalVar.getVar("Navigation"),  SGHelperGlobalVar.getVar("SplashScreen")) },true
          )
          // SGHelperNavigation.navigateReset(SGHelperGlobalVar.getVar("Navigation"),  SGHelperGlobalVar.getVar("SplashScreen"))
          
      }
      else if(this.codeMessage==="The Internet connection appears to be offline."){
        SGDialogBox.showWarning(null, errorMessage[language].titleA,errorMessage[language].messageNoInternetConnection ,
          errorMessage[language].OK, () => { this.baseRunSingleAPIWithRedoOption(apiName, asyncApi, onThen, onCatch, timeOutLimit,ShowPopUp); },true
        )
      }
      else{
        console.log(this.codeMessage)
        SGDialogBox.showFail(null, errorMessage[language].title,errorMessage[language].messageC + (mode!=='live' ? this.errorMessageData+" " +this.codeMessage:""),
          errorMessage[language].OK, () => { if(SGHelperNavigation.canGoBack(SGHelperGlobalVar.getVar("Navigation"))) SGHelperNavigation.navigatePop(SGHelperGlobalVar.getVar("Navigation")) },true
        )
      }
    }
  }

  /**
   * Run Single API with redo option on error
   * @param {*} asyncApi 
   * @param {*} onThen 
   * @param {*} onCatch 
   * @param {*} timeOutLimit 
   */
  baseRunSingleAPIWithRedoOption(apiName, asyncApi, onThen = (v) => { }, onCatch = () => { }, timeOutLimit = 0,ShowPopUp=true) {
    this._baseSingleAPIGUID = SGHelperType.getGUID();
    this._baseSingleAPIStatus = 'inprogress';
    var _guid = this._baseSingleAPIGUID.toString();
    if (SGHelperType.isDefined(this._baseSingleAPITimeOutID)) {
      clearTimeout(this._baseSingleAPITimeOutID);
      this._baseSingleAPITimeOutID = null;
    }
    if (timeOutLimit > 0) {
      if(ShowPopUp)this._baseSingleAPITimeOutID = setTimeout(this._baseRunSingleAPIErrorHandler.bind(this, _guid,apiName, asyncApi, onThen, onCatch, timeOutLimit, {message:'Auto SINGLE RUN cut off time limit'},ShowPopUp), timeOutLimit);
    }
    // console.log(apiName + ' start');
    asyncApi()
      .then(((guid, onthen, v) => {
        // console.log(apiName + ' response');
        if (this._baseSingleAPIGUID === guid) {
          if (SGHelperType.isDefined(this._baseSingleAPITimeOutID)) {
            clearTimeout(this._baseSingleAPITimeOutID);
            this._baseSingleAPITimeOutID = null;
          }
          if (SGHelperType.isDefined(onthen)) { onthen(v); }
          // console.log(apiName + ' done');
        }
      }).bind(this, _guid, onThen))
      .catch(((guid, apiname, asyncapi, onthen, oncatch, timeoutlimit, e) => {
        console.log(apiName + ' failed');
        if (this._baseSingleAPIGUID === guid) {
          if (SGHelperType.isDefined(this._baseSingleAPITimeOutID)) {
            clearTimeout(this._baseSingleAPITimeOutID);
            this._baseSingleAPITimeOutID = null;
          }

          if (SGHelperType.isDefined(oncatch)) {
            oncatch(e);
          }
          if(ShowPopUp)this._baseRunSingleAPIErrorHandler(guid, apiname, asyncapi, onthen, oncatch, timeoutlimit, e,ShowPopUp);
        }
      }).bind(this, _guid, apiName, asyncApi, onThen, onCatch, timeOutLimit))
  }

  handleLink(url) {
    var valid = SGHelperType.validURL(url)
    console.log(url)
    console.log(valid)
    console.log('handle link')
    if (valid) {
        Linking.canOpenURL(url
        ).then(supported => {
            if ((SGHelperType.left(url, 8) != 'https://')) {
                Linking.openURL('https://' + url);
            } else {
                Linking.openURL(url);
            }
        });
    }
};

_checkDeepLinkingHandlerPushNotification() {
  var url = SGHelperGlobalVar.getVar('deepLinkingURL')
  console.log2("YOHANES1")
  console.log2(url)
  if (url != null && url != '') {
    if (url.includes(SGHelperGlobalVar.getVar('UriScheme1'))) {
      var urischeme = SGHelperGlobalVar.getVar('UriScheme1')
      var app_link = url.split(urischeme);

      var link = app_link[1].split('/');
      // console.log(link[0])
      console.log("RESET")
      // SGHelperGlobalVar.addVar('deepLinkingURL', '');

      switch (link[0]) {
        case '': break;//do nothing
        case 'building':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "MallHome", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'store':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'resto':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'facility':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "FacilityDetail", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'eventbuilding':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'PlaceEvent' });
          break;
        case 'eventstore':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'StorePromo' });
          break;
        case 'eventresto':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'RestoPromo' });
          break;
        case 'productstore':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'productresto':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], notificationKey: link[2] });
          break;
        case 'inbox':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "InboxDetail", { commentKey: link[1] });
          break;
        case 'notification':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "Broadcast" });
          break;
        case 'auctionstore':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "StoreAuction" });
            break;
        case 'auctionresto':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "RestoAuction" });
          break;
        case 'quiztenant':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "Quiz", { fID: link[1]});
          break;
        case 'quizbuilding':
          SGHelperGlobalVar.addVar('deepLinkingURL', '');
          SGHelperNavigation.navigatePush(this.props.navigation, "QuizBuilding", { fID: link[1]});
          break;
        default: console.log("do nothing")//SGHelperGlobalVar.addVar('deepLinkingURL', '');
      }
    }
  }
}

_checkDeepLinkingHandlerShareMessage(value) {
    var url = value;
    // console.log2("YOHANES2")
    // console.log2(url)
    if (url != null && url != '') {
      var isShareMessage = Platform.OS === 'ios' ? url.includes(SGHelperGlobalVar.getVar('UriScheme3')) : url.includes(SGHelperGlobalVar.getVar('UriScheme2'))
      if (isShareMessage) {
        if(url.includes(SGHelperGlobalVar.getVar('UriScheme4'))){
          var urischeme = SGHelperGlobalVar.getVar('UriScheme4') 
        }else{
          var urischeme = Platform.OS === 'ios' ? SGHelperGlobalVar.getVar('UriScheme3') : SGHelperGlobalVar.getVar('UriScheme2')
        }
       
        var app_link = url.split(urischeme);
        console.log(app_link)
        var link = app_link[1].split('/');
        console.log(link)
        console.log(link)
        if(link.length === 2){
          var tmp = link[1].split('?');
          link[1] = tmp[0];
        }else if(link.length === 3){
          var tmp = link[2].split('?');
          link[2] = tmp[0];
        }
        switch (link[0]) {
          case '': break;//do nothing
          case 'building':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "MallHome", { contentKey: link[1] });
            break;
          case 'store':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1] });
            break;
          case 'resto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1] });
            break;
          case 'id-ID':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            this.handleLink(url)
            break;
          case 'en-EN':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            this.handleLink(url)
            break;
          case 'restomenu':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1],movetoRestoMenu:true });
            break;
          case 'storecatalog':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1],movetostorecatalog:true });
              break;
          case 'facility':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "FacilityDetail", { contentKey: link[1] });
            break;
          case 'eventbuilding':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "PlaceEventDetail", { contentKey: link[1] });
            break;
          case 'eventstore':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StorePromoDetail", { contentKey: link[1] });
            break;
          case 'eventresto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoPromoDetail", { contentKey: link[1] });
            break;
          case 'productstore':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2] });
            break;
          case 'productresto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2] });
            break;
          case 'inbox':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "InboxDetail", { commentKey: link[1] });
            break;
          case 'notification':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1] });
            break;
          case 'storewhattogift':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
            break;
          case 'restowhattogift':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
            break;
          case 'clothtobuy':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "ClothToBuyResultDetail", { contentKey: link[1] });
            break;
          case 'whattoeat':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToEatResultDetail", { contentKey: link[1] });
            break;
          case 'eventsponsor':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "SponsorshipDetail", { contentKey: link[1] });
            break;
          case 'StoreAuction':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
            break;
          case 'RestoAuction':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
            break;
          case 'download':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "MyReferralInMyReward", { referral: true } );
          break;
          case 'quiztenant':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "Quiz", { fID: link[1]});
            break;
          case 'quizbuilding':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "QuizBuilding", { fID: link[1]});
            break;
          case 'qrproductstore':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2],qr:true });
              break;
          case 'qrproductresto':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2],qr:true });
              break;
          default: console.log("do nothing")
        }
      } else {
        console.log("MASUK KE ELSE Home")
        if(url.includes(SGHelperGlobalVar.getVar('UriScheme4'))){
          var urischeme = SGHelperGlobalVar.getVar('UriScheme4') 
        }else if(url.includes(SGHelperGlobalVar.getVar('UriScheme2'))){
          var urischeme = SGHelperGlobalVar.getVar('UriScheme2')
        }else if(url.includes(SGHelperGlobalVar.getVar('UriScheme3'))){
        var urischeme = SGHelperGlobalVar.getVar('UriScheme3')
        }else if(url.includes(SGHelperGlobalVar.getVar('UriScheme1'))){
          var urischeme = SGHelperGlobalVar.getVar('UriScheme1')
        }
        var app_link = url.split(urischeme);
        console.log(app_link)
        var link = app_link[1].split('/');
        console.log(link)
        console.log(link)
        if(link.length === 2){
          var tmp = link[1].split('?');
          link[1] = tmp[0];
        }else if(link.length === 3){
          var tmp = link[2].split('?');
          link[2] = tmp[0];
        }
        switch (link[0]) {
          case '': break;//do nothing
          case 'building':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "MallHome", { contentKey: link[1] });
            break;
          case 'store':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1] });
            break;
          case 'resto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1] });
            break;
          case 'id-ID':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            this.handleLink(url)
            break;
          case 'en-EN':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            this.handleLink(url)
            break;
          case 'restomenu':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1],movetoRestoMenu:true });
            break;
          case 'storecatalog':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1],movetostorecatalog:true });
            break;
          case 'facility':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "FacilityDetail", { contentKey: link[1] });
            break;
          case 'eventbuilding':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "PlaceEventDetail", { contentKey: link[1] });
            break;
          case 'eventstore':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StorePromoDetail", { contentKey: link[1] });
            break;
          case 'eventresto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoPromoDetail", { contentKey: link[1] });
            break;
          case 'productstore':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2] });
            break;
          case 'productresto':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2] });
            break;
          case 'inbox':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "InboxDetail", { commentKey: link[1] });
            break;
          case 'notification':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1] });
            break;
          case 'storewhattogift':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
            break;
          case 'restowhattogift':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
            break;
          case 'clothtobuy':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "ClothToBuyResultDetail", { contentKey: link[1] });
            break;
          case 'whattoeat':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "WhatToEatResultDetail", { contentKey: link[1] });
            break;
          case 'eventsponsor':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "SponsorshipDetail", { contentKey: link[1] });
            break;
          case 'StoreAuction':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
            break;
          case 'RestoAuction':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
            break;
          case 'download':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "MyReferralInMyReward", { referral: true } );
          break;
          case 'quiztenant':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "Quiz", { fID: link[1]});
            break;
          case 'quizbuilding':
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
            SGHelperNavigation.navigatePush(this.props.navigation, "QuizBuilding", { fID: link[1]});
            break;
          case 'qrproductstore':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2],qr:true });
              break;
          case 'qrproductresto':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2],qr:true });
              break;
          default: console.log("do nothing")
        }
      }

    }
  }
}