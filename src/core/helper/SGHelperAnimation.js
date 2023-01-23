/**
* Please use react-native-reanimated
* single animation : timing, decay, spring
* multiple animation : parallel, sequence, stagger
* animated components : View, Text, Image, ScrollView, Code
* Spotgue Core Helper for Animating object
* wrap react native animation implementation and hide from Spotgue UI App
* @format 
* @flow 
* 1. Animate with parameter object, effect, change value, duration, event animation tick call back, event animation complete call back
*    a. translation (movement)
*    b. rotation
*    c. scale
*    d. transparansi
* 2. Stop Animation
* 3. Clear Animation
*/
import { SGHelperType } from './SGHelperType';
import { SGConfigCore } from '../config/SGConfigCore';


export class SGHelperAnimation {
  static curve1 = [0, 0.001, 0.002, 0.003, 0.005, 0.008, 0.011, 0.015, 0.019, 0.024, 0.029, 0.035, 0.041, 0.048, 0.055, 0.063, 0.072, 0.081, 0.09, 0.1, 0.111, 0.122, 0.133, 0.145, 0.158, 0.171, 0.184, 0.197, 0.211, 0.224, 0.237, 0.25, 0.263, 0.276, 0.289, 0.303, 0.316, 0.329, 0.342, 0.355, 0.368, 0.382, 0.395, 0.408, 0.421, 0.434, 0.447, 0.461, 0.474, 0.487, 0.5, 0.513, 0.526, 0.539, 0.553, 0.566, 0.579, 0.592, 0.605, 0.618, 0.632, 0.645, 0.658, 0.671, 0.684, 0.697, 0.711, 0.724, 0.737, 0.75, 0.763, 0.776, 0.789, 0.803, 0.816, 0.829, 0.842, 0.855, 0.867, 0.878, 0.889, 0.9, 0.91, 0.919, 0.928, 0.937, 0.945, 0.952, 0.959, 0.965, 0.971, 0.976, 0.981, 0.985, 0.989, 0.992, 0.995, 0.997, 0.998, 0.999, 1];
  static curve2 = [0, 0.009, 0.018, 0.027, 0.036, 0.045, 0.054, 0.063, 0.073, 0.082, 0.092, 0.101, 0.111, 0.121, 0.13, 0.14, 0.15, 0.161, 0.171, 0.181, 0.191, 0.202, 0.213, 0.223, 0.234, 0.245, 0.256, 0.267, 0.278, 0.289, 0.301, 0.312, 0.324, 0.335, 0.347, 0.359, 0.371, 0.383, 0.395, 0.407, 0.42, 0.432, 0.445, 0.457, 0.47, 0.483, 0.496, 0.509, 0.523, 0.536, 0.55, 0.563, 0.577, 0.591, 0.605, 0.619, 0.633, 0.648, 0.662, 0.677, 0.692, 0.706, 0.721, 0.737, 0.752, 0.767, 0.783, 0.799, 0.814, 0.83, 0.846, 0.863, 0.879, 0.896, 0.912, 0.929, 0.946, 0.963, 0.98, 0.998, 1.015, 1.033, 1.051, 1.069, 1.087, 1.106, 1.124, 1.143, 1.162, 1.181, 1.2, 1.179, 1.158, 1.138, 1.118, 1.098, 1.078, 1.058, 1.038, 1.019, 1];
  static _animList = [];
  static _isAnimating = false;
  static _delay = SGConfigCore.config.SGHelperAnimation.delay;
  static _isForceStop = false;
  static _lastFrameTime;


  /**
   * get a unique animatio ID
   */
  static getAnimationID() {
    return SGHelperType.getGUID();
  }

  /**
   * add 1 dimension animation (1 axis movement, alpha change or rotation change)
   * @param {*} x1 
   * @param {*} x2 
   * @param {*} smoothen 
   * @param {*} duration 
   * @param {*} onAnimate 
   * @param {*} onEnd 
   */
  static addAnimation1D(x1, x2, smoothen, duration, onAnimate, onEnd) {
    var id = SGHelperAnimation.getAnimationID();
    SGHelperAnimation._animList.push({
      id: id,
      origin: { x: x1, },
      target: { x: x2, },
      current: { x: x1, },
      delta: { x: x2 - x1, },
      smoothen: smoothen,
      onAnimate: onAnimate ? onAnimate : (cur) => { },
      onEnd: onEnd ? onEnd : (cur) => { },
      duration: duration,
      start: Date.now(),
      dimension: 1,
      animFunction: SGHelperAnimation._animate1D,
    });
    SGHelperAnimation.startAllAnimation();
    return id;
  }
  /**
   * add 2 dimension animation (x, y)
   * @param {*} x1 
   * @param {*} y1 
   * @param {*} x2 
   * @param {*} y2 
   * @param {*} smoothen 
   * @param {*} duration 
   * @param {*} onAnimate 
   * @param {*} onEnd 
   */
  static addAnimation2D(x1, y1, x2, y2, smoothen, duration, onAnimate, onEnd) {
    var id = SGHelperAnimation.getAnimationID();
    SGHelperAnimation._animList.push({
      id: id,
      origin: { x: x1, y: y1 },
      target: { x: x2, y: y2 },
      current: { x: x1, y: y1 },
      delta: { x: x2 - x1, y: y2 - y1 },
      smoothen: smoothen,
      onAnimate: onAnimate ? onAnimate : (cur) => { },
      onEnd: onEnd ? onEnd : (cur) => { },
      duration: duration,
      start: Date.now(),
      dimension: 2,
      animFunction: SGHelperAnimation._animate2D,
    });
    SGHelperAnimation.startAllAnimation();
    return id;
  }
  /**
   * add 4 Dimension animation x,y and w,h change
   * @param {*} x1 
   * @param {*} y1 
   * @param {*} w1 
   * @param {*} h1 
   * @param {*} x2 
   * @param {*} y2 
   * @param {*} w2 
   * @param {*} h2 
   * @param {*} smoothen 
   * @param {*} duration 
   * @param {*} onAnimate 
   * @param {*} onEnd 
   */
  static addAnimation4D(x1, y1, w1, h1, x2, y2, w2, h2, smoothen, duration, onAnimate, onEnd) {
    var id = SGHelperAnimation.getAnimationID();
    SGHelperAnimation._animList.push({
      id: id,
      origin: { x: x1, y: y1, w: w1, h: h1 },
      target: { x: x2, y: y2, w: w2, h: h2 },
      current: { x: x1, y: y1, w: w1, h: h1 },
      delta: { x: x2 - x1, y: y2 - y1, w: w2 - w1, h: h2 - h1 },
      smoothen: smoothen,
      onAnimate: onAnimate ? onAnimate : (cur) => { },
      onEnd: onEnd ? onEnd : (cur) => { },
      duration: duration,
      start: Date.now(),
      dimension: 4,
      animFunction: SGHelperAnimation._animate4D,
    });
    SGHelperAnimation.startAllAnimation();
    return id;
  }
  /**
   * clear all animation in the list
   */
  static _clearAnimationList() {
    SGHelperAnimation._animList = Array();
    SGHelperAnimation._isAnimating = false;
    SGHelperAnimation._isForceStop = false;
  }
  /**
   * start all animation
   */
  static startAllAnimation() {
    if (!SGHelperAnimation._isAnimating) {
      SGHelperAnimation._isAnimating = true;
      SGHelperAnimation._lastFrameTime = Date.now();
      SGHelperAnimation.animateAll();
    }
  }
  /**
   * stop all animation
   */
  static stopAllAnimation() {
    if (SGHelperAnimation._isAnimating) {
      SGHelperAnimation._isForceStop = true;
      SGHelperAnimation._clearAnimationList();
    }
  }
  /**
   * stop animation of given ID
   */
  static stopAnimation(id) {
    for (var i = 0; i < SGHelperAnimation._animList.length; i++) {
      if (SGHelperAnimation._animList[i] !== null) {
        if (SGHelperAnimation._animList[i].id === id) {
          SGHelperAnimation._animList[i] = null;
        }
      }
    }
  }
  /**
   * animate all animation request
   */
  static animateAll() {
    if (SGHelperAnimation._isForceStop) { SGHelperAnimation._clearAnimationList(); return; }
    var counter = 0;
    for (let i = 0; i < SGHelperAnimation._animList.length; i++) {
      var obj = SGHelperAnimation._animList[i];
      if (obj !== null) {
        counter++;
        obj.animFunction(obj, i);
      }
    }
    var curDT = Date.now();
    var lastDur = curDT - SGHelperAnimation._lastFrameTime;
    if (counter > 0) {
      setTimeout(() => { SGHelperAnimation.animateAll(); }, Math.max(0, SGHelperAnimation._delay - lastDur));
    } else {
      SGHelperAnimation._clearAnimationList();
    }
    SGHelperAnimation._lastFrameTime = curDT;
  }

  /**
   * animate the request frame by frame
   * @param {*} obj 
   * @param {*} i 
   */
  static _animate1D(obj, i) {
    var cur = Date.now();
    var progDur = Math.max(Math.min(obj.duration, cur - obj.start), 0) / obj.duration;
    var curvefactor = progDur;
    if (obj.smoothen) {
      curvefactor = SGHelperAnimation.curve1[Math.floor(progDur * 100)];
    }
    obj.current.x = obj.origin.x + obj.delta.x * curvefactor;
    obj.onAnimate(obj.current);
    if (progDur >= 1.0) {
      obj.onEnd(obj.current);
      SGHelperAnimation._animList[i] = null;
    }
  }

  /**
   * animate the request frame by frame
   * @param {*} obj 
   * @param {*} i 
   */
  static _animate2D(obj, i) {
    var cur = Date.now();
    var progDur = Math.max(Math.min(obj.duration, cur - obj.start), 0) / obj.duration;
    var curvefactor = progDur;
    if (obj.smoothen) {
      curvefactor = SGHelperAnimation.curve1[Math.floor(progDur * 100)];
    }
    obj.current.x = obj.origin.x + obj.delta.x * curvefactor;
    obj.current.y = obj.origin.y + obj.delta.y * curvefactor;
    obj.onAnimate(obj.current);
    if (progDur >= 1.0) {
      obj.onEnd(obj.current);
      SGHelperAnimation._animList[i] = null;
    }
  }

  /**
   * animate the request frame by frame
   * @param {*} obj 
   * @param {*} i 
   */
  static _animate4D(obj, i) {
    var cur = Date.now();
    var progDur = Math.max(Math.min(obj.duration, cur - obj.start), 0) / obj.duration;
    var curvefactor = progDur;
    if (obj.smoothen) {
      curvefactor = SGHelperAnimation.curve1[Math.floor(progDur * 100)];
    }
    obj.current.x = obj.origin.x + obj.delta.x * curvefactor;
    obj.current.y = obj.origin.y + obj.delta.y * curvefactor;
    obj.current.w = obj.origin.w + obj.delta.w * curvefactor;
    obj.current.h = obj.origin.h + obj.delta.h * curvefactor;
    obj.onAnimate(obj.current);
    if (progDur >= 1.0) {
      obj.onEnd(obj.current);
      SGHelperAnimation._animList[i] = null;
    }
  }
}
