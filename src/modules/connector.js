// @flow
/* eslint-disable no-unused-vars */
import type { DocumentNode } from 'graphql';
import type { Middleware, $Request } from 'express';

import {
  merge,
  map,
  union,
  without,
  castArray,
  concat,
  reduce,
  pluck,
  assignIn,
} from 'lodash';

import log from '../helpers/log';

const combine = (features, extractor): any =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

type FeatureParams = {
  schema: DocumentNode | DocumentNode[],
  createResolversFunc?: Function | Function[],
  createContextFunc?: Function | Function[],
  beforeware?: Middleware | Middleware[],
  middleware?: Middleware | Middleware[],
  createFetchOptions?: Function | Function[],
  creatModelFunc?: Function | Function[],
};

class Feature {
  schema: DocumentNode[];
  createResolversFunc: Function[];
  createContextFunc: Function[];
  createFetchOptions: Function[];
  beforeware: Function[];
  middleware: Function[];

  constructor(feature?: FeatureParams, ...features: Feature[]) {
    const allFeatures = concat(castArray(feature), features);
    // console.log(feature.schema[0] instanceof DocumentNode);
    this.schema = combine(allFeatures, arg => arg.schema);
    this.createResolversFunc = combine(
      allFeatures,
      arg => arg.createResolversFunc,
    );
    this.createContextFunc = combine(allFeatures, arg => arg.createContextFunc);
    this.beforeware = combine(allFeatures, arg => arg.beforeware);
    this.middleware = combine(allFeatures, arg => arg.middleware);
    this.createFetchOptions = combine(
      allFeatures,
      arg => arg.createFetchOptions,
    );
  }

  get schemas(): DocumentNode[] {
    return this.schema;
  }

  async createContext(req: $Request, connectionParams: any, webSocket: any) {
    const results = await Promise.all(
      this.createContextFunc.map(createContext =>
        createContext(req, connectionParams, webSocket),
      ),
    );
    return merge({}, ...results);
  }

  createResolvers(pubsub: any) {
    return merge(
      {},
      ...this.createResolversFunc.map(createResolvers =>
        createResolvers(pubsub),
      ),
    );
  }

  get beforewares(): Middleware[] {
    return this.beforeware;
  }

  get middlewares(): Middleware[] {
    return this.middleware;
  }

  get constructFetchOptions(): any {
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
}

export default Feature;
