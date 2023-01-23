/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVWaitingListAPI extends SGBaseScreen {

    static async addWaitingListVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('addWaitingListVisitor', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async cancelWaitingListVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('CancelWaitingListVisitor', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateCallWaitingListVisitor(data) {
        console.log('updateCallWaitingListVisitor')
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(data))
        var res = await SGHelperAPICall.callAPISync('UpdateCallVisitorController', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async searchWaitingListVisitor(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchWaitingListVisitorController', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchWaitingListMyBookingTenantList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        // console.log(SGHelperGlobalVar.getVar('token'))
        // console.log(JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort,
        //     paging:pagingParam
        // }))
        var res = await SGHelperAPICall.callAPISync('SearchWaitingListMyBookingTenantList',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log('API')
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchWaitingListMyBookingTenantListBrand(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchWaitingListMyBookingTenantListByGroupTenant',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async searchWaitingListMyBookingVisitor(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        // console.log({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort,
        //     paging:pagingParam
        // })
        
        var res = await SGHelperAPICall.callAPISync('SearchWaitingListMyBooking', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

}