/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchInThisPlaceAPI extends SGBaseScreen {

    static async getSearchAllStoreInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllBuildingEventInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllBuildingEventSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStorePromoInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStorePromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoPromoInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoPromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStoreProductInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllRestoMenuInBuildingSlider(language, keyword, buildingKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");

        console.log('getSearchAllRestoMenuInBuildingSlider')
        console.log(token)
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlacePlaceEvent(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllBuildingEvent', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlaceAuction(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllAuction', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlaceStorePromo(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log('res')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllStorePromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlaceRestoPromo(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoPromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlaceStore(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        console.log(JSON.stringify(
            {
                filter: filtersort.filter,
                sort: filtersort.sort,
                paging:pagingParam
            }
        ))
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchAllStore', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingPlaceResto(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

     
        
        var res = await SGHelperAPICall.callAPISync('SearchAllResto', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingStoreProduct(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log('getSearchInBuildingStoreProduct')
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInBuildingRestoProduct(language, keyword, filterData, sortData, buildingKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var inBuildingFilter = { name: "buildingKey", operator: '=', value: buildingKey };
        filterData.push(inBuildingFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log('getSearchInBuildingRestoProduct')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllRestoProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }
}