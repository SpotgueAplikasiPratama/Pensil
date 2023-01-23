/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VStoreHomeAPI extends SGBaseScreen {

    static async getStoreHomeHeader(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetStoreHomeHeader', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreSettings(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetStoreHomeSettings', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStorePromoSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchStoreHighlightPromo', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreProductCategory(contentKey,mode) {
        var obj = {storeID :contentKey,mode:mode}
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(obj)
        console.log(JSON.stringify(obj))
        var res = await SGHelperAPICall.callAPISync('SearchStoreProductCategory', obj)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreTrendingProductList(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchStoreTrendingProduct', contentKey)
        console.log('getStoreTrendingProductList')
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreProductByCategory(storeKey, categoryKey,sortArr,pagingParam) {
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey },
            { name: 'categoryKey', operator: '=', value: categoryKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchStoreHomeProductList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreProductByCategoryDapper(storeKey,sortArr,pagingParam) {
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchStoreHomeProductListAllCategory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getStoreProductPdfByCategory(storeKey, categoryKey) {
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey },
            { name: 'categoryKey', operator: '=', value: categoryKey }
        ]
        var arrSort = [
        ]

        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchStoreHomeProductPdfList', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }


    static async getStoreProductPdfByCategoryDapper(storeKey,pagingParam) {
        console.log(SGHelperGlobalVar.getVar('token'))
        var arrFilter = [
            { name: 'storeKey', operator: '=', value: storeKey }
        ]
        var arrSort = [
        ]

        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchStoreHomeProductPdfListAllCategory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

}