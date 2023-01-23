
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbBQuizAPI extends SGBaseScreen {

    static async GetBuildingQuizByID(fID) {
        var token = SGHelperGlobalVar.getVar("token");
        
        var res = await SGHelperAPICall.callAPISync('GetBuildingQuizByID', fID)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async GetBuildingQuizUserTotalAnswer(fID) {
        var token = SGHelperGlobalVar.getVar("token");
        
        var res = await SGHelperAPICall.callAPISync('GetBuildingQuizUserTotalAnswer', fID)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SubmitBuildingQuizAnswer(data) {
        var token = SGHelperGlobalVar.getVar("token");
        console.log(JSON.stringify(data));
        var res = await SGHelperAPICall.callAPISync('SubmitBuildingQuizAnswer', data)
        console.log(res);
        console.log(token);
        return SGHelperErrorHandling.executeRespon(res)
    }
}