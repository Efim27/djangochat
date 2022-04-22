// @ts-nocheck
import * as UIkit from 'uikit';
import fetch from 'cross-fetch';

import PageBlock from './PageBlock';
import { getParameterByName } from '../utils';

export default class signin extends PageBlock {
    private readonly chatDom;
    private readonly submitBtnDom;
    private readonly refreshBtnDom;

    private csrfToken: string;
    private chatMessageList: {
        owner: number,
        recipient: number,
        msg_text: string,
        created_at: string,
    }[];
    private isChatLocked: boolean = false;
    private recipientId: number;

    protected init(): boolean {
        if (!document.querySelector('.user-chat')) {
            return false;
        }

        this.chatDom = document.querySelector(".user-chat");
        this.submitBtnDom = this.chatDom.querySelector(".user-chat__btn_send");
        this.refreshBtnDom = this.chatDom.querySelector(".user-chat__btn_refresh");
        this.csrfToken = this.chatDom.querySelector(".user-chat__csrf-token").value;
        this.recipientId = getParameterByName('user_id');

        return true;
    }

    protected start(): void {
        this.refreshMsgList();
        this.chatHandler();
    }

    private sendMsg = (): void => {
        if (this.isChatLocked) {
            return;
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
                }

                console.log(data);
            })
            .catch(error => {
                console.log(error);
                UIkit.notification('Ошибка!');
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

        this.refreshBtnDom.addEventListener('click', (event) => {
            this.refreshMsgList().then(() => {
                console.log(123);
                console.log(this.chatMessageList);
            });
        });
    }
}