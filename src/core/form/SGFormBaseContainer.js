/**
* Spotgue Core Form Base Container class for all custom Form control in the project
* wrap react native React.Component implementation and hide from Spotgue UI App
* @format 
* @flow 
* 1. Toggle hide/show
* 2. Definable style from selected list
* 3. width and height as relative % from parent component
* 4. link to certain data model object
*/
import React from 'react';
import { SGBaseContainer } from '../container/SGBaseContainer';
import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
import { SGHelperType } from '../helper/SGHelperType';

export class SGFormBaseContainer extends SGBaseContainer {
    static flagImage = {
        ID: require('../asset/image/Flag-Indonesia.png'),
        EN: require('../asset/image/Flag-United-States-of-America.png'),
        CN: require('../asset/image/Flag-China.png'),
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._showError = false;
        this._errMessage = [];
    }

    validateValue() {
        this._showError = false;
        this._errMessage = [];
        if (SGHelperType.isDefined(this.props.validator)) {
            var arrValidator = this.props.validator;
            for (var i = 0; i < arrValidator.length; i++) {
                var res = arrValidator[i].validate(this._value);
                if (!res.isValid) {
                    this._showError = true;
                    this._errMessage.push(res.errMessage);
                }
            }
        }
    }

}

