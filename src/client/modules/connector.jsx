import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

import log from '../../common/log';

const combine = (features, extractor) =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  /* eslint-disable no-unused-vars */
  constructor(
    {
      route,
      navItem,
      navItemRight,
      reducer,
      middleware,
      afterware,
      connectionParam,
      createFetchOptions,
      stylesInsert,
      rootComponentFactory,
      modalRoute,
    },
    ...features
  ) {
    /* eslint-enable no-unused-vars */
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.stylesInsert = combine(arguments, arg => arg.stylesInsert);
    this.rootComponentFactory = combine(
      arguments,
      arg => arg.rootComponentFactory,
    );
    this.modalRoute = combine(arguments, arg => arg.modalRoute);
  }

  get routes() {
    return this.route.map((component, idx) =>
      React.cloneElement(component, { key: idx + this.route.length }),
    );
  }

  get modalRoutes() {
    return this.modalRoute.map((component, idx) =>
      React.cloneElement(component, { key: idx + this.route.length }),
    );
  }

  get navItems() {
    return this.navItem.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length,
      }),
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length,
      }),
    );
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get middlewares() {
    return this.middleware;
  }

  get afterwares() {
    return this.afterware;
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get constructFetchOptions() {
    return this.createFetchOptions.length
      ? (...args) => {
          try {
            let result = {};
            for (const func of this.createFetchOptions) {
              result = { ...result, ...func(...args) };
            }
            return result;
          } catch (e) {
            log.error(e.stack);
          }
        }
      : null;
  }

  get stylesInserts() {
    return this.stylesInsert;
  }

  getWrappedRoot(root, req) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}
