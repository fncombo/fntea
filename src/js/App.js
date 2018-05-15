// Libraries
import NoSleep from 'nosleep.js'
import FuzzySort from 'fuzzysort'
import Color from 'color'
import Ordinal from 'ordinal'

// React
import React, { Component, PureComponent, Fragment } from 'react'

// Style
import '../css/App.css'

// Data
import data from './data.json'

// Lookup constants
const teaTypes = {
    1: 'Green',
    2: 'White',
    3: 'Oolong',
    4: 'Black',
    5: 'Pu-erh',
    6: 'Blend',
    7: 'Herbal',
}

const brewingTypes = {
    western: 'Western',
    gongfu: 'Gong Fu',
}

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
            tea: data,
            searchQuery: '',
        }

        this.search = this.search.bind(this)
    }

    // Simple search
    search(searchQuery) {
        if (!searchQuery.length) {
            this.setState({
                tea: data,
                searchQuery: searchQuery,
            })

            return
        }

        let results = []

        FuzzySort.go(searchQuery, data, {
            keys: [
                'name',
                'nameOther',
                'season',
                'cultivar',
                'origin',
            ],
            threshold: -150,
        }).forEach(item => results.push(item.obj))

        this.setState({
            tea: results,
            searchQuery: searchQuery,
        })
    }

    render() {
        const { tea, searchQuery } = this.state

        return (
            <Fragment>
                <header>
                    <input
                        type="search"
                        placeholder="Filter (haha...)"
                        autoComplete="false"
                        value={searchQuery}
                        onChange={event => this.search(event.target.value)}
                    />
                </header>
                <div id="cards">
                    {tea.map(tea => <Card tea={tea} key={tea.name} />)}
                </div>
                <footer>
                    <ul>
                        <li><strong>Wishlist</strong></li>
                        <li>Dong Fang Mei Ren (Eastern Beauty)</li>
                        <li>Tie Guan Yin (Iron Goddess)</li>
                        <li>Jin Xuan (Milk Oolong)</li>
                        <li>Assam</li>
                    </ul>
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
            brewingTab: tea.brewing.hasOwnProperty('western') ? 'western' : 'gongfu'
        }
    }

    // Change the brewing instructions tab
    changeBrewingTab(type) {
        this.setState({
            brewingTab: type,
        })
    }

    render() {
        const { tea } = this.props
        const { brewingTab } = this.state

        // Make sure the text colour is readable compared to the background
        const teaColor = Color(tea.color)
        const style = {
            '--tea-color': teaColor,
            '--text-color': teaColor.isLight() ? teaColor.darken(0.65) : teaColor.lighten(2),
        }

        return (
            <div className="card" style={style}>
                <h1>
                    {tea.name}
                    <span>{tea.nameOther || <Fragment>&mdash;</Fragment>}</span>
                </h1>
                <div className="card-body">
                    <h2>
                        {tea.organic ? 'Organic ' : ''}{teaTypes[tea.type]} Tea
                        {!!tea.link &&
                            <a href={tea.link} target="_blank" title="Visit store page">
                                <span role="img" aria-label="emoji">&#128722;</span>
                            </a>}
                        <span>
                            {tea.rating ?
                                <span className="rating">
                                    {new Array(tea.rating).fill(0).map((n, i) => <strong key={i}>&#x2605;</strong>)}
                                    {new Array(5 - tea.rating).fill(0).map((n, i) => <Fragment key={i}>&#x2605;</Fragment>)}
                                </span> : 'Unrated'}
                        </span>
                    </h2>
                    <ul className="card-list">
                        <li>
                            <span role="img" aria-label="emoji">&#128197;</span>
                            <span><strong>Season:</strong> {tea.season || 'Unknown'}</span>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127793;</span>
                            <span><strong>{tea.type === 7 ? 'Plant' : 'Cultivar'}:</strong> {tea.cultivar || 'Unknown'}</span>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127759;</span>
                            <span><strong>Origin:</strong> {tea.origin || 'Unknown'}</span>
                        </li>
                    </ul>
                    <h2>Brewing Instructions</h2>
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
                        <BrewingInstructions data={tea.brewing[type]} active={brewingTab === type} key={i} />
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
            timer: data.baseDuration * infusion,
            noSleep: noSleep,
        }, this.runTimer)
    }

    // Timer loop to decremenet each second
    runTimer() {
        const { timer } = this.state

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
                    alert('Timer Done')
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
                        <strong className="temp-large">Temperature</strong>
                        <strong className="temp-small">Temp.</strong>
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
                            {new Array(5).fill(0).map((n, i) => <span key={i} />)}
                            <div></div>
                            <div style={{ width: `${(data.baseDuration / 240) * 100}%` }}></div>
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