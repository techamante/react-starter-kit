import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import Helmet from 'react-helmet';
import Html from './html';
import ErrorPage from '../../client/modules/common/components/ErrorPage';
import errorPageStyle from '../../client/modules/common/components/ErrorPage.scss';
import assets from './assets.json';
// eslint-disable-line import/no-unresolved
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  console.error(pe.render(err));
  const helmet = Helmet.renderStatic(); // Avoid memory leak while tracking mounted instances
  const test = 'hello';
  const ErrorHtml = ({ children }) => (
    <html lang="en">
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        <style>{errorPageStyle._getCss()}</style>
      </head>
      <body>{children}</body>
    </html>
  );

  const html = ReactDOM.renderToStaticMarkup(
    <ErrorHtml>
      <ErrorPage error={err} />
    </ErrorHtml>,
  );

  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
};
