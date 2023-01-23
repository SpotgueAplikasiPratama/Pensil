import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperType, SGHelperGlobalVar } from '../../core/helper';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as Image, SGIcon as Icon, SGPopView, SGViewPager as ViewPager } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
export class AuctionParticipantCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            main: {width: w*0.93,backgroundColor: 'white', borderWidth: p*0.3, marginVertical: p, borderRadius: p*3 },
            v1: {width: w*0.93, flexDirection: 'row', justifyContent: 'space-between'},
            v1_3_L: { flex: 1, height: w / 4, marginLeft: p*2},
            v1_3_R: { flex: 1, height: w / 4,},
            overlay: { width: w / 3.5, height: w / 3.5, borderRadius: 2 * p, resizeMode: 'contain', backgroundColor: 'rgba(255,255,255,0.5)' },
            text_L: { alignSelf: 'flex-start'},
            text_R_Default: { alignSelf: 'flex-end', paddingRight: 2 * p },
            text_R_R: { alignSelf: 'flex-end', paddingRight: 2 * p, color: 'rgb(230,77,77)'},
            text_R_G: { alignSelf: 'flex-end', paddingRight: 2 * p, color: 'rgb(56,188,140)'  },
            icon: { marginRight: 2 * p },
            vs4_1: { marginRight: p*2,alignSelf:'flex-end',marginBottom:2*p},
            textReason: {width: w*0.85, color: 'rgb(230,77,77)', marginBottom: p*2, textAlign: 'justify'},
            infoPointPopView: { width: w - 8 * p, padding: p*2, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            sliderContainer: {  width: w - 12 * p, height:(w*2.5)*9/16, backgroundColor: 'white', borderRadius: p*3, },
            sliderView: { width: w - 4 * p, height:(w*2.7)*9/16, backgroundColor: 'white', justifyContent: 'flex-end', borderRadius: p*3, paddingBottom: p*2 },
            vClose: { position: 'absolute', right: 0, top: 0},
            sliderImage: { width: w - 12 * p, height: (w*2.5)*9/16, backgroundColor: 'transparent', borderRadius: p*3, resizeMode: 'stretch'},
            vCloseCancel: { position: 'absolute', right: 0, top: 0},
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.pvID3 = SGPopView.getPopViewID();
    }

    onShowImageReceipt() {
        SGPopView.showPopView(this.pvID3);
    }
    onHideImageReceipt() {
        SGPopView.hidePopView(this.pvID3);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataAuction = this.props.dataAuction;
        var language = this.props.language;
        var imageSetting = this.props.imageSetting;
        // console.log('auction card')
        // console.log(data)
        // console.log(dataAuction)
        return (
            <View style={style.main} accessible={true} accessibilityLabel={'AuctionParticipantCardRootView'}>
                <SGPopView accessible={true} accessibilityLabel={''} modal vPos={'Top'} animationType={'slideUp'} popViewID={this.pvID3} >
                   
                    <View style={style.sliderView}>
                        <ViewPager accessible={true} accessibilityLabel={'AuctionParticipantHeaderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                            {
                                (data.fReceiptImage).map((x, index) => {
                                    return (
                                        <View accessible={true} accessibilityLabel={'AuctionParticipantHeaderImageView'} key={x.id}>             
                                            <Image accessible={true} accessibilityLabel={'AuctionParticipantHeaderImage'} style={style.sliderImage} source={{ uri: x[imageSetting].uri }}></Image>
                                        </View>
                                    )
                                })
                            }
                        </ViewPager>
                        <TouchableOpacity style={style.vClose} onPress={() => { this.onHideImageReceipt() }}>
                            <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818'}}></Icon>
                        </TouchableOpacity>
                    </View>
                    
                </SGPopView>
                    
                
                <View style={style.v1}> 
                    {data.fStatus === 'Submitted' &&
                        <TouchableOpacity style={style.vCloseCancel} onPress={() => {this.props.onCancelBid()}}>
                            <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: 'red'}}></Icon>
                        </TouchableOpacity>
                    }
                    <View accessible={true} accessibilityLabel={'AuctionParticipantCardTextView'} style={style.v1_3_L}>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardEndDate'} preset={Text.preset.h6} style={style.text_L} numberOfLines={1}>{SGHelperType.formatDateTime(SGHelperType.convertNewDate(data.fCreatedDate),language.toUpperCase())}</Text>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardStartDate'} preset={Text.preset.h5B} style={style.text_L} numberOfLines={1}>{this.currency} {SGHelperType.addThousandSeparator((data.fBidPrice.toFixed(0)).toString())}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'AuctionParticipantCardTextView'} style={style.v1_3_R}>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardShortDesc'} preset={Text.preset.h6} style={style.text_R_Default} numberOfLines={1}>{SGLocalize.translate('AuctionForm.Points', {count: data.fReferralPoint})}</Text>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardShortDesc'} preset={Text.preset.h6} style={data.fStatus === 'Submitted' ? style.text_R_Default : data.fStatus === 'Accepted'  || data.fStatus === 'Winner' ? style.text_R_G : style.text_R_R} numberOfLines={1} >{data.fStatus}</Text>
                    </View>
                    {dataAuction.fUploadReceipt == 'Y' &&
                        <TouchableOpacity onPress={this.onShowImageReceipt.bind(this)} style={style.vs4_1}>
                                <Icon accessible={true} accessibilityLabel={'CalledListWaitingIcon'} name={Icon.Icon.gallery} preset={Icon.preset.h2}></Icon>
                        </TouchableOpacity>
                    }
                </View>
                {data.fReason !== '' &&
                    <Text hidden={data.fStatus === 'Rejected' || data.fStatus === 'Cancelled' ? false : true} style={style.textReason}>{data.fReason}</Text>
                }
            </View>
        );
    }
}
