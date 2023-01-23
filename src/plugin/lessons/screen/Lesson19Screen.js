import React from 'react';
import Core from '../../core/core';

export default class Lesson19Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
            backgroundVideo1: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: '50%',
                height: 200,
            },
            backgroundVideo2: {
                position: 'absolute',
                top: 200,
                left: 0,
                bottom: 0,
                right: 0,
                width: '50%',
                height: 200,
            },
        });
    }

    constructor(props, context, ...args) {
        Core.log('constructor');
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
    }

    onBuffer() {

    }
    videoError() {

    }
    render() {
        const { SGVideoPlayer, SGRootView, SGView } = Core.Control;

        Core.log('render')
        var style = this.style;
        var { w, h, p } = this.WHP;
        return (
            <SGRootView>
                <SGView style={{width:w, flex:1}}>
                    <SGVideoPlayer source={{ uri: 'https://www.dreamenglish.com/mp4/abcvideo.m4v' }}   // Can be a URL or a local file.
                        style={style.backgroundVideo1}
                        controls={true}
                    />
                    <SGVideoPlayer source={{ uri: 'https://www.dreamenglish.com/mp4/abcvideo.m4v' }}   // Can be a URL or a local file.
                        style={style.backgroundVideo2}
                        controls={true}
                    />
                </SGView>
            </SGRootView>
        );
    }
}