import PageBlock from './PageBlock';

export default class signin extends PageBlock {
    protected init(): boolean {
        if (document.querySelector('.signin')) {
            return true;
        }

        return false;
    }

    protected start(): void {
        const signinForm = document.querySelector(".signin__form");

        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            //@ts-ignore
            const data = Object.fromEntries(new FormData(signinForm).entries());

            console.log(data);
        });
    }
}