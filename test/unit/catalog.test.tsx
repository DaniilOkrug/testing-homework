import React from "react";
import { Route } from "react-router";

import { decodeHTML } from "./helpers/decodeHTML";
import { basename, initState, products, renderApp } from "./helpers/renderApp";

import { Catalog } from "../../src/client/pages/Catalog";
import { Product } from "../../src/client/pages/Product";

describe("Каталог:", () => {
  it("в каталоге должны отображаться товары, список которых приходит с сервера", async () => {
    const { app } = renderApp({
      element: <Catalog />,
      initState,
    });
    const { getAllByTestId } = app;
    await new Promise((r) => setTimeout(r, 500));

    for (const id of Object.keys(initState.products)) {
      expect(Boolean(getAllByTestId(id)[0])).toBe(true);
    }
  });

  it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const { app } = renderApp({
      element: <Catalog />,
      initState,
    });
    const { getAllByTestId } = app;
    await new Promise((r) => setTimeout(r, 500));

    for (const product of initState.products) {
      const productItem = getAllByTestId(product.id).find((item) =>
        item.className.includes("ProductItem")
      );
      const itemFields = [
        {
          classname: "ProductItem-Name",
          value: product.name,
        },
        {
          classname: "ProductItem-Price",
          value: "$" + product.price,
        },
        {
          classname: "ProductItem-DetailsLink",
          value: `/hw/store/catalog/${product.id}`,
        },
      ];
      for (const item of itemFields) {
        const productFieldItem = productItem?.getElementsByClassName(
          item.classname
        )[0];
        const targetData =
          item.classname === "ProductItem-DetailsLink"
            ? productFieldItem?.getAttribute("href")
            : productFieldItem?.innerHTML;
        expect(targetData).toEqual(item.value);
      }
    }
  });

  it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
    const { app } = renderApp({
      element: (
        <Route path={`${basename}/catalog/:id`}>
          <Product />
        </Route>
      ),
      initState,
      routeInitialEntries: [`${basename}/catalog/0`],
    });
    const { getByText } = app;
    await new Promise((r) => setTimeout(r, 500));

    const productDetailsName = document.getElementsByClassName(
      "ProductDetails-Name"
    )[0];
    const productDetailsDescription = document.getElementsByClassName(
      "ProductDetails-Description"
    )[0];
    const productDetailsPrice = document.getElementsByClassName(
      "ProductDetails-Price"
    )[0];
    const productDetailsColor = document.getElementsByClassName(
      "ProductDetails-Color"
    )[0];
    const productDetailsMaterial = document.getElementsByClassName(
      "ProductDetails-Material"
    )[0];
    expect(decodeHTML(productDetailsName.innerHTML)).toEqual(products[0].name);
    expect(decodeHTML(productDetailsDescription.innerHTML)).toEqual(
      products[0].description
    );
    expect(decodeHTML(productDetailsPrice.innerHTML)).toEqual(
      "$" + products[0].price
    );
    expect(decodeHTML(productDetailsColor.innerHTML)).toEqual(
      products[0].color
    );
    expect(decodeHTML(productDetailsMaterial.innerHTML)).toEqual(
      products[0].material
    );
    expect(getByText("Add to Cart").tagName).toEqual("BUTTON");
  });

  describe("если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом:", () => {
    const testId = 1;

    it("каталог", async () => {
      const { app } = renderApp({
        element: <Catalog />,
        initState,
      });
      const { getAllByTestId } = app;
      await new Promise((r) => setTimeout(r, 500));

      const productCard = getAllByTestId(testId)[0];
      expect(decodeHTML(productCard.innerHTML)).toContain("Item in cart");
    });

    it("страница товара", async () => {
      const { app } = renderApp({
        element: (
          <Route path={`${basename}/catalog/:id`}>
            <Product />
          </Route>
        ),
        initState,
        routeInitialEntries: [`${basename}/catalog/${testId}`],
      });
      const { getByText } = app;
      await new Promise((r) => setTimeout(r, 500));

      expect(Boolean(getByText("Item in cart"))).toEqual(true);
    });
  });

  it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
    const { app, store } = renderApp({
      element: (
        <Route path={`${basename}/catalog/:id`}>
          <Product />
        </Route>
      ),
      initState,
      routeInitialEntries: [`${basename}/catalog/1`],
    });
    const { getByText } = app;
    await new Promise((r) => setTimeout(r, 500));

    const button = getByText("Add to Cart");
    button.click();

    expect(store.getState().cart[1].count).toEqual(initState.cart[1].count + 1);
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
    const { store, cartAPI } = renderApp({
      element: (
        <Route path={`${basename}/catalog/:id`}>
          <Product />
        </Route>
      ),
      initState,
      routeInitialEntries: [`${basename}/catalog/1`],
    });
    await new Promise((r) => setTimeout(r, 500));

    //Проверка localStorage. При удачном результате, товары сохраняются при переагрузке
    expect(Object.keys(cartAPI.getState()).length).toEqual(
      Object.keys(store.getState().cart).length
    );
  });
});
