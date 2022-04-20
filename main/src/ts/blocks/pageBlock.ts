export default abstract class PageBlock {
    constructor() {
        if (!this.init()) {
            return;
        }

        this.start();
    }

    protected abstract init(): boolean
    protected abstract start(): void
}