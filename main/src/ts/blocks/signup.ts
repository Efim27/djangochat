import PageBlock from './PageBlock';

export default class signup extends PageBlock {
    protected init(): boolean {
        if (document.querySelector('.signup')) {
            return true;
        }

        return false;
    }

    protected start(): void {
        const signupForm = document.querySelector(".signup__form");

        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            //@ts-ignore
            const data = Object.fromEntries(new FormData(signupForm).entries());

            console.log(data);
        });
    }
}