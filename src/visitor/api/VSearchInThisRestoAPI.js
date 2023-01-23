/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchInThisRestoAPI extends SGBaseScreen {

    static async getSearchAllRestoPromoInRestoSlider(language, keyword, restoKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'restoKey', operator: '=', value: restoKey },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort); 
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoPromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoProductInRestoSlider(language, keyword, restoKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'restoKey', operator: '=', value: restoKey }
        ]

        console.log('SearchAllRestoProductSlider')
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInRestoRestoPromo(language, keyword, filterData, sortData, restoKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var InRestoFilter = { name: "restoKey", operator: '=', value: restoKey };
        filterData.push(InRestoFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoPromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInRestoRestoProduct(language, keyword, filterData, sortData, restoKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var InRestoFilter = { name: "restoKey", operator: '=', value: restoKey };
        filterData.push(InRestoFilter);
        console.log(JSON.stringify(filterData));
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}