/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchAllAPI extends SGBaseScreen {

    static async getSearchAllBuildingSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllBuildingSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStoreSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllBuildingEventSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllBuildingEventSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStorePromoSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStorePromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoPromoSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoPromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStoreProductSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoProductSlider(language, keyword, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}