import React from "react";
import "@testing-library/jest-dom";

import { Cart } from "../../src/client/pages/Cart";
import { initState, renderApp } from "./helpers/renderApp";

describe("Корзина:", () => {
  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", () => {
    const { app } = renderApp();
    const { getAllByRole } = app;

    const cartLink = getAllByRole("link").find(
      (link) => link.getAttribute("href") === "/hw/store/cart"
    );

    const regex = /\d+/g;
    const martchArr = cartLink?.innerHTML.match(regex);
    const cartAmount = martchArr ? Number(martchArr[0]) : 0;

    expect(cartAmount).toEqual(Object.keys(initState.cart).length);
  });

  it("в корзине должна отображаться таблица с добавленными в нее товарами", () => {
    const { app } = renderApp({
      element: <Cart />,
    });
    const { getByTestId, getByRole } = app;

    expect(getByRole("table").className).toContain("Cart-Table");

    for (const id of Object.keys(initState.cart)) {
      expect(getByTestId(id)).toBeVisible();
    }
  });

  it("для каждого товара должны отображаться название, цена, количество, стоимость, а также должна отображаться общая сумма заказа", () => {
    const { app } = renderApp({
      element: <Cart />,
    });
    const { getByTestId } = app;

    for (const id of Object.keys(initState.cart)) {
      const cartItemData = initState.cart[Number(id)];

      const row = getByTestId(id);
      const rowItems = Array.from(row.children);

      const mockCartTable = [
        {
          class: "Cart-Index",
          value: id,
        },
        {
          class: "Cart-Name",
          value: cartItemData.name,
        },
        {
          class: "Cart-Price",
          value: "$" + cartItemData.price,
        },
        {
          class: "Cart-Count",
          value: cartItemData.count,
        },
        {
          class: "Cart-Total",
          value: "$" + cartItemData.count * cartItemData.price,
        },
      ];

      for (let i = 0; i < rowItems.length; i++) {
        expect(rowItems[i]).toHaveClass(mockCartTable[i].class);
        expect(rowItems[i].innerHTML).toEqual(String(mockCartTable[i].value));
      }
    }
  });

  it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', () => {
    const { app } = renderApp({
      element: <Cart />,
    });
    const { getByText, queryByTestId } = app;

    const resetButton = getByText("Clear shopping cart");
    expect(resetButton).toBeVisible();
    resetButton.click();

    for (const id of Object.keys(initState.cart)) {
      expect(queryByTestId(id)).toBeNull();
    }
  });

  it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
    renderApp({
      element: <Cart />,
      initState: {},
    });

    const cart = document.getElementsByClassName("Cart")[0];
    expect(cart.innerHTML).toContain("Cart is empty");
  });
});
