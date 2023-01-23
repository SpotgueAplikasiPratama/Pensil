/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VtrendingAPI extends SGBaseScreen {

    static async getUserTrendingPlaceEventSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingPlaceEventSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingPlaceSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingPlaceSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingStoreSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingStoreSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingAuctionSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingAuctionSlider')
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingStorePromoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingStorePromoSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingRestoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingRestoSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingRestoPromoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchTrendingRestoPromoSlider')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingPlaceEventList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchTrendingPlaceEventList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingPlaceList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");

        console.log(token);

        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        }))
        
        var res = await SGHelperAPICall.callAPISync('SearchTrendingPlaceList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingAuctionList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort,
        //     paging:pagingParam
        // }));
       
        var res = await SGHelperAPICall.callAPISync('SearchTrendingAuctionList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingStoreList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchTrendingStoreList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingStorePromoList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort,
        //     paging:pagingParam
        // }));
       
        var res = await SGHelperAPICall.callAPISync('SearchTrendingStorePromoList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingRestoList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchTrendingRestoList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserTrendingRestoPromoList(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");

        console.log(token)
        
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchTrendingRestoPromoList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

}