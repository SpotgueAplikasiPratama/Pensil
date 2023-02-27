import React from 'react';
import Core from '../../core/core';


export default class HomeScreen extends Core.Screen.SGBaseScreen {
  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start',backgroundColor:'white', width: w, height: h, overflow: 'visible' },
      to1: { marginBottom: 10 },
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    const {SGHelperSoundPlayer} = Core.Helper;
    SGHelperSoundPlayer.initTTS();
    this.props.navigation.setOptions({
      headerShown: false,
    });
    this.showLessons = false;
    this.showGames = false;
    this.showPlugins = true;
  }

  render() {
    const { SGRootScrollView, SGImage,SGView, SGTouchableOpacity, SGText, SGButton } = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var style = this.style;
    var {w,h,p} = this.WHPNoHeader;
    return (
      <SGRootScrollView style={style.v1} >
        <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ backgroundColor: 'transparent', width: 150, height: 150 }} />
        <SGText>
          Hi Team, Welcome to MAG Visitor Testing App!
        </SGText>
        <SGButton style={{ width: w * 0.75 }} label={this.showPlugins?'Hide Plugin List':'Show Plugin List'} preset={SGButton.preset.green} onPress={() => { this.showPlugins=!this.showPlugins;this.forceUpdate(); }} />          
        <SGView style={{marginLeft:4*p}} hidden={!this.showPlugins}>
          <SGButton style={{ width: w * 0.65 }} label={'Plugin1: TestSimpleAPIScreen'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'TestSimpleAPIScreen') }} />
        </SGView>
        <SGButton style={{ width: w * 0.75 }} label={this.showLessons?'Hide Lesson List':'Show Lesson List'} preset={SGButton.preset.blue} onPress={() => { this.showLessons=!this.showLessons;this.forceUpdate(); }} />          
        <SGView style={{marginLeft:4*p}} hidden={!this.showLessons}>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson2Screen') }} >
            <SGText style={{ color: 'blue', }} >1. Go To Lesson#2</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson4Screen') }} >
            <SGText style={{ color: 'blue', }} >2. Go To Lesson#4</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson5Screen') }} >
            <SGText style={{ color: 'blue', }} >3. Go To Lesson#5</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson6Screen') }} >
            <SGText style={{ color: 'blue', }} >4. Go To Lesson#6</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson7Screen') }} >
            <SGText style={{ color: 'blue', }} >5. Go To Lesson#7</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson8Screen') }} >
            <SGText style={{ color: 'blue', }} >6. Go To Lesson#8</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson9Screen') }} >
            <SGText style={{ color: 'blue', }} >7. Go To Lesson#9</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson10Screen') }} >
            <SGText style={{ color: 'blue', }} >8. Go To Lesson#10</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson11Screen') }} >
            <SGText style={{ color: 'blue', }} >9. Go To Lesson#11</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson12Screen') }} >
            <SGText style={{ color: 'blue', }} >10. Go To Lesson#12</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson13Screen') }} >
            <SGText style={{ color: 'blue', }} >11. Go To Lesson#13</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson14Screen') }} >
            <SGText style={{ color: 'blue', }} >12. Go To Lesson#14</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson15Screen') }} >
            <SGText style={{ color: 'blue', }} >13. Go To Lesson#15</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson16Screen') }} >
            <SGText style={{ color: 'blue', }} >14. Go To Lesson#16</SGText>
          </SGTouchableOpacity>
                    <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson17Screen') }} >
              <SGText style={{ color: 'blue', }} >15. Go To Lesson#17</SGText>
          </SGTouchableOpacity>

          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson18Screen') }} >
            <SGText style={{ color: 'blue', }} >16. Go To Lesson#18</SGText>
          </SGTouchableOpacity>
         <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson19Screen') }} >
            <SGText style={{ color: 'blue', }} >17. Go To Lesson#19</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson20Screen') }} >
            <SGText style={{ color: 'blue', }} >18. Go To Lesson#20</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson21Screen') }} >
            <SGText style={{ color: 'blue', }} >19. Go To Lesson#21</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson22Screen') }} >
            <SGText style={{ color: 'blue', }} >20. Go To Lesson#22</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson23Screen') }} >
            <SGText style={{ color: 'blue', }} >21. Go To Lesson#23</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson24Screen') }} >
            <SGText style={{ color: 'blue', }} >22. Go To Lesson#24</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson25Screen') }} >
            <SGText style={{ color: 'blue', }} >23. Go To Lesson#25</SGText>
          </SGTouchableOpacity>        
          <SGButton style={{ width: w * 0.65 }} label={'<< Test Screen >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'TestScreen') }} />
          <SGButton style={{ width: w * 0.65 }} label={'<< Dummy Testing Screen >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'DummyTestingScreen') }} />
          <SGButton style={{ width: w * 0.65 }} label={'<< Student List API >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'StudentList') }} />
          <SGButton style={{ width: w * 0.65 }} label={'<< Sample Sprite >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'SpriteScreen') }} />
        </SGView>
        <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson26Screen') }} >
            <SGText style={{ color: 'blue', }} >24. Go To Lesson#26</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson27Screen') }} >
            <SGText style={{ color: 'blue', }} >25. Go To Lesson#27</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson28Screen') }} >
            <SGText style={{ color: 'blue', }} >26. Go To Lesson#28</SGText>
          </SGTouchableOpacity>
      </SGRootScrollView>
    );
  }
}