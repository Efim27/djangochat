import signin from './blocks/signin';
import signup from './blocks/signup';
import chat from './blocks/chat';

export default () => {
    new signin();
    new signup();
    new chat();
};