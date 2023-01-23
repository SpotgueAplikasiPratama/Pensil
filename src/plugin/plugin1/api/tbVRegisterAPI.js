import React from 'react';
import Core from '../../../core/core';

export default class tbVRegisterAPI{
    
    static async GetNewRegistrationFormSetting(data) {
        console.log(Core.Helper.SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(data));
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetNewRegistrationFormSetting', data)
        console.log('res GetNewRegistrationFormSetting')
        console.log(res);
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetExistingRegistrationFormSetting(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetExistingRegistrationFormSetting', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetNewRegistrationSetting(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetNewRegistrationSetting', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetMyLoyaltyRegistration(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyRegistration', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async getExternalAPISetting(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('getExternalAPISetting', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async CancelMyLoyaltyRegistration(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('CancelMyLoyaltyRegistration', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async AddNewUserLoyaltyRegistration(data) {
        console.log(JSON.stringify(data))
        console.log('data new')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('AddNewUserLoyaltyRegistration', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async AddExistingUserLoyaltyRegistration(data) {
        console.log(JSON.stringify(data.getCurrentJSON()))
        console.log('data existing')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('AddExistingUserLoyaltyRegistration', data.getCurrentJSON())
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async LoyaltyCardListPicker(lang) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('LoyaltyCardListPicker', lang)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async TenantListPicker(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('TenantListPicker', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }
    
    static async CardListPicker(data) {
        Core.log('Saya API CardListPicker')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('CardListPicker', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async GetUDFLoyaltyByBuilding(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetUDFLoyaltyByBuilding', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async SearchLocationMatrix(arrFilter, arrSort) {
        Core.log('sudah masuk ke dalam SearchLocation Matriks API')
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");
        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchLocationMatrix', {
            filter: filtersort.filter,
            sort: filtersort.sort   })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async GetLoyaltyCustomReceiptSettByCategory(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetLoyaltyCustomReceiptSettByCategory', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

}