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
    private isChatLocked: boolean = false;
    private chatMessageList: string[];

    protected init(): boolean {
        if (!document.querySelector('.user-chat')) {
            return false;
        }

        this.chatDom = document.querySelector(".user-chat");
        this.submitBtnDom = this.chatDom.querySelector(".user-chat__btn_send");
        this.refreshBtnDom = this.chatDom.querySelector(".user-chat__btn_refresh");
        this.csrfToken = this.chatDom.querySelector(".user-chat__csrf-token").value;

        return true;
    }

    protected start(): void {
        this.chatHandler();
    }

    private sendMsg = (): void => {
        if (this.isChatLocked) {
            return;
        }

        const msgText: string = this.chatDom.querySelector('.user-chat__textarea').value;
        const sendMsgFormData: FormData = new FormData();
        sendMsgFormData.append('recipient_id', getParameterByName('user_id'));
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
            console.log();
            if (this.isChatLocked) {
                return;
            }

            this.sendMsg();

            this.lockSubmitBtn();
            setTimeout(this.unlockSubmitBtn, 500);
        });
    }
}