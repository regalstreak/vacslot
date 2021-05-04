import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';
import { registerBackgroundFetchHeadlessTasks } from 'src/utils/backgroundUpdater';
import { initialisePushNotifications } from 'src/utils/notifications';
import CodePush from 'react-native-code-push';

AppRegistry.registerComponent(appName, () => App);

initialisePushNotifications();
registerBackgroundFetchHeadlessTasks();

CodePush.sync({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.ON_NEXT_RESUME,
    updateDialog: false,
});

LogBox.ignoreLogs(['Setting a timer']);
