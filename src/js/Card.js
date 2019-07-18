// Libraries
import ClassNames from 'classnames'
import Color from 'color'

// React
import React, { PureComponent, Fragment } from 'react'

// Components
import SearchableText from './SearchableText'
import Brewing from './Brewing'

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
            // Get offset of the element from top of the document
            const scrollTop = document.querySelector(`#${tea.name.replace(/\s/g, '-').toLowerCase()}`).getBoundingClientRect().top

            // Current scroll amount, plus element offset, minus spacing for the sticky header
            window.scrollTo({
                top: window.pageYOffset + scrollTop - 70,
                behavior: 'smooth',
            })
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

        return (
            <div id={tea.name.replace(/\s/g, '-').toLowerCase()} className={cardClasses} style={style}>
                <hgroup className="card-header" onClick={this.toggleExpand}>
                    <h2><SearchableText text={tea.name} searchQuery={searchQuery} /></h2>
                    {tea.nameOther && <h3><SearchableText text={tea.nameOther} searchQuery={searchQuery} /></h3>}
                </hgroup>
                <div className="card-body">
                    <h4>
                        {tea.organic && 'Organic '}
                        <SearchableText text={tea.type} searchQuery={searchQuery} />
                    </h4>
                    {!!tea.link &&
                        <a className="store-link" href={tea.link} target="_blank" title="Visit store page" rel="noopener noreferrer">
                            <span role="img" aria-label="emoji">&#128722;</span>
                        </a>
                    }
                    {tea.rating > 0 ?
                        <span className="rating" role="img" aria-label={`${tea.rating} Star Emojis`}>
                            {/* eslint-disable-next-line */}
                            {new Array(tea.rating).fill(0).map((n, i) => <Fragment key={i}>&#11088;</Fragment>)}
                        </span> :
                        <span className="rating unrated">Unrated</span>
                    }
                    <ul className="card-list">
                        <li>
                            <span role="img" aria-label="Calendar Emoji">&#128197;</span>
                            <div>
                                <strong>Season:</strong>&nbsp;
                                {tea.season ? <SearchableText text={tea.season} searchQuery={searchQuery} /> : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                        <li>
                            <span role="img" aria-label="Plant Emoji">&#127793;</span>
                            <div>
                                <strong>{tea.type === 'Tisane' ? 'Plant' : 'Cultivar'}:</strong>&nbsp;
                                {tea.cultivar ? <SearchableText text={tea.cultivar} searchQuery={searchQuery} /> : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                        <li>
                            <span role="img" aria-label="Globe Emoji">&#127759;</span>
                            <div>
                                <strong>Origin:</strong>&nbsp;
                                {tea.origin ? <SearchableText text={tea.origin} searchQuery={searchQuery} /> : <Fragment>&mdash;</Fragment>}
                            </div>
                        </li>
                    </ul>
                    <h4>Brewing Instructions</h4>
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
