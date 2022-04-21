// @ts-nocheck
import * as UIkit from 'uikit';
import fetch from 'cross-fetch';

import PageBlock from './PageBlock';

export default class signin extends PageBlock {
    private readonly formDom;
    private readonly formSubmitBtnDom;
    private readonly formErrorsDom;

    private isFormLocked: boolean = false;

    protected init(): boolean {
        if (!document.querySelector('.signin')) {
            return false;
        }

        this.formDom = document.querySelector(".signin__form");
        this.formErrorsDom = this.formDom.querySelector(".signin__form-error");
        this.formSubmitBtnDom = this.formDom.querySelector(".signin__submit");

        return true;
    }

    protected start(): void {
        this.formHandler();
    }

    private updateFormError(errorText: string) {
        this.formErrorsDom.innerHTML = errorText;
    }

    private signinRequestHandler = (data): void => {
        if (data.status == 'error') {
            this.updateFormError(data.error);
            UIkit.notification(data.error);
            return;
        }

        window.location.href = '/';
    }

    private lockForm = (): void => {
        this.formSubmitBtnDom.disabled = true;
        this.isFormLocked = true;
    }

    private unlockForm = (): void => {
        this.formSubmitBtnDom.disabled = false;
        this.isFormLocked = false;
    }

    private formHandler(): void {
        this.formDom.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.isFormLocked) {
                return;
            }

            this.lockForm();
            setTimeout(this.unlockForm, 500);

            fetch('/signin/post', {
                method: 'POST',
                body: new FormData(this.formDom)
            })
                .then(response => response.json())
                .then(this.signinRequestHandler)
                .catch(error => {
                    console.log(error);
                    UIkit.notification('Ошибка!');
                });
        });
    }
}