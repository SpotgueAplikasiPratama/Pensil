/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVOrderMenuAPI extends SGBaseScreen {
    static async addOrderTableVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('AddOrderTable', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async addUserxOrderTable(data) {
        var res = await SGHelperAPICall.callAPISync('AddUserxOrderTable', data.getCurrentJSON())
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchUserxOrderTable(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchUserxOrderTable', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }


    static async searchOrderTablesVisitor(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchOrderTable', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async addOrderItemVisitor(data) {
        console.log(JSON.stringify(data))
        var res = await SGHelperAPICall.callAPISync('addItemOrderMenuVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }


    static async cancelOrderDetailByVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('CancelOrderFromVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateConfirmOrderVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('ConfirmOrderVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateCompleteOrderVisitor(data) {
        var res = await SGHelperAPICall.callAPISync('CompleteOrderVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async searchTableDataWithKeyVisitor(fTableKey, fStoreKey) {
        var res = await SGHelperAPICall.callAPISync('SearchOrderMenuTableVisitor', {
            fTableKey: fTableKey,
            fStoreKey: fStoreKey
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchAllOrderDetailVisitorByTableKey(fIDfTableKey) {
        var res = await SGHelperAPICall.callAPISync('SearchAllOrderTableVisitor', fIDfTableKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchTotalOrderVisitor(fIDfTableKey) {
        var res = await SGHelperAPICall.callAPISync('SearchTotalOrderVisitor', fIDfTableKey)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);;
    }

    static async searchCategoryMenuTabVisitor(fContentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchCategoryProductVisitor', fContentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchProductListVisitor(fContentKey) {
        var res = await SGHelperAPICall.callAPISync('SearchProductVisitor', fContentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchOrderMenuProductDetailVisitor(fID) {
        var res = await SGHelperAPICall.callAPISync('SearchOrderMenuProductDetailVisitor', fID)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchOrderMenuMyBookingVisitor(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchOrderMenuMyBooking', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async searchTableListQRCode(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchTableListQrCode', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getTableListByID(fID) {
        var res = await SGHelperAPICall.callAPISync('getTableListByID', fID)
        return SGHelperErrorHandling.executeRespon(res);;
    }

    static async SearchOrderMenuMyBookingTenantList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchOrderMenuMyBookingTenantList',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async SearchOrderMenuMyBookingTenantListBrand(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchOrderMenuMyBookingTenantListByGroupTenant',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

}