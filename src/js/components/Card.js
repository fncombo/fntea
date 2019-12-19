// React
import React, { useContext, useState, useRef, useEffect } from 'react'

// Libraries
import classNames from 'classnames'
import color from 'color'
import debounce from 'debounce'

// Components
import SearchableText from 'js/components/SearchableText'
import Brewing from 'js/components/Brewing'
import Timer from 'js/components/Timer'

// Helpers
import { GlobalState } from 'js/helpers/App'
import { calculateStyle } from 'js/helpers/functions'

// Style
import 'scss/Card.scss'

/**
 * Info item in the card details list. Search text is highlighted and empty values are replaced with a dash.
 */
const Info = ({ icon, title, children: text }) =>
    <li>
        <span role="img" aria-label={`${title} Icon`}>{icon}</span>
        <div>
            <strong>{title}:</strong>{' '}
            {text ? <SearchableText>{text}</SearchableText> : <>&mdash;</>}
        </div>
    </li>

/**
 * Card for a single tea.
 */
export default function Card({ tea }) {
    const { activeTimer, cardsRef } = useContext(GlobalState)
    const [ currentBrewing, setCurrentBrewing ] = useState(0)
    const [ isExpanded, setIsExpanded ] = useState(false)
    const [ style, setStyle ] = useState(null)
    const cardRef = useRef()
    const timerRef = useRef()

    // Whether this particular timer is the active one
    const isTimerActive = activeTimer && activeTimer.name === tea.name

    // Scroll window to the top of the card when it's expanded on mobile
    useEffect(() => {
        // Only on mobile
        if (window.innerWidth > 600) {
            return
        }

        // Current scroll amount, plus element offset from top of the document, minus spacing for the sticky header
        if (isExpanded) {
            window.scrollTo({
                top: window.pageYOffset + cardRef.current.getBoundingClientRect().top - 70,
                behavior: 'smooth',
            })
        }
    }, [ isExpanded ])

    // Center the card when the timer starts and restore the position when it ends
    useEffect(() => {
        // Only on desktop when the timer is active
        if (window.innerWidth < 600 || !isTimerActive) {
            return undefined
        }

        // Apply the style initially
        setStyle(calculateStyle(cardsRef, cardRef, timerRef))

        // Add event listeners to correctly apply the style at all times
        const debounced = debounce(() => setStyle(calculateStyle(cardsRef, cardRef, timerRef)), 150)

        window.addEventListener('scroll', debounced)

        window.addEventListener('resize', debounced)

        // Remove the style and event listeners when timer ends
        return () => {
            setStyle(null)

            window.removeEventListener('scroll', debounced)

            window.removeEventListener('resize', debounced)
        }
    }, [ isTimerActive, cardsRef ])

    // Various properties about this tea
    const isColorless = tea.color === '#000'
    const isTisane = tea.type === 'Tisane'

    // Base colour
    const teaColor = color(tea.color)

    // Make sure the text colour is readable compared to the background (light text for dark tea colour by default)
    let textColor = teaColor.lighten(2)

    // Very light and de-saturated text for very dark and saturated tea colours
    if (teaColor.lightness() < 20 && teaColor.saturationv() > 90) {
        textColor = teaColor.saturate(-0.5).lighten(4.5)

    // Dark text for light tea colour
    } else if (teaColor.isLight()) {
        textColor = teaColor.darken(0.75)
    }

    // Per-card style which includes unique colours for different UI elements
    const colorStyle = isColorless ? null : {
        // Background
        '--tea-color': teaColor,
        // Text
        '--text-color': textColor,
        // Bars background
        '--faded-tea-color': teaColor.fade(0.75),
        // Button hover
        '--darker-tea-color': teaColor.darken(0.25),
        // Default shadow
        '--shadow-color': teaColor.fade(0.75),
        // Hover shadow
        '--shadow-dark-color': teaColor.saturate(1.5).darken(0.5).fade(0.75),
    }

    // Card classes
    const classes = classNames('card', isTimerActive ? 'timer-on' : 'timer-off', {
        'is-expanded': isExpanded,
        'is-colorless': isColorless,
    })

    return (
        <div className={classes} style={{ ...style, ...colorStyle }} ref={cardRef}>
            <hgroup onClick={() => setIsExpanded(!isExpanded)}>
                <SearchableText as="h2">{tea.name}</SearchableText>
                {tea.altName && <SearchableText as="h3">{tea.altName}</SearchableText>}
            </hgroup>
            <div className="card-body">
                <SearchableText as="h4">
                    {tea.isOrganic && 'Organic '}{tea.type}
                </SearchableText>
                {!!tea.link &&
                    <a href={tea.link} target="_blank" title="Visit store" rel="noopener noreferrer">
                        <span role="img" aria-label="Cart Icon">🛒</span>
                    </a>
                }
                {tea.rating
                    ? (
                        <span className="rating" role="img" aria-label={`${tea.rating} Star Icons`}>
                            {Array.from({ length: tea.rating }, () => '⭐')}
                        </span>
                    )
                    : <span className="rating is-unrated">Unrated</span>
                }
                <ul className="card-list">
                    <Info icon="📅" title="Season">
                        {tea.season}
                    </Info>
                    <Info icon={isTisane ? '🌿' : '🌱'} title={isTisane ? 'Plant' : 'Cultivar'}>
                        {tea.cultivar}
                    </Info>
                    <Info icon="🌏" title="Origin">
                        {tea.origin}
                    </Info>
                </ul>
                <h4>Brewing Instructions</h4>
                <ul className="card-tabs">
                    {tea.brewing.map(({ displayName }, i) => {
                        const tabClasses = classNames({ 'is-active': currentBrewing === i })
                        const clickCallback = activeTimer ? null : () => setCurrentBrewing(i)

                        return (
                            <li className={tabClasses} onClick={clickCallback} key={displayName}>
                                {displayName}
                            </li>
                        )
                    })}
                </ul>
                <div className="card-tabs-content">
                    <Brewing data={tea.brewing[currentBrewing]} />
                    <Timer tea={tea} data={tea.brewing[currentBrewing]} timerRef={timerRef} />
                </div>
            </div>
        </div>
    )
}
