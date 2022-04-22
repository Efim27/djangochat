// @ts-nocheck
import * as UIkit from 'uikit';
import fetch from 'cross-fetch';

import PageBlock from './PageBlock';
import { getParameterByName } from '../utils';

class chatRenderHandler {
    private chatDom;
    private chatMessagesListDom;
    private recipientId: number = getParameterByName('user_id');

    constructor(chatDom) {
        this.chatDom = chatDom;
        this.chatMessagesListDom = this.chatDom.querySelector('.user-chat__messages');
    }

    private clearMsgList(): void {
        this.chatMessagesListDom.innerHTML = '';
    }

    public renderMsg(msgData: {
        owner: number,
        recipient: number,
        msg_text: string,
        created_at: string,
    }) {
        const exampleMessage = document.querySelector('.user-chat__message_example');
        const messageDom = exampleMessage.cloneNode(true);

        messageDom.classList.remove('user-chat__message_example');
        messageDom.querySelector('.user-chat-message__text').innerHTML = msgData.msg_text;
        messageDom.querySelector('.user-chat-message__datetime').innerHTML = msgData.created_at;

        // Проверка типа сообщения по владельцу
        // Если владелец текущий юзер:
        if (msgData.recipient_id == this.recipientId) {
            messageDom.querySelector('.user-chat-message__owner').innerHTML = 'Я';
            messageDom.classList.add('user-chat__message_imowner');
            messageDom.classList.add('uk-card-primary');
        }
        else {
            messageDom.querySelector('.user-chat-message__owner').innerHTML = msgData.owner_username;
            messageDom.classList.add('uk-card-secondary');
        }

        this.chatMessagesListDom.append(messageDom);
        this.chatMessagesListDom.scrollTop = this.chatMessagesListDom.scrollHeight;
    }

    public renderMsgList(msgList: {
        owner: number,
        recipient: number,
        msg_text: string,
        created_at: string,
    }[]): void {
        this.clearMsgList();

        msgList.forEach((chatMessageData) => {
            this.renderMsg(chatMessageData);
        });
    }
}

export default class chat extends PageBlock {
    private chatDom;
    private submitBtnDom;

    private csrfToken: string;
    private chatMessageList: {
        owner: number,
        recipient: number,
        msg_text: string,
        created_at: string,
    }[];
    private chatRenderHandler: chatRenderHandler;
    private isChatLocked: boolean = false;
    private recipientId: number;

    protected init(): boolean {
        if (!document.querySelector('.user-chat')) {
            return false;
        }

        this.chatDom = document.querySelector(".user-chat");
        this.chatRenderHandler = new chatRenderHandler(this.chatDom);
        this.submitBtnDom = this.chatDom.querySelector(".user-chat__btn_send");
        this.csrfToken = this.chatDom.querySelector(".user-chat__csrf-token").value;
        this.recipientId = getParameterByName('user_id');

        return true;
    }

    protected start(): void {
        this.refreshMsgList().then(() => {
            this.chatRenderHandler.renderMsgList(this.chatMessageList);
        });
        this.chatHandler();
    }

    private sendMsg = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (this.isChatLocked) {
                return reject();
            }

            const msgText: string = this.chatDom.querySelector('.user-chat__textarea').value;
            const sendMsgFormData: FormData = new FormData();
            sendMsgFormData.append('recipient_id', this.recipientId);
            sendMsgFormData.append('msg_text', msgText);
            sendMsgFormData.append('csrfmiddlewaretoken', this.csrfToken);

            fetch('/chat/send_msg', {
                method: 'POST',
                body: sendMsgFormData
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status == 'error') {
                        UIkit.notification(data.error);
                        return resolve();
                    }

                    this.chatRenderHandler.renderMsg(data.message);
                    return resolve();
                })
                .catch(error => {
                    console.log(error);
                    UIkit.notification('Ошибка!');
                    return reject();
                });
        });
    }

    private refreshMsgList(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sendMsgFormData: FormData = new FormData();
            sendMsgFormData.append('recipient_id', this.recipientId);
            sendMsgFormData.append('csrfmiddlewaretoken', this.csrfToken);

            fetch('/chat/list', {
                method: 'POST',
                body: sendMsgFormData
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status == 'error') {
                        UIkit.notification(data.error);
                        return reject();
                    }

                    this.chatMessageList = data.messages;
                    return resolve();
                })
                .catch(error => {
                    console.log(error);
                    UIkit.notification('Ошибка!');
                    return reject();
                });
        });
    }

    private lockSubmitBtn = (): void => {
        this.submitBtnDom.disabled = true;
        this.isChatLocked = true;
    }

    private unlockSubmitBtn = (): void => {
        this.submitBtnDom.disabled = false;
        this.isChatLocked = false;
    }

    private chatHandler(): void {
        this.submitBtnDom.addEventListener('click', (event) => {
            if (this.isChatLocked) {
                return;
            }

            this.sendMsg();

            this.lockSubmitBtn();
            setTimeout(this.unlockSubmitBtn, 500);
        });

        this.chatDom.querySelector(".user-chat__btn_refresh").addEventListener('click', (event) => {
            this.refreshMsgList().then(() => {
                this.chatRenderHandler.renderMsgList(this.chatMessageList);
            });
        });
    }
}