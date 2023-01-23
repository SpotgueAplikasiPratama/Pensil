import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VAuctionDetailAPI extends SGBaseScreen {

    static async getAuctionDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetDetailItemAuction', contentKey)
        console.log(res);
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async GetMyAuctionBidList(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetMyAuctionBidList', contentKey)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async InsertAuctionParticipant(data) {
        var res = await SGHelperAPICall.callAPISync('InsertAuctionParticipant', data)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async cancelBidParticipant(data) {
        var res = await SGHelperAPICall.callAPISync('cancelBidParticipant', data)
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(data))
        console.log('cancelbid')
        console.log(res);

        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async GetSummarySilentAuction(key) {
        var res = await SGHelperAPICall.callAPISync('GetSummarySilentAuction', key)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async getWinnerDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('getWinnerDetail', contentKey)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }
}