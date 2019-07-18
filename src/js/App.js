// Libraries
import FuzzySort from 'fuzzysort'

// React
import React, { Component, Fragment } from 'react'

// Style
import '../css/App.css'
import '../css/Brewing.css'
import '../css/Cards.css'
import '../css/Inputs.css'
import '../css/Text.css'
import '../css/Timer.css'

// Data
import data from './data.json'

// Componenets
import Card from './Card.js'

// Search and card gallery
export default class App extends Component {
    constructor() {
        super()

        this.state = {
            tea: this.sort(data.tea),
            searchQuery: '',
            timerState: false,
        }

        this.search = this.search.bind(this)
        this.masterTimerToggleCallback = this.masterTimerToggleCallback.bind(this)
    }

    // Sort by rating then alphabetically
    sort(tea) {
        return tea.sort((a, b) => {
            if (a.rating < b.rating) {
                return 1
            } else if (a.rating > b.rating) {
                return -1
            } else if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        })
    }

    // Simple search
    search(searchQuery = '') {
        if (!searchQuery.length) {
            this.setState({
                tea: this.sort(data.tea),
                searchQuery: '',
            })

            return
        }

        let results = []

        // Search
        FuzzySort.go(searchQuery, data.tea, {
            keys: [
                'name',
                'nameOther',
                'type',
                'season',
                'cultivar',
                'origin',
            ],
            threshold: -150,
        }).forEach(item => results.push(item.obj))

        this.setState({
            tea: this.sort(results),
            searchQuery: searchQuery,
        })
    }

    // Callback for when the timer is turned off and on
    masterTimerToggleCallback(timerState) {
        this.setState({
            timerState: timerState,
        })
    }

    render() {
        const { tea, searchQuery, timerState } = this.state

        return (
            <Fragment>
                <div className="fnheader">
                    <h1>Tea Shelf <a href="https://fncombo.me">fncombo</a></h1>
                </div>
                <div id="header">
                    <header>
                        <input
                            type="search"
                            placeholder="Filter... pun intended"
                            value={searchQuery}
                            disabled={timerState}
                            onChange={event => this.search(event.target.value)}
                            autoFocus={window.innerWidth > 600}
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoComplete="off"
                            aria-label="Search Tea List"
                        />
                    </header>
                </div>
                <div id="cards" className={`timer-${timerState ? 'on' : 'off'}`}>
                    {tea.map(tea =>
                        <Card tea={tea} searchQuery={searchQuery} key={tea.name} masterTimerToggleCallback={this.masterTimerToggleCallback} />
                    )}
                </div>
                <footer>
                    <p>Carefully researched and tweaked for personal taste and preference.<br />Actual colours may vary.<br />All amounts are per 100ml.</p>
                </footer>
            </Fragment>
        )
    }
}
