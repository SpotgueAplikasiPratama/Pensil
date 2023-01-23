/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserSearchHistoryAPI extends SGBaseScreen {

    static async addUserSearchHistory(data) {
        var res = await SGHelperAPICall.callAPISync('AddSearchHistory', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async clearAllUserSearchHistory() {
        var res = await SGHelperAPICall.callAPISync('DeleteSearchHistory')
        return  SGHelperErrorHandling.executeRespon(res)
    }

    static async deleteSelectedUserSearchHistory(key) {
        var res = await SGHelperAPICall.callAPISync('DeleteSearchHistoryByID', key)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserSearchHistory() {
        var res = await SGHelperAPICall.callAPISync('SearchUserRecentSearchHistory')
        return SGHelperErrorHandling.executeRespon(res)
    }

}