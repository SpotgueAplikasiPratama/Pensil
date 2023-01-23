import React from 'react';
import Core from '../../core/core';


export default class SpriteScreen extends Core.Screen.SGBaseScreen {
  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: {flex:1, justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
      to1: { marginBottom: 10 },
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    const {SGHelperSoundPlayer} = Core.Helper;
    SGHelperSoundPlayer.STTInit().catch((e)=>{alert(e);});
    this.zelda = React.createRef();
  }
  componentWillUnmount() {
  }

  play(config){
    this.zelda.current.play(config);
  }
  stop(callback){
    this.zelda.current.stop(callback);
  }
  reset(callback){
    this.zelda.current.reset(callback);
  }

  playAnim1(){
    this.play({
      type:'anim1', resetAfterFinish:true,onFinish:()=>{ Core.log('anim1');}
    })
  }
  playAnim2(){
    this.play({
      type:'anim2', loop:false, resetAfterFinish:false, onFinish:()=>{ Core.log('anim2');}
    })
  }
  playAnim3(){
    this.play({
      type:'anim3', loop:false, resetAfterFinish:false, onFinish:()=>{ Core.log('anim3');}
    })
  }
  playAnim4(){
    this.play({
      type:'anim4', loop:false, resetAfterFinish:false, onFinish:()=>{ Core.log('anim4');}
    })
  }
  playAnim5(){
    this.play({
      type:'anim5', loop:true, resetAfterFinish:false, onFinish:()=>{ Core.log('anim5');}
    })
  }
  playAnim6(){
    this.play({
      type:'anim6', loop:true, resetAfterFinish:false, onFinish:()=>{ Core.log('anim6');}
    })
  }
  playAnim7(){
    this.play({
      type:'anim7', loop:true, resetAfterFinish:false, onFinish:()=>{ Core.log('anim7');}
    })
  }
  playAnim8(){
    this.play({
      type:'anim8', loop:true, resetAfterFinish:false, onFinish:()=>{ Core.log('anim8');}
    })
  }

  onStartListen(evt){
    const {SGDialogBox} = Core.Control;
    const {SGHelperSoundPlayer} = Core.Helper;
    SGHelperSoundPlayer.STTStart('en-US',()=>{},(res)=>{
      if(res.value[0]==='turn left'){this.playAnim6();}
      else if(res.value[0]==='turn right'){this.playAnim8();}
      else if(res.value[0]==='go up'){this.playAnim7();}
      else if(res.value[0]==='go down'){this.playAnim5();}
      else {SGDialogBox.showToast('unknown command')}
    },(e)=>{Core.log(JSON.stringify(e));});
  }
  onEndListen(evt){
    const {SGHelperSoundPlayer} = Core.Helper;
    SGHelperSoundPlayer.STTStop();
  }
  render() {
    const { SGRootScrollView, SGImage, SGTouchableOpacity, SGText,SGView, SGButton, SGSpriteSheet, SGDragView } = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var style = this.style;
    var {w,h,p} = this.WHPNoHeader;
    return (
      <SGRootScrollView style={style.v1} >
        <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ backgroundColor: 'transparent', width: 150, height: 150 }} />
        <SGText>
          Hi Friend, Welcome to our Game App!
        </SGText>
        <SGView style={{flexDirection:'row', width:w,flexWrap:'wrap'}}>
        <SGButton style={{ width: w * 0.35 }} label={'<< Stop >>'} preset={SGButton.preset.orange} onPress={() => { this.stop(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Reset >>'} preset={SGButton.preset.orange} onPress={() => { this.reset(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim1 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim1(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim2 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim2(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim3 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim3(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim4 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim4(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim5 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim5(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim6 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim6(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim7 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim7(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Anim8 >>'} preset={SGButton.preset.orange} onPress={() => { this.playAnim8(); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Start Listen >>'} preset={SGButton.preset.orange} onPress={(evt) => { this.onStartListen(evt); }} />
        <SGButton style={{ width: w * 0.35 }} label={'<< Stop Listen >>'} preset={SGButton.preset.orange} onPress={(evt) => { this.onEndListen(evt); }} />
        <SGTouchableOpacity style={{backgroundColor:'purple', height:w*0.15, width:w*0.35, borderRadius:4*p}} onPressIn={this.onStartListen.bind(this)} onPressOut={this.onEndListen.bind(this)}>
            <SGText style={{color:'white'}}>{'Listen'}</SGText>
        </SGTouchableOpacity>
        </SGView>
        <SGDragView>
        <SGSpriteSheet 
          ref={this.zelda} 
          source={{uri:'https://www.pinclipart.com/picdir/big/544-5449330_art-sprite-2d-unity-computer-graphics-grass-sprite.png', width:795, height:685}} 
          columns={10}
          rows={8}
          animations={{
            anim1:[0,1,2],
            anim2:[10,11,12],
            anim3:[20],
            anim4:[30,31,32],
            anim5:[40,41,42,43,44,45,46,47,48,49],
            anim6:[50,51,52,53,54,55,56,57,58,59],
            anim7:[60,61,62,63,64,65,66,67,68,69],
            anim8:[70,71,72,73,74,75,76,77,78,79]
          }}
        />
        </SGDragView>

        {/* <SGButton style={{ width: w * 0.75 }} label={'<< Game Berhitung >>'} preset={SGButton.preset.red} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GameBerhitungSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Game Penjumlahan >>'} preset={SGButton.preset.orange} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GamePenjumlahanSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Game Perkalian >>'} preset={SGButton.preset.blue} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GamePerkalianSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Game Pembagian >>'} preset={SGButton.preset.green} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GamePembagianSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Game Membaca >>'} preset={SGButton.preset.grey} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GameMembacaSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Mandarin Berhitung >>'} preset={SGButton.preset.red} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GameMBerhitungSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Mandarin Kosa Kata >>'} preset={SGButton.preset.red} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GameMKosaKataSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Mandarin Kata Bergambar >>'} preset={SGButton.preset.red} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'GameMKataBergambarSplashScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< Dummy Testing Screen >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'DummyTestingScreen') }} />
        <SGButton style={{ width: w * 0.75 }} label={'<< 15. Go To Lesson#17 >>'} preset={SGButton.preset.black} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson17Screen') }} /> */}
        {/* <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson2Screen') }} >
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
          </SGTouchableOpacity> */}
        {/* <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson26Screen') }} >
            <SGText style={{ color: 'blue', }} >24. Go To Lesson#26</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson27Screen') }} >
            <SGText style={{ color: 'blue', }} >25. Go To Lesson#27</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson28Screen') }} >
            <SGText style={{ color: 'blue', }} >26. Go To Lesson#28</SGText>
          </SGTouchableOpacity> */}
      </SGRootScrollView>
    );
  }
}