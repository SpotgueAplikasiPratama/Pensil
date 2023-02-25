/**
* Spotgue Core Helper for Calling Server API
* wrap react native fetch implementation and hide from Spotgue UI App
* @format 
* @flow 
* 1. Call API (synchronous and asynchronous), with callback event (successful and failed event)
*    use secure HTTPS / SSL protocol and encryption on data being transferred
* 2. Client & Server time sync with delay tolerance
     get time region to convert local time to GMT standard on client side when communicating with server
     standard server time will record in GMT and converted to local time on client side
     all time field display and will capture    
*/
import { SGHelperType } from '../../core/helper/SGHelperType';
import RNFetchBlob from "react-native-blob-util";

import CryptoJS from 'crypto-js';
import DeviceInfo from 'react-native-device-info';
import { visitorTableID, keyEncryptAnonymous, mode } from '../../../app.json'
import { SGHelperGlobalVar } from '.';
import NetInfo from "@react-native-community/netinfo";
export class SGHelperAPICall {
     static useAPIMgmt = false;
     static setUseAPIMgmt(v){
          SGHelperAPICall.useAPIMgmt = v;
     }
     static callAPI(method, url, header, body, callBack) {
          var a = new Date().getTime();
          RNFetchBlob.fetch(method, url, header, body)
               .then((res) => {
                    var b = new Date().getTime();
                    var c = b - a;
                    // console.log("time func" + url + ": " + c);
                    if (callBack) {
                         callBack(res);
                    }

               });
     }
     static async _analyzeErrorMessage(res){
          var RTOCount = SGHelperGlobalVar.getVar("RTOCount")
          if(res.includes("Timeout") || res.includes("timed out") ){
               if(mode==="live"){
                    SGHelperGlobalVar.setVar("RTOCount",RTOCount+1)
                    RTOCount= SGHelperGlobalVar.getVar("RTOCount")
                    if(RTOCount>=2){
                        await SGHelperAPICall.pingAzure()
                    }
               }
               
               return {message:'SG-A'}
          }
          if(res.includes("Unable to resolve host") || res.includes("Session Expired")|| res.includes("connection")||res.includes("Failed to connect"))return {message:'SG-A'}
          if(res.includes("The Internet connection appears to be offline."))return {message:'The Internet connection appears to be offline.'}
          
          return res
     }
     static async callAPISync(apiKey, param) {
          try {
               var APIMap = SGHelperGlobalVar.getVar("APIMap") //List Of API
               var token = SGHelperGlobalVar.getVar('token')
               var method = APIMap[apiKey].fMethod
               var url = APIMap[apiKey].fBaseURL + APIMap[apiKey].fSpecificURL
               var header = {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
               }
               var body = JSON.stringify(param)
               if (SGHelperGlobalVar.getVar('GlobalAppMode') === 'live') {
                    var res = await RNFetchBlob.fetch(method, url, header, body)
                    // if(SGHelperGlobalVar.getVar("Yoh")) throw new Error("The request timed out.")
                    return res;
               } else {
                    var APILog = SGHelperGlobalVar.getVar('APILog') //List of summary API: count and avgDuration
                    var startTime = new Date().getTime();
                    var res = await RNFetchBlob.fetch(method, url, header, body)
                    var endTime = new Date().getTime();
                    var duration = endTime - startTime;
                    if (duration <= 5000) {
                         var t = APILog[apiKey]
                         t.avgDuration = (t.count * t.avgDuration + duration) / (t.count + 1)
                         t.count++;
                         if (t.min === 0) t.min = duration
                         if (t.max === 0) t.max = duration
                         if (t.min > duration) t.min = duration
                         if (t.max < duration) t.max = duration
                    }
                    return res
               }
          } catch (error) {  
               throw await SGHelperAPICall._analyzeErrorMessage(error.message)
          }
         
     }
  
     static async callAPIAsync(method, url, header, body) {
          try {
               var res = await RNFetchBlob.fetch(method, url, header, body);
               return res;
          } catch (error) {
               throw  await SGHelperAPICall._analyzeErrorMessage(error.message)
          }
        
     }

     static hashAnonymousLogin(str, key) {
          str = CryptoJS.enc.Utf8.parse(str);
          key = CryptoJS.enc.Utf8.parse(key);
          var mac = CryptoJS.HmacSHA256(str, key);
          return (mac.toString(CryptoJS.enc.Base64));
     }
     static async refreshVisitorAPIMap() {
          var res = await SGHelperAPICall.getVisitorAPIMap()
          if (res.respInfo.status === 200) {
               var temp = JSON.parse(res.data);
               var arrAPIMap = [];
               if (mode === 'live') {
                    for (var i = 0; i < temp.length; i++) {
                         arrAPIMap[temp[i].fAPIKey] = temp[i];
                    }
               } else {
                    var arrAPILog = [];
                    for (var i = 0; i < temp.length; i++) {
                         arrAPIMap[temp[i].fAPIKey] = temp[i];
                         arrAPILog[temp[i].fAPIKey] = { fAPIKey: temp[i].fAPIKey, count: 0, min: 0, max: 0, avgDuration: 0 };
                    }
                    if (SGHelperGlobalVar.isVar('APILog')) {
                         SGHelperGlobalVar.setVar("APILog", arrAPILog)
                    } else {
                         SGHelperGlobalVar.addVar("APILog", arrAPILog)
                    }
               }
               if (SGHelperGlobalVar.isVar('APIMap')) {
                    SGHelperGlobalVar.setVar("APIMap", arrAPIMap)
               } else {
                    SGHelperGlobalVar.addVar("APIMap", arrAPIMap)
               }
          }
          return res;
     }


   
     static async getVisitorAPIMap() {
          console.log('widih');
          var date = new Date().toJSON()
          var str = DeviceInfo.getUniqueId() + date
          var param = {
               fDeviceID: DeviceInfo.getUniqueId(),
               timeStamp: date,
               password: this.hashAnonymousLogin(str, keyEncryptAnonymous),
               versionID: visitorTableID
          }
          var res = null;
          if(mode==='live'){
               if(SGHelperGlobalVar.getVar("APIMapStatus")==="Primary" || !SGHelperAPICall.useAPIMgmt){
                    res = await this.callAPIAsync('POST', 'https://mag-api-map-' + mode + '.azurewebsites.net/api/v1/visitor/SearchAPIListFromVersion', {
                         'Content-Type': 'application/json'
                    }, JSON.stringify(param))
               }else{
                    res = await this.callAPIAsync('POST', 'https://mag-api-mgmt.azure-api.net/spotgueapimaplive/api/v1/visitor/SearchAPIListSecondaryFromVersion', {
                         'Content-Type': 'application/json'
                    }, JSON.stringify(param))
               }
          }else{
               res = await this.callAPIAsync('POST', 'https://mag-api-map-' + mode + '.azurewebsites.net/api/v1/visitor/SearchAPIListFromVersion', {
                    'Content-Type': 'application/json'
               }, JSON.stringify(param))
          }
          return res;

     }

     static async checkVisitorVersion(id) {
          var res = await this.callAPIAsync('POST', 'https://mag-api-map-' + mode + '.azurewebsites.net/api/v1/visitor/checkVisitorVersion', {
               'Content-Type': 'application/json'
          }, JSON.stringify(id))     
          return res;          
      }
      
     static async pingAzure(){
          if(!SGHelperAPICall.useAPIMgmt){ return; }
          var date = new Date().toJSON()
          var str = DeviceInfo.getUniqueId() + date
          var param = {
               fDeviceID: DeviceInfo.getUniqueId(),
               timeStamp: date,
               password: this.hashAnonymousLogin(str, keyEncryptAnonymous),
               strInput: 'MAGVisitor'
          }
          if(mode==="live" ){
               if(SGHelperGlobalVar.getVar("APIMapStatus")==="Primary"){
                    //try to ping management
                    console.log("PING MGMT")
                    var res = await this.callAPIAsync('POST', 'https://mag-api-mgmt.azure-api.net/spotgueapimaplive/api/v1/common/pingAPI', {
                         'Content-Type': 'application/json'
                    }, JSON.stringify(param))
                   
               }else{
                    //try to ping primary
                    console.log("PING PRIMARY")
                    var res = await this.callAPIAsync('POST', 'https://mag-api-map-live.azurewebsites.net/api/v1/common/pingAPI', {
                         'Content-Type': 'application/json'
                    }, JSON.stringify(param))
               }
          }
          if(res.respInfo.status===200){
               if(SGHelperGlobalVar.getVar("APIMapStatus")==="Primary"){
                    SGHelperGlobalVar.setVar("APIMapStatus","Secondary")
                    SGHelperGlobalVar.setVar("RTOCount",0)
               }else{
                    SGHelperGlobalVar.setVar("APIMapStatus","Primary")
               }
               
               // SGHelperGlobalVar.setVar("RTOCount",0)
               await SGHelperAPICall.refreshVisitorAPIMap()
               // return true
          }
     }

   
     static convertFilterSort(arrFilter, arrSort) {
          var filter = [];
          var sort = [];
          for (var i = 0; i < arrFilter.length; i++) {
               var f = { name: "", op: "", value: [] };
               f.name = arrFilter[i].name;
               f.op = arrFilter[i].operator;
               var v = arrFilter[i].value;
               f.value = Array.isArray(v) ? v : SGHelperType.isDefined(v) ? [v] : v;
               filter.push(f);
          }
          for (var i = 0; i < arrSort.length; i++) {
               var s = { name: "", descending: false, selected: false };
               s.name = arrSort[i].name;
               s.descending = arrSort[i].descending;
               s.selected = arrSort[i].selected;
               sort.push(s);
          }
          return { filter, sort };
     }
     static convertFilterSort2(arrFilter, arrSort , pagingParam) {
          var filter = [];
          var sort = [];
          var paging = {
               
          }
          for (var i = 0; i < arrFilter.length; i++) {
               var f = { name: "", op: "", value: [] };
               f.name = arrFilter[i].name;
               f.op = arrFilter[i].operator;
               var v = arrFilter[i].value;
               f.value = Array.isArray(v) ? v : SGHelperType.isDefined(v) ? [v] : v;
               filter.push(f);
          }
          for (var i = 0; i < arrSort.length; i++) {
               var s = { name: "", descending: false, selected: false };
               s.name = arrSort[i].name;
               s.descending = arrSort[i].descending;
               s.selected = arrSort[i].selected;
               sort.push(s);
          }
          return { filter, sort , paging };
     }
}






