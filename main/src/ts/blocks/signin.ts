// @ts-nocheck
import * as UIkit from 'uikit';
import fetch from 'cross-fetch';

import PageBlock from './PageBlock';

export default class signin extends PageBlock {
    private readonly formDom;
    private readonly formErrorsDom;

    protected init(): boolean {
        if (!document.querySelector('.signin')) {
            return false;
        }

        this.formDom = document.querySelector(".signin__form");
        this.formErrorsDom = this.formDom.querySelector(".signup__form-error");

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

    private formHandler(): void {
        this.formDom.addEventListener('submit', (event) => {
            event.preventDefault();

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