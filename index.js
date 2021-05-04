import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';
import { registerBackgroundFetchHeadlessTasks } from 'src/utils/backgroundUpdater';
import { initialisePushNotifications } from 'src/utils/notifications';

AppRegistry.registerComponent(appName, () => App);

initialisePushNotifications();
registerBackgroundFetchHeadlessTasks();

LogBox.ignoreLogs(['Setting a timer']);
