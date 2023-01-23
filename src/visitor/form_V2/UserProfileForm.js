import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGPicker as Picker, SGDatePicker, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGImagePicker, SGFlatList as FlatList, SGText,SGFilePicker } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGFormTextInput, SGFormSwitch, SGFormPicker, SGFormImagePicker, SGFormDatePicker,SGFormFilePicker } from '../../core/form';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperStyle } from '../../core/helper';
import { CustomizationData, CustomizationCarCRUDList } from '../container_V2/CarCRUDCard';
import { VisitorHelper } from '../helper/VisitorHelper';
import image from '../asset/image';

export class UserProfileForm extends SGBaseForm {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { flex: 1, justifyContent: 'center', backgroundColor: 'white',width:w },
            v2: { width: w - 2 * p, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 2 * p, alignItems: 'center' },
            v3: { width: w / 4, height: w * 0.1, backgroundColor: "#e9e9e9", marginLeft: 2 * p },
            v4: { width: w - 2 * p, justifyContent: 'flex-start', backgroundColor: 'white' },
            vImage: { width: (w - 2 * p) / 3, height: w * 0.3, borderRadius: w },
            text: { alignSelf: 'flex-start', marginHorizontal: 2 * p, marginTop: 6 * p,paddingLeft:5*p },
            text2: { alignSelf: 'center' },
            inputView1: { flex: null, marginTop: p, backgroundColor: 'white', width: (w - 6 * p), height: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
            inputView2: { flex: null, marginTop: p, backgroundColor: 'white', width: (w - 6 * p), borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { color: '#7a7a7a', paddingHorizontal: p * 2, fontSize: w * 0.0375 },
            textInput: { flex: null, width: w - 4 * p, height: w * 0.08, alignItems: 'flex-start' },
            button: { backgroundColor: "grey", alignSelf: 'flex-end', marginRight: 2 * p },
            c1: { width: w, height: h, padding: p },
            imageProfile: { width: w * 0.4, height: w * 0.4, borderRadius: w },
            picker: { width: w * 0.1 },
            phoneInputView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: w },
            phoneNumberText: { alignSelf: 'flex-start', paddingLeft:5*p, marginTop: 3 * p, color: SGHelperStyle.color.TextDisabled },
            viewChangePic:{width: (w - 42 * p) / 3,position:'absolute',top:27*p,backgroundColor: '#000000', opacity: 0.8,borderRadius:3*p},
            textChangePic:{color:'white'}
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.carPlate = [];
        this.selectedCountry = this.getData('fCountry');
        this.selectedProvince = this.getData('fProvince');
        this.selectedCity = this.getData('fCity');
        this.state = { show: false, comment: '' };
        this.lookupCountryPhoneCode = tbLookupDAO.getActiveLookUpByGroup('CountryPhoneCode');
        console.log(this.lookupCountryPhoneCode);
        this.countryPhoneCodePickerData = [];
        for (var i = 0; i < this.lookupCountryPhoneCode.length; i++) {
            var jsonPicker = { key: this.lookupCountryPhoneCode[i].fValueKey, title: this.lookupCountryPhoneCode[i].fLanguage[this._language.toLowerCase()], image: image[this.lookupCountryPhoneCode[i].fValueKey].med.url };
            this.countryPhoneCodePickerData.push(jsonPicker);
        }
        this.phoneNumberInput = this.getData('fPhoneNumber');
        this.selectedCountryPhoneCode = this.phoneNumberInput.substr(0, this.phoneNumberInput.indexOf('-'));
        this.IP1 = React.createRef();
    }

    _naturalSort(myArray, type, fieldName ){
        const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
        const sorted = myArray.sort((a, b) => collator.compare(b[fieldName], a[fieldName]))
        if(type==='asc'){
            var res = sorted;
        }
        if(type === 'desc'){
            var res = sorted.reverse();
        }
        console.log(res)
        return(res)
    }

    _getPickerData(filter) {
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        var data = [];
        for (var i = 0; i < pullData.length; i++) {
            var pickerData = { key: pullData[i].fLookUpKey, title:pullData[i].fLanguage[this._language.toLowerCase()]  };
            data.push(pickerData)
        }
        data = VisitorHelper._naturalSort(data, 'desc', 'title');
        return (data);
    }

    _getCountryData() {
        var locationMatrix = this.props.locationMatrix
        var data = []
        var distinctCountryArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {
            if (!distinctCountryArr.includes(locationMatrix[i].fCountry)) {
                var pickerData = { key: locationMatrix[i].fCountry, title: VisitorHelper.getLocalizeDataFromLookUp('Country',(locationMatrix[i].fCountry),this._language) };
                data.push(pickerData);
                distinctCountryArr.push(locationMatrix[i].fCountry);
            }
        }
        data = VisitorHelper._naturalSort(data,'desc','title')
        return (data);
    }

    _onCountryValueChange(v) {
        this.setData('fCountry', v);
        this.setData('fProvince', '');
        this.setData('fCity', '');
        this.selectedCountry = v
        this.selectedProvince = ''
        this.selectedCity = ''
        this.forceUpdate();
    }

    _getProvinceData() {
        var locationMatrix = this.props.locationMatrix
        var data = []
        var distinctProvinceArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {
            if (!distinctProvinceArr.includes(locationMatrix[i].fProvince) && locationMatrix[i].fCountry === this.selectedCountry) {
                var pickerData = { key: locationMatrix[i].fProvince, title:  VisitorHelper.getLocalizeDataFromLookUp('Province',(locationMatrix[i].fProvince),this._language) };
                data.push(pickerData);
                distinctProvinceArr.push(locationMatrix[i].fProvince);
            }
        }
        data = VisitorHelper._naturalSort(data,'desc','title')
        console.log('data province')
        console.log(data);
        return (data);
    }

    _onProvinceValueChange(v) {
        this.setData('fProvince', v);
        this.setData('fCity', '');
        this.selectedProvince = v
        this.selectedCity = ''
        this.forceUpdate();
    }

    _getCityData() {
        var locationMatrix = this.props.locationMatrix
        var data = []
        var distinctCityArr = [];
        for (var i = 0; i < locationMatrix.length; i++) {
            if (!distinctCityArr.includes(locationMatrix[i].fCity) && locationMatrix[i].fCountry === this.selectedCountry && locationMatrix[i].fProvince === this.selectedProvince) {
                var pickerData = { key: locationMatrix[i].fCity, title: VisitorHelper.getLocalizeDataFromLookUp('City',(locationMatrix[i].fCity),this._language) };
                data.push(pickerData);
                distinctCityArr.push(locationMatrix[i].fCity);
            }
        }
        data = VisitorHelper._naturalSort(data,'desc','key')
        return (data);
    }

    _onCityValueChange(v) {
        this.setData('fCity', v);
        this.selectedCity = v;
        this.forceUpdate();
    }

    _pushPickerData() {
        var securityQuestionData = this._getPickerData("SecurityQuestion");
        var genderData = this._getPickerData("Gender");
        var reservationTimeData = this._getPickerData("ReservationReminder");
        var statusData = this._getPickerData("Family");
        var preferenceData = this._getPickerData("Preference");
        var spendingCriteriaData = this._getSpendingCriteriaData("SpendingCriteria","SpendingCriteria");
        spendingCriteriaData = VisitorHelper._sortArrJSON(spendingCriteriaData, 'key', true);
        this.pickerData = [];
        this.pickerData.push(securityQuestionData)
        this.pickerData.push(genderData)
        this.pickerData.push(reservationTimeData)
        this.pickerData.push(statusData)
        this.pickerData.push(preferenceData)
        this.pickerData.push(spendingCriteriaData)
    }

    _getSpendingCriteriaData(filter, LookUpVariable) {
        var spendingCriteriaJSON = {
            IDR: { d: { min: 0.0, max: 250000.0 }, c: { min: 250000.0, max: 750000.0 }, b: { min: 750000.0, max: 1500000.0 }, a: { min: 1500000.0, max: 1000000000.0 } },
            USD: { d: { min: 0.0, max: 20.0, }, c: { min: 20.0, max: 55.0 }, b: { min: 55.0, max: 110.0 }, a: { min: 110.0, max: 1000000000.0 } },
            CNY: { d: { min: 0.0, max: 120.0 }, c: { min: 120.0, max: 350.0 }, b: { min: 350.0, max: 700.0 }, a: { min: 700.0, max: 1000000000.0 } },
            JPY: { d: { min: 0.0, max: 1850.0 }, c: { min: 1850.0, max: 5550.0 }, b: { min: 5550.0, max: 11100.0 }, a: { min: 11100.0, max: 1000000000.0 } },
            KRW: { d: { min: 0.0, max: 19500.0 }, c: { min: 19500.0, max: 60000.0 }, b: { min: 60000.0, max: 116000.0 }, a: { min: 116000.0, max: 1000000000.0 } },
            MYR: { d: { min: 0.0, max: 75.0 }, c: { min: 75.0, max: 220.0 }, b: { min: 220.0, max: 435.0 }, a: { min: 435.0, max: 1000000000.0 } },
            SGD: { d: { min: 0.0, max: 25.0 }, c: { min: 25.0, max: 72.0 }, b: { min: 72.0, max: 145.0 }, a: { min: 145.0, max: 1000000000.0 } },
            AUD: { d: { min: 0.0, max: 25.0 }, c: { min: 25.0, max: 70.0 }, b: { min: 70.0, max: 141.0 }, a: { min: 141.0, max: 1000000000.0 } },
        }
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        var data = [];
        for (var i = 0; i < pullData.length; i++) {
            var pickerData = { key: pullData[i].fLookUpKey, title: SGLocalize.translate(LookUpVariable + "." + pullData[i].fValueKey, { currency: this.currentUserCurrency, min: spendingCriteriaJSON[this.currentUserCurrency][pullData[i].fValueKey].min, max: spendingCriteriaJSON[this.currentUserCurrency][pullData[i].fValueKey].max }) };
            data.push(pickerData);
        }

        return (data);
    }

    _updateCarPlate(val) {
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            var acceptJSON = SGHelperType.copyJSON(val[i].carNumber);
            arr.push(acceptJSON);
        }
        this.carPlate = arr;
        this.setData('fCar', this.carPlate);
        this.forceUpdate();
    }

    _onPickerValueChange(v) {
        this.selectedCountryPhoneCode = v;
        this.phoneNumberInput = this.selectedCountryPhoneCode + '-';
        this.forceUpdate();
    }

    _onSetPhoneNumber(v) {
        var code = '';
        if (!(v.includes(this.selectedCountryPhoneCode))) {
            code = this.selectedCountryPhoneCode + '-';
        }
        this.setData('fPhoneNumber', code + v);
        this.phoneNumberInput = v
    }

    render() {
        this.initData(this.props.userData);
        var data = this.props.userData
        var { w, h, p } = this.whp;
        var style = this.style;
        var language = this._language.toUpperCase();
        var countryData = this._getCountryData();
        var provinceData = this._getProvinceData();
        var cityData = this._getCityData();
        this._pushPickerData();
        var securityQuestionData = this.pickerData[0]
        var genderQuestionData = this.pickerData[1]
        var reservationTimeData = this.pickerData[2]
        var statusData = this.pickerData[3]
        var preferenceData = this.pickerData[4]
        var spendingCriteriaData = this.pickerData[5]
        return (
            <View accessible={true} accessibilityLabel={'UserProfileFormRootView'} style={style.v1}> 
                <SGImagePicker ref={this.IP1}  noreview language={language} imageFactor={0.4} previewMode maxImageCount={1} shadow hideText value={this.getData('fProfileImageJSON')} ratio={SGImagePicker.ratio.r9x9} previewStyle={{ width: w * 0.3, height: w * 0.3, borderRadius: (w * 0.3 + w * 0.3 / 2),marginVertical:4*p }}/>
        
                <View style={style.viewChangePic}>
                    <Text style={style.textChangePic} preset={Text.preset.titleH3B} onPress={()=>{this.IP1.current.onImagePressHandler(0);}}>{SGLocalize.translate('UserProfileScreen.Text1')}</Text>
                </View>
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)}  accessible={true} accessibilityLabel={'UserProfileFormNameTextInput'}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('UserProfileScreen.NameText')}
                    placeholder={SGLocalize.translate('UserProfileScreen.NameText1')} onValueChange={(v) => { this.setData('fName', v) }} value={this.getData('fName')} validator={data.getValidators('fName')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'UserProfileFormEmailTextInput'} disabled={true}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('UserProfileScreen.EmailText')}
                    placeholder={SGLocalize.translate('UserProfileScreen.EmailText1')} onValueChange={(v) => { this.setData('fEmail', v) }} value={this.getData('fEmail')} validator={data.getValidators('fEmail')} />
                <Text preset={Text.preset.titleH3} style={style.phoneNumberText} >{SGLocalize.translate('UserProfileScreen.NumberPhoneText')}</Text>
                <View accessible={true} accessibilityLabel={'SignUpFormWithPhoneNumberRootView'} style={style.phoneInputView}>
                    <SGFormPicker accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} disabled single  mandatory  preset={SGFormPicker.preset.phoneNumber} optionList={this.countryPhoneCodePickerData} value={this.selectedCountryPhoneCode} onValueChange={(v) => { this._onPickerValueChange(v) }} />
                    <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberPhoneNumberPhoneTextInput'} disabled dataType={TextInput.dataType.phone} onValueChange={(v) => { this._onSetPhoneNumber(v) }}  preset={SGFormTextInput.preset.phoneNumber} value={this.phoneNumberInput} placeholder={'000000000'} />
                </View>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate('UserProfileScreen.GenderText')}  optionList={genderQuestionData} onValueChange={(v) => { this.setData('fGender', v) }} value={this.getData('fGender')} validator={data.getValidators('fGender')}/>
                <Text accessible={true} accessibilityLabel={'UserProfileFormUserProfText'} preset={Text.preset.titleH3} style={style.text}>{SGLocalize.translate('UserProfileScreen.DOBText')}</Text>
                <SGDatePicker language={language} accessible={true} accessibilityLabel={'UserProfileFormDatePicker'} preset={SGDatePicker.preset.default}  onValueChange={(v) => { this.setData('fDOB', v) }} value={this.getData('fDOB')} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }}   textStyle={{ color: 'black' }} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate('UserProfileScreen.CountryText')}  optionList={countryData} onValueChange={(v) => { this._onCountryValueChange(v) }} value={this.getData('fCountry')} validator={data.getValidators('fCountry')} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate('UserProfileScreen.ProvinceText')}  optionList={provinceData} onValueChange={(v) => { this._onProvinceValueChange(v) }} value={this.getData('fProvince')} validator={data.getValidators('fProvince')}/>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate('UserProfileScreen.CityText')}  optionList={cityData} onValueChange={(v) => { this._onCityValueChange(v) }} value={this.getData('fCity')} validator={data.getValidators('fCity')} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormRemindResvPicker'} single label={SGLocalize.translate('UserProfileScreen.ReservationReminder')}  optionList={reservationTimeData} onValueChange={(v) => { this.setData('fReminderReservation', v) }} value={this.getData('fReminderReservation')}  validator={data.getValidators('fReminderReservation')}/>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormStatusDataPicker'} single label={SGLocalize.translate('UserProfileScreen.Status')}  optionList={statusData} onValueChange={(v) => { this.setData('fFamily', v) }} value={this.getData('fFamily')} validator={data.getValidators('fFamily')} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormFoodPrefPicker'} label={SGLocalize.translate('UserProfileScreen.FoodPreference')}  optionList={preferenceData} onValueChange={(v) => { this.setData('fFoodPreference', v) }} value={this.getData('fFoodPreference')}  validator={data.getValidators('fFoodPreference')}/>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormRemindResvPicker'} single label={SGLocalize.translate('UserProfileScreen.SpendingCriteria')}   optionList={spendingCriteriaData} onValueChange={(v) => { this.setData('fSpendCriteria', v) }} value={this.getData('fSpendCriteria')}  validator={data.getValidators('fSpendCriteria')}/>
                <CustomizationCarCRUDList accessible={true} accessibilityLabel={'UserProfileFormCustomCarCRUDList'} readonly={false} dataList={this.getData('fCar')} updateCarPlate={this._updateCarPlate.bind(this)} style={style.c1} />
                {/* <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormSecQuestionPicker'} single disabled={true} label={SGLocalize.translate('UserProfileScreen.SecurityQuestionText')}  optionList={securityQuestionData} onValueChange={(v) => { this.setData('fSecurityQuestionKey', v) }} value={this.getData('fSecurityQuestionKey')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'UserProfileFormSecQuestionTextInput'} disabled={true}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.password} label={SGLocalize.translate('UserProfileScreen.SecurityQuestionAnswer')}
                    placeholder={SGLocalize.translate("UserProfileScreen.SecurityQuestionAnswer1")} onValueChange={(v) => { this.setData('fQuestionAnswer', v) }} value={this.getData('fQuestionAnswer')}/> */}
                {/* <SGFormTextInput accessible={true} accessibilityLabel={'UserProfileFormAnsTextInput'} disabled={true}  preset={SGFormTextInput.preset.t1} dataType={TextInput.dataType.multiline} label={SGLocalize.translate('UserProfileScreen.DescriptionText')}
                    placeholder={SGLocalize.translate('UserProfileScreen.DescriptionText')} onValueChange={(v) => { this.setData('fShortDescription', v) }} value={this.getData('fShortDescription')} style={style.inputView1} /> */}
            </View>
        );
    }
}