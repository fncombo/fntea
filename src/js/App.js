import React, { useLayoutEffect, useRef, useState } from 'react'

import color from 'color'

import Card from 'src/js/Card'
import { ActiveTimerTeaProvider, SearchQueryProvider, useActiveTimerTea, useTeas } from 'src/js/utils'

import 'src/scss/App.scss'

/**
 * Full page overlay for the brewing progress gradient which uses the current tea's colour.
 */
function Progress() {
    const [activeTimerTea] = useActiveTimerTea()

    if (!activeTimerTea) {
        return null
    }

    const teaColor = color(activeTimerTea.color)
    const colorStops = [
        teaColor.lighten(0.25).fade(0.5),
        teaColor.fade(0.5),
        teaColor.saturate(1.5).darken(0.5).fade(0.5),
    ]

    return (
        <div
            className="progress"
            style={{
                animationDuration: `${activeTimerTea.timerValue}s`,
                backgroundImage: `linear-gradient(to bottom, ${colorStops.join(', ')})`,
            }}
        />
    )
}

/**
 * Header, search UI, and the grid of tea cards.
 */
export default function App() {
    const { teas, searchQuery, updateSearchQuery } = useTeas()
    const [activeTimerTea, setActiveTimerTea] = useState(null)
    const cardsRef = useRef(null)

    useLayoutEffect(() => {
        // @ts-ignore
        if (window.navigator.standalone) {
            document.body.classList.add('is-standalone')
        }
    }, [])

    return (
        <ActiveTimerTeaProvider value={[activeTimerTea, setActiveTimerTea]}>
            <div className="fnheader">
                <h1>
                    Tea Shelf <a href="#">Aendy</a>
                </h1>
            </div>
            <div id="header">
                <label htmlFor="search">Search</label>
                <header>
                    <input
                        id="search"
                        type="search"
                        placeholder="Filter... pun intended"
                        value={searchQuery}
                        disabled={!!activeTimerTea}
                        onChange={updateSearchQuery}
                        autoFocus={window.innerWidth > 600}
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                    />
                </header>
            </div>
            {!teas.length && (
                <div id="no-search-results">
                    Hmm, no tea found! Have a recommendation? Drop me an email{' '}
                    <span role="img" aria-label="Smiley">
                        😃
                    </span>
                </div>
            )}
            <div id="cards" className={`timer-${activeTimerTea ? 'on' : 'off'}`} ref={cardsRef}>
                <SearchQueryProvider value={searchQuery}>
                    {teas.map((tea, index) => (
                        <Card tea={tea} index={index} cardsRef={cardsRef} key={tea.key} />
                    ))}
                </SearchQueryProvider>
            </div>
            {!!teas.length && (
                <footer>
                    <p>Carefully researched and tweaked for personal taste and preference.</p>
                    <p>Season, cultivar, and origin are reflective of the latest purchase.</p>
                    <p>Actual colours may vary. All amounts are per 100ml.</p>
                </footer>
            )}
            <Progress />
        </ActiveTimerTeaProvider>
    )
}
