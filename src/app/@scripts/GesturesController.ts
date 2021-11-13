import * as fp from 'fingerpose';

const fingerIndexUpGesture = new fp.GestureDescription('index_up');
fingerIndexUpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
fingerIndexUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
fingerIndexUpGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
fingerIndexUpGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
fingerIndexUpGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
fingerIndexUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);

const fingerIndexDownGesture = new fp.GestureDescription('index_down');
fingerIndexDownGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
fingerIndexDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
fingerIndexDownGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
fingerIndexDownGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
fingerIndexDownGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
fingerIndexDownGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalDown, 1.0);

const fingerIndexLeftGesture = new fp.GestureDescription('index_left');
fingerIndexLeftGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
fingerIndexLeftGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
fingerIndexLeftGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
fingerIndexLeftGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
fingerIndexLeftGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
fingerIndexLeftGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalLeft, 1.0);

const fingerIndexRightGesture = new fp.GestureDescription('index_right');
fingerIndexRightGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
fingerIndexRightGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
fingerIndexRightGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
fingerIndexRightGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
fingerIndexRightGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
fingerIndexRightGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalRight, 1.0);

const fingersOkGesture = new fp.GestureDescription('ok_gesture');
fingersOkGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
fingersOkGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
fingersOkGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
fingersOkGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
fingersOkGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);


export const Gestures = new fp.GestureEstimator([
  fingerIndexUpGesture,
  fingerIndexDownGesture,
  fingerIndexLeftGesture,
  fingerIndexRightGesture,
  fingersOkGesture
]);