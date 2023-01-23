/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserNotificationSettingsAPI extends SGBaseScreen {

    static async addUserNotificationSettingsOn(data) {
        data.fID = null;
        // var cloneData = SGHelperType.copyJSON(data.getCurrentJSON());
        var res = await SGHelperAPICall.callAPISync('ChangeUserNotificationOn', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async addUserNotificationSettingsOff(data) {
        data.fID = null;
        var res = await SGHelperAPICall.callAPISync('ChangeUserNotificationOff', data)
        return SGHelperErrorHandling.executeRespon(res)
    }
}