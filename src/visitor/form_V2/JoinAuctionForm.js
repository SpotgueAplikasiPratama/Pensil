import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGIcon as Icon, SGTouchableOpacity as TouchableOpacity, SGImagePicker, SGPopView, SGDialogBox,SGScrollView as ScrollView } from "../../core/control";
import { SGLocalize } from '../locales/SGLocalize';
import { SGFormTextInput, SGFormDatePicker, SGFormTimePicker, SGFormImagePicker, SGFormButton } from '../../core/form';
import { SGHelperType, SGHelperGlobalVar } from '../../core/helper';
import { WebViewRender } from '../component_V2/WebViewRender';
import { CardIconButtonShare } from '../component_V2/CardIconButton';

export class JoinAuctionForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w*0.93, borderWidth: p*0.5, borderRadius: p*3,marginVertical: p*2 },
            auctionFormSummary: {width: w*0.88, flexDirection: 'row', justifyContent: 'space-between',padding: p},
            auctionFormSummaryLeft: { width: w*0.57, alignSelf: 'flex-start'},
            myPointsView: { width: w*0.58, flexDirection: 'row', justifyContent: 'space-between', marginRight: p},
            auctionFormSummaryRight: { flex:1, alignSelf: 'center' }  ,
            auctionForm: { width: w*0.88, alignItems: 'flex-start'},
            textReceipt: {paddingHorizontal: p, marginTop: p*4, marginBottom: -p*2},
            termConditionView: { width: w*0.87, borderRadius: p*3, marginVertical: p*3, alignSelf: 'flex-start', color: '#63AEE0' },
            bidView: {width:w*0.88, flexDirection: 'row', justifyContent: 'space-between',marginBottom:4*p},
            vClose: { position: 'absolute', right: 0, top: -2 },
            iconButton: { width: w,height:w,padding: p },
            throwWHP:{width:w,height:h,padding:p},
            termConditionPopView: { width: w - 8 * p, height: h*0.85, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            infoPointPopView: { width: w - 8 * p, padding: p*2, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000', alignSelf: 'flex-start' },
            webView: { width: '100%', height: w * 2 },
            vView1:{width: w - 8 * p,justifyContent: 'flex-start', margin: p*3},
            vView2:{paddingLeft:10*p},
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.initData(this.props.data)
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.arrayOfLinksData = this.props.arrayOfLinksData
        this.pvID = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    onHideTermCondition() {
        SGPopView.hidePopView(this.pvID);
    }
    onShowTermCondition() {
        SGPopView.showPopView(this.pvID);
    }

    onShowInfoPoint() {
        SGPopView.showPopView(this.pvID2);
    }

    _shareMessageRefferal(){
        var userData = this.props.userData;
        var referralCode =userData.fReferralCode;
        if(this.props.language == 'id'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextID') + '`')
            return shareMessage;
        }else if (this.props.language == 'en'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextEN') + '`')
            return shareMessage;
        }else if (this.props.language == 'cn'){   
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextCN') + '`')
            return shareMessage;
        }
    }

    _checkBidPrice() {
        if (this.props.disabled == true) {
            this.setData('fBidPrice', this.dataAuction.fMinBidPrice )
            var res = this.getData('fBidPrice')
        } else {
            var res = this.getData('fBidPrice')
        }
        return res
    }

    render() {
        this.initData(this.props.data)
        var style = this.style;
        var tR = SGLocalize.translate;
       
        this.imageSetting = this.props.imageSetting
        this.dataAuction = this.props.dataAuction   
        var disabled = this.props.disabled
        this.myPoint = this.props.myPoint
        var language = this.props.language.toUpperCase();
        return (
            <View style={style.mainView1}>
                <SGPopView accessible={true} accessibilityLabel={''} modal vPos={'Top'} animationType={'slideUp'} popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={''} style={style.termConditionPopView}>
                    <TouchableOpacity style={style.vClose} onPress={() => { this.onHideTermCondition() }}>
                        <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818' }}></Icon>
                    </TouchableOpacity>
                    <Text preset={Text.preset.h4B}>{tR('AuctionForm.TermConditionLabel')}</Text>
                        <View accessible={true} accessibilityLabel={'AuctionDetailScreenContentView'} style={style.descriptionContainer}>
                            {this.dataAuction['fContentAuction' + language].fTypeDetail === 'longdescription' ?
                                (
                                <ScrollView contentContainerStyle={style.vView1}> 
                                    <Text accessible={true} accessibilityLabel={'AuctionDetailScreenDescText'} preset={Text.preset.heading7} style={style.descriptionText}>{this.dataAuction['fContentAuction' + language].fLongDescription}</Text>
                                </ScrollView>
                                )
                                :
                                (null)
                            }
                            {this.dataAuction['fContentAuction' + language].fTypeDetail === 'url' &&
                                this.dataAuction['fContentAuction' + language].fURL !== '' ?
                                (
                              
                                    <View style={style.vView2}> 
                                        <WebViewRender data={this.dataAuction['fContentAuction' + language].fURL } style={style.throwWHP} fType='url'></WebViewRender>
                                    </View>
                               
                                )
                                :
                                (null)
                            }
                            {this.dataAuction['fContentAuction' + language].fTypeDetail === 'html' &&
                                this.dataAuction['fContentAuction' + language].fHTML !== '' ?
                                (
                                <View style={style.vView2}> 
                                    <WebViewRender data={this.dataAuction['fContentAuction' + language].fHTML } style={style.throwWHP} fType='html'></WebViewRender>
                                </View>
                                )
                                :
                                (null)
                            }
                        </View>
                    </View>
                </SGPopView>

                <SGPopView accessible={true} accessibilityLabel={''} vPos={'Top'} animationType={'slideUp'} popViewID={this.pvID2} >
                    <View accessible={true} accessibilityLabel={''} style={style.infoPointPopView}>
                        <Text style={{textAlign: 'justify'}} preset={Text.preset.h6}>{tR('AuctionForm.InfoPoint')}</Text>
                    </View>
                </SGPopView>

                <View>
                    <View style={style.auctionFormSummary}>
                        <Text style={style.auctionFormSummaryLeft} preset={Text.preset.h6}>{tR('AuctionForm.WinnerLabel')}</Text>
                        <Text style={style.auctionFormSummaryRight} preset={Text.preset.h6B}>{tR('AuctionForm.'+this.dataAuction.fAuctionMode)}</Text>
                    </View>
                 
                    <View style={style.auctionFormSummary}>
                        <Text style={style.auctionFormSummaryLeft} preset={Text.preset.h6}>{tR('AuctionForm.ReferralPointLabel')}</Text>
                        <Text style={style.auctionFormSummaryRight} preset={Text.preset.h6B}>{tR('AuctionForm.Points', { count: this.dataAuction.fReferralPrice })}</Text>
                    </View>
                    
                    <View style={style.auctionFormSummary}>
                        <View style={style.myPointsView}>
                            <Text preset={Text.preset.h6}>{tR('AuctionForm.MyPointsLabel')}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={this.onShowInfoPoint.bind(this)}>
                                    <Icon accessible={true} accessibilityLabel={'AskAliceAddLocationSelectedIcon'} style={{color: '#63AEE0'}} preset={Icon.preset.h3} name={Icon.Icon.info}></Icon>
                                </TouchableOpacity>
                                <CardIconButtonShare accessible={true} accessibilityLabel={'Shareicon'} textColor='#bebebe' navigator={this.props.navigator} contentType={'UserRefferal'} contentKey={this.dataAuction.key} shareMessage={this._shareMessageRefferal()} targetKey={this.dataAuction.storeKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                            </View>
                        </View>
                        {!this.anonymousMode &&
                        <Text style={style.auctionFormSummaryRight} preset={Text.preset.h6B}>{tR('AuctionForm.Points', { count: this.myPoint.totalAvailable })}</Text>
                    }
                    </View>
                    
                    <View style={style.auctionFormSummary}>
                        <Text style={style.auctionFormSummaryLeft} preset={Text.preset.h6}>{tR('AuctionForm.MinimumBidLabel')}</Text>
                        <Text style={style.auctionFormSummaryRight} preset={Text.preset.h6B}>{this.currency} {SGHelperType.addThousandSeparator((this.dataAuction.fMinBidPrice.toFixed(0)).toString())}</Text>
                    </View>
                    <View style={style.auctionFormSummary}>
                        <Text style={style.auctionFormSummaryLeft} preset={Text.preset.h6}>{tR('AuctionForm.MaximumBidLabel')}</Text>
 
                        <Text style={style.auctionFormSummaryRight} preset={Text.preset.h6B}>{this.currency} {SGHelperType.addThousandSeparator((this.dataAuction.fMaxBidPrice.toFixed(0)).toString())}</Text>
                    </View>
                </View>

                <View style={style.auctionForm}>
                    {this.dataAuction.fUploadReceipt === 'Y' && 
                        <View style={style.auctionForm}>
                            <Text style={style.textReceipt} preset={Text.preset.h6}>{tR('AuctionForm.minReceipt', {amount: this.currency + ' ' + SGHelperType.addThousandSeparator((this.dataAuction.fReceiptMinAmount.toFixed(0)).toString())})}</Text>
                            <Text style={style.textReceipt}>{SGLocalize.translate('AuctionForm.AuctionValidDayReceipt',{count:this.dataAuction.fReceiptValidDays})}</Text>
                            <SGFormImagePicker language={language} preset={SGFormImagePicker.preset.f1} accessible={true} accessibilityLabel={'AuctionFormImagePicker'} label={tR('AuctionForm.receiptImageLabel')} ratio={SGImagePicker.ratio.r9x16} hideText maxImageCount={this.dataAuction.fReceiptMaxCount} onValueChange={(v) => { this.setData('fReceiptImage', v) }} value={this.getData('fReceiptImage')} validator={this._data.getValidators('fReceiptImage')} />
                        </View>
                    }
                    <TouchableOpacity onPress={this.onShowTermCondition.bind(this)}>
                        <Text style={style.termConditionView} preset={Text.preset.h6B}>{tR('AuctionForm.TermConditionLabel')}</Text>
                    </TouchableOpacity>
                    {this.dataAuction.fModulusBidPrice > 0 &&
                        <Text preset={Text.preset.h6}>{tR('AuctionForm.incrementBid', {amount: this.currency + ' ' + SGHelperType.addThousandSeparator((this.dataAuction.fModulusBidPrice.toFixed(0)).toString())})}</Text>
                    }
                    <View style={style.bidView}>
                        <SGFormTextInput disabled={disabled} hideLabel preset={SGFormTextInput.preset.bAlert} dataType={TextInput.dataType.decimal} placeholder={tR('AuctionForm.bidPlaceholder')} value={this._checkBidPrice()} onValueChange={(v)=>{this.setData('fBidPrice', v)}}></SGFormTextInput>
                        <SGFormButton accessible={true} accessibilityLabel={''} shadow preset={SGFormButton.preset.auctionButton} data={disabled? null : this.props.data} label={tR('AuctionForm.bidSubmitButton')} onPress={this.props.onPress} />
                    </View>
                </View>

            </View>
        );
    }
}
