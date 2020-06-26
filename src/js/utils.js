import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import TEAS from 'src/teas.json'

/**
 * Search query string helpers.
 */
const SearchQueryContext = createContext('')

const SearchQueryProvider = SearchQueryContext.Provider

const useSearchQuery = () => useContext(SearchQueryContext)

/**
 * Active timer tea object context helpers.
 */
const ActiveTimerTeaContext = createContext(null)

const ActiveTimerTeaProvider = ActiveTimerTeaContext.Provider

const useActiveTimerTea = () => useContext(ActiveTimerTeaContext)

/**
 * Calculates the X and Y transform values for a card in order to move it to the middle of the window.
 */
function calculateStyle(cardsRef, index, cardShadowRef) {
    // Final calculated style of the cards container
    const cardsStyle = window.getComputedStyle(cardsRef.current)

    // Gap between columns
    const columnsGap = parseInt(cardsStyle.gap, 10)

    // Array of all the columns
    const columns = cardsStyle.gridTemplateColumns.split(' ')

    // Width and height or columns and rows
    const columnWidth = parseInt(columns[0], 10)
    const rowHeight = parseInt(cardsStyle.gridTemplateRows.split(' ')[0], 10)

    // Index of the card in the list
    let currentColumn = index + 1

    // Calculate which row this card is on
    const currentRow = Math.ceil(currentColumn / columns.length) - 1

    // Calculate the column of this card based on its index and the row it's on
    if (currentColumn > columns.length) {
        currentColumn -= currentRow * columns.length
    }

    // Calculate the middle column of a row
    const middleColumn = (columns.length + 1) / 2

    // Total height of the card when it is expanded
    const cardHeight = cardShadowRef.current.getBoundingClientRect().height

    // Calculate the total offset from the top of the card and by how much to move it for it to be centered
    const topCardsOffset = cardsRef.current.getBoundingClientRect().top
    const topRowOffset = rowHeight * currentRow + columnsGap * currentRow
    const topTotalOffset = topCardsOffset + topRowOffset - 60
    const topMoveOffset = (window.innerHeight - cardHeight - 60) / 2

    // Number of columns to move this card by for it to be centered
    const moveColumnsCount = middleColumn - currentColumn

    // Final transform amounts
    const x = moveColumnsCount * columnWidth + (moveColumnsCount - 0.5) * columnsGap
    const y = -topTotalOffset + topMoveOffset

    return `translate(${x}px, ${y}px)`
}

/**
 * Custom hook to center a card when its timer is active.
 */
function useCardCentering(isActiveTimerTea, cardsRef, index) {
    const cardRef = useRef(null)
    const cardShadowRef = useRef(null)

    // Center the card when the timer starts and restore the position when it ends
    useEffect(() => {
        const card = cardRef.current

        // Only on desktop when the timer is active
        if (window.innerWidth < 600 || !isActiveTimerTea) {
            return undefined
        }

        disableBodyScroll(null, {
            reserveScrollBarGap: true,
        })

        // Apply the initial style
        card.style.transform = calculateStyle(cardsRef, index, cardShadowRef)

        // Add event listener to correctly apply the style when the window is resized
        const eventHandler = () => {
            card.style.transform = calculateStyle(cardsRef, index, cardShadowRef)
        }

        window.addEventListener('resize', eventHandler)

        // Remove the style and event listeners when timer ends
        return () => {
            enableBodyScroll(null)

            card.style.transform = ''

            window.removeEventListener('resize', eventHandler)
        }
    }, [isActiveTimerTea, cardsRef, index])

    return { cardRef, cardShadowRef }
}

/**
 * Filters ad sorts the teas data based on the search query.
 */
function getTeas(searchQuery = '') {
    const normalizedSearch = searchQuery.toLowerCase()
    const searchKeys = ['type', 'name', 'altName', 'season', 'cultivar', 'origin']

    return TEAS.filter((tea) => searchKeys.some((key) => !!tea[key]?.toLowerCase().includes(normalizedSearch))).sort(
        (teaA, teaB) => {
            if (teaA.rating === null && teaB.rating !== null) {
                return 1
            }

            if (teaA.rating < teaB.rating) {
                return 1
            }

            if (teaA.rating > teaB.rating) {
                return -1
            }

            if (teaA.name < teaB.name) {
                return -1
            }

            if (teaA.name > teaB.name) {
                return 1
            }

            return 0
        }
    )
}

/**
 * Custom hook to returned filtered and sorted teas.
 */
function useTeas() {
    const [teas, setTeas] = useState(getTeas)
    const [searchQuery, setSearchQuery] = useState('')

    const updateSearchQuery = useCallback(({ target: { value } }) => {
        setSearchQuery(value)

        setTeas(getTeas(value))
    }, [])

    return { teas, searchQuery, updateSearchQuery }
}

/**
 * Tea data prop types.
 */
const TeaPropTypes = {}

TeaPropTypes.brewingDuration = PropTypes.exact({
    base: PropTypes.number.isRequired,
    increase: PropTypes.number.isRequired,
})

TeaPropTypes.brewingMethod = PropTypes.exact({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    duration: TeaPropTypes.brewingDuration.isRequired,
    maxInfusions: PropTypes.number.isRequired,
})

TeaPropTypes.brewing = PropTypes.arrayOf(TeaPropTypes.brewingMethod)

TeaPropTypes.tea = PropTypes.exact({
    type: PropTypes.string.isRequired,
    isOrganic: PropTypes.bool.isRequired,
    color: PropTypes.string,
    name: PropTypes.string.isRequired,
    isFancyName: PropTypes.bool,
    altName: PropTypes.string,
    season: PropTypes.string,
    cultivar: PropTypes.string,
    origin: PropTypes.string.isRequired,
    rating: PropTypes.number,
    link: PropTypes.string,
    temperature: PropTypes.number.isRequired,
    brewing: TeaPropTypes.brewing.isRequired,
})

export {
    SearchQueryProvider,
    useSearchQuery,
    ActiveTimerTeaProvider,
    useActiveTimerTea,
    useCardCentering,
    useTeas,
    TeaPropTypes,
}
