// @ts-nocheck
import * as UIkit from 'uikit';
import PageBlock from './PageBlock';

export default class signup extends PageBlock {
    private readonly formDom;

    protected init(): boolean {
        if (!document.querySelector('.signup')) {
            return false;
        }

        this.formDom = document.querySelector(".signup__form");

        return true;
    }

    protected start(): void {
        this.formHandler();
    }

    private clearFieldErrors = (): void => {
        const fieldErrorsDom = this.formDom.querySelectorAll(`.signup__form-error`);
        fieldErrorsDom.forEach((fieldErrorDom) => {
            fieldErrorDom.innerHTML = '';
        });
    }

    private printFieldError = (fieldName, error: string): void => {
        const fieldDom = this.formDom.querySelector(`.signup__field-${fieldName} p.signup__form-error`);
        fieldDom.innerHTML = error;
    }

    private updateFormErrors(errors: object) {
        this.clearFieldErrors();

        Object.entries(errors).forEach(([fieldName, error]) => {
            this.printFieldError(fieldName, error);
        });
    }

    private signinRequestHandler = (data): void => {
        if (data.status == 'error') {
            this.updateFormErrors(data.errors);
            return;
        }

        window.location.href = '/signin';
    }

    private formHandler(): void {
        this.formDom.addEventListener('submit', (event) => {
            event.preventDefault();

            fetch('/signup/post', {
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