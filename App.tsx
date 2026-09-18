// Polyfill buffer for react-native-svg compatibility
import './src/polyfills/buffer';

// Expo's entry point (node_modules/expo/AppEntry.js) imports the default export
// from this file and registers it as the root component. Re-export the real App
// component so Expo registers the correct component.
export {default} from './src/App';
