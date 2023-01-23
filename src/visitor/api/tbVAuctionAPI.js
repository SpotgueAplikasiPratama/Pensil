
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVAuctionAPI extends SGBaseScreen {

    static async searchMyBookingAuction(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchMyBookingAuction', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })

       
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchStoreAuctionSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('searchStoreAuctionSlider', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchRestoAuctionSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('searchRestoAuctionSlider', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

}