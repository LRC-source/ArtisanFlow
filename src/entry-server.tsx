import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppWithoutRouter } from '../App';

export function render(url: string) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppWithoutRouter />
      </StaticRouter>
    </React.StrictMode>
  );
}
