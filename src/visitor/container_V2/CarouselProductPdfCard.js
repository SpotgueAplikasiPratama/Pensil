import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGPopView } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';

export class CarouselProductPdfCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { marginHorizontal: 2 * p, alignItems: 'flex-start', justifyContent: 'flex-start', marginVertical: p * 7, backgroundColor: 'white', width: w * 0.52, minHeight: w * 0.785, borderRadius: 4 * p, paddingBottom: 2 * p, borderColor: '#c5c4bc', borderWidth: 0.3, shadowRadius: 5, shadowOffset: { height: 3 } },
            image: { width: w * 0.5, height: w * 0.5, backgroundColor: '#FFFFFF',borderTopLeftRadius: 3 * p, borderTopRightRadius: 3 * p  },
            textTitle: { marginHorizontal: 2 * p, marginTop: 3 * p, color: '#000000' },
            bottomView: { alignItems: 'flex-start',  width: w * 0.52, flex: 1 },
            bottomView1: { alignItems: 'flex-start' },
            bottomView2: {flexDirection: 'row', width: w * 0.52, justifyContent: 'space-between' },
            icon: { width: w * 1.3, height: w * 1.3 }
            
          
        });
    }

    onCardPress(screen) {
        this.props.navigator.navigate(screen)
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.pvID1 = SGPopView.getPopViewID();
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    onCloseHandler() {
        SGPopView.hidePopView(this.pvID1);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'PDFViewer', { pdfLink: this.props.pdfLink })}>
                <View accessible={true} accessibilityLabel={'CarouselProductPdfCardRootView'} shadow shadowIntensity={this.props.listMode ? 0.2 : 1} style={style.mainView}>
                    <Image accessible={true} accessibilityLabel={'CarouselProductPdfCardImage'} style={style.image} source={{ uri: this.props.contentImage }}></Image>
                    <Text accessible={true} accessibilityLabel={'CarouselProductPdfCardTitle'} numberOfLines={1} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH3B} style={style.textTitle}>{(this.props.productName)}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
