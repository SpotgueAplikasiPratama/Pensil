import React from 'react';
import Core from '../../../core/core';
import { SGFormPicker } from '../../../core/form';
import MyTranslator from '../../lessons/locale/MyTranslator';

export default class ExistingMemberForm extends Core.Form.SGBaseForm {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center' },
            Date: {marginVertical: 4 * p},
            c1: { width: w, height: h, padding: p },
            throwWHP: { width: w, height:h , padding: p },
            Card: {marginBottom: 4 * p, borderWidth: p*0.06, padding: p*2, borderColor: 'black', borderRadius: p*2},
            Text: {zIndex: 1, top: p*3, marginTop: p*4, backgroundColor: 'white', paddingHorizontal: p*3},
            cardFlow:{width: w*0.9 ,flexDirection: 'row', justifyContent:'space-between'},
            textFlow: {width: w*0.8},
            v4: { width: w*0.08, alignItems: 'center',justifyContent:'center' },
            buttonInviteMember: { width: w - 16 * p, borderRadius: p, borderWidth: 1, marginVertical: 3*p, borderColor: 'black', padding: p*2, backgroundColor: 'white', flexDirection:'row', justifyContent: 'space-between' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.screenWHP);
        this.initData(this.props.data);
        this.setting = this.props.setting;
        this.referralCode = this.props.userData.fReferralCode;
        this.setData('fReferralCode', this.referralCode)
        this.setData('fCardKey', this.props.card.fCardKey)
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

    render() {
        const { SGView, SGTextInput, SGImagePicker} = Core.Control;
        const { SGFormTextInput, SGFormDatePicker, SGFormPicker, SGFormImagePicker } = Core.Form;
        this.initData(this.props.data);
        this.selectedCountry = this.getData('fMemberProfileJSON.fCountry');
        this.selectedProvince = this.getData('fMemberProfileJSON.fProvince');
        this.selectedCity = this.getData('fMemberProfileJSON.fCity');
        this.cardList = this.props.cardList;
        this.langauge = this.props.language;
        var disabled = this.props.disabled;
        var countryData = this._getCountryData();
        var provinceData = this._getProvinceData();
        var cityData = this._getCityData();
        this.setting = this.props.setting;
        this.data = this.props.data
        var { w, h, p } = this.screenWHP;
        var style = this.style;
        return (
        <SGView accessible={true} accessibilityLabel={''} style={style.v1}> 
        
            {/* <SGFormTextInput disabled={true} dataType={SGTextInput.dataType.text} label={'Referral Code'} placeholder={'Enter Here'} value={this.getData('fReferralCode')}/> */}
            <SGFormTextInput disabled={disabled} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('AddNewRegistrationForm.cardNumberLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.cardNumberPlaceholder')} value={this.getData('fCardNumber')} onValueChange={(v) => { this.setData('fCardNumber', v),this.forceUpdate();}} validator={this._data.getValidators('fCardNumber')}/>

            <SGFormTextInput maxLength={16} disabled={disabled} hidden={this.setting.fIDCardNumber == "hidden" ? true : false} dataType={SGTextInput.dataType.phone} label={MyTranslator.tr('AddNewRegistrationForm.IDCardNumberLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.IDCardNumberPlaceholder')} value={this.getData('fMemberProfileJSON.fIDCardNumber')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fIDCardNumber', v),this.forceUpdate();}} validator={this.setting.fIDCardNumber == "mandatory" && this._data.getValidators('fMemberProfileJSON.fIDCardNumber')}/>
            <SGFormImagePicker disabled={disabled} hidden={this.setting.fIDCardPicture == "hidden" ? true : false} label={MyTranslator.tr('AddNewRegistrationForm.IDCardImageLabel')} noreview hideText language={this.language}  maxImageCount={1} ratio={SGImagePicker.ratio.r16x9}  onValueChange={(v) => { this.setData('fMemberProfileJSON.fIDCardPicture', v) }} value={this.getData('fMemberProfileJSON.fIDCardPicture')} validator={this.setting.fIDCardPicture == "mandatory" && this._data.getValidators('fMemberProfileJSON.fIDCardPicture')}></SGFormImagePicker>

            <SGFormTextInput disabled={disabled} hidden={this.setting.fFullName == "hidden" ? true : false} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('AddNewRegistrationForm.fullNameLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.fullNamePlaceholder')} value={this.getData('fMemberProfileJSON.fFullName')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fFullName', v),this.forceUpdate();}}  validator={this.setting.fFullName == "mandatory" && this._data.getValidators('fMemberProfileJSON.fFullName')}/>
            <SGFormTextInput disabled={disabled} hidden={this.setting.fEmail == "hidden" ? true : false} style={{width:w*0.8}}dataType={SGTextInput.dataType.email} label={MyTranslator.tr('AddNewRegistrationForm.emailLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.emailPlaceholder')} value={this.getData('fMemberProfileJSON.fEmail')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fEmail', v),this.forceUpdate();}} validator={this.setting.fEmail == "mandatory" && this._data.getValidators('fMemberProfileJSON.fEmail')}/>

            <SGFormTextInput disabled={disabled} hidden={this.setting.fMobilePhone == "hidden" ? true : false} style={{width:w*0.8}}dataType={SGTextInput.dataType.phone} label={MyTranslator.tr('AddNewRegistrationForm.phoneNumberLabel')} placeholder={MyTranslator.tr('AddNewRegistrationForm.phoneNumberPlaceholder')} value={this.getData('fMemberProfileJSON.fMobilePhone')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fMobilePhone', v),this.forceUpdate();}} validator={this.setting.fMobilePhone == "mandatory" && this._data.getValidators('fMemberProfileJSON.fMobilePhone')}/>

            <SGFormDatePicker disabled={disabled} hidden={this.setting.fBirthDate == "hidden" ? true : false} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={MyTranslator.tr('AddNewRegistrationForm.birthDateLabel')} value={this.getData('fMemberProfileJSON.fBirthDate')} onValueChange={(v) => { this.setData('fMemberProfileJSON.fBirthDate', v),this.forceUpdate();}} validator={this.setting.fBirthDate == "mandatory" && this._data.getValidators('fMemberProfileJSON.fBirthDate')}/>
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
        </SGView>
        );
    }
}
