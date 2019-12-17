// React
import { createContext } from 'react'

// Data
import TEAS from 'js/teas.json'

// Global state context
const GlobalState = createContext()

// Keys of tea data to search in
const SEARCH_KEYS = [
    'type',
    'name',
    'nameAlt',
    'cultivar',
    'origin',
]

/**
 * Sort teas by rating then alphabetically.
 */
function sortTeas(teas) {
    return teas.sort((a, b) => {
        if (a.rating < b.rating) {
            return 1
        }

        if (a.rating > b.rating) {
            return -1
        }

        if (a.name < b.name) {
            return -1
        }

        if (a.name > b.name) {
            return 1
        }

        return 0
    })
}

/**
 * Filter by search query.
 */
function filterTeas(teas, searchQuery) {
    if (!searchQuery) {
        return teas
    }

    const normalizedSearch = searchQuery.toUpperCase()

    return teas.filter(tea =>
        SEARCH_KEYS.some(key =>
            (tea[key] ? tea[key].toUpperCase().includes(normalizedSearch) : false)
        )
    )
}

/**
 * Global state reducer to filter and sort teas when the search query updates.
 */
function stateReducer(state, searchQuery) {
    return {
        teas: sortTeas(filterTeas([ ...TEAS ], searchQuery)),
        searchQuery,
    }
}

// Default global state data
const INITIAL_STATE = {
    teas: sortTeas([ ...TEAS ]),
    searchQuery: '',
}

// Exports
export {
    GlobalState,
    stateReducer,
    INITIAL_STATE,
}
