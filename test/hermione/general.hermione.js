const { assert } = require("chai");

const { routes, bugId } = require("./constants");

describe('общие требования:', () => {
    beforeEach(async ({ browser }) => {
        await browser.url(`/hw/store?bug_id=${bugId}`);
        const app = await browser.$('.Application');
        await app.waitForExist();
    });

    describe('вёрстка должна адаптироваться под ширину экрана:', () => {
        it('ширина >= 1400', async ({
            browser
        }) => {
            const windowSizes = await browser.getWindowSize();
            await browser.setWindowSize(1400, windowSizes.height);

            const adaptiveContainer = await browser.$('.container');
            const sizes = await adaptiveContainer.getSize();

            assert.equal(sizes.width, 1320, 'Невреный размер адаптивного контейнера при ширине равной 1400');
        })

        it('ширина >= 1200', async ({
            browser
        }) => {
            const windowSizes = await browser.getWindowSize();
            await browser.setWindowSize(1200, windowSizes.height);

            const adaptiveContainer = await browser.$('.container');
            const sizes = await adaptiveContainer.getSize();

            assert.equal(sizes.width, 1140, 'Невреный размер адаптивного контейнера при ширине равной 1200');
        })

        it('ширина >= 992', async ({
            browser
        }) => {
            const windowSizes = await browser.getWindowSize();
            await browser.setWindowSize(992, windowSizes.height);

            const adaptiveContainer = await browser.$('.container');
            const sizes = await adaptiveContainer.getSize();

            assert.equal(sizes.width, 960, 'Невреный размер адаптивного контейнера при ширине равной 992');
        })

        it('ширина >= 768', async ({
            browser
        }) => {
            const windowSizes = await browser.getWindowSize();
            await browser.setWindowSize(768, windowSizes.height);

            const adaptiveContainer = await browser.$('.container');
            const sizes = await adaptiveContainer.getSize();

            assert.equal(sizes.width, 720, 'Невреный размер адаптивного контейнера при ширине равной 768');
        })

        it('ширина >= 576', async ({
            browser
        }) => {
            const windowSizes = await browser.getWindowSize();
            await browser.setWindowSize(576, windowSizes.height);

            const adaptiveContainer = await browser.$('.container');
            const sizes = await adaptiveContainer.getSize();

            assert.equal(sizes.width, 540, 'Невреный размер адаптивного контейнера при ширине равной 576');
        })
    })

    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async ({ browser }) => {
        const menu = await browser.$('.Application-Menu');
        const menuLinks = await (await menu.$('.navbar-nav')).$$(`.nav-link`);

        const links = new Set();
        for (let i = 0; i < menuLinks.length; i++) {
            const link = await menuLinks[i].getAttribute('href');
            links.add(link);
            if (!routes.includes(link)) {
                assert(false, 'Путь не существует в списке маршрутов')
            }
        }

        assert.lengthOf([...links], 4);
    });

    it('название магазина в шапке должно быть ссылкой на главную страницу', async ({ browser }) => {
        const linkElement = await browser.$('.Application-Brand')
        const url = await linkElement.getAttribute('href');

        assert.equal(url, '/hw/store/');
    });

    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ browser }) => {
        const windowSizes = await browser.getWindowSize();
        await browser.setWindowSize(575, windowSizes.height);

        const menuHamburger = await browser.$('.Application-Toggler')

        assert(await menuHamburger.isDisplayed(), 'Меню не скрыто в "гамбургер"')
    });

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
        const windowSizes = await browser.getWindowSize();
        await browser.setWindowSize(575, windowSizes.height);

        const menuHamburger = await browser.$('.Application-Toggler');
        await menuHamburger.click();

        const menuApp = await browser.$('.Application-Menu');

        const links = await browser.$$('.nav-link');
        await links[0].click();

        assert(!(await menuApp.isDisplayed()), 'Меню "гамбургер" не закрылось')
    });
});