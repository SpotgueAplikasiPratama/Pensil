/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRestoMenuListAPI extends SGBaseScreen {

    static async getRestoProductList(restoKey, categoryKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey },
            { name: 'categoryKey', operator: '=', value: categoryKey },
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(token);
        // console.log(JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort,
        //     paging:pagingParam
        // }))
        var res = await SGHelperAPICall.callAPISync('SearchRestoHomeProductList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoTrendingProductList(restoKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightSeeMoreTrendingProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoBestSellerProductList(restoKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightSeeMoreBestSellerProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoPromoProductList(restoKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightSeeMorePromoProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })

        return SGHelperErrorHandling.executeRespon(res)
    }
}