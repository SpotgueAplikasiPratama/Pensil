/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRestoHomeAPI extends SGBaseScreen {

    static async getRestoHomeHeader(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetRestoHomeHeader', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoSettings(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetRestoHomeSettings', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoPromoSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightPromo', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoTrendingProductList(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightTrendingProduct', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoBestSellerProductList(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightBestSellerProduct', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoPromoProductList(contentKey) {
        console.log('getRestoPromoProductList')
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightPromoProduct', contentKey)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoChefRecommendedProductList(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightChefRecProduct', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoProductCategory(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoProductCategory', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoProductPdfCategory(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchRestoProductPdfCategory', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoProductByCategory(restoKey, categoryKey,sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey },
            { name: 'categoryKey', operator: '=', value: categoryKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchRestoHomeProductList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)

    }

    static async getRestoProductByCategoryDapper(restoKey, sortArr,pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey }
        ]
        var arrSort = sortArr;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchRestoHomeProductListAllCategory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)

    }


    static async getRestoProductPdfByCategory(restoKey, categoryKey) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey },
            { name: 'categoryKey', operator: '=', value: categoryKey }
        ]
        var arrSort = [
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchRestoHomeProductPdfList', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoProductPdfByCategoryDapper(restoKey, pagingParam) {
        var arrFilter = [
            { name: 'restoKey', operator: '=', value: restoKey }
        ]
        var arrSort = [
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchRestoHomeProductPdfListAllCategory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

}