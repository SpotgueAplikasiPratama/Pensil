
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
 import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
 import { SGHelperGlobalVar } from '../../core/helper';
 import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
 
 export class tbVProfileSponsorshipAPI extends SGBaseScreen {
 
     static async searchActiveSponsor() {
         var token = SGHelperGlobalVar.getVar('token');
         var res = await SGHelperAPICall.callAPISync('SearchActiveSponsor')
         return SGHelperErrorHandling.executeRespon(res)
     }
 
 
 }