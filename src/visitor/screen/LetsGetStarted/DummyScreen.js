
/**
 * Version 1.3.0
 * 1. Melvin 20 May 2021
 * - Improve API Main Home Screen
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 * 2. Yohanes 26 April 2021
 * - add TrackingTransparency
 * Version 1.1.0
 * 1. Yohanes, 8 Maret 2021
 *  - add Version and Mode  
 *  - check Version Pending
 *  
 * */
import React, { Fragment } from "react";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGImage as Image, SGText as Text, SGView as View, SGRootView as RootView,SGDialogBox,SGFlatList as FlatList,SGActivityIndicator as ActivityIndicator } from "../../../core/control";

export class DummyScreen extends SGBaseScreen {

    constructor(props, context, ...args) {
        super(props, context, ...args);        
    }
    async componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
          <View style={{ flex: 1, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center' }} ></View>
        );
    }
}


