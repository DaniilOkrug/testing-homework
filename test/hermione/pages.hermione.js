const { assert } = require("chai");
const { bugId } = require("./constants")

describe('Страницы:', () => {
    describe('в магазине должны быть страницы: главная, каталог, условия доставки, контакты:', () => {
        it('главная', async ({ browser }) => {
            await browser.url(`/hw/store?bug_id=${bugId}`);
            const app = await browser.$('.Application');
            assert(!Boolean(app.error), 'Страница "Главная" не существует')
        })

        it('каталог', async ({ browser }) => {
            await browser.url(`/hw/store/catalog?bug_id=${bugId}`);
            const app = await browser.$('.Application');
            assert(!Boolean(app.error), 'Страница "Каталог" не существует')
        })

        it('условия доставки', async ({ browser }) => {
            await browser.url(`/hw/store/delivery?bug_id=${bugId}`);
            const app = await browser.$('.Application');
            assert(!Boolean(app.error), 'Страница "Условия доставки" не существует')
        })

        it('контакты', async ({ browser }) => {
            await browser.url(`/hw/store/contacts?bug_id=${bugId}`);
            const app = await browser.$('.Application');
            assert(!Boolean(app.error), 'Страница "Контакты" не существует')
        })
    })

    describe('страницы главная, условия доставки, контакты должны иметь статическое содержимое:', () => {
        it('главная', async ({ browser }) => {
            await browser.url(`/hw/store?bug_id=${bugId}`);
            await browser.setWindowSize(1200, 800);
            await browser.assertView('главная', '.Application', {
                compositeImage: true
            })
        })

        it('условия доставки', async ({ browser }) => {
            await browser.url(`/hw/store/delivery?bug_id=${bugId}`);
            await browser.setWindowSize(1200, 800);
            await browser.assertView('доставка', '.Application', {
                compositeImage: true
            })
        })

        it('контакты', async ({ browser }) => {
            await browser.url(`/hw/store/contacts?bug_id=${bugId}`);
            await browser.setWindowSize(1200, 800);
            await browser.assertView('контакты', '.Application', {
                compositeImage: true
            })
        })
    })
})