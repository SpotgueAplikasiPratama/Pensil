import { SGHelperType } from './SGHelperType';

export class SGHelperStringValidator {
    /**
     * Class to perform string validation
     * @param {string} stringType : string type from StringValidator.stringType
     * @param {boolean} isRequired : field is required 
     * @param {number} minLength : minimum text length
     * @param {string} errMessage : error message to be displayed when not valid
     */
    constructor(stringType, isRequired, minLength, errMessage) {
        this._rule = { stringType: stringType, isRequired: isRequired, minLength: minLength, errMessage: errMessage };
    }

    /**
     * validate value based on the rule defined
     * @param {*} val : value to be validated
     * @returns {*} : returns object {value:*, isValid:boolean, errMessage:string}
     */
    validate(val) {
        var result = { value: val, isValid: false, errMessage: this._rule.errMessage };
        if (SGHelperType.isDefined(val)) {
            var arrVal = Array.isArray(val) ? val : [val];
            if (this._rule.isRequired && arrVal.length === 0) { return result; }
            for (var i = 0; i < arrVal.length; i++) {
                if (typeof arrVal[i] === 'string') {
                    var strVal = arrVal[i];
                    if (this._rule.stringType === SGHelperType.stringType.currency) {
                        strVal = SGHelperType.normalizeCurrency(strVal);
                    }
                    if (this._rule.isRequired && strVal.trim().length === 0) { return result; }
                    if (this._rule.minLength > strVal.length) { return result; }
                    if (strVal.length !== 0 && !SGHelperType._testRegex(this._rule.stringType, strVal)) { return result; }
                } else {
                    switch (this._rule.stringType) {
                        case SGHelperType.stringType.string:
                        case SGHelperType.stringType.alpha:
                        case SGHelperType.stringType.alphanumeric:
                        case SGHelperType.stringType.email:
                        case SGHelperType.stringType.password:
                        case SGHelperType.stringType.zipCodeID:
                            var strVal = String(arrVal[i]);
                            if (this._rule.isRequired && strVal.trim().length === 0) { return result; }
                            if (this._rule.minLength > strVal.length) { return result; }
                            if (strVal.length !== 0 && !SGHelperType._testRegex(this._rule.stringType, strVal)) { return result; }
                            break;
                        case SGHelperType.stringType.number:
                        case SGHelperType.stringType.decimal:
                        case SGHelperType.stringType.currency:
                            if (isNaN(arrVal[i])) { return result; }
                            break;
                        case SGHelperType.stringType.date:
                        case SGHelperType.stringType.datetime:
                        case SGHelperType.stringType.time:
                            if (!(arrVal[i] instanceof Date)) { return result; }
                            break;
                    }
                }
            }
        } else {
            if (this._rule.isRequired || this._rule.minLength !== 0) { return result; }
        }
        return { value: val, isValid: true, errMessage: '' };
    }

    static _unitTest() {
        var arr = [SGHelperType.stringType.alpha, SGHelperType.stringType.alphanumeric, SGHelperType.stringType.email, SGHelperType.stringType.password, SGHelperType.stringType.currency, SGHelperType.stringType.date, SGHelperType.stringType.time, SGHelperType.stringType.datetime, SGHelperType.stringType.decimal, SGHelperType.stringType.number, SGHelperType.stringType.string, SGHelperType.stringType.zipCodeID];
        var b;
        var x1;
        console.log('Unit Test for String Validator')
        for (let i = 0; i < arr.length; i++) {
            console.log((i + 1) + '. ' + arr[i])
            x1 = new SGHelperStringValidator(arr[i], false, 0, 'msg1');
            console.log(x1);
            console.log(x1.validate('abc'));
            console.log(x1.validate('gerry@spotgue.com'));
            console.log(x1.validate('100'));
            console.log(x1.validate('100.234'));
            console.log(x1.validate('100.23'));
            console.log(x1.validate('ab12'));
            console.log(x1.validate('.a'));
            console.log(x1.validate('15/02/2020 03:34:59'));
            console.log(x1.validate('11460'));
            console.log(x1.validate('12222222'));
            console.log(x1.validate('05:35'));
            console.log(x1.validate(''));
            console.log(x1.validate(b));
            console.log(x1.validate('12/03/2020'));
            console.log(x1.validate('rahasia123_'));
        }
    }
}

export class SGHelperArrayValidator {
    /**
     * Class to perform array validation
     * @param {boolean} isRequired : field is required 
     * @param {number} minLength : minimum text length
     * @param {string} errMessage : error message to be displayed when not valid
     */
    constructor(isRequired, minLength, errMessage) {
        this._rule = { isRequired: isRequired, minLength: minLength, errMessage: errMessage };
    }

    /**
     * validate value based on the rule defined
     * @param {*} val : value to be validated
     * @returns {*} : returns object {value:*, isValid:boolean, errMessage:string}
     */
    validate(val) {
        var result = { value: val, isValid: false, errMessage: this._rule.errMessage };
        if (SGHelperType.isDefined(val)) {
            if (!Array.isArray(val)) { return result; }
            if (this._rule.isRequired && (val.length === 0 || val.length < this._rule.minLength)) { return result; }
        } else {
            if (this._rule.isRequired || this._rule.minLength !== 0) { return result; }
        }
        return { value: val, isValid: true, errMessage: '' };
    }
}

export class SGHelperFieldValidator {
    static dataType = {
        string: 'string',
        number: 'number',
        date: 'date',
        object: 'object',
        array: 'array',
    }

    static nullRule = {
        anyNullReturnTrue: 'anyNullReturnTrue',
        bothNullReturnTrue: 'bothNullReturnTrue',
        f1NullReturnTrue: 'f1NullReturnTrue',
        f2NullReturnTrue: 'f2NullReturnTrue',
        anyNullReturnFalse: 'anyNullReturnFalse',
        bothNullReturnFalse: 'bothNullReturnFalse',
        f1NullReturnFalse: 'f1NullReturnFalse',
        f2NullReturnFalse: 'f2NullReturnFalse',
    }

    static operator = {
        equal: 'equal',
        notEqual: 'notEqual',
        lessThan: 'lessThan',
        lessThanOrEqual: 'lessThanOrEqual',
        greaterThan: 'greaterThan',
        greaterThanOrEqual: 'greaterThanOrEqual',
    }

    /**
     * Class to perform field comparison validation
     * @param {string} dataType : 'string'|'number'|'date'|'object'|'array'
     * @param {string} operator : '==='|'!=='|'<'|'<='|'>'|'>='
     * @param {*} dataObject : data object that contain the second field to compare
     * @param {string} fieldToCompare : the field name (property) to compare
     * @param {string} nullRule : rule to handle when there are null value
     * @param {string} errMessage : error message to be displayed when not valid
     */
    constructor(dataType, operator, dataObject, fieldToCompare, nullRule, errMessage) {
        this._rule = { dataType: dataType, operator: operator, dataObject: dataObject, fieldToCompare: fieldToCompare, nullRule: nullRule, errMessage: errMessage };
    }

    _checkNull(val1, val2) {
        var isDef = SGHelperType.isDefined;
        var nR = SGHelperFieldValidator.nullRule;
        var v1 = isDef(val1);
        var v2 = isDef(val2);
        if (!v1 || !v2) {
            switch (this._rule.nullRule) {
                case nR.anyNullReturnTrue:
                    if (!v1 || !v2) return { isAnyNull: true, result: true };
                case nR.anyNullReturnFalse:
                    if (!v1 || !v2) return { isAnyNull: true, result: false };
                case nR.bothNullReturnTrue:
                    if (!v1 && !v2) return { isAnyNull: true, result: true };
                case nR.bothNullReturnFalse:
                    if (!v1 && !v2) return { isAnyNull: true, result: false };
                case nR.f1NullReturnTrue:
                    if (!v1) return { isAnyNull: true, result: true };
                case nR.f1NullReturnFalse:
                    if (!v1) return { isAnyNull: true, result: false };
                case nR.f2NullReturnTrue:
                    if (!v2) return { isAnyNull: true, result: true };
                case nR.f2NullReturnFalse:
                    if (!v2) return { isAnyNull: true, result: false };
            }
        }
        return { isAnyNull: false, result: false };
    }

    /**
     * validate value based on the rule defined
     * @param {*} val : value to be validated
     * @returns {*} : returns object {value:*, isValid:boolean, errMessage:string}
     */
    validate(val) {
        var resultFalse = { value: val, isValid: false, errMessage: this._rule.errMessage };
        var resultTrue = { value: val, isValid: true, errMessage: '' };

        var isDef = SGHelperType.isDefined;
        var dT = SGHelperFieldValidator.dataType;
        var oP = SGHelperFieldValidator.operator;

        var f1 = val;
        var f2 = !isDef(this._rule.dataObject) ? null : !isDef(this._rule.dataObject._getValue) ? null : this._rule.dataObject._getValue(this._rule.fieldToCompare);
        //check null Rule
        var nullCheckRes = this._checkNull(f1, f2);
        if (nullCheckRes.isAnyNull) {
            if (nullCheckRes.result) {
                return resultTrue;
            } else {
                return resultFalse;
            }
        }
        //convert based on dataType
        switch (this._rule.dataType) {
            case dT.date:
                f1 = SGHelperType.numerizeDate(f1);
                f2 = SGHelperType.numerizeDate(f2);
                break;
            case dT.object:
                f1 = JSON.stringify(f1);
                f2 = JSON.stringify(f2);
                break;
            case dT.array:
                f1 = JSON.stringify(f1);
                f2 = JSON.stringify(f2);
                break;
        }
        //check based on operator
        switch (this._rule.operator) {
            case oP.equal:
                if (f1 === f2) { return resultTrue }
                else { return resultFalse }
            case oP.notEqual:
                if (f1 !== f2) { return resultTrue }
                else { return resultFalse }
            case oP.lessThan:
                if (f1 < f2) { return resultTrue }
                else { return resultFalse }
            case oP.lessThanOrEqual:
                if (f1 <= f2) { return resultTrue }
                else { return resultFalse }
            case oP.greaterThan:
                if (f1 > f2) { return resultTrue }
                else { return resultFalse }
            case oP.greaterThanOrEqual:
                if (f1 >= f2) { return resultTrue }
                else { return resultFalse }
        }
    }
}

export class SGHelperRangeValidator extends SGHelperStringValidator {
    /**
     * validate numeric or date within a given range
     * @param {string} stringType : from SGHelperType.stringType
     * @param {boolean} isRequired 
     * @param {string} errMessage 
     * @param {*} minRange : for number, decimal, date, time, datetime
     * @param {*} maxRange : for number, decimal, date, time, datetime
     */
    constructor(stringType, isRequired, errMessage, minRange, maxRange) {
        super(stringType, isRequired, isRequired ? 1 : 0, errMessage);
        this._rule.minRange = minRange;
        this._rule.maxRange = maxRange;
    }

    /**
     * validate value based on rule defined
     * @param {*} val 
     * @returns {*} : returns object {value:*, isValid:boolean, errMessage:string}
     */
    validate(val) {
        var res = super.validate(val);
        if (!res.isValid) { return res };
        res = { value: val, isValid: false, errMessage: this._rule.errMessage };
        if (SGHelperType.isDefined(val) && Array.isArray(val) ? val.length !== 0 : val !== '') {
            var arrVal = Array.isArray(val) ? val : [val];
            switch (this._rule.stringType) {
                case SGHelperType.stringType.number:
                case SGHelperType.stringType.decimal:
                case SGHelperType.stringType.currency:
                    for (var i = 0; i < arrVal.length; i++) {
                        var num = typeof arrVal[i] === 'string' ? Number(SGHelperType.normalizeCurrency(arrVal[i])) : arrVal[i];
                        if (SGHelperType.isDefined(this._rule.minRange)) {
                            if (this._rule.minRange > num) { return res; }
                        }
                        if (SGHelperType.isDefined(this._rule.maxRange)) {
                            if (this._rule.maxRange < num) { return res; }
                        }
                    }
                    break;
                case SGHelperType.stringType.date:
                    for (var i = 0; i < arrVal.length; i++) {
                        var dt = SGHelperType.numerizeDate(SGHelperType.datetimeToDate(arrVal[i] instanceof Date ? arrVal[i] : new Date(arrVal[i])));
                        if (SGHelperType.isDefined(this._rule.minRange)) {
                            var dtMin = SGHelperType.numerizeDate(SGHelperType.datetimeToDate(this._rule.minRange));
                            if (dtMin > dt) { return res; }
                        }
                        if (SGHelperType.isDefined(this._rule.maxRange)) {
                            var dtMax = SGHelperType.numerizeDate(SGHelperType.datetimeToDate(this._rule.maxRange));
                            if (dtMax < dt) { return res; }
                        }
                    }
                    break;
                case SGHelperType.stringType.datetime:
                    for (var i = 0; i < arrVal.length; i++) {
                        var dt = SGHelperType.numerizeDate(arrVal[i] instanceof Date ? arrVal[i] : new Date(arrVal[i]));
                        if (SGHelperType.isDefined(this._rule.minRange)) {
                            if (SGHelperType.numerizeDate(this._rule.minRange) > dt) { return res; }
                        }
                        if (SGHelperType.isDefined(this._rule.maxRange)) {
                            if (SGHelperType.numerizeDate(this._rule.maxRange) < dt) { return res; }
                        }
                    }
                    break;
                case SGHelperType.stringType.time:
                    for (var i = 0; i < arrVal.length; i++) {
                        var t = SGHelperType.timeToSecond(arrVal[i]);
                        if (SGHelperType.isDefined(this._rule.minRange) && SGHelperType.isDefined(this._rule.maxRange)) {
                            var min = SGHelperType.timeToSecond(this._rule.minRange);
                            var max = SGHelperType.timeToSecond(this._rule.maxRange);
                            if (max < min) {
                                if (min > t && max < t) { return res; }
                            } else {
                                if (min > t || max < t) { return res; }
                            }
                        } else {
                            if (SGHelperType.isDefined(this._rule.minRange)) {
                                if (SGHelperType.timeToSecond(this._rule.minRange) > t) { return res; }
                            }
                            if (SGHelperType.isDefined(this._rule.maxRange)) {
                                if (SGHelperType.timeToSecond(this._rule.maxRange) < t) { return res; }
                            }
                        }
                    }
                    break;
            }
        }
        return { value: val, isValid: true, errMessage: '' };
    }

    static _unitTest() {
        var arr = [SGHelperType.stringType.time];
        var b;
        var x1;
        console.log('Unit Test for Range Validator')
        for (let i = 0; i < arr.length; i++) {
            console.log((i + 1) + '. ' + arr[i])
            var dt1 = new Date();
            //dt1.setMonth(0);
            var dt2 = new Date();
            dt2.setDate(100);
            x1 = new SGHelperRangeValidator(arr[i], false, 'msg1', '07:59', '16:59');
            console.log(x1);
            console.log(x1.validate('abc'));
            console.log(x1.validate('gerry@spotgue.com'));
            console.log(x1.validate('100'));
            console.log(x1.validate('100.234'));
            console.log(x1.validate('100.23'));
            console.log(x1.validate('ab12'));
            console.log(x1.validate('.a'));
            console.log(x1.validate('15/04/2020 03:34:59'));
            console.log(x1.validate('11460'));
            console.log(x1.validate('12222222'));
            console.log(x1.validate('08:35'));
            console.log(x1.validate(''));
            console.log(x1.validate(b));
            console.log(x1.validate('15/04/2020'));
            console.log(x1.validate('rahasia123_'));
        }
    }
}



