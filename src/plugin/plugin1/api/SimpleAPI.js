import React from 'react';
import Core from '../../../core/core';

export default class SimpleAPI{
    static async CallAPITambah(num1,num2){
        var res = await Core.Helper.SGHelperAPICall.callAPIAsync('GET',"https://functionhh1.azurewebsites.net/api/FunctionTambah?a="+num1+"&b="+num2);
        return(res.data);
    }
    static async CallAPIUpperCase(data1){
        var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
        "https://functionhh1.azurewebsites.net/api/FunctionUpperCase?code=lfz2XQ6TEbE53xz8OR0AbwESHeG34fP6sacoHjIj2A53aIw7aUNtWQ==","",
        JSON.stringify(data1)
        );
        return (JSON.parse(v.data));
    }
}