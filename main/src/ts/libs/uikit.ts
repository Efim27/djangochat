
import * as UIkit from 'uikit';
// @ts-ignore
import Icons from 'uikit/dist/js/uikit-icons';

export default () => {
    // @ts-ignore
    window.UIkit = UIkit;

    // @ts-ignore
    UIkit.use(Icons);
};