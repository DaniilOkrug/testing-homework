import React, { PropsWithChildren } from "react";
import { AnyAction, Store } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { commerce } from "faker";

import { Application } from "../../../src/client/Application";
import { CartApi, ExampleApi } from "../../../src/client/api";
import { initStore } from "../../../src/client/store";

import { CartState, Product } from "../../../src/common/types";

export const products = getProducts();

export const initState = {
  cart: {
    1: { name: products[0].name, price: products[0].price, count: 1 },
    2: { name: products[1].name, price: products[1].price, count: 2 },
    3: { name: products[2].name, price: products[2].price, count: 3 },
  } as CartState,
  products,
};

export const basename = "/hw/store";

export function renderApp(
  config: Partial<{
    element: JSX.Element;
    initState: Partial<{
      cart: CartState;
      products: Product[];
    }>;
    routeInitialEntries: string[];
  }> = {
    element: <Application />,
    initState,
  }
) {
  const api = new ExampleApi(basename);

  const products = config.initState?.products || [];
  api.getProducts = () => Promise.resolve({ data: products || [] } as any);
  api.getProductById = (id) => Promise.resolve({ data: products[id] } as any);

  const cart = new CartApi();
  if (config.initState?.cart) cart.setState(initState.cart);

  const store = initStore(api, cart);

  const content = <Provider store={store}>{config.element}</Provider>;
  const application = config.routeInitialEntries ? (
    <MemoryRouter initialEntries={config.routeInitialEntries}>
      {content}
    </MemoryRouter>
  ) : (
    <BrowserRouter basename={basename}>{content}</BrowserRouter>
  );

  return { app: render(application), store, cartAPI: cart };
}

function getProducts() {
  const products: Product[] = [];

  for (let i = 0; i < 10; i++) {
    products.push({
      id: i,
      name: commerce.productName(),
      price: Number(commerce.price()),
      description: commerce.productDescription(),
      color: commerce.color(),
      material: commerce.productMaterial(),
    });
  }

  return products;
}
