/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVReservationAPI extends SGBaseScreen {

    static async addReservation(data) {
        console.log('add reservation')
        console.log(JSON.stringify( data.getCurrentJSON()));
        var res = await SGHelperAPICall.callAPISync('addReservationVisitor', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async cancelReservationVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('CancelReservationVisitor', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateCallReservationVisitor(data) {
        console.log(data);
        var res = await SGHelperAPICall.callAPISync('UpdateReservationVisitorCalled', data)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateReservation(data) {
        console.log(data);
        var res = await SGHelperAPICall.callAPISync('UpdateReservationVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }


    static async searchReservation(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchReservationVisitorController', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSettingReservationByContentKey(fContentKey) {
        var res = await SGHelperAPICall.callAPISync('GetTenantReservationSettingInVisitor', fContentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchReservationMyBookingVisitor(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchReservationMyBooking', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchReservationMyBookingTenantList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchReservationMyBookingTenantList',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchReservationMyBookingTenantListBrand(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchReservationMyBookingTenantListByGroupTenant',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }
}