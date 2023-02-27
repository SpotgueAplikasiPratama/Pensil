/**
 *
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 *
* MAG Core Helper for Screen Navigation
* wrap react native navigation implementation and hide from MAG UI App
* handle android back button navigation event
* handle iOS back gesture navigation event also
* @format 
* @flow 
* 1. Navigate screen
* 2. Navigate back
* 3. Navigate reset
*/

import React from 'react'
//import { Transition, Transitioning } from 'react-native-reanimated'
import { Transitioning } from 'react-native-reanimated'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { StyleSheet, Dimensions } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { InteractionManager } from 'react-native'
import { SGActivityIndicator as ActivityIndicator } from '../control/SGActivityIndicator';
import { CommonActions, StackActions } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

export class SGHelperNavigation {
    static NavigationContainer = NavigationContainer;
    static createStackNavigator = createStackNavigator;
    static forHorizontalIOS = CardStyleInterpolators.forHorizontalIOS;
    static maxStack = 20; //always keep first route on stack + last X-1 route on the stack
    static keepMaxStack(nav) {
        if (SGHelperNavigation.getRoutes(nav).length >= SGHelperNavigation.maxStack) {
            nav.dispatch(state => {
                // leave first route in stack
                var routes = state.routes.slice(0);
                routes.splice(1, state.routes.length - SGHelperNavigation.maxStack + 1);
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: routes.length - 1,
                });
            });
        }
    }

    static navigate(nav, strRoute, params) {
        nav.navigate(strRoute, params);
    }
    static navigateReset(nav, strRoute, params) {
        nav.reset({ index: 0, routes: [{ name: strRoute, params: params }] });
    }
    static navigatePush(nav, strRoute, params) {
        SGHelperNavigation.keepMaxStack(nav);
        nav.push(strRoute, params);
    }
    static navigatePopPush(nav, strRoute, params) {
        // nav.pop();
        // nav.push(strRoute, params);
        nav.dispatch(
            StackActions.replace(strRoute, params)
        );
    }
    static goBack(nav) {
        nav.goBack();
    }
    static navigatePop(nav, strRoute, params) {
        nav.pop();
    }
    static canGoBack(nav) {
        return nav.canGoBack();
    }
    static getRoutes(nav) {
        return nav.getState().routes;
    }
    static PlaceHolderScreen = PlaceHolderScreen;
    static optimizeHeavyScreen = optimizeHeavyScreen;
}

const _showBlackSideAreas = Dimensions.get('screen').width/Dimensions.get('screen').height >= 10/16;

class PlaceHolderScreen extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.props.navigation.setOptions({
            headerShown: true,
            headerTitle: 'loading ...',
            headerStyle: { elevation: 0, backgroundColor:_showBlackSideAreas?'black':'white', },
            headerTitleStyle: { color:_showBlackSideAreas?'white':'black'}
        });
    }
    render() {
        return (
            <ActivityIndicator darkMode={_showBlackSideAreas} preset={ActivityIndicator.preset.h1} />
        );
    }
}

function optimizeHeavyScreen(Component) {
    const Placeholder = PlaceHolderScreen;
    const disableHoistStatics = false;
    const transition = null;
    // const transition = (
    //     <Transition.Together>
    //         <Transition.In type="fade" />
    //         <Transition.Change interpolation="easeInOut" />
    //     </Transition.Together>
    // );

    const OptimizedHeavyScreen = (props) => {
        const {
            transitionRef,
            areInteractionsComplete,
        } = useAfterInteractions()
        return (
            <Transitioning.View transition={transition} style={styles.container} ref={transitionRef} >
                {areInteractionsComplete ? (
                    <Component {...props} />
                ) : !!Placeholder ? (
                    <Placeholder {...props} />
                ) : null}
            </Transitioning.View>
        )
    }
    if (!disableHoistStatics) {
        // forward navigationOptions, and other statics
        hoistNonReactStatics(OptimizedHeavyScreen, Component)
    }
    return OptimizedHeavyScreen
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', backgroundColor:_showBlackSideAreas?'black':'white', alignItems: 'center' } })

const useAfterInteractions = () => {
    const [areInteractionsComplete, setInteractionsComplete] = useState(false)
    const subscriptionRef = useRef(null)
    const transitionRef = useRef(null)
    useEffect(() => {
        subscriptionRef.current = InteractionManager.runAfterInteractions(
            () => {
                transitionRef.current?.animateNextTransition()
                setInteractionsComplete(true)
                subscriptionRef.current = null
            }
        )
        return () => { subscriptionRef.current?.cancel() }
    }, [])
    return {
        areInteractionsComplete,
        transitionRef,
    }
}
