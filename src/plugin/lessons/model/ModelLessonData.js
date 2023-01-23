import React from 'react';
import Core from '../../core/core';


export default class ModelLessonData extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return { id: '', imageList: [], desc: '', uri: '', latitude: -6.17, longitude: 106.78, openHour: new Date(1900, 0, 1, 10, 0, 0, 0), expiryDate: new Date(2020, 5, 1), hobby: [], hobby2: [], password: '', confirmPassword: '', imageURL: '', title: '', desc: '', price: 0, active: 'Y', en: { name: '', desc: '1' } };
    }
    constructor(ori, cur, changeList) {
        super(ModelLessonData, ori ? ori : ModelLessonData.getBlankJSON(), cur, changeList);

        const { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator, SGHelperArrayValidator, SGHelperType } = Core.Helper;
        this.addValidator('title', new SGHelperStringValidator(SGHelperType.stringType.string, true, 10, 'Title harus diisi 10 karakter'));
        this.addValidator('title', new SGHelperStringValidator(SGHelperType.stringType.email, true, 1, 'Title harus diisi email'));
        this.addValidator('price', new SGHelperRangeValidator(SGHelperType.stringType.decimal, true, 'Please provide valid price (minimum is 1000)', 1000, null));
        this.addValidator('password', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, 'Please provide valid password 8-16 character (only letter, number, and underscore allowed)'));
        this.addValidator('confirmPassword', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, 'Please provide valid password 8-16 character (only letter, number, and underscore allowed) on confirm password'));
        this.addValidator('confirmPassword', new SGHelperFieldValidator(SGHelperType.stringType.password, SGHelperFieldValidator.operator.equal, this, 'password', SGHelperFieldValidator.nullRule.bothNullReturnTrue, 'Confirm password does not match with password'));
        this.addValidator('hobby', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, 'Please select at least 1 hobby'));
        this.addValidator('hobby2', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, 'Please select at least 1 hobby'));
        this.addValidator('expiryDate', new SGHelperRangeValidator(SGHelperType.stringType.date, true, 'Please provide valid expiry date min (1Jan2020)', new Date(2020, 0, 1, 0, 0, 0, 0)));
        this.addValidator('openHour', new SGHelperRangeValidator(SGHelperType.stringType.time, true, 'Please provide valid opening hour min (10:00)', new Date(1900, 0, 1, 10, 0, 0, 0)));
        this.addValidator('uri', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, 'File pdf harus dipilih'));
        this.addValidator('imageList', new SGHelperArrayValidator(true, 1, 'Image list slider harus diisi dengan minimum 1 image'));
    }
    set id(val) { this._setValue('id', val); }
    get id() { return this._getValue('id'); }
    set imageList(val) { this._setValue('imageList', val); }
    get imageList() { return this._getValue('imageList'); }
    set desc(val) { this._setValue('desc', val); }
    get desc() { return this._getValue('desc'); }
    set uri(val) { this._setValue('uri', val); }
    get uri() { return this._getValue('uri'); }
    set latitude(val) { this._setValue('latitude', val); }
    get latitude() { return this._getValue('latitude'); }
    set longitude(val) { this._setValue('longitude', val); }
    get longitude() { return this._getValue('longitude'); }
    set openHour(val) { this._setValue('openHour', val); }
    get openHour() { return this._getValue('openHour'); }
    set expiryDate(val) { this._setValue('expiryDate', val); }
    get expiryDate() { return this._getValue('expiryDate'); }
    set hobby(val) { this._setValue('hobby', val); }
    get hobby() { return this._getValue('hobby'); }
    set hobby2(val) { this._setValue('hobby2', val); }
    get hobby2() { return this._getValue('hobby2'); }
    set password(val) { this._setValue('password', val); }
    get password() { return this._getValue('password'); }
    set confirmPassword(val) { this._setValue('confirmPassword', val); }
    get confirmPassword() { return this._getValue('confirmPassword'); }
    set imageURL(val) { this._setValue('imageURL', val); }
    get imageURL() { return this._getValue('imageURL'); }
    set title(val) { this._setValue('title', val); }
    get title() { return this._getValue('title'); }
    set desc(val) { this._setValue('desc', val); }
    get desc() { return this._getValue('desc'); }
    set price(val) { this._setValue('price', val); }
    get price() { return this._getValue('price'); }
    set active(val) { this._setValue('active', val); }
    get active() { return this._getValue('active'); }
    set en(val) { this._setValue('en', val); }
    get en() { return this._getValue('en'); }
}