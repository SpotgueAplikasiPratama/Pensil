/**
* Spotgue Core Helper for Global Variable management
* provide access to Global Variable (state) that is accessible accross module
* implementation may persist the variable in: 
* a. memory
* b. key value store
* c. realm DB
* 1. Create Global Var and attach onChange event
* 2. GetValue of Global Var
* 3. SetValue of Global Var
* 4. Clear Global Var
*/
import { SGHelperType } from './SGHelperType';

export class SGHelperGlobalVar {
  static variables = Array();
  static isVar(varName) {
    if (SGHelperGlobalVar.variables[varName]) {
      return (SGHelperGlobalVar.variables[varName] !== null);
    } else {
      return false;
    }
  }
  static addVar(varName, val, evtChange) {
    if (SGHelperType.isDefined(evtChange)) {
      var evtID = SGHelperType.getGUID();
      SGHelperGlobalVar.variables[varName] = { value: val, eventSubscriber: [{ id: evtID, onChange: evtChange }] };
      return evtID;
    } else {
      SGHelperGlobalVar.variables[varName] = { value: val, eventSubscriber: [] };
      return null;
    }
  }
  static subscribeVar(varName, evtChange) {
    if (SGHelperGlobalVar.isVar(varName)) {
      var evtID = SGHelperType.getGUID();
      SGHelperGlobalVar.variables[varName].eventSubscriber.push({ id: evtID, onChange: evtChange })
      return evtID;
    } else {
      return null;
    }
  }
  static unSubscribeVar(varName, evtID) {
    if (SGHelperGlobalVar.isVar(varName)) {
      for (var i = 0; i < SGHelperGlobalVar.variables[varName].eventSubscriber.length; i++) {
        var evt = SGHelperGlobalVar.variables[varName].eventSubscriber[i];
        if (evt.id === evtID) {
          SGHelperGlobalVar.variables[varName].eventSubscriber.splice(i, 1);
          return;
        }
      }
    }
  }
  static setVar(varName, val) {
    if (SGHelperGlobalVar.isVar(varName)) {
      if (SGHelperGlobalVar.variables[varName].value !== val) {
        SGHelperGlobalVar.variables[varName].value = val;
        for (var i = 0; i < SGHelperGlobalVar.variables[varName].eventSubscriber.length; i++) {
          var evt = SGHelperGlobalVar.variables[varName].eventSubscriber[i];
          if (SGHelperType.isDefined(evt.onChange)) {
            evt.onChange(val);
          }
        }
      }
      return true;
    }
    else {
      return false;
    }
  }
  static removeVar(varName) {
    delete SGHelperGlobalVar.variables[varName];
    //SGHelperGlobalVar.variables[varName]=null;
  }
  static getVar(varName) {
    if (SGHelperGlobalVar.isVar(varName)) {
      return SGHelperGlobalVar.variables[varName].value;
    } else {
      return null;
    }
  }
}
