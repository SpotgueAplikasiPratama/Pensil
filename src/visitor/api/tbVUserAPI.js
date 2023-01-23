/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserAPI extends SGBaseScreen {

    static async checkReferralCodeValid(referralCode, deviceID) {
        var jsonInput = { referralCode: referralCode, deviceID: deviceID }
        var res = await SGHelperAPICall.callAPISync('CheckReferralCodeValid', jsonInput)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getGoogleData(userID, accessToken) {
        var res = await SGHelperAPICall.callAPISync('GetGoogleData',
            {
                userID: userID,
                accessToken: accessToken
            })
            console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getFacebookData(userID, accessToken) {
        console.log('Facebook API')
        console.log(userID)
        console.log(accessToken)
        var res = await SGHelperAPICall.callAPISync('GetFacebookData',
            {
                userID: userID,
                accessToken: accessToken
            })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async authenticate(userLoginData) {
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(userLoginData));
        var res = await SGHelperAPICall.callAPISync('AuthenticateOTP', userLoginData)
        console.log(res);
        console.log('cek result boi')
        // console.log(res)
        // throw({data:JSON.stringify({message:'SG-C',respInfo:{status:500}})})
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async authenticateByFB(userLoginData) {
        var res = await SGHelperAPICall.callAPISync('AuthenticateByFB', userLoginData)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async authenticateByApple(userLoginData) {
        var res = await SGHelperAPICall.callAPISync('AuthenticateByApple', userLoginData)
       return SGHelperErrorHandling.executeRespon(res);
    }

    static async authenticateByGoogle(userLoginData) {
        var res = await SGHelperAPICall.callAPISync('AuthenticateByGoogle', userLoginData)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async anonymous(deviceJSON) {
        var res = await SGHelperAPICall.callAPISync('Authenticate', deviceJSON)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async isEmailOrPhoneAvailable(emailOrPhoneNumber) {
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(emailOrPhoneNumber))
        var res = await SGHelperAPICall.callAPISync('IsEmailOrPhoneAvailable', emailOrPhoneNumber)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async isAppleIDAvailable(appleID) {
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(appleID))
        var res = await SGHelperAPICall.callAPISync('IsAppleIDAvailable', appleID)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async registerUser(userData) {
        var res = await SGHelperAPICall.callAPISync('RegisterUser', userData)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getUserByID() {
        var res = await SGHelperAPICall.callAPISync('GetByID')
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async regenerateTokenLogin(userLoginData) {
        var res = await SGHelperAPICall.callAPISync('RegenerateTokenLogin', userLoginData)
        console.log('RegenerateTokenLogin')
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSecurityQuestion(emailOrPhoneNumber) {
        var res = await SGHelperAPICall.callAPISync('GetSecurityQuestion', emailOrPhoneNumber)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async checkSecurityQuestion(emailOrPhoneNumber, userAnswer) {
        var jsonInput = { emailOrPhone: emailOrPhoneNumber, answer: userAnswer };
        var res = await SGHelperAPICall.callAPISync('CheckSecurityAnswer', jsonInput)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async changePasswordForgotPassword(emailOrPhoneNumber, password) {
        var jsonInput = { emailOrPhone: emailOrPhoneNumber, password: password };
        var res = await SGHelperAPICall.callAPISync('ChangePasswordForgotPassword', jsonInput)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async changePassword(emailOrPhoneNumber, password) {
        var jsonInput = { emailOrPhone: emailOrPhoneNumber, password: password };
        var res = await SGHelperAPICall.callAPISync('ChangePassword', jsonInput)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async changeEmail(email) {
        var res = await SGHelperAPICall.callAPISync('ChangeEmail', email)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async GetActiveUserLogin() {
        var res = await SGHelperAPICall.callAPISync('GetActiveUserLoginController');
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async ActivateDeveloperMode(value) {
        var res = await SGHelperAPICall.callAPISync('ActivateDeveloperMode', value)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async InActivateDeveloperMode() {
        var res = await SGHelperAPICall.callAPISync('InActivateDeveloperMode')
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async changePhoneNumber(phoneNumber) {
        var res = await SGHelperAPICall.callAPISync('ChangePhoneNumber', phoneNumber)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async changeSecurityQuestion(securityQuestionKey, questionAnswer) {
        var jsonInput = { fSecurityQuestionKey: securityQuestionKey, fQuestionAnswer: questionAnswer };
        var res = await SGHelperAPICall.callAPISync('ChangeSecurityQuestion', jsonInput)
        return SGHelperErrorHandling.executeRespon(res);
    }
    //
    static async addAppleAccount(data) {
        var res = await SGHelperAPICall.callAPISync('AddAppleAccount', data)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async getAppleAccount(fAppleID) {
        var res = await SGHelperAPICall.callAPISync('GetAppleAccountByAppleID', fAppleID)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async addDeletedAcount(data) {
        console.log(data)
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log('input')
        var res = await SGHelperAPICall.callAPISync('AddDeletedAccount', data)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async isEmailOrPhoneDeleted(emailOrPhoneNumber) {
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(emailOrPhoneNumber))
        var res = await SGHelperAPICall.callAPISync('isEmailOrPhoneDeleted', emailOrPhoneNumber)
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }
}