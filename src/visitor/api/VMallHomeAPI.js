/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VMallHomeAPI extends SGBaseScreen {

    static async getBuildingContent(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetBuildingContent', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingHomeHeader(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetBuildingHomeHeader', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchBuildingHighlightSaleDiscount(buildingID) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSaleDiscount', buildingID)
        // console.log('SearchBuildingHighlightSaleDiscount')
        // console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchBuildingHighlightSaleHashtag(buildingKey,language, arrFilter, arrSort,pagingParam) {
        console.log('SearchBuildingHighlightSaleHashtag')
        arrFilter.push({ name: language.toUpperCase(), operator: 'SEARCH', value: '' });
        arrFilter.push({ name: 'buildingKey', operator: '=', value: buildingKey });
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))

        console.log('search building hashtagsale')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        console.log(SGHelperGlobalVar.getVar('token'))
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSaleHashtag', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchBuildingHighlightSeeMoreSaleDiscount(buildingKey, arrFilter, arrSort,pagingParam) {
        arrFilter.push({ name: 'buildingKey', operator: '=', value: buildingKey });
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSeeMoreSaleDiscount', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchBuildingHighlightSeeMoreSaleHashtag(buildingKey,language,keyword, arrFilter, arrSort,pagingParam) {
        arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSeeMoreSaleHashtag', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })

        console.log('SearchBuildingHighlightSeeMoreSaleHashtag')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }));
        return SGHelperErrorHandling.executeRespon(res)
    }


    static async SearchBuildingHighlightSeeMoreSaleDiscountWithKeyword(buildingKey,language,keyword, arrFilter, arrSort,pagingParam) {
        arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'buildingKey', operator: '=', value: buildingKey }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSeeMoreSaleDiscountWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log('SearchBuildingHighlightSeeMoreSaleDiscountWithKeyword')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    


    static async getBuildingParkingHighlightData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingParkingHighLight', contentKey)
        console.log('building parking highlight')
        // console.log(res)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingEventSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightEvent', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingAuctionSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightAuction', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingStorePromoSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightStorePromo', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingRestoPromoSlider(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightRestoPromo', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingMostLikedStore(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightMostLikedStore', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingMostLikedResto(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightMostLikedResto', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getStoreCategoryData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingStoreCategory', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingFloorData(contentKey) {

        var res = await SGHelperAPICall.callAPISync('SearchPickerBuildingFloor', contentKey)
        var resArr = SGHelperErrorHandling.executeRespon(res)
        
        resArr.unshift({ key: "DefaultAll", fFloorNameID: "Semua Lantai", fFloorNameEN: "All Floor", fFloorNameCN: "所有楼层" })
        return (resArr);
 
    }

    static async getBuildingStoreListData(contentKey) {
        var arrFilter = [
            { name: 'buildingKey', operator: '=', value: contentKey }
        ]
        var arrSort = [
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHomeStoreList', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    // resto

    static async getRestoCategoryData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingRestoCategory',contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoCuisineData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingRestoCuisineCategory',contentKey)
        var resArr = SGHelperErrorHandling.executeRespon(res)
        resArr.unshift({ key: "DefaultAll" })
        return (resArr);

    }

    static async getBuildingRestoListData(contentKey) {
        var arrFilter = [
            { name: 'buildingKey', operator: '=', value: contentKey }
        ]
        var arrSort = [
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await SGHelperAPICall.callAPISync('SearchBuildingHomeRestoList',{
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        // console.log(res)
        return SGHelperErrorHandling.executeRespon(res)
    }

    //tab facility
    static async getFacilityCategoryData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingFacilityCategory',contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getParkingListData(contentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchBuildingParkingList',contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingFacilityListData(contentKey) {
        var arrFilter = [
            { name: 'buildingKey', operator: '=', value: contentKey }
        ]
        var arrSort = [
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHomeFacilityList',{
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }


}