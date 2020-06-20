import React from 'react'
import { hydrate, render } from 'react-dom'

import smoothscroll from 'smoothscroll-polyfill'

import App from 'src/js/App'

const rootEl = document.getElementById('root')

// Hydrate server rendered HTML or render from scratch
if (rootEl.hasChildNodes()) {
    hydrate(<App />, rootEl)
} else {
    render(<App />, rootEl)
}

smoothscroll.polyfill()
