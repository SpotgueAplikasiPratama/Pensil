/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VStoreProductListAPI extends SGBaseScreen {

    static async getStoreProductList(storeKey, categoryKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey },
            { name: 'categoryKey', operator: '=', value: categoryKey },
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchStoreHomeProductList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreTrendingProductList(storeKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchStoreSeeMoreTrendingProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging : pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}