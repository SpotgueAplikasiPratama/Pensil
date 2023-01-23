import { SGHelperType } from "../helper/SGHelperType";
import { Value } from "react-native-reanimated";

export class SGBaseModel {
  /**
   * Base class for all data model
   * @param {JSON} ori : original JSON object data
   * @param {JSON} cur : current JSON object data
   * @param {[]} changeList : array of JSON showing change history
   * @param {object} className : the class name definition
   */
  constructor(className, ori, cur, changeList) {
    this._class = className;
    this._original = ori;
    this._validator = [];
    this._current = cur ? cur : this._copyJSON(this._original);
    this._changeList = changeList ? changeList : [];
    this._GUID = SGHelperType.getGUID();
  }
  /**
   * return cloned JSON object
   * @param {JSON} src : source JSON object to copy
   * @returns {JSON} : cloned JSON
   */
  _copyJSON(src) {
    return JSON.parse(JSON.stringify(src));
  }
  /**
   * set value of data item
   * @param {string} fieldName : field name
   * @param {*} newVal : value to set
   */
  _setValue(fieldName, newVal) {
    var beforeValue = this._getValue(fieldName);
    if (beforeValue !== newVal) {
      this._changeList[this._changeList.length] = {
        fieldName: fieldName,
        before: SGHelperType.stringify(beforeValue),
        after: newVal,
      };
      if (fieldName.indexOf('.') === -1) {
        this._current[fieldName] = newVal;
      } else {
        var arr = fieldName.split('.');
        if (arr.length === 2) {
          this._current[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]] = newVal;
        } else {
          this._current[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]][SGHelperType.isNumber(arr[2]) ? Number(arr[2]) : arr[2]] = newVal;
        }
      }
    }
  }

  /**
   * retrieve value of data item
   * @param {string} fieldName : field name
   * @returns {*} : field value
   */
  _getValue(fieldName) {
    if (fieldName.indexOf('.') === -1) {
      return this._current[fieldName];
    } else {
      var arr = fieldName.split('.');
      if (arr.length === 2) {
        return this._current[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]];
      } else {
        return this._current[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]][SGHelperType.isNumber(arr[2]) ? Number(arr[2]) : arr[2]];
      }
    }
  }
  _getOriginalValue(fieldName) {
    if (fieldName.indexOf('.') === -1) {
      return this._original[fieldName];
    } else {
      var arr = fieldName.split('.');
      if (arr.length === 2) {
        return this._original[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]];
      } else {
        return this._original[SGHelperType.isNumber(arr[0]) ? Number(arr[0]) : arr[0]][SGHelperType.isNumber(arr[1]) ? Number(arr[1]) : arr[1]][SGHelperType.isNumber(arr[2]) ? Number(arr[2]) : arr[2]];
      }
    }
  }
  /**
   * add validation rule for a field
   * @param {string} fieldName
   * @param {object} validator : can be SGHelperStringValidator or SGHelperRangeValidator object
   */
  addValidator(fieldName, validator) {
    this._validator.push({ fieldName: fieldName, validator: validator });
  }

  /**
   * get validator object for a field
   * @param {string} fieldName
   * @returns {object} : SGHelperStringValidator or SGHelperRangeValidator
   */
  getValidators(fieldName) {
    var res = [];
    for (var i = 0; i < this._validator.length; i++) {
      if (this._validator[i].fieldName === fieldName) {
        res.push(this._validator[i].validator);
      }
    }
    return res;
  }

  /**
   * validate all fields with validation rule and return array of result
   * @returns {[]} : array of result {value, isValid, errMessage}
   */
  validate() {
    var res = [];
    for (var i = 0; i < this._validator.length; i++) {
      res.push(
        this._validator[i].validator.validate(this._getValue(this._validator[i].fieldName))
      );
    }
    return res;
  }
  /**
   * retrieve original JSON object
   * @returns {JSON}
   */
  getOriginalJSON() {
    return this._original;
  }
  /**
   * retrieve current JSON object
   * @returns {JSON}
   */
  getCurrentJSON() {
    return this._current;
  }
  /**
   * check if the JSON object is modified from original
   * @returns {boolean}
   */
  isModified() {
    return this._changeList.length > 0;
  }
  /**
   * retrieve array containing all changes to the original JSON
   * @returns {[]}
   */
  getChangeLog() {
    return this._changeList;
  }
  getRevision() {
    return this._changeList.length;
  }
  /**
   * Get unique identifier
   */
  get GUID() {
    return this._GUID;
  }

  getField(name) {
    return this._current[name];
  }

  /**
   * Clone data object
   */
  cloneData() {
    var C = this._class;
    var clone = new C(this._copyJSON(this._original), this._copyJSON(this._current), this._copyJSON(this._changeList));
    clone._GUID = this._GUID;
    return clone;
  }
}
