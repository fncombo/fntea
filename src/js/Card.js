// Libraries
import ClassNames from 'classnames'
import Color from 'color'
import FuzzySort from 'fuzzysort'
import ZenScroll from 'zenscroll'

// React
import React, { PureComponent, Fragment } from 'react'

// Components
import Brewing from './Brewing.js'

// Card for a single tea
export default class Card extends PureComponent {
    constructor(props) {
        super(props)

        const { tea } = this.props

        // Possible brewing types
        this.brewingTypes = {
            western: 'Western',
            gongfu: 'Gong Fu',
        }

        // Default active brewing type
        this.state = {
            expanded: false,
            brewingType: tea.brewing.hasOwnProperty('western') ? 'western' : 'gongfu',
            timerState: false,
        }

        this.toggleExpand = this.toggleExpand.bind(this)
        this.timerToggleCallback = this.timerToggleCallback.bind(this)
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
    changeBrewingType(type) {
        const { timerState } = this.state

        // Can't change tabs when the timer is running
        if (timerState) {
            return
        }

        this.setState({
            brewingType: type,
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

    // Callback for when the timer is turned off and on
    timerToggleCallback(timerState) {
        const { masterTimerToggleCallback } = this.props

        masterTimerToggleCallback(timerState)

        this.setState({
            timerState: timerState,
        })
    }

    render() {
        const { tea, searchQuery } = this.props

        const { expanded, brewingType, timerState } = this.state

        // Base colour
        const teaColor = Color(tea.color)

        // Make sure the text colour is readable compared to the background
        let textColor

        // Very light and desaturated text for very dark and saturated tea colours
        if (teaColor.lightness() < 20 && teaColor.saturationv() > 90) {
            textColor = teaColor.saturate(-0.5).lighten(4.5)

        // Dark text for light tea colour
        } else if (teaColor.isLight()) {
            textColor = teaColor.darken(0.75)

        // Ligh text for dark tea colour
        } else {
            textColor = teaColor.lighten(2)
        }

        // Per-card style which includes unqiue colours
        const style = {
            // Background
            '--tea-color': teaColor,
            // Text
            '--text-color': textColor,
            // Bars background
            '--faded-tea-color': teaColor.fade(0.75),
            // Buton hover
            '--darker-tea-color': teaColor.darken(0.25),
            // Default shadow
            '--shadow-color': teaColor.fade(0.75),
            // Hover sahdow
            '--shadow-dark-color': teaColor.darken(0.75).fade(0.75),
        }

        // Card classes
        const cardClasses = ClassNames('card', {
            'expanded': expanded,
            'timer-on': timerState,
            'timer-off': !timerState,
        })

        // Highlight search query in these texts
        const season = searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.season)} /> : tea.season
        const cultivar = searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.cultivar)} /> : tea.cultivar
        const origin = searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.origin)} /> : tea.origin

        return (
            <div id={tea.name.replace(/\s/g, '-').toLowerCase()} className={cardClasses} style={style}>
                <div className="card-header" onClick={this.toggleExpand}>
                    <h1>
                        {searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.name)} /> : tea.name}
                    </h1>
                    {tea.nameOther &&
                        <h2>{(searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.nameOther)} /> : tea.nameOther)}</h2>
                    }
                </div>
                <div className="card-body">
                    <h3>
                        {tea.organic ? 'Organic ' : ''}
                        {searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch(tea.type)} /> : tea.type}
                        {!!tea.link &&
                            <a className="store-link" href={tea.link} target="_blank" title="Visit store page">
                                <span role="img" aria-label="emoji">&#128722;</span>
                            </a>
                        }
                        {tea.rating ?
                            <span className="rating">
                                {new Array(tea.rating).fill(0).map((n, i) => <span key={i}>&#x2605;</span>)}
                                {new Array(5 - tea.rating).fill(0).map((n, i) => <Fragment key={i}>&#x2605;</Fragment>)}
                            </span> :
                            <span className="rating unrated">Unrated</span>
                        }
                    </h3>
                    <ul className="card-list">
                        <li>
                            <span role="img" aria-label="emoji">&#128197;</span>
                            <div>
                                <strong>Season:</strong> {tea.season ? season : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127793;</span>
                            <div>
                                <strong>{tea.type === 'Tisane' ? 'Plant' : 'Cultivar'}:</strong> {tea.cultivar ? cultivar : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                        <li>
                            <span role="img" aria-label="emoji">&#127759;</span>
                            <div>
                                <strong>Origin:</strong> {tea.origin ? origin : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                    </ul>
                    <h3>Brewing Instructions</h3>
                    <ul className="card-tabs">
                        {Object.entries(tea.brewing).map(([type], i) =>
                            <li className={ClassNames({'active': brewingType === type})} onClick={() => this.changeBrewingType(type)} key={i}>
                                {this.brewingTypes[type]}
                            </li>
                        )}
                    </ul>
                    <Brewing name={tea.name} data={tea.brewing[brewingType]} brewingType={brewingType} timerToggleCallback={this.timerToggleCallback} />
                </div>
            </div>
        )
    }
}