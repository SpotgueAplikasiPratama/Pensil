import React from 'react';
import { SGBaseScreen } from "../../core/screen/SGBaseScreen";
import { SGView as View, SGButton as Button, SGText as Text, SGImage as Image, SGScrollView as ScrollView, SGTabView as TabView, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGPopView, SGFlatList as FlatList } from '../../core/control';
import { StyleSheet } from 'react-native';
import image from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperStyle } from '../../core/helper';
// import { MiniAddStoreCard } from '../container_V2/MiniAddStoreCard';

export class AddFavoritePopUp extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginVertical: p, width: (w * 0.8), height: w * 1.5, justifyContent: 'center', borderRadius: 3 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', padding: p, marginBottom: 4 * p, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            throwCardWHP: { width: 0.8 * w, height: 0.8 * h, padding: 0.8 * p },
            iconClose: { marginBottom: 1 * p, width: w * 0.05, height: w * 0.05, alignSelf: 'flex-end', backgroundColor: 'white', },
            buttonCancel: { color: '#7a7a7a' },
            buttonSend: { color: '#63aee0' },
            buttonView: { flexDirection: 'row', justifyContent: 'space-between', width: (w * 0.575) },
            tabBarTextStyle: { color: '#606060' },
            tabBarStyle: { borderColor: '#c5c4bc', borderBottomWidth: 0.0015 * w, width:w },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    getStoreData() {
        return (
            [{ key: 'Store1', storeName: 'ZARA', storeCategory: 'Fashion & Accessories', placeName: 'Central Park Mall', location: 'West Jakarta', contentImage: 'https://spotgue.com/dev/visitor/store_logo_1.png', liked: '100k', },
            { key: 'Store3', storeName: 'Hush Puppies', storeCategory: 'Fashion & Accessories', placeName: 'Central Park Mall', location: 'West Jakarta', contentImage: 'https://spotgue.com/dev/visitor/store_logo_5.png', liked: '100k', },
            { key: 'Store4', storeName: 'H & M', storeCategory: 'Fashion & Accessories', placeName: 'Central Park Mall', location: 'West Jakarta', contentImage: 'https://spotgue.com/dev/visitor/store_logo_2.png', liked: '100k', },
            { key: 'Store5', storeName: 'Giordano', storeCategory: 'Fashion & Accessories', placeName: 'Central Park Mall', location: 'West Jakarta', contentImage: 'https://spotgue.com/dev/visitor/store_logo_3.png', liked: '100k', },]
        )
    }

    onSendPress() {

    }

    onCloseHandler() {
        SGPopView.hidePopView(this.props.popViewID);
    }


    render() {
        var { w, h, p } = this.whp;
        var dataStore = this.getStoreData();
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'AddFavoritePopUpRootView'} style={style.mainView1}>
                <TouchableOpacity style={style.iconClose} onPress={() => this.onCloseHandler(this.props.popViewID)}>
                    <Image accessible={true} accessibilityLabel={'AddFavoritePopUpCloseButton'} style={style.iconClose} source={{ uri: image.closeButton[this.imageSetting].url }}></Image>
                </TouchableOpacity>
                <Text>{SGLocalize.translate('AddFavorites.screenTitle')}</Text>
                <TabView accessible={true} accessibilityLabel={'AddFavoritePopUpTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarActiveTextPreset={Text.preset.titleH1} tabBarInactiveTextPreset={Text.preset.titleH1} scrollableTabBar tabBarUnderlineStyle={{ backgroundColor: 'red' }} style={{}} initialPage={0} renderTabBar={() => <DefaultTabBar />}  >
                    <ScrollView accessible={true} accessibilityLabel={'AddFavoritePopUpScrollView1'} style={{ height: w * 0.8 }} tabLabel={SGLocalize.translate("HomeScreen.tabTrendingTitle")}>
                    </ScrollView>
                    <FlatList accessible={true} accessibilityLabel={'AddFavoritePopUpList'} tabLabel='hehe' showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start' }} data={dataStore} renderItem={({ item }) => {
                        console.log(item);
                        return (
                            <MiniAddStoreCard accessible={true} accessibilityLabel={'AddFavoritePopUpMiniAddStoreCard'} navigator={this.props.navigator} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesStoreScreen.lastVisitedText")} contentKey={item.key} storeName={item.storeName} storeCategory={item.storeCategory} storeLocation={item.storeLocation} placeName={item.placeName} image={item.image} location={item.location} lastVisited={item.lastVisited} liked={item.liked} contentImage={item.contentImage} like={item.userLikedThis} notification={item.notificationOnThis} favorite={item.favoriteThis} style={style.throwCardWHP}></MiniAddStoreCard>
                        );
                    }} keyExtractor={item => item.key}>
                    </FlatList>
                    <ScrollView accessible={true} accessibilityLabel={'AddFavoritePopUpScrollView2'} style={{ height: w * 0.65 }} tabLabel={SGLocalize.translate("HomeScreen.tabTrendingTitle")}>
                    </ScrollView>
                    <ScrollView accessible={true} accessibilityLabel={'AddFavoritePopUpScrollView3'} style={{ height: w * 0.65 }} tabLabel={SGLocalize.translate("HomeScreen.tabTrendingTitle")}>
                    </ScrollView>
                </TabView>
                <Button accessible={true} accessibilityLabel={'AddFavoritePopUpButtonSubmit'} style={style.buttonSend} label={'submit'}></Button>
            </View>
        );
    }
}
