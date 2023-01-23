
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVParkingAndroidTVAPI extends SGBaseScreen {


    static async AddAndroidTVLog(data) {
        console.log(data)
        var res = await SGHelperAPICall.callAPISync('AddAndroidTVLog', data)
        return SGHelperErrorHandling.executeRespon(res)
    }
}