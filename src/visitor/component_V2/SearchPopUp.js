import React from 'react';
import {StyleSheet} from 'react-native';
import {SGBaseContainer} from '../../core/container/SGBaseContainer';
import {SGView as View, SGText as Text, SGTextInput as TextInput, SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity} from '../../core/control';
import {SGHelperWindow} from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';

export class SearchPopUp extends SGBaseContainer{
    createStyleSheet = (whp) => {
        var {w, h, p} = this._screenWHP;
        if(this.props.style){
            if(this.props.style.width) w = this.props.style.width;
            if(this.props.style.height) h = this.props.style.height;
            if(this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            mainContainer: {width: w * 0.88, height: h - SGHelperWindow.getHeaderHeight() - SGHelperWindow.getStatusBarHeight(), backgroundColor: '#262626', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: p * 5, borderRadius: 0, borderTopLeftRadius: p * 5, borderBottomLeftRadius: p * 5, marginRight: -p * 0.02},
            leftContainer: {width: w * 0.035, height: w * 0.17, alignSelf: 'center'},
            borderLine: {borderWidth: p * 0.45, height: w * 0.135, borderRadius: p, borderColor: '#FFFFFF', backgroundColor: '#FFFFFF', alignSelf: 'flex-end'},
            rightContainer: {width: w * 0.82, justifyContent: 'flex-start', alignItems: 'flex-start'},
            text: {color: '#FFFFFF'},
            searchInput: { width: w * 0.82, borderRadius: p * 1.5, marginVertical: p * 3},
            recentSearchContainer: {alignItems: 'flex-start', marginTop: p},
            scrollViewContentContainer: { width: w * 0.82, paddingVertical: p, justifyContent: 'flex-start', alignItems: 'flex-start'},
            searchHistoryData: {marginVertical: p * 0.5}
        });
    }
    
    constructor(props, context, ...args){
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }

    _setSearchKeyword(value) {
        this.searchKeyword = value;
    }

    render(){
        var style = this.style;
        var data = this.props.searchHistory;

        return(
            <View accessible={true} style={style.mainContainer}>
                <View style={style.leftContainer}>
                    <View style={style.borderLine}></View>
                </View>
                <View style={style.rightContainer}>
                    <Text preset={Text.preset.heading4B} style={style.text}>{SGLocalize.translate("SearchStartScreen.screenTitle")}</Text>
                    {/* <TextInput accessible={true} accessibilityLabel={'SimpleSearchBarTextInput'} style={style.searchInput} onSubmitEditing={() => this._onSubmitSearch()} placeholder={SGLocalize.translate("SearchStartScreen.searchPlaceholder")} value={this.searchKeyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput> */}
                    <TextInput textStyle={{fontSize:w*0.025}} accessible={true} accessibilityLabel={'SimpleSearchBarTextInput'} style={style.searchInput} placeholder={SGLocalize.translate("SearchStartScreen.searchPlaceholder")} value={this.searchKeyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput>
                    {data.length !== 0 ?
                        (<View accessible={true} style={style.recentSearchContainer}>
                            <Text preset={Text.preset.heading4B} style={style.text}>{SGLocalize.translate("SearchStartScreen.screenTitle")}</Text>
                            <ScrollView dummyFooterBar dummyBottomBar accessible={true} showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollViewContentContainer}>
                                {data.map((x) => {
                                    return (<View>
                                        {x.fActive === 'Y' ?
                                            (<TouchableOpacity>
                                            {/* <TouchableOpacity onPress={() => { this._selectRecentSearchHistory(x.fKeyword) }}> */}
                                                <View accessible={true} style={style.searchHistoryData}>
                                                    <Text accessible={true} preset={Text.preset.heading5} style={style.text}>"{x.fKeyword}"</Text>
                                                    {/* <Icon accessible={true} name='md-close' style={style.deleteIcon} onPress={() => this._deleteSelectedSearchHistory(x.fID)}></Icon> */}
                                                </View>
                                            </TouchableOpacity>)
                                        :
                                            (null)
                                        }
                                    </View>)
                                })}
                            </ScrollView>
                        </View>)
                    :
                        (null)
                    }
                </View>
            </View>
        );
    }
}