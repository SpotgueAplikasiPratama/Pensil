import React from "react";
import Core from "../../../core/core";
import MyTranslator from "../../lessons/locale/MyTranslator"

export class ArrayOfReceiptData extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return { 
            fID:'',
            fEarnPointKey:'',
            fMemberKey:'',
            fBuildingKey:'',
            fStoreKey:'',
            fUserKey:'',
            fReceiptNumber:'',
            fReceiptImage:[],
            fReceiptAmount:'',
            fReceiptDate: new Date(),
            fValidDate: new Date(),
            fActive:'',
            fReceipt:[],
            fMaxDate: new Date()
            };
    }
    constructor(ori, cur, changeList) {
        super(ArrayOfReceiptData, ori ? ori : ArrayOfReceiptData.getBlankJSON(), cur, changeList);
        const {SGHelperType, SGHelperGlobalVar, SGHelperStringValidator, SGHelperRangeValidator, SGHelperFieldValidator} = Core.Helper;
        
        this.addValidator('fStoreKey',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('EarnPointForm.storeNameValidator')));  

        // var date = new Date()
        // var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - settingReceipt.fMaxReceiptDay)
        // this._setValue('fMaxDate', maxDate)

        // if(settingReceipt.fReceiptMinAmount > 0){
        //     this.addValidator('fReceiptNumber',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptNumberValidator')));
        //     this.addValidator('fReceiptImage', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptImageValidator')));
        //     this.addValidator('fReceiptAmount', new SGHelperRangeValidator(SGHelperType.stringType.decimal, true, MyTranslator.tr('EarnPointForm.receiptAmountValidator'), settingReceipt.fReceiptMinAmount ));
        //     this.addValidator('fStoreKey',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('EarnPointForm.storeNameValidator')));  
        //     this.addValidator('fReceiptDate', new SGHelperFieldValidator(SGHelperType.stringType.date, SGHelperFieldValidator.operator.greaterThanOrEqual, this, 'fMaxDate', SGHelperFieldValidator.nullRule.bothNullReturnTrue, MyTranslator.tr('EarnPointForm.receiptDateValidator')))
        // }
    }
    
    get fID() { return this._getValue('fID'); }
    set fID(val) { this._setValue('fID', val); }
    get fMemberKey() { return this._getValue('fMemberKey'); }
    set fMemberKey(val) { this._setValue('fMemberKey', val); }
    get fBuildingKey() { return this._getValue('fBuildingKey'); }
    set fBuildingKey(val) { this._setValue('fBuildingKey', val); }
    get fStoreKey() { return this._getValue('fStoreKey'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); }
    get fUserKey() { return this._getValue('fUserKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); }
    get fReceiptNumber() { return this._getValue('fReceiptNumber'); }
    set fReceiptNumber(val) { this._setValue('fReceiptNumber', val); }
    get fReceiptImage() { return this._getValue('fReceiptImage'); }
    set fReceiptImage(val) { this._setValue('fReceiptImage', val); }
    get fReceiptAmount() { return this._getValue('fReceiptAmount'); }
    set fReceiptAmount(val) { this._setValue('fReceiptAmount', val); }
    get fReceiptDate() { return this._getValue('fReceiptDate'); }
    set fReceiptDate(val) { this._setValue('fReceiptDate', val); }
    get fValidDate() { return this._getValue('fValidDate'); }
    set fValidDate(val) { this._setValue('fValidDate', val); }
    get fActive() { return this._getValue('fActive'); }
    set fActive(val) { this._setValue('fActive', val); }
    get fReceipt() { return this._getValue('fActive'); }
    set fReceipt(val) { this._setValue('fActive', val); }
    get fMaxDate() { return this._getValue('fMaxDate'); }
    set fMaxDate(val) { this._setValue('fMaxDate', val); }
}

export class ArrayOfReceiptCRUDCard extends Core.Form.SGBaseForm {
    createStyleSheet(propStyle) {
        const { StyleSheet } = Core;
        if (this._strStyle !== JSON.stringify(propStyle)) {
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: (w - 12 * p),  borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: 1,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' ,marginVertical:2*p},
                v2: { width: (w - 12 * p) * 0.9, flexDirection: 'row', alignItems: 'center',justifyContent:'flex-start' },
                v3: { width: ((w - 12 * p)) * 0.5, paddingHorizontal: p, padding: 0, justifyContent: 'center', alignItems: 'flex-start' },
                v4: { width: ((w - 12 * p)) * 0.1, alignItems: 'center',justifyContent:'center' },
                icon: { marginLeft: - 0.10 * p },
                text:{alignSelf:'flex-start',paddingLeft:2*p},
            });
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.createStyleSheet(this.props.style);
        this._dataModel = this.props.data
        this.initData(this._dataModel);
        this.language = this.props.language;
        this.index = this.props.index;
    }
    render() {
        const {SGView, SGIcon, SGTouchableOpacity, SGText} = Core.Control
        this.createStyleSheet(this.props.style);
        var { w, h, p } = this._whp;
        var style = this._style;
        this._dataModel = this.props.data
        var imageSetting = this.props.imageSetting;
        var readonly = this.props.readonly;
        this.initData(this._dataModel);
        return (
            <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDCardRootView'} style={{ ...style.v1, opacity: 0.5 }}>
                <SGTouchableOpacity onPress={this.props.onPress} disabled={readonly}>
                    <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDCardTopView'} style={style.v2}>
                        <SGText accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDCardNumbText'} preset={SGText.preset.h5B} style={style.text} numberOfLines={1}>{this.index} - {this._dataModel['fReceiptNumber']}</SGText>   
                    </SGView>
                </SGTouchableOpacity>
                <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDCardIconView'} style={style.v4}>
                    <SGIcon accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDCardDeleteIcon'} name={SGIcon.Icon.delete} style={style.icon} preset={SGIcon.preset.h3} onPress={this.props.onDelete} />
                </SGView>
            </SGView>
        );
    }
}



export class ArrayOfReceiptCRUDForm extends Core.Form.SGBaseForm {
    initStyleSheet(propStyle) {
        if (this._strStyle !== JSON.stringify(propStyle)) {
            const {StyleSheet} = Core
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: ((w - 10 * p)), backgroundColor: 'white',justifyContent:'center',alignItems:'center',paddingVertical:2*p},
                ti1: { width: (w - 15 * p), color: 'rgb(100,100,100)', borderColor: 'rgb(150,150,150)' },
            });
        }
    }
    constructor(props, context, ...args) {
        const {SGHelperGlobalVar} = Core.Helper
        super(props, context, ...args);
        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
        this.userData = SGHelperGlobalVar.getVar('dataUser');
        this.settingData = SGHelperGlobalVar.getVar('SettingData');
    }

    async _onStorePickerChange(v){
        this.setData('fStoreKey', v);
        this.input = {fCardKey: this.props.fCardKey, fStoreKey: v}
        console.log(this.input)
        console.log('aaaaa')
        await this.props._checkCustomSetting(this.input)
    }
   
    render() {
        const { SGView, SGText, SGTextInput, SGImagePicker } = Core.Control
        const {  SGFormTextInput, SGFormImagePicker, SGFormDatePicker, SGFormPicker, SGFormButton} = Core.Form
        const { SGHelperType, SGHelperGlobalVar } = Core.Helper
        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
        var setting = SGHelperGlobalVar.getVar('EarnPointSetting')
        var settingNewMember = SGHelperGlobalVar.getVar('newRegisSetting')
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        var { w, h, p } = this._whp;
        var style = this._style;
        var disabled = this.props.disabled;
        var data = this.props.data;
        var globalLanguage = this.props.globalLanguage

        return (
            <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDFormRootView'} style={this.props.style.height ? style.v1 : { ...style.v1, height: this.props.style.height }}>
                <SGFormPicker disabled={disabled}  single label={MyTranslator.tr('EarnPointForm.storeName')} optionList={this.props.tenantPicker} value={this.getData('fStoreKey')} onValueChange={(v) => {this._onStorePickerChange(v)}} validator={this._data.getValidators('fStoreKey')}/>
                
                <SGFormTextInput autoCapitalize={'characters'} disabled={this.getData('fStoreKey') == '' ? true : disabled} dataType={SGTextInput.dataType.text} label={MyTranslator.tr('EarnPointForm.receiptNumberLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptNumberPlaceholder')} value={this.getData('fReceiptNumber')} onValueChange={(v) => { this.setData('fReceiptNumber', v)}} validator={this._data.getValidators('fReceiptNumber')} />
                <SGFormImagePicker disabled={this.getData('fStoreKey') == '' ? true : disabled} maxImageCount={1} label={MyTranslator.tr('EarnPointForm.receiptImageLabel')} noreview hideText ratio={SGImagePicker.ratio.r9x16} value={this.getData('fReceiptImage')} onValueChange={(v) => { this.setData('fReceiptImage', v)}} validator={this._data.getValidators('fReceiptImage')}></SGFormImagePicker>
                <SGText>
                    {MyTranslator.tr('EarnPointForm.minReceiptAmountLabel')}
                    {'IDR '} 
                    {SGHelperGlobalVar.getVar('typeSettingLoyalty') == true ? 
                        SGHelperType.isDefined(this.props.customSetting.fID) ? SGHelperType.addThousandSeparator((this.props.customSetting.fRegistrationReceiptMinAmount.toFixed(0)).toString()) : SGHelperType.addThousandSeparator((settingNewMember.fNewRegistrationMinAmount.toFixed(0)).toString()) 
                    : 
                        SGHelperType.isDefined(this.props.customSetting.fID) ? SGHelperType.addThousandSeparator((this.props.customSetting.fEarnReceiptMinAmount.toFixed(0)).toString()) : SGHelperType.addThousandSeparator((setting.fReceiptMinAmount.toFixed(0)).toString())
                    }
                </SGText>
                <SGFormTextInput disabled={this.getData('fStoreKey') == '' ? true : disabled} dataType={SGTextInput.dataType.currency} label={MyTranslator.tr('EarnPointForm.receiptAmountLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptAmountPlaceholder')} value={this.getData('fReceiptAmount')} onValueChange={(v) => { this.setData('fReceiptAmount', v)}} validator={this._data.getValidators('fReceiptAmount')}/>
                <SGFormDatePicker disabled={this.getData('fStoreKey') == '' ? true : disabled} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={MyTranslator.tr('EarnPointForm.receiptDateLabel')} value={this.getData('fReceiptDate')} onValueChange={(v) => { this.setData('fReceiptDate', v) }} validator={this._data.getValidators('fReceiptDate')}/>
                
                
                {/* <SGFormButton preset={SGFormButton.preset.b1} accessible={true} accessibilityLabel={''} onPress={this._onAddPress.bind(this)} label={MyTranslator.tr('EarnPointForm.addReceiptButton')} data={this.dataReceipt}></SGFormButton> */}
            </SGView>
        );
    }
}

export class ArrayOfReceiptCRUDList extends Core.Control.SGBaseContainer {
    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { overflow: 'visible', minHeight: w * 0.2, width: w - 10 * p, marginVertical: 3*p, justifyContent: 'flex-start', },
            v2: { flex: 1, width: w - 6 * p, backgroundColor: 'white', borderRadius: p, justifyContent: 'space-between', alignItems: 'center' },
            v2_1: { flex: 1, width: w - 10 * p, backgroundColor: 'white', borderRadius: p, justifyContent: 'space-between', alignItems: 'center' },
            v3: {  width: w - 8 * p,marginTop: 1.5 * p, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' },
            v4: { width: w - 10 * p, padding: 0, justifyContent: 'center', alignItems: 'center' },
            sv1: { width: w - 10 * p, maxHeight: w * 0.5, },
            c1: { width: w, padding: p, },
            c2: { width: w, padding: p },
            title: { alignSelf: 'flex-start',paddingBottom:2*p }
        });
    }
    constructor(props, context, ...args) {
        const {SGHelperGlobalVar} = Core.Helper
        super(props, context, ...args);
        this._whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this._style = this.createStyleSheet(this._whp);
        this._data = this._getArrayOfLinkJSON();
        this.data = this._data
        this.language = this.props.language;
        this.globalLanguage = this.props.globalLanguage;
        this.tenantPicker = this.props.tenantPicker

        this.newRegisSetting = SGHelperGlobalVar.getVar('newRegisSetting')
        this.earnSetting = SGHelperGlobalVar.getVar('EarnPointSetting');
        SGHelperGlobalVar.addVar('typeSettingLoyalty', this.props.newMember)

        this.disabled = this.props.disabled;
        this.mode = 'list'
        this.tempData = new ArrayOfReceiptData()

    }

    onAddPress() {
        const {SGDialogBox, SGLocalize} = Core.Control
        if(this.props.newMember == true){
            if(this.data.length < this.newRegisSetting.fRegistrationMaxReceiptCombined){
                this.mode = 'add'
                this.tempData = new ArrayOfReceiptData()
            }else{
                SGDialogBox.showWarning(null,SGLocalize.translate("AlertPermission.Fail"),MyTranslator.tr('ListEarnPoint.maxReceipt'),SGLocalize.translate("AlertPermission.Close"))
            }
        }else{
            if(this.data.length < this.earnSetting.fMaxReceiptCombined){
                this.mode = 'add'
                this.tempData = new ArrayOfReceiptData()
            }else{
                SGDialogBox.showWarning(null,SGLocalize.translate("AlertPermission.Fail"),MyTranslator.tr('ListEarnPoint.maxReceipt'),SGLocalize.translate("AlertPermission.Close"))
            }
        }

        this.forceUpdate()
        // this.mode = 'add'
        // this.tempData = new ArrayOfReceiptData()
        // this.forceUpdate()
    }

    onCardPress(args) {
        var data = this.data[args]._current;
        this.mode = this.props.disabled ? 'view' : 'edit'
        this.index = args
        this.tempData = new ArrayOfReceiptData(data)
        this.forceUpdate()
    }

    onDeletePress(index) {
        // console.log('ini index' + index);
        this.index = index
        // console.log(this.data);
        this.data.splice(index, 1);
        // console.log(this.data);
        this.props.updateArrayOfAnswer(this.data);
        this.forceUpdate()
    }

    onSaveAddPress() {
        const {SGDialogBox, SGLocalize} = Core.Control
        const {SGHelperGlobalVar, SGHelperType} = Core.Helper
        var data = this.data;
        var settingReceipt = SGHelperGlobalVar.getVar('EarnPointSetting')
        var newRegisSetting = SGHelperGlobalVar.getVar('newRegisSetting')
        var customSetting = SGHelperGlobalVar.getVar('customSetting')
        var type = SGHelperGlobalVar.getVar('typeSettingLoyalty');
                    
        var date = new Date()
        if(type == true){
            if(SGHelperType.isDefined(customSetting.fID)){
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - customSetting.fRegistrationMaxReceiptDay)
                if(customSetting.fRegistrationReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < customSetting.fRegistrationReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + customSetting.fRegistrationReceiptMinAmount, Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }else{
                        data.push(this.tempData);
                        this.mode = 'list'
                        this.data = data
                        if(this.data.length > 1){
                            for(var i = 0; i < this.data.length; i++){
                                if(this.data[i].getCurrentJSON().fStoreKey == this.tempData.getCurrentJSON().fStoreKey &&
                                this.data[i].getCurrentJSON().fReceiptNumber == this.tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.refs.SV1.scrollToEnd();
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    data.push(this.tempData);
                    this.mode = 'list'
                    this.data = data
                    this.refs.SV1.scrollToEnd();
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }else{
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - newRegisSetting.fMaxReceiptDay)
                if(newRegisSetting.fNewRegistrationMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    // else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                    //     SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    // }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < newRegisSetting.fNewRegistrationMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + newRegisSetting.fNewRegistrationMinAmount,Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        data.push(this.tempData);
                        this.mode = 'list'
                        this.data = data
                        if(this.data.length > 1){
                            for(var i = 0; i < this.data.length; i++){
                                if(this.data[i].getCurrentJSON().fStoreKey == this.tempData.getCurrentJSON().fStoreKey &&
                                this.data[i].getCurrentJSON().fReceiptNumber == this.tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.refs.SV1.scrollToEnd();
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    data.push(this.tempData);
                    this.mode = 'list'
                    this.data = data
                    this.refs.SV1.scrollToEnd();
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }

        }else{
            if(SGHelperType.isDefined(customSetting.fID)){
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - customSetting.fEarnMaxReceiptDay)
                if(customSetting.fEarnReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < customSetting.fEarnReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + customSetting.fEarnReceiptMinAmount, Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        data.push(this.tempData);
                        this.mode = 'list'
                        this.data = data
                        if(this.data.length > 1){
                            for(var i = 0; i < this.data.length; i++){
                                if(this.data[i].getCurrentJSON().fStoreKey == this.tempData.getCurrentJSON().fStoreKey &&
                                this.data[i].getCurrentJSON().fReceiptNumber == this.tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.refs.SV1.scrollToEnd();
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    data.push(this.tempData);
                    this.mode = 'list'
                    this.data = data
                    this.refs.SV1.scrollToEnd();
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }else{
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - settingReceipt.fMaxReceiptDay)
                if(settingReceipt.fReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < settingReceipt.fReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + settingReceipt.fReceiptMinAmount ,Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        data.push(this.tempData);
                        this.mode = 'list'
                        this.data = data
                        if(this.data.length > 1){
                            for(var i = 0; i < this.data.length; i++){
                                if(this.data[i].getCurrentJSON().fStoreKey == this.tempData.getCurrentJSON().fStoreKey &&
                                this.data[i].getCurrentJSON().fReceiptNumber == this.tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.refs.SV1.scrollToEnd();
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    data.push(this.tempData);
                    this.mode = 'list'
                    this.data = data
                    this.refs.SV1.scrollToEnd();
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }
        }
    }
  

    onSaveEditPress() {
        const {SGDialogBox, SGLocalize} = Core.Control
        const {SGHelperGlobalVar, SGHelperType} = Core.Helper
        var data = this.data;
        var settingReceipt = SGHelperGlobalVar.getVar('EarnPointSetting')
        var newRegisSetting = SGHelperGlobalVar.getVar('newRegisSetting')
        var customSetting = SGHelperGlobalVar.getVar('customSetting')
        var type = SGHelperGlobalVar.getVar('typeSettingLoyalty');
                    
        var date = new Date()
        if(type == true){
            if(SGHelperType.isDefined(customSetting.fID)){
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - customSetting.fRegistrationMaxReceiptDay)
                if(customSetting.fRegistrationReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < customSetting.fRegistrationReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + customSetting.fRegistrationReceiptMinAmount, Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ return },true)
                    }else{
                        var tempData = this.tempData;
                        var index = this.index
                        if(data.length > 1){
                            for(var i = 0; i < data.length; i++){
                                if(data[i].getCurrentJSON().fStoreKey == tempData.getCurrentJSON().fStoreKey &&
                                data[i].getCurrentJSON().fReceiptNumber == tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.data[index] = tempData
                        this.mode = 'list'
                        this.data = data
                        this.setState({ mode: 'list', data: data, });
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    var tempData = this.tempData;
                    var index = this.index
                    this.data[index] = tempData
                    this.mode = 'list'
                    this.data = data
                    this.setState({ mode: 'list', data: data, });
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }else{
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - newRegisSetting.fMaxReceiptDay)
                if(newRegisSetting.fNewRegistrationMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    // else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                    //     SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    // }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < newRegisSetting.fNewRegistrationMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + newRegisSetting.fNewRegistrationMinAmount,Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        var tempData = this.tempData;
                        var index = this.index
                        if(data.length > 1){
                            for(var i = 0; i < data.length; i++){
                                if(data[i].getCurrentJSON().fStoreKey == tempData.getCurrentJSON().fStoreKey &&
                                data[i].getCurrentJSON().fReceiptNumber == tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.data[index] = tempData
                        this.mode = 'list'
                        this.data = data
                        this.setState({ mode: 'list', data: data, });
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    var tempData = this.tempData;
                    var index = this.index
                    this.data[index] = tempData
                    this.mode = 'list'
                    this.data = data
                    this.setState({ mode: 'list', data: data, });
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }

        }else{
            if(SGHelperType.isDefined(customSetting.fID)){
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - customSetting.fEarnMaxReceiptDay)
                if(customSetting.fEarnReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < customSetting.fEarnReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + customSetting.fEarnReceiptMinAmount, Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        var tempData = this.tempData;
                        var index = this.index
                        if(data.length > 1){
                            for(var i = 0; i < data.length; i++){
                                if(data[i].getCurrentJSON().fStoreKey == tempData.getCurrentJSON().fStoreKey &&
                                data[i].getCurrentJSON().fReceiptNumber == tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.data[index] = tempData
                        this.mode = 'list'
                        this.data = data
                        this.setState({ mode: 'list', data: data, });
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    var tempData = this.tempData;
                    var index = this.index
                    this.data[index] = tempData
                    this.mode = 'list'
                    this.data = data
                    this.setState({ mode: 'list', data: data, });
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }else{
                var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - settingReceipt.fMaxReceiptDay)
                if(settingReceipt.fReceiptMinAmount > 0){
                    if(this.tempData.getCurrentJSON().fReceiptNumber == ''){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptNumberValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptImage.length == 0){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptImageValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptAmount < settingReceipt.fReceiptMinAmount){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptAmountValidator') + ' ' + settingReceipt.fReceiptMinAmount ,Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }
                    else if(this.tempData.getCurrentJSON().fReceiptDate < maxDate){
                        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptDateValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)
                    }else{
                        var tempData = this.tempData;
                        var index = this.index
                        if(data.length > 1){
                            for(var i = 0; i < data.length; i++){
                                if(data[i].getCurrentJSON().fStoreKey == tempData.getCurrentJSON().fStoreKey &&
                                data[i].getCurrentJSON().fReceiptNumber == tempData.getCurrentJSON().fReceiptNumber){
                                    SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),MyTranslator.tr('EarnPointForm.receiptSameValidator'),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{ },true)   
                                    return
                                }
                            }
                        }
                        this.data[index] = tempData
                        this.mode = 'list'
                        this.data = data
                        this.setState({ mode: 'list', data: data, });
                        this.props.updateArrayOfAnswer(this.data);
                        this.forceUpdate()
                    }
                }else{
                    var tempData = this.tempData;
                    var index = this.index
                    this.data[index] = tempData
                    this.mode = 'list'
                    this.data = data
                    this.setState({ mode: 'list', data: data, });
                    this.props.updateArrayOfAnswer(this.data);
                    this.forceUpdate()
                }
            }
        }
    }

    onBackPress() {
        this.mode = 'list'
        this.forceUpdate()
    }

    _getArrayOfLinkJSON() {
        var arrayJSON = [];
        var dataList = JSON.parse(JSON.stringify(this.props.dataList))

        for (var i = 0; i < dataList.length; i++) {
            arrayJSON.push(new ArrayOfReceiptData({ fStoreKey: dataList[i].fStoreKey, fReceiptNumber : dataList[i].fReceiptNumber, fReceiptImage : dataList[i].fReceiptImage, fReceiptAmount : dataList[i].fReceiptAmount, fReceiptDate:dataList[i].fReceiptDate }))
        }
        return arrayJSON
    }
    render() {
        const {SGView, SGText, SGIcon, SGLocalize, SGScrollView} = Core.Control
        const {SGFormButton} = Core.Form 
        const {SGHelperGlobalVar} = Core.Helper
        var { w, h, p } = this._whp;
        var style = this._style;
        this.data = this._getArrayOfLinkJSON();
        var mode = this.mode;
        var ro = this.props.disabled;
        this.customSetting = SGHelperGlobalVar.getVar('customSetting')
        this.globalLanguage = this.props.globalLanguage;
        var imageSetting = this.props.imageSetting;
        console.log(this.newRegisSetting.fRegistrationMaxReceiptCombined)
        console.log(this.data.length)
        console.log('data length')
        return (
            <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListRootView'} style={style.v1}>
                 <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListIconView'} style={style.v3}>
                        {this.props.newMember == true ?
                            this.newRegisSetting.fRegistrationMaxReceiptCombined > this.data.length &&
                            <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListAddIcon'} name={SGIcon.Icon.add} style={(mode === 'list' && !ro ? { marginRight:  -p } : { fontSize: 0.01 })} onPress={this.onAddPress.bind(this)} />
                            :
                            this.earnSetting.fMaxReceiptCombined > this.data.length &&
                            <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListAddIcon'} name={SGIcon.Icon.add} style={(mode === 'list' && !ro ? { marginRight:  -p } : { fontSize: 0.01 })} onPress={this.onAddPress.bind(this)} />
                        }
                        <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListBackIcon'} name={SGIcon.Icon.back} style={((mode === 'add' || mode === 'edit' || mode === 'view') ? {} : { fontSize: 0.01 })} onPress={this.onBackPress.bind(this)} />
                    </SGView>
                <SGText accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListTitle'} style={style.title} preset={SGText.preset.h6}>{MyTranslator.tr('EarnPointSelf.upload')}</SGText>
                <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListContainerView'} shadow={mode != 'add' && mode != 'view' && mode != 'edit' || this.props.full ? true: false} style={this.props.full ? style.v2 : style.v2_1}>
                   
                    <SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListCardView'} style={mode === 'list' ? { alignSelf: 'center' } : { height: 0 }}>
                        <SGScrollView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListScrollView'} ref='SV1' style={style.sv1} contentContainerStyle={style.v4} showsVerticalScrollIndicator={false} NestedScrollView>
                            {
                                this.data.map((d, i) => {
                                    return (
                                        <ArrayOfReceiptCRUDCard accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListCustCarCRUDCard'} index={i} language={this.language} imageSetting={imageSetting} key={d.GUID} readonly={ro} style={style.c1} data={d} onPress={this.onCardPress.bind(this, i)} onDelete={ro ? () => { } : this.onDeletePress.bind(this, i)} _checkCustomSetting={this.props._checkCustomSetting}/>
                                    );
                                })
                            }
                        </SGScrollView>
                    </SGView>

                    {mode === 'add' || mode === 'view' || mode === 'edit' ?
                        (<SGView accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListBottomView'} style={{width: w - 10*p}} >
                            <ArrayOfReceiptCRUDForm disabled={ro}  globalLanguage={this.globalLanguage} accessible={true} accessibilityLabel={'ArrayOfAnswerCRUDListForm'} readonly={ro} style={style.c2} data={this.tempData} tenantPicker={this.tenantPicker} _checkCustomSetting={this.props._checkCustomSetting} customSetting={this.customSetting} fCardKey={this.props.fCardKey}/>
                            {mode === 'add' ?
                            (<SGFormButton preset={SGFormButton.preset.crudList} accessible={true} accessibilityLabel={''} onPress={this.onSaveAddPress.bind(this)} label={SGLocalize.translate('Button.Save')} data={this.tempData}></SGFormButton>)
                            : (null)}
                            {mode === 'edit' ?
                            (<SGFormButton preset={SGFormButton.preset.crudList} accessible={true} accessibilityLabel={''} onPress={this.onSaveEditPress.bind(this)} label={SGLocalize.translate('globalText.UpdateNow')} data={this.tempData}></SGFormButton>)
                            : (null)}
                        </SGView>) : (null)}

                </SGView>
            </SGView>
        );
    }
}