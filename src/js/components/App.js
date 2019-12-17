// React
import React, { useState, useReducer } from 'react'

// Components
import Card from 'js/components/Card'

// Helpers
import { GlobalState, stateReducer, INITIAL_STATE } from 'js/helpers/App'

// Style
import 'scss/App.scss'

/**
 * This is the thing!
 */
export default function App() {
    const [ activeTimer, setActiveTimer ] = useState(null)
    const [ { teas, searchQuery }, setSearchQuery ] = useReducer(stateReducer, INITIAL_STATE)

    return (
        <GlobalState.Provider value={{ activeTimer, setActiveTimer, searchQuery }}>
            <div className="fnheader">
                <h1>Tea Shelf <a href="https://fncombo.me">fncombo</a></h1>
            </div>
            <div id="header">
                <header>
                    <input
                        type="search"
                        placeholder="Filter... pun intended"
                        value={searchQuery}
                        disabled={!!activeTimer}
                        onChange={({ target: { value } }) => setSearchQuery(value)}
                        autoFocus={window.innerWidth > 600}
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                    />
                </header>
            </div>
            {!teas.length && <div id="no-search-results">What kind of tea is that?</div>}
            <div id="cards" className={`timer-${activeTimer ? 'on' : 'off'}`}>
                {teas.map(tea =>
                    <Card tea={tea} key={tea.name} />
                )}
            </div>
            <footer>
                <p>Carefully researched and tweaked for personal taste and preference.</p>
                <p>Actual colours may vary.</p>
                <p>All amounts are per 100ml.</p>
            </footer>
        </GlobalState.Provider>
    )
}
