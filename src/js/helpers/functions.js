/*
 * Format a number of seconds to a pretty string.
 * e.g. 120 => 2 min or 2:00, 45 => 45 sec or 0:45
 */
function formatSeconds(seconds, useShortFormat) {
    if (!seconds) {
        return useShortFormat ? '0:00' : '0 sec'
    }

    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    if (useShortFormat) {
        return (min ? `${min}:` : '0:') + (sec ? sec.toString().padStart(2, '0') : '00')
    }

    return (min ? `${min} min` : '') + (sec ? `${min ? ' ' : ''}${sec} sec` : '')
}

/**
 * Calculate the X and Y transform values for a card in order to move it to the middle of the window.
 */
function calculateStyle(cardsRef, cardRef, timerRef) {
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
    let currentColumn = [ ...cardsRef.current.children ].indexOf(cardRef.current) + 1

    // Calculate which row this card is on
    const currentRow = Math.ceil(currentColumn / columns.length) - 1

    // Calculate the column of this card based on its index and the row it's on
    if (currentColumn > columns.length) {
        currentColumn -= (currentRow * columns.length)
    }

    // Calculate the middle column of a row
    const middleColumn = (columns.length + 1) / 2

    // Total height of the card when it is expanded
    const cardHeight = cardRef.current.getBoundingClientRect().height
        + timerRef.current.getBoundingClientRect().height

    // Calculate the total offset from the top of the card and by how much to move it for it to be centered
    const topCardsOffset = cardsRef.current.getBoundingClientRect().top
    const topRowOffset = (rowHeight * currentRow) + (columnsGap * currentRow)
    const topTotalOffset = topCardsOffset + topRowOffset - 60
    const topMoveOffset = (window.innerHeight - cardHeight - 60) / 2

    // Number of columns to move this card by for it to be centered
    const moveColumnsCount = middleColumn - currentColumn

    // Final transform amounts
    const x = (moveColumnsCount * columnWidth) + ((moveColumnsCount - 0.5) * columnsGap)
    const y = -topTotalOffset + topMoveOffset

    return { transform: `translate(${x}px, ${y}px)` }
}

// Exports
export {
    formatSeconds,
    calculateStyle,
}
