// Libraries
import NoSleep from './NoSleep.js'
import FuzzySort from 'fuzzysort'
import Color from 'color'
import Ordinal from 'ordinal'
import ZenScroll from 'zenscroll'

// React
import React, { Component, PureComponent, Fragment } from 'react'

// Style
import '../css/App.css'

// Data
import data from './data.json'

const brewingTypes = {
    western: 'Western',
    gongfu: 'Gong Fu',
}

// Calculate offset to center scrolling elements on the screen
ZenScroll.setup(false, (window.innerHeight - 580) / 2)

// Format a number of seconds to a pretty string
// e.g. 120 => 2 min or 2:00, 45 => 45 sec or 0:45
const formatTime = (seconds, shortFormat) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    if (shortFormat) {
        return (min ? `${min}:` : '0:') + (sec ? (sec + '').padStart(2, '0') : '00')
    }

    return (min ? `${min} min` : '') + (sec ? (min ? ' ' : '') + `${sec} sec` : '')
}

// Search, gallery, followed by a wishlist
// TODO: Make wishlist dynamic?
export default class App extends Component {
    constructor() {
        super()

        this.state = {
            tea: this.sort(data.tea),
            searchQuery: '',
        }

        this.search = this.search.bind(this)
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

    render() {
        const { tea, searchQuery } = this.state

        return (
            <Fragment>
                <div class="fnheader">
                    <h1>Tea Shelf <a href="https://fncombo.me"><span>fn</span><span>combo</span></a></h1>
                </div>
                <header>
                    <input
                        type="search"
                        placeholder="Filter... pun intended"
                        autoComplete="false"
                        value={searchQuery}
                        onChange={event => this.search(event.target.value)}
                        autoFocus={window.innerWidth > 600}
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                    />
                </header>
                <div id="cards">
                    {tea.map(tea => <Card tea={tea} searchQuery={searchQuery} key={tea.name} />)}
                </div>
                <footer>
                    <p>Carefully researched and tweaked for personal taste and preference. Actual colours may vary.</p>
                </footer>
            </Fragment>
        )
    }
}

// Card for a single tea
class Card extends PureComponent {
    constructor(props) {
        super(props)

        const { tea } = this.props

        // Default active brewing type
        this.state = {
            expanded: false,
            brewingTab: tea.brewing.hasOwnProperty('western') ? 'western' : 'gongfu',
        }

        this.toggleExpand = this.toggleExpand.bind(this)
    }

    // Toggle whether the card is expanded or not on a phone
    toggleExpand() {
        const { expanded } = this.state
        const { tea } = this.props

        // Only if small enough for collapsed cards
        if (window.innerWidth > 600) {
            return
        }

        this.setState({
            expanded: !expanded,
        })

        if (!expanded) {
            ZenScroll.to(document.querySelector(`#${tea.name.replace(/\s/g, '-').toLowerCase()}`))
        }
    }

    // Change the brewing instructions tab
    changeBrewingTab(type) {
        this.setState({
            brewingTab: type,
        })
    }

    // Highlight the current search in a text string
    highlightSearch(value) {
        const { searchQuery } = this.props

        const result = FuzzySort.single(searchQuery, value)

        return {
            __html: result ? FuzzySort.highlight(result, '<strong>', '</strong>') : value,
        }
    }

    render() {
        const { tea, searchQuery } = this.props
        const { expanded, brewingTab } = this.state

        // Make sure the text colour is readable compared to the background
        const teaColor = Color(tea.color)
        const textColor = teaColor.isLight() ? teaColor.darken(0.75) : teaColor.lighten(2)
        const style = {
            '--tea-color': teaColor,
            '--text-color': textColor,
            '--faded-tea-color': teaColor.fade(0.75),
            '--faded-text-color': textColor.fade(0.75),
            '--darker-tea-color': teaColor.darken(0.25),
        }

        return (
            <div id={tea.name.replace(/\s/g, '-').toLowerCase()} className={`card ${expanded ? 'expanded' : ''}`} style={style}>
                <div className="card-header" onClick={this.toggleExpand}>
                    <h1>
                        {searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.name)} /> : tea.name}
                    </h1>
                    {tea.nameOther && <h2>{(searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.nameOther)} /> : tea.nameOther)}</h2>}
                </div>
                <div className="card-body">
                    <h3>
                        {tea.organic ? 'Organic ' : ''}{searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.type)} /> : tea.type}
                        {!!tea.link &&
                            <a className="store-link" href={tea.link} target="_blank" title="Visit store page">
                                <span role="img" aria-label="emoji">&#128722;</span>
                            </a>}
                        {tea.rating ?
                            <span className="rating">
                                {new Array(tea.rating).fill(0).map((n, i) => <span key={i}>&#x2605;</span>)}
                                {new Array(5 - tea.rating).fill(0).map((n, i) => <Fragment key={i}>&#x2605;</Fragment>)}
                            </span> : <span className="rating unrated">Unrated</span>}
                    </h3>
                    <ul className="card-list">
                        <li>
                            <span role="img" aria-label="emoji">&#128197;</span>
                            <div><strong>Season:</strong> {tea.season ? (searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.season)} /> : tea.season) : <Fragment>&mdash;</Fragment>}</div>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127793;</span>
                            <div><strong>{tea.type === 7 ? 'Plant' : 'Cultivar'}:</strong> {tea.cultivar ? (searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.cultivar)} /> : tea.cultivar) : <Fragment>&mdash;</Fragment>}</div>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127759;</span>
                            <div><strong>Origin:</strong> {tea.origin ? (searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.origin)} /> : tea.origin) : <Fragment>&mdash;</Fragment>}</div>
                        </li>
                    </ul>
                    <h3>Brewing Instructions</h3>
                    <ul className="card-tabs">
                        {Object.entries(tea.brewing).map(([type], i) =>
                            <li
                                className={brewingTab === type ? 'active' : ''}
                                onClick={() => this.changeBrewingTab(type)}
                                key={i}
                            >
                                {brewingTypes[type]}
                            </li>
                        )}
                    </ul>
                    {Object.entries(tea.brewing).map(([type], i) =>
                        <BrewingInstructions name={tea.name} data={tea.brewing[type]} active={brewingTab === type} key={i} />
                    )}
                </div>
            </div>
        )
    }
}

// Brewing instructions tab with a configurable timer
class BrewingInstructions extends PureComponent {
    constructor() {
        super()

        this.state = {
            timer: false,
            infusion: 1,
            timeoutId: false,
            noSleep: undefined,
        }

        this.decreaseInfusion = this.decreaseInfusion.bind(this)
        this.increaseInfusion = this.increaseInfusion.bind(this)
        this.toggleTimer = this.toggleTimer.bind(this)
        this.runTimer = this.runTimer.bind(this)
    }

    // Decrease infustion to a minimum of 1
    decreaseInfusion() {
        const { infusion } = this.state

        if (infusion === 1) {
            return
        }

        this.setState({
            infusion: infusion - 1,
        })
    }

    // Increase infusion to a maximum for this tea
    increaseInfusion() {
        const { infusion } = this.state
        const { data } = this.props

        if (infusion === data.infusions) {
            return
        }

        this.setState({
            infusion: infusion + 1,
        })
    }

    // Turn the timer on or off based on whether it's running
    toggleTimer() {
        const { timer, infusion, timeoutId } = this.state
        const { data } = this.props

        // Stop the timer if it is runing
        if (timer) {
            window.clearTimeout(timeoutId)

            this.state.noSleep.disable()

            this.setState({
                timer: false,
                noSleep: undefined,
            })

            return
        }

        // Start no sleep to prevent phone screen from turning off while timer is running
        const noSleep = new NoSleep()
        noSleep.enable()

        // Start the initial timer
        this.setState({
            timer: data.baseDuration + (data.durationIncrease * (infusion - 1)),
            noSleep: noSleep,
        }, this.runTimer)
    }

    // Timer loop to decremenet each second
    runTimer() {
        const { infusion, timer } = this.state
        const { name } = this.props

        // Decrement the current timer value
        this.setState({
            timer: timer - 1 === 0 ? false : timer - 1,
        }, () => {
            // Check if the timer is done
            if (!this.state.timer) {
                this.state.noSleep.disable()

                this.setState({
                    timer: false,
                    noSleep: undefined,
                })

                // Tiny delay to let the page unpate the text to 0:00
                window.setTimeout(() => {
                    alert(`Timer for ${Ordinal(infusion)} infusion of ${name} done.`)
                }, 100)

                return
            }

            // Schdeule update timeout loop
            const timeoutId = window.setTimeout(this.runTimer, 1000)

            // Save the timeout ID for manual cancel by button
            this.setState({
                timeoutId: timeoutId,
            })
        })
    }

    render() {
        const { data, active } = this.props
        const { timer, infusion } = this.state

        return (
            <div className={`card-tabs-content ${active ? 'active' : ''}`}>
                <ul className="brewing-data">
                    <li>
                        <strong>Amount</strong>
                        <span>{data.amount}g&nbsp;&#8725;&nbsp;100ml</span>
                        <div className="bar">
                            {new Array(6).fill(0).map((n, i) => <span key={i} />)}
                            <div></div>
                            <div style={{ width: `${(data.amount * 10) * 2}%` }}></div>
                        </div>
                    </li>
                    <li>
                        <strong>Temperature</strong>
                        <span>{data.temperature}&deg; C</span>
                        <div className="bar">
                            {new Array(6).fill(0).map((n, i) => <span key={i} />)}
                            <div></div>
                            <div style={{ width: `${(data.temperature - 50) * 2}%` }}></div>
                        </div>
                    </li>
                    <li>
                        <strong>Infusions</strong>
                        <span>{data.infusions}</span>
                        <div className="bar">
                            {new Array(11).fill(0).map((n, i) => <span key={i} />)}
                            <div></div>
                            <div style={{ width: `${data.infusions * 10}%` }}></div>
                        </div>
                    </li>
                    <li>
                        <strong>Infusion Time</strong>
                        <span>{formatTime(data.baseDuration)} base, +{formatTime(data.durationIncrease)} per extra</span>
                        <div className="bar">
                            {new Array(4).fill(0).map((n, i) => <span key={i} />)}
                            <div></div>
                            <div style={{ width: `${(data.baseDuration / 180) * 100}%` }}></div>
                        </div>
                    </li>
                </ul>
                <div className="card-section timer-body">
                    <div className="timer-control">
                        <button
                            className="timer-duration decrease"
                            onClick={this.decreaseInfusion}
                            disabled={infusion === 1 || !!timer}
                        />
                    </div>
                    <div className="timer-content">
                        <span className="timer-infusion">{Ordinal(infusion)} Infusion</span>
                        <strong className="timer-clock">
                            {timer ?
                                formatTime(timer, true) :
                                formatTime(data.baseDuration + (data.durationIncrease * (infusion - 1)), true)}
                        </strong>
                    </div>
                    <div className="timer-control">
                        <button
                            className="timer-duration increase"
                            onClick={this.increaseInfusion}
                            disabled={infusion === data.infusions || !!timer}
                        />
                    </div>
                </div>
                <div className="card-section">
                    <button className="timer-start" onClick={this.toggleTimer}>
                        {timer ? 'Stop' : 'Start'} Brewing Timer
                    </button>
                </div>
            </div>
        )
    }
}