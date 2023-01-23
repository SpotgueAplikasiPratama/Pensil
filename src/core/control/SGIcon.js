/**
 * wrap react-native vector icons
 * add 3 behavior
 * 1. have style property with size and color
 * 2. have default style from SGHelperStyle
 * 3. list down available icons and wrap the source from which font
 * 4. implement safe click
 * 5. hidden true|false
 * 6. disabled true|false
 * 7. darkMode true|false
 * 8. safeClickDelay props
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import FoundIcon from 'react-native-vector-icons/Foundation';
import FeaIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Entyp from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from'react-native-vector-icons/SimpleLineIcons';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';

export class SGIcon extends SGBaseControl {
    static Icon = {
        pencil: 'FontAwesome.pencil',
        setting: 'AntIcon.setting',
        book: 'FontAwesome.book',
        website: 'MCIcon.web',
        email: 'MCIcon.email-outline',
        location: 'Entyp.location-pin',
        foot: 'FoundIcon.foot',
        favoriteActive: 'IonIcon.ios-star',
        favoriteInactive: 'IonIcon.ios-star-outline',
        favoriteActive: 'IonIcon.ios-star',
        likeInactive: 'IonIcon.ios-heart',
        likeActive: 'IonIcon.ios-heart-empty',
        food: 'MCIcon.food',
        reward: 'MCIcon.gift-outline',
        alice: 'MCIcon.brain',
        profile: 'MCIcon.face-profile',
        notificationActive: 'IonIcon.ios-notifications',
        notificationInactive: 'IonIcon.ios-notifications-outline',
        inbox: 'FAIcon.inbox',
        close: 'FeaIcon.x',
        back: 'FeaIcon.arrow-left-circle',
        delete: 'FeaIcon.trash-2',
        eye: 'FeaIcon.eye',
        eyeOff: 'FeaIcon.eye-off',
        save: 'FeaIcon.save',
        add: 'FeaIcon.plus-square',
        prev: 'FeaIcon.chevron-left',
        next: 'FeaIcon.chevron-right',
        arrowDown: 'FeaIcon.chevron-down',
        arrowUp: 'FeaIcon.chevron-up',
        arrowLeft: 'FeaIcon.chevron-left',
        arrowRight: 'FeaIcon.chevron-right',
        search: 'FeaIcon.search',
        square: 'FeaIcon.square',
        squareChecked: 'FeaIcon.check-square',
        check: 'FeaIcon.check',
        car: 'IonIcon.ios-car',
        woman: 'IonIcon.ios-woman',
        driver: 'FAIcon.id-badge',
        female: 'FAIcon.female',
        logout:'AntIcon.logout',
        wheelchair: 'FAIcon.wheelchair',
        google: 'AntIcon.google',
        facebook: 'AntIcon.facebook-square',
        rightCircle: 'AntIcon.rightcircle',
        leftCircle: 'AntIcon.leftcircle',
        rightSquare: 'AntIcon.rightsquare',
        leftSquare: 'AntIcon.leftsquare',
        upSquare: 'AntIcon.upsquare',
        downSquare: 'AntIcon.downsquare',
        notes: 'FAIcon.sticky-note',
        home: 'Entyp.home',
        help: 'IonIcon.ios-help-circle',
        plus: 'AntIcon.pluscircle',
        checkBoxActive: 'Fontisto.checkbox-active',
        checkBoxPassive: 'Fontisto.checkbox-passive',
        injection : 'Fontisto.injection-syringe',
        filter: 'AntIcon.filter',
        preview: 'Fontisto.preview',
        preview2: 'IonIcon.ios-attach',
        phone: 'AntIcon.phone',
        casePhone: 'MCIcon.cellphone-iphone',
        user: 'FAIcon.user',
        sync: 'MCIcon.sync',
        checkMark: 'IonIcon.md-checkmark',
        checkIos: 'IonIcon.ios-checkmark-circle',
        info: 'AntIcon.infocirlce',
        calendar: 'FontAwesome.calendar',
        time: 'IonIcon.md-time',
        caretright: 'AntIcon.caretright',
        caretleft: 'AntIcon.caretleft',
        sort: 'MCIcon.sort',
        error: 'Entyp.warning',
        chilli1: 'MCIcon.chili-mild',
        chilli2: 'MCIcon.chili-medium',
        chilli3: 'MCIcon.chili-hot',
        chefHat: 'MCIcon.chef-hat',
        error: 'Entyp.warning',
        qrscan: 'MCIcon.qrcode-scan',
        closecircle: 'IonIcon.md-close-circle',
        keyIcon: 'Entyp.key',
        clockTime: 'IonIcon.md-time',
        table: 'AntIcon.table',
        wallet: 'Fontisto.wallet',
        minusCircle: 'AntIcon.minuscircle',
        plusCircle: 'AntIcon.pluscircle',
        store: 'FontAwesome5.store',
        resto: 'MaterialIcons.restaurant',
        facility: 'FontAwesome5.coffee',
        tasks: 'FontAwesome.tasks',
        inbox: 'FontAwesome.inbox',
        face_profile: 'MaterialCommunityIcons.face-profile',
        text_undo: 'FAIcon.undo',
        text_clear: 'FAIcon.remove',
        text_ok: 'FAIcon.check',
        like: 'AntIcon.like2',
        dislike: 'AntIcon.dislike2',
        camera: 'FAIcon.camera',
        gallery: 'IonIcon.md-images',
        uploadFolder: 'MCIcon.folder-upload',
        duplicateIcon: 'MaterialCommunityIcons.content-duplicate',
        printer: 'AntIcon.printer',
        notification: 'AntIcon.notification',
        calender: 'FAIcon.calendar',
        pin: 'Fontisto.pinboard',
        group: 'FAIcon.group',
        dialogSuccess: 'AntIcon.checkcircle',
        dialogFail: 'AntIcon.closecircle',
        dialogConfirmation: 'AntIcon.exclamationcircle',
        dialogInputBox: 'AntIcon.infocirlce',
        woman: 'IonIcon.md-woman',
        wheelchair: 'FontAwesome.wheelchair',
        jenkins: 'FontAwesome5.jenkins',
        notification2: 'IonIcon.md-notifications',
        comment: 'FontAwesome.comment-o',
        copy: 'MaterialIcons.content-copy',
        paste: 'MaterialIcons.content-paste',
        edit: 'AntIcon.form',
        minus: 'FeaIcon.minus',
        checkbox: 'MaterialIcons.check-box',
        uncheckbox: 'MaterialIcons.check-box-outline-blank',
        browser: 'MaterialIcons.open-in-browser',
        smileCircle:'AntIcon.smile-circle',
        sortFontAwesome:'FontAwesome5.sort-amount-down-alt',
        share:'Entyp.share',
        shareIOS:'Entyp.share-alternative',
        locationTix:'Entyp.location',
        robot:'MaterialCommunityIcons.robot',
        sizeFullScreen:'SimpleLineIcons.size-fullscreen',
        sizeActual:'SimpleLineIcons.size-actual',
        info2: 'AntIcon.infocirlceo',
        sort: 'MCIcon.sort',
        download: 'AntIcon.clouddownloado',
        console: 'MCIcon.console',
        question: 'AntIcon.questioncircleo',
        qrIcon:'AntIcon.qrcode'
    }
    static preset = {
        //default normal font size is h6
        h0:'h0', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6', h7: 'h7', h8: 'h8',
        h1B: 'h1B', h2B: 'h2B', h3B: 'h3B', h4B: 'h4B', h5B: 'h5B', h6B: 'h6B', h7B: 'h7B', h8B: 'h8B',
        h1I: 'h1I', h2I: 'h2I', h3I: 'h3I', h4I: 'h4I', h5I: 'h5I', h6I: 'h6I', h7I: 'h7I', h8I: 'h8I',
        w1: 'w1', w2: 'w2', w3: 'w3', w4: 'w4', w5: 'w5', w6: 'w6', w7: 'w7', w8: 'w8', w9: 'w9', w10: 'w10',
        w11: 'w11', w12: 'w12', w13: 'w13', w14: 'w14', w15: 'w15', w16: 'w16',
        hidden: 'hidden',
        titleH1B: 'titleH1B',
        titleH2B: 'titleH2B',
        titleH3B: 'titleH3B',
        titleH4B: 'titleH4B',
        titleH5B: 'titleH5B',
        titleH6B: 'titleH6B',
        titleH1: 'titleH1',
        titleH2: 'titleH2',
        titleH3: 'titleH3',
        titleH4: 'titleH4',
        titleH5: 'titleH5',
        titleH6: 'titleH6',
    }
    static _isPresetInit = false;
    static _presetStyle = {};
    static _initPreset() {
        if (!SGIcon._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            var bF = 2.3;
            var bF2 = 1.15;
            SGIcon._presetStyle = {
                light: StyleSheet.create({
                    // {fontSize}, {marginVertical} and {marginHorizontal} is % multiplication factor of screen w
                    h0: { fontSize: 3.75 * Math.pow(1.15, 6) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1B: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2B: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3B: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4B: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5B: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6B: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7B: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8B: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1I: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2I: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3I: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4I: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5I: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6I: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7I: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8I: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w1: { fontSize: 100 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w2: { fontSize: 100 / 2 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w3: { fontSize: 100 / 3 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w4: { fontSize: 100 / 4 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w5: { fontSize: 100 / 5 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w6: { fontSize: 100 / 6 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w7: { fontSize: 100 / 7 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w8: { fontSize: 100 / 8 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w9: { fontSize: 100 / 9 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w10: { fontSize: 100 / 10 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w11: { fontSize: 100 / 11 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w12: { fontSize: 100 / 12 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w13: { fontSize: 100 / 13 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w14: { fontSize: 100 / 14 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w15: { fontSize: 100 / 15 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w16: { fontSize: 100 / 16 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    hidden: { fontSize: 0.0001 * w * 0.01, marginVertical: 0, marginHorizontal: 0 },
                    titleH1B: { fontSize: bF * Math.pow(bF2, 5) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH2B: { fontSize: bF * Math.pow(bF2, 4) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH3B: { fontSize: bF * Math.pow(bF2, 3) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH4B: { fontSize: bF * Math.pow(bF2, 2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH5B: { fontSize: bF * Math.pow(bF2, 1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH6B: { fontSize: bF * Math.pow(bF2, 0) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH1: { fontSize: bF * Math.pow(bF2, 5) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH2: { fontSize: bF * Math.pow(bF2, 4) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH3: { fontSize: bF * Math.pow(bF2, 3) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH4: { fontSize: bF * Math.pow(bF2, 2) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH5: { fontSize: bF * Math.pow(bF2, 1) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH6: { fontSize: bF * Math.pow(bF2, 0) * w * 0.01, color: SGHelperStyle.color.SGIcon.Black, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                }),
                dark: StyleSheet.create({
                    // {fontSize}, {marginVertical} and {marginHorizontal} is % multiplication factor of screen w
                    h0: { fontSize: 3.75 * Math.pow(1.15, 6) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1B: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2B: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3B: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4B: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5B: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6B: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7B: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8B: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h1I: { fontSize: 3.75 * Math.pow(1.15, 5) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h2I: { fontSize: 3.75 * Math.pow(1.15, 4) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h3I: { fontSize: 3.75 * Math.pow(1.15, 3) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h4I: { fontSize: 3.75 * Math.pow(1.15, 2) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h5I: { fontSize: 3.75 * Math.pow(1.15, 1) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h6I: { fontSize: 3.75 * Math.pow(1.15, 0) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h7I: { fontSize: 3.75 * Math.pow(1.15, -1) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    h8I: { fontSize: 3.75 * Math.pow(1.15, -2) * w * 0.01, fontStyle: 'italic', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w1: { fontSize: 100 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w2: { fontSize: 100 / 2 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w3: { fontSize: 100 / 3 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w4: { fontSize: 100 / 4 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w5: { fontSize: 100 / 5 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w6: { fontSize: 100 / 6 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w7: { fontSize: 100 / 7 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w8: { fontSize: 100 / 8 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w9: { fontSize: 100 / 9 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w10: { fontSize: 100 / 10 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w11: { fontSize: 100 / 11 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w12: { fontSize: 100 / 12 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w13: { fontSize: 100 / 13 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w14: { fontSize: 100 / 14 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w15: { fontSize: 100 / 15 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    w16: { fontSize: 100 / 16 * 0.96 * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    hidden: { fontSize: 0.0001 * w * 0.01, marginVertical: 0, marginHorizontal: 0 },
                    titleH1B: { fontSize: bF * Math.pow(bF2, 5) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH2B: { fontSize: bF * Math.pow(bF2, 4) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH3B: { fontSize: bF * Math.pow(bF2, 3) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH4B: { fontSize: bF * Math.pow(bF2, 2) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH5B: { fontSize: bF * Math.pow(bF2, 1) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH6B: { fontSize: bF * Math.pow(bF2, 0) * w * 0.01, fontWeight: 'bold', color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH1: { fontSize: bF * Math.pow(bF2, 5) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH2: { fontSize: bF * Math.pow(bF2, 4) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH3: { fontSize: bF * Math.pow(bF2, 3) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH4: { fontSize: bF * Math.pow(bF2, 2) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH5: { fontSize: bF * Math.pow(bF2, 1) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },
                    titleH6: { fontSize: bF * Math.pow(bF2, 0) * w * 0.01, color: SGHelperStyle.color.SGIcon.White, marginVertical: w * 0.01, marginHorizontal: w * 0.01 },

                })
            };
            SGIcon._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGIcon._initPreset();
    }
    parseName() {
        this._name = this.props.name;
        var arr = this._name.split('.');
        switch (arr[0]) {
            case 'FoundIcon': this._iconTag = FoundIcon; break;
            case 'FeaIcon': this._iconTag = FeaIcon; break;
            case 'IonIcon': this._iconTag = IonIcon; break;
            case 'FAIcon': this._iconTag = FAIcon; break;
            case 'AntIcon': this._iconTag = AntIcon; break;
            case 'Entyp': this._iconTag = Entyp; break;
            case 'Fontisto': this._iconTag = Fontisto; break;
            case 'MCIcon': this._iconTag = MCIcon; break;
            case 'FontAwesome': this._iconTag = FontAwesome; break;
            case 'FontAwesome5': this._iconTag = FontAwesome5; break;
            case 'MaterialIcons': this._iconTag = MaterialIcons; break;
            case 'MaterialCommunityIcons': this._iconTag = MaterialCommunityIcons; break;
            case 'SimpleLineIcons': this._iconTag = SimpleLineIcons; break;
            default: this._iconTag = FeaIcon;
        }
        this._iconName = arr[1];
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            if (this._name !== this.props.name) { this.parseName(); }
            this.onPressSafe = this.props.disabled ? null : SGBaseControl.makeSafeClick(this, this.props.onPress, this.props.safeClickDelay);
            this.pr = (this.props.preset ? this.props.preset : SGIcon.preset.h6);
            this.style = this.props.hidden ? SGIcon._presetStyle[this.props.darkMode?'dark':'light'].hidden : [SGIcon._presetStyle[this.props.darkMode?'dark':'light'][this.pr], this.props.style ? this.props.style : null, this.props.disabled ? { opacity: SGHelperStyle.opacity.SGIconDisabled } : {}]
        }
    }
    render() {
        this.initProps();
        var IconTag = this._iconTag;
        return (
            !this.props.hidden &&
            <IconTag accessible={true} accessibilityLabel={this._name} name={this._iconName} style={this.style} onPress={this.onPressSafe} />
        );
    }
}



