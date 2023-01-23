
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbTQuizAPI extends SGBaseScreen {

    static async GetTenantQuizByID(fID) {
        var token = SGHelperGlobalVar.getVar("token");
        
        var res = await SGHelperAPICall.callAPISync('GetTenantQuizByID', fID)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async GetTenantQuizUserTotalAnswer(fID) {
        var token = SGHelperGlobalVar.getVar("token");
        
        var res = await SGHelperAPICall.callAPISync('GetTenantQuizUserTotalAnswer', fID)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SubmitTenantQuizAnswer(data) {
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SubmitTenantQuizAnswer', data)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }
}