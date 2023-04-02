import React from 'react';
import Core from '../../../core/core';
import MyTranslator from '../../lessons/locale/MyTranslator';
import { ArrayOfReceiptCRUDList } from './ArrayOfReceiptCRUD';

export default class AddNewMemberForm extends Core.Form.SGBaseForm {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height:h , padding: p },
            v1: { justifyContent: 'center' },
            Date: {marginVertical: 4 * p},
            c1: { width: w, height: h, padding: p },
            Card: {marginBottom: 4 * p, borderWidth: p*0.06, padding: p*2, borderColor: 'black', borderRadius: p*2, alignItems: 'flex-start'},
            Text: {zIndex: 1, top: p*3, marginTop: p*4, backgroundColor: 'white', paddingHorizontal: p*3},
            cardFlow:{width: w*0.9 ,flexDirection: 'row', justifyContent:'space-between'},
            textFlow: {width: w*0.8},
            v4: { width: w*0.08, alignItems: 'center',justifyContent:'center' },
            buttonInviteMember: { width: w * 0.9, borderRadius: p, borderWidth: 1, marginVertical: 3*p, borderColor: 'black', padding: p*2, backgroundColor: 'white', flexDirection:'row', justifyContent: 'space-between' },
            phoneInputView: { flexDirection: 'row', justifyContent: 'flex-start', width: (w  - p * 2) * 0.8, marginBottom: p * 4 },
        });
    }
    constructor(props, context, ...args) {
        const { SGPopView } = Core.Control
        const {SGHelperGlobalVar} = Core.Helper
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.screenWHP);
        this.initData(this.props.data);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.setting = this.props.setting;
        this.UDFSetting = this.props.UDFSetting
        this.settingReceipt = this.props.settingReceipt;
        console.log(this.settingReceipt)
        console.log('setting receipt')
        this.referralCode = this.props.userData.fReferralCode;
        this.setData('fReferralCode', this.referralCode)
        this.setData('fCardKey', this.props.card.fCardKey)
        this.pvID = SGPopView.getPopViewID();
        this.pickerIncome = this._getPickerData('IncomeRange')
        this.pickerReligion = this._getPickerData('Religion')
        this.pickerMaritalStatus = this._getPickerData('MaritalStatus')
        this.pickerGender = this._getPickerData('Gender')
    }

    _getPickerData(filter) {
        const {SGHelperType, SGHelperGlobalVar, tbLookupDAO, VisitorHelper} = Core.Helper

        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        var data = [];
        for (var i = 0; i < pullData.length; i++) {
            var pickerData = { key: pullData[i].fLookUpKey, title:pullData[i].fLanguage[this._language.toLowerCase()]  };
            data.push(pickerData)
        }
        data = VisitorHelper._naturalSort(data, 'desc', 'key');
        // Core.log('saya pulldata')
        // Core.log(JSON.stringify(data))
        return (data);
    }
       
    
    _getLocalizeDataFromLookUp(filter,key){
        const { SGHelperType, SGHelperGlobalVar, tbLookupDAO } = Core.Helper
        // Core.log('testasltjnal')
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        // Core.log('saya pullData LookUp')
        // Core.log(JSON.stringify(pullData))
        for (var i = 0; i < pullData.length; i++) {
            if(pullData[i].fLookUpKey == key){
                return pullData[i].fLanguage[this._language.toLowerCase()]
            }
        }
        return 'Undefined'
    }

    _getCountryData() {
        const { SGHelperType, SGHelperGlobalVar } = Core.Helper
        var locationMatrix = this.props.LocationMatrix;
        // Core.log('saya location matrix asdpkhasljdasd')
        // Core.log(locationMatrix.length)
        var data = []
        var distinctCountryArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {
            if (!distinctCountryArr.includes(locationMatrix[i].fCountry)) {
                var pickerData = { key: locationMatrix[i].fCountry, title: this._getLocalizeDataFromLookUp('Country',(locationMatrix[i].fCountry))};

                data.push(pickerData);
                distinctCountryArr.push(locationMatrix[i].fCountry);
            }
        }
        return (data);
    }

    _onCountryValueChange(v) {
        this.setData('fMemberProfileJSON.fCountry', v);
        this.setData('fMemberProfileJSON.fProvince', '');
        this.setData('fMemberProfileJSON.fCity', '');
        this.selectedCountry = v
        this.selectedProvince = ''
        this.selectedCity = ''
        this.forceUpdate();
    }

    _getProvinceData() {
        const { SGHelperType, SGHelperGlobalVar } = Core.Helper
        var locationMatrix = this.props.LocationMatrix
        var data = []
        var distinctProvinceArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {

            if (!distinctProvinceArr.includes(locationMatrix[i].fProvince) && locationMatrix[i].fCountry === this.selectedCountry) {
                var pickerData = { key: locationMatrix[i].fProvince, title: this._getLocalizeDataFromLookUp('Province',(locationMatrix[i].fProvince)) };
                data.push(pickerData);
                distinctProvinceArr.push(locationMatrix[i].fProvince);
            }
        }
        return (data);
    }

    _onProvinceValueChange(v) {
        this.setData('fMemberProfileJSON.fProvince', v);
        this.setData('fMemberProfileJSON.fCity', '');
        this.selectedProvince = v
        this.selectedCity = ''
        this.forceUpdate();
    }

    _getCityData() {
        const { SGHelperType, SGHelperGlobalVar } = Core.Helper
        var locationMatrix = this.props.LocationMatrix
        var data = []
        var distinctCityArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {
            if (!distinctCityArr.includes(locationMatrix[i].fCity) && locationMatrix[i].fCountry === this.selectedCountry && locationMatrix[i].fProvince === this.selectedProvince) {
                var pickerData = { key: locationMatrix[i].fCity, title: this._getLocalizeDataFromLookUp('City',(locationMatrix[i].fCity))};

                data.push(pickerData);
                distinctCityArr.push(locationMatrix[i].fCity);
            }
        }
        return (data);
    }

    _onCityValueChange(v) {
        this.setData('fMemberProfileJSON.fCity', v);
        this.selectedCity = v;
        this.forceUpdate();
    }

    updateArrayOfAnswer(val) {
        const {SGHelperType} = Core.Helper
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            var acceptJSON = SGHelperType.copyJSON(val[i].getCurrentJSON());
            arr.push(acceptJSON);
        }
        this.arrayOfAnswer = arr;
        this.setData('fRegistrationReceipt', this.arrayOfAnswer);
        if(this.getData('fRegistrationReceipt').length > 0){
            this.bool = false
        }else {
            this.bool = true
        }
        this.forceUpdate();
    }


    render() {
        const { SGView, SGTextInput, SGTouchableOpacity,SGIcon, SGPopView, SGImagePicker, SGText,SGPicker} = Core.Control;
        const { SGFormTextInput, SGFormDatePicker, SGFormPicker, SGFormImagePicker, SGFormTimePicker } = Core.Form;
        const { SGHelperType } = Core.Helper;
        this.initData(this.props.data);
        this.selectedCountry = this.getData('fMemberProfileJSON.fCountry');
        this.selectedProvince = this.getData('fMemberProfileJSON.fProvince');
        this.selectedCity = this.getData('fMemberProfileJSON.fCity');
        this.setting = this.props.setting;
        this.settingReceipt = this.props.settingReceipt;
        // this.data = this.props.data;
        this.cardList = this.props.cardList;
        this.language = this.props.language;
        var disabled = this.props.disabled;
        var { w, h, p } = this.screenWHP;
        var style = this.style; 
        var countryData = this._getCountryData();
        var provinceData = this._getProvinceData();
        var cityData = this._getCityData();
        console.log(this.settingReceipt)
        console.log('setting new regis')
        return (
            <SGView accessible={true} accessibilityLabel={''} style={style.v1}> 
            
            {/* <SGFormTextInput disabled={true} dataType={SGTextInput.dataType.text} label={'Referral Code'} placeholder={'Enter Here'} value={this.getData('fReferralCode')}/> */}
            
            <SGFormTextInput maxLength={16} disabled={disabled} hidden={this.setting.fIDCardNumber == "hidden" ? true : false} dataType={SGTextInput.dataType.phone} label={MyTranslator.tr('AddNewRegistrationForm.IDCardNumberLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.IDCardNumberPlaceholder')} value={this.getData('fMemberProfileJSON.fIDCardNumber')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fIDCardNumber', v),this.forceUpdate();}} validator={this.setting.fIDCardNumber == "mandatory" && this._data.getValidators('fMemberProfileJSON.fIDCardNumber')}/>
            <SGFormImagePicker disabled={disabled} hidden={this.setting.fIDCardPicture == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.IDCardImageLabel')} noreview hideText language={this.language}  maxImageCount={1} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fIDCardPicture', v) }} value={this.getData('fMemberProfileJSON.fIDCardPicture')} validator={this.setting.fIDCardPicture == "mandatory" && this._data.getValidators('fMemberProfileJSON.fIDCardPicture')}></SGFormImagePicker>

            <SGFormTextInput disabled={disabled} hidden={this.setting.fFullName == "hidden" ? true : false} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('AddNewRegistrationForm.fullNameLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.fullNamePlaceholder')} value={this.getData('fMemberProfileJSON.fFullName')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fFullName', v),this.forceUpdate();}}  validator={this.setting.fFullName == "mandatory" && this._data.getValidators('fMemberProfileJSON.fFullName')}/>
            <SGFormTextInput disabled={disabled} hidden={this.setting.fEmail == "hidden" ? true : false} style={{width:w*0.8}}dataType={SGTextInput.dataType.email} label={MyTranslator.tr('AddNewRegistrationForm.emailLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.emailPlaceholder')} value={this.getData('fMemberProfileJSON.fEmail')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fEmail', v),this.forceUpdate();}} validator={this.setting.fEmail == "mandatory" && this._data.getValidators('fMemberProfileJSON.fEmail')}/>

            <SGFormTextInput disabled={disabled} hidden={this.setting.fMobilePhone == "hidden" ? true : false} maxLength={13} style={{width:w*0.8}}dataType={SGTextInput.dataType.phone} label={MyTranslator.tr('AddNewRegistrationForm.phoneNumberLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.phoneNumberPlaceholder')} value={this.getData('fMemberProfileJSON.fMobilePhone')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fMobilePhone', v),this.forceUpdate();}} validator={this.setting.fMobilePhone == "mandatory" && this._data.getValidators('fMemberProfileJSON.fMobilePhone')}/>

            <SGFormDatePicker disabled={disabled} hidden={this.setting.fBirthDate == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={MyTranslator.tr('AddNewRegistrationForm.birthDateLabel')} placeholder={''} value={this.getData('fMemberProfileJSON.fBirthDate')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fBirthDate', v),this.forceUpdate();}} validator={this.setting.fBirthDate == "mandatory" && this._data.getValidators('fMemberProfileJSON.fBirthDate')}/>
           

            <SGFormTextInput disabled={disabled} hidden={this.setting.fBirthPlace == "hidden" ? true : false} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('AddNewRegistrationForm.birthPlaceLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.birthPlacePlaceholder')} value={this.getData('fMemberProfileJSON.fBirthPlace')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fBirthPlace', v),this.forceUpdate();}} validator={this.setting.fBirthPlace == "mandatory" && this._data.getValidators('fMemberProfileJSON.fBirthPlace')}/>
            <SGFormPicker disabled={disabled} single hidden={this.setting.fGender == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.genderLabel')} value={this.getData('fMemberProfileJSON.fGender')} optionList={this.pickerGender} onValueChange={(v) => { this.setData('fMemberProfileJSON.fGender', v),this.forceUpdate(); }} validator={this.setting.fGender == "mandatory" && this._data.getValidators('fMemberProfileJSON.fGender')}/>
            <SGFormPicker disabled={disabled} single hidden={this.setting.fReligion == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.religionLabel')} value={this.getData('fMemberProfileJSON.fReligion')} optionList={this.pickerReligion} onValueChange={(v) => { this.setData('fMemberProfileJSON.fReligion', v),this.forceUpdate(); }}validator={this.setting.fReligion == "mandatory" && this._data.getValidators('fMemberProfileJSON.fReligion')}/>
            <SGFormPicker disabled={disabled} single hidden={this.setting.fMaritalStatus == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.maritalStatusLabel')} value={this.getData('fMemberProfileJSON.fMaritalStatus')} optionList={this.pickerMaritalStatus} onValueChange={(v) => { this.setData('fMemberProfileJSON.fMaritalStatus', v),this.forceUpdate(); }} validator={this.setting.fMaritalStatus == "mandatory" && this._data.getValidators('fMemberProfileJSON.fMaritalStatus')}/>

            <SGFormPicker disabled={disabled} hidden={this.setting.fCountry == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.countryLabel')} single optionList={countryData} onValueChange={(v) => { this._onCountryValueChange(v) }} value={this.getData('fMemberProfileJSON.fCountry')} validator={this.setting.fCountry == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCountry')}/>
            <SGFormPicker disabled={disabled} hidden={this.setting.fProvince == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.provinceLabel')} single optionList={provinceData} onValueChange={(v) => { this._onProvinceValueChange(v) }} value={this.getData('fMemberProfileJSON.fProvince')} validator={this.setting.fProvince == "mandatory" && this._data.getValidators('fMemberProfileJSON.fProvince')}/>
            <SGFormPicker disabled={disabled} hidden={this.setting.fCity == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.cityLabel')} single optionList={cityData} onValueChange={(v) => { this._onCityValueChange(v) }} value={this.getData('fMemberProfileJSON.fCity')} validator={this.setting.fCity == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCity')} />
            <SGFormTextInput disabled={disabled} hidden={this.setting.fAddress == "hidden" ? true : false} style={{width:w*0.8}}dataType={SGTextInput.dataType.multiline} label={MyTranslator.tr('AddNewRegistrationForm.addressLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.addressPlaceholder')} value={this.getData('fMemberProfileJSON.fAddress')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fAddress', v),this.forceUpdate();}} validator={this.setting.fAddress == "mandatory" && this._data.getValidators('fMemberProfileJSON.fAddress')}/>
            <SGFormTextInput disabled={disabled} hidden={this.setting.fPostalCode == "hidden" ? true : false}  style={{width:w*0.8}} dataType={SGTextInput.dataType.phone} label={MyTranslator.tr('AddNewRegistrationForm.postalCode')} placeholder={''} value={this.getData('fMemberProfileJSON.fPostalCode')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fPostalCode', v),this.forceUpdate();}} validator={this.setting.fPostalCode == "mandatory" && this._data.getValidators('fMemberProfileJSON.fPostalCode')}/>
            <SGFormTextInput disabled={disabled} hidden={this.setting.fOccupation == "hidden" ? true : false} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('AddNewRegistrationForm.occupationLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.occupationPlaceholder')} value={this.getData('fMemberProfileJSON.fOccupation')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fOccupation', v),this.forceUpdate();}} validator={this.setting.fOccupation == "mandatory" && this._data.getValidators('fMemberProfileJSON.fOccupation')}/>
            <SGFormPicker disabled={disabled} single hidden={this.setting.fIncomeRange == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.incomeLabel')} value={this.getData('fMemberProfileJSON.fIncomeRange')} optionList={this.pickerIncome} onValueChange={(v) => { this.setData('fMemberProfileJSON.fIncomeRange', v),this.forceUpdate(); }} validator={this.setting.fIncomeRange == "mandatory" && this._data.getValidators('fMemberProfileJSON.fIncomeRange')}/>
            
            {this.UDFSetting.fUDFLoyalty[0].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[0].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField1 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[0].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField1', v) }} value={this.getData('fMemberProfileJSON.fCustomField1')} validator={this.setting.fCustomField1 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField1')}/>
                :
                this.UDFSetting.fUDFLoyalty[0].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField1 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[0].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField1', v) }} value={this.getData('fMemberProfileJSON.fCustomField1')} validator={this.setting.fCustomField1 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField1')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[0].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField1 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[0].fLabel} value={this.getData('fMemberProfileJSON.fCustomField1')} optionList={this.UDFSetting.fUDFLoyalty[0].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField1', v),this.forceUpdate(); }} validator={this.setting.fCustomField1 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField1')}/>
                :
                this.UDFSetting.fUDFLoyalty[0].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField1 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[0].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField1'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField1', v),this.forceUpdate();}} validator={this.setting.fCustomField1 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField1')}/>
                :
                this.UDFSetting.fUDFLoyalty[0].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[0].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField1', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField1'))} validator={this.setting.fCustomField1 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField1')}/>
            }

            {this.UDFSetting.fUDFLoyalty[1].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[1].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField2 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[1].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField2', v) }} value={this.getData('fMemberProfileJSON.fCustomField2')} validator={this.setting.fCustomField2 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField2')}/>
                :
                this.UDFSetting.fUDFLoyalty[1].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField2 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[1].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField2', v) }} value={this.getData('fMemberProfileJSON.fCustomField2')} validator={this.setting.fCustomField2 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField2')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[1].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField2 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[1].fLabel} value={this.getData('fMemberProfileJSON.fCustomField2')} optionList={this.UDFSetting.fUDFLoyalty[1].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField2', v),this.forceUpdate(); }} validator={this.setting.fCustomField2 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField2')}/>
                :
                this.UDFSetting.fUDFLoyalty[1].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField2 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[1].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField2'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField2', v),this.forceUpdate();}} validator={this.setting.fCustomField2 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField2')}/>
                :
                this.UDFSetting.fUDFLoyalty[1].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[1].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField2', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField2'))} validator={this.setting.fCustomField2 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField2')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[2].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[2].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField3 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[2].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField3', v) }} value={this.getData('fMemberProfileJSON.fCustomField3')} validator={this.setting.fCustomField3 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField3')}/>
                :
                this.UDFSetting.fUDFLoyalty[2].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField3 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[2].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField3', v) }} value={this.getData('fMemberProfileJSON.fCustomField3')} validator={this.setting.fCustomField3 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField3')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[2].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField3 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[2].fLabel} value={this.getData('fMemberProfileJSON.fCustomField3')} optionList={this.UDFSetting.fUDFLoyalty[2].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField3', v),this.forceUpdate(); }} validator={this.setting.fCustomField3 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField3')}/>
                :
                this.UDFSetting.fUDFLoyalty[2].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField3 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[2].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField3'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField3', v),this.forceUpdate();}} validator={this.setting.fCustomField3 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField3')}/>
                :
                this.UDFSetting.fUDFLoyalty[2].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[2].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField3', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField3'))} validator={this.setting.fCustomField3 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField3')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[3].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[3].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField4 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[3].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField4', v) }} value={this.getData('fMemberProfileJSON.fCustomField4')} validator={this.setting.fCustomField4 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField4')}/>
                :
                this.UDFSetting.fUDFLoyalty[3].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField4 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[3].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField4', v) }} value={this.getData('fMemberProfileJSON.fCustomField4')} validator={this.setting.fCustomField4 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField4')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[3].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField4 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[3].fLabel} value={this.getData('fMemberProfileJSON.fCustomField4')} optionList={this.UDFSetting.fUDFLoyalty[3].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField4', v),this.forceUpdate(); }} validator={this.setting.fCustomField4 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField4')}/>
                :
                this.UDFSetting.fUDFLoyalty[3].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField4 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[3].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField4'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField4', v),this.forceUpdate();}} validator={this.setting.fCustomField4 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField4')}/>
                :
                this.UDFSetting.fUDFLoyalty[3].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[3].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField4', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField4'))} validator={this.setting.fCustomField4 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField4')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[4].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[4].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField5 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[5].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField5', v) }} value={this.getData('fMemberProfileJSON.fCustomField5')} validator={this.setting.fCustomField5 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField5')}/>
                :
                this.UDFSetting.fUDFLoyalty[4].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField5 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[5].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField5', v) }} value={this.getData('fMemberProfileJSON.fCustomField5')} validator={this.setting.fCustomField5 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField5')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[4].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField5 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[5].fLabel} value={this.getData('fMemberProfileJSON.fCustomField5')} optionList={this.UDFSetting.fUDFLoyalty[5].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField5', v),this.forceUpdate(); }} validator={this.setting.fCustomField5 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField5')}/>
                :
                this.UDFSetting.fUDFLoyalty[4].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField5 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[5].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField5'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField5', v),this.forceUpdate();}} validator={this.setting.fCustomField5 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField5')}/>
                :
                this.UDFSetting.fUDFLoyalty[4].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[5].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField5', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField5'))} validator={this.setting.fCustomField5 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField5')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[5].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[5].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField6 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[5].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField6', v) }} value={this.getData('fMemberProfileJSON.fCustomField6')} validator={this.setting.fCustomField6 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField6')}/>
                :
                this.UDFSetting.fUDFLoyalty[5].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField6 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[5].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField6', v) }} value={this.getData('fMemberProfileJSON.fCustomField6')} validator={this.setting.fCustomField6 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField6')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[5].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField6 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[5].fLabel} value={this.getData('fMemberProfileJSON.fCustomField6')} optionList={this.UDFSetting.fUDFLoyalty[5].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField6', v),this.forceUpdate(); }} validator={this.setting.fCustomField6 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField6')}/>
                :
                this.UDFSetting.fUDFLoyalty[5].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField6 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[5].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField6'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField6', v),this.forceUpdate();}} validator={this.setting.fCustomField6 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField6')}/>
                :
                this.UDFSetting.fUDFLoyalty[5].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[5].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField6', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField6'))} validator={this.setting.fCustomField6 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField6')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[6].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[6].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField7 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[6].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField7', v) }} value={this.getData('fMemberProfileJSON.fCustomField7')} validator={this.setting.fCustomField7 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField7')}/>
                :
                this.UDFSetting.fUDFLoyalty[6].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField7 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[6].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField7', v) }} value={this.getData('fMemberProfileJSON.fCustomField7')} validator={this.setting.fCustomField7 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField7')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[6].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField7 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[6].fLabel} value={this.getData('fMemberProfileJSON.fCustomField7')} optionList={this.UDFSetting.fUDFLoyalty[6].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField7', v),this.forceUpdate(); }} validator={this.setting.fCustomField7 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField7')}/>
                :
                this.UDFSetting.fUDFLoyalty[6].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField7 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[6].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField7'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField7', v),this.forceUpdate();}} validator={this.setting.fCustomField7 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField7')}/>
                :
                this.UDFSetting.fUDFLoyalty[6].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[6].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField7', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField7'))} validator={this.setting.fCustomField7 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField7')}/>
            }
            
            {this.UDFSetting.fUDFLoyalty[7].fActive == 'Y' &&
                this.UDFSetting.fUDFLoyalty[7].fType == 'text' ?
                <SGFormTextInput hidden={this.setting.fCustomField8 === 'hidden' ? true : false} maxLength={SGHelperType.ArraymaxLength(4)} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.text} label={this.UDFSetting.fUDFLoyalty[7].fLabel}
                    placeholder={('RewardForm.PlaceholderUDF')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField8', v) }} value={this.getData('fMemberProfileJSON.fCustomField8')} validator={this.setting.fCustomField8 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField8')}/>
                :
                this.UDFSetting.fUDFLoyalty[7].fType == 'image' ?
                <SGFormImagePicker disabled={disabled} hidden={this.setting.fCustomField8 === 'hidden' ? true : false} label={this.UDFSetting.fUDFLoyalty[7].fLabel} noreview hideText language={this.language} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField8', v) }} value={this.getData('fMemberProfileJSON.fCustomField8')} validator={this.setting.fCustomField8 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField8')}></SGFormImagePicker>
                :
                this.UDFSetting.fUDFLoyalty[7].fType == 'picker' ?
                <SGFormPicker disabled={disabled} single hidden={this.setting.fCustomField8 == "hidden" ? true : false} label={this.UDFSetting.fUDFLoyalty[7].fLabel} value={this.getData('fMemberProfileJSON.fCustomField8')} optionList={this.UDFSetting.fUDFLoyalty[7].fPickerData} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField8', v),this.forceUpdate(); }} validator={this.setting.fCustomField8 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField8')}/>
                :
                this.UDFSetting.fUDFLoyalty[7].fType == 'date' ?
                <SGFormDatePicker disabled={disabled} hidden={this.setting.fCustomField8 == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={this.UDFSetting.fUDFLoyalty[7].fLabel} placeholder={''} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField8'))} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField8', v),this.forceUpdate();}} validator={this.setting.fCustomField8 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField8')}/>
                :
                this.UDFSetting.fUDFLoyalty[7].fType == 'time' &&
                <SGFormTimePicker label={this.UDFSetting.fUDFLoyalty[7].fLabel} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fMemberProfileJSON.fCustomField8', v) }} value={SGHelperType.convertNewDate(this.getData('fMemberProfileJSON.fCustomField8'))} validator={this.setting.fCustomField8 == "mandatory" && this._data.getValidators('fMemberProfileJSON.fCustomField8')}/>
            }
            
            {this.settingReceipt.fRegistrationMaxReceiptCombined > 0 &&
                <SGView>
                    <SGText style={style.Text} preset={SGText.preset.h5B}>{MyTranslator.tr('AddNewRegistrationForm.receiptLabel')}</SGText>
                    <SGView style={style.Card}>
                        <ArrayOfReceiptCRUDList newMember={true} disabled={disabled} language={this._language} globalLanguage={this._language} dataList={this.getData('fRegistrationReceipt')} updateArrayOfAnswer={this.updateArrayOfAnswer.bind(this)} style={style.c1} imageSetting ={this.imageSetting} tenantPicker={this.props.tenantPicker} _checkCustomSetting={this.props._checkCustomSetting} fCardKey={this.props.card.fCardKey}></ArrayOfReceiptCRUDList>
                    </SGView>
                </SGView>
            }
        
            
            </SGView>
        );
    }
}
