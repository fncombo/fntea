(function () {

    // Lookup for tea type
    const types = {
        1: 'Green',
        2: 'White',
        3: 'Oolong',
        4: 'Black',
        5: 'Pu-erh',
        6: 'Blend',
        7: 'Herb',
    };

    // Lookup for brewing type
    const brewingTypes = {
        1: 'Western',
        2: 'Gongfu',
    };

    // Used for the search string
    const dataTags = [
        'type',
        'name',
        'nameOther',
        'year',
        'cultivar',
        'origin',
    ];

    // Why is this not native yet?
    // https://stackoverflow.com/a/13542669/1561377
    const shadeColor = (color, percent) => {
        const f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    };

    // (Disgusted noise.)
    // https://stackoverflow.com/a/5624139/1561377
    const hex2rgb = (hex) => {
        const result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    };

    // This too
    // https://stackoverflow.com/a/11868159/1561377
    // http://www.w3.org/TR/AERT#color-contrast
    const contrast = (hex) => {
        const rgb = hex2rgb(hex);
        return Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000) > 125;
    };

    // Horse
    const clamp = (number, min, max) => {
        return Math.min(Math.max(number, min), max);
    };

    // Hmm fine
    const ordinal = (number) => {
        const rem10 = number % 10;
        const rem100 = number % 100;
        if (rem10 === 1 && rem100 !== 11) {
            return `${number}st`;
        } else if (rem10 === 2 && rem100 !== 12) {
            return `${number}nd`;
        } else if (rem10 === 3 && rem100 !== 13) {
            return `${number}rd`;
        }
        return `${number}th`;
    };

    // WHAT YEAR IS IT
    const formatSeconds = (seconds, shortFormat) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        if (shortFormat) {
            return (min ? `${min}:` : '0:') + (sec ? (sec + '').padStart(2, '0') : '00');
        }
        return (min ? `${min} min` : '') + (sec ? (min ? ' ' : '') + `${sec} sec` : '');
    };

    // Generate brewing instructions
    const brewingData = (type, tea) => {
        return `
<div class="card-tabs-content" data-target="${type}">
    <ul class="brewing-data">
        <li>
            <strong>Amount</strong>
            <span>${tea.amount}g&nbsp;&#8725;&nbsp;100ml</span>
            <div class="bar">
                ${`<span></span>`.repeat(6)}
                <div></div>
                <div style="width: ${clamp((tea.amount * 10) * 2, 0, 100)}%;"></div>
            </div>
        </li>
        <li>
            <strong class="temp-large">Temperature</strong>
            <strong class="temp-small">Temp.</strong>
            <span>${tea.temperature}&deg; C</span>
            <div class="bar">
                ${`<span></span>`.repeat(6)}
                <div></div>
                <div style="width: ${(tea.temperature - 50) * 2}%;"></div>
            </div>
        </li>
        <li>
            <strong>Infusions</strong>
            <span>${tea.infusions}</span>
            <div class="bar">
                ${`<span></span>`.repeat(11)}
                <div></div>
                <div style="width: ${clamp(tea.infusions * 10, 0, 100)}%;"></div>
            </div>
        </li>
        <li>
            <strong>Infusion Time</strong>
            <span>${formatSeconds(tea.baseDuration)} base, +${formatSeconds(tea.durationIncrease)} per extra</span>
            <div class="bar">
                ${`<span></span>`.repeat(5)}
                <div></div>
                <div style="width: ${(tea.baseDuration / 240) * 100}%;"></div>
                <!--
                <div style="left: ${(tea.baseDuration / 240) * 100}%; width: ${clamp((tea.durationIncrease / 240) * 100, 0, 100 - ((tea.baseDuration / 240) * 100))}%;"></div>
                -->
            </div>
        </li>
    </ul>
    <div class="card-section timer-body">
        <div class="timer-control">
            <button class="timer-duration" data-action="decrease" disabled>&nbsp;</button>
        </div>
        <div class="timer-content">
            <span class="timer-infusion">1st Infusion</span>
            <strong class="timer-clock" data-base-duration="${tea.baseDuration}"
                                        data-duration-increase="${tea.durationIncrease}"
                                        data-max-infusions="${tea.infusions}"
                                        data-current-infusion="1"
                                        data-current-duration="${tea.baseDuration}"></strong>
        </div>
        <div class="timer-control">
            <button class="timer-duration" data-action="increase">&nbsp;</button>
        </div>
    </div>
    <div class="card-section">
        <button class="timer-start">Start Brewing Timer</button>
    </div>
</div>
`;
    };

    // Make all tea cards
    document.querySelector('#cards').innerHTML = tea.sort((a, b) => {
        // Sort first by rating descending, then by name ascending
        const a_rating = a.rating;
        const b_rating = b.rating;
        const a_name = a.name;
        const b_name = b.name;

        if (a_rating < b_rating) {
            return 1;
        } else if (a_rating > b_rating) {
            return -1;
        } else if (a_name < b_name) {
            return -1;
        } else if (a_name > b_name) {
            return 1;
        }

        return 0;
    }).map(tea => {
        // Generate HTML for each tea
        if (tea.rating) {
            tea.rating = `<span class="rating">${'<strong>&bigstar;</strong>'.repeat(tea.rating)}${'&bigstar;'.repeat(5 - tea.rating)}</span>`;
        }

        // Create search string for this tea
        const data = dataTags.map(tag => {
            if (tag === 'type') {
                return types[tea.type];
            }
            return tea[tag] || '';
        }).join(' ');

        return `
<div class="card" style="--tea-color: ${tea.color}; --text-color: ${shadeColor(tea.color, contrast(tea.color) ? -0.65 : 0.85)};"
    data-search="${data.toLowerCase()}">
    <h1>${tea.name}<span>${tea.nameOther || '&mdash;'}</span></h1>
    <div class="card-body">
        <!--
        <div class="tea-info">
            <span>${types[tea.type]}</span>
            ${tea.link ? `<a href="${tea.link}" target="_blank">Shop</a>` : ''}
            <span>${tea.rating || 'Unrated'}</span>
        </div>
        -->
        <h2>
            ${types[tea.type]} Tea
            ${tea.link ? `<a href="${tea.link}" target="_blank">&#128722;</a>` : ''}
            <span>${tea.rating || 'Unrated'}</span>
        </h2>
        <ul class="card-list">
            <li>&#128197; <strong>Season:</strong> ${tea.season || 'Unknown'}</li>
            <li>&#127793; <strong>Cultivar:</strong> ${tea.cultivar || 'Unknown'}</li>
            <li>&#127759; <strong>Origin:</strong> ${tea.origin || 'Unknown'}</li>
        </ul>
        <h2>Brewing Instructions</h2>
        <ul class="card-tabs">
            ${tea.brewing.western ? `<li data-target="western">Western Style</li>` : ''}
            ${tea.brewing.gongfu ? `<li data-target="gongfu">Gong Fu Style</li>` : ''}
        </ul>
        ${tea.brewing.western ? brewingData('western', tea.brewing.western) : ''}
        ${tea.brewing.gongfu ? brewingData('gongfu', tea.brewing.gongfu) : ''}
    </div>
</div>
`;
    }).join('');

    // Events
    const clickEvent = new Event('click');
    const noSleep = new NoSleep();

    // Tabs
    const tabEventHandler = event => {
        if (event.target.classList.contains('active')) {
            return;
        }

        const cardBody = event.target.closest('.card-body');

        // Remove active tab and content
        cardBody.querySelectorAll('.card-tabs .active').forEach(el => el.classList.remove('active'));
        cardBody.querySelectorAll('.card-tabs-content.active').forEach(el => el.classList.remove('active'));

        // Set new active tab and content
        cardBody.querySelector(`.card-tabs-content[data-target="${event.target.dataset.target}"]`).classList.add('active');
        event.target.classList.add('active');
    };

    // Bind tab events and activate all first tabs
    document.querySelectorAll('.card-tabs li').forEach(el => el.addEventListener('click', tabEventHandler));
    document.querySelectorAll('.card-tabs li:first-child').forEach(el => el.dispatchEvent(clickEvent));

    // Timer clock
    document.querySelectorAll('.timer-clock').forEach(el => el.textContent = formatSeconds(el.dataset.baseDuration, true));

    const timerClockHandler = event => {
        const timerBody = event.target.closest('.card-tabs-content');
        const clock = timerBody.querySelector('.timer-clock');
        let duration = parseInt(clock.dataset.currentDuration, 10);

        if (event.target.dataset.running) {
            window.clearTimeout(event.target.dataset.timerId);
            event.target.removeAttribute('data-running');
            event.target.removeAttribute('data-timer-id');
            event.target.textContent = 'Start Brewing Timer';
            clock.textContent = formatSeconds(duration, true);
            timerBody.querySelectorAll('.timer-duration').forEach(el => el.classList.remove('hide'));
            noSleep.disable();
            return;
        }

        // Start timer
        const runTimer = () => {
            duration -= 1;
            clock.textContent = formatSeconds(duration, true);

            if (duration === 0) {
                // Tiny delay to update clock text
                window.setTimeout(() => {
                    alert('Timer Done');
                    event.target.dispatchEvent(clickEvent);
                }, 100);
                return;
            }

            event.target.dataset.timerId = window.setTimeout(runTimer, 1000);
        };

        runTimer();

        event.target.dataset.running = 'running';
        event.target.textContent = 'Stop Brewing Timer';
        timerBody.querySelectorAll('.timer-duration').forEach(el => el.classList.add('hide'));

        // Prevent from going to sleep
        noSleep.enable();
    };

    document.querySelectorAll('.timer-start').forEach(el => el.addEventListener('click', timerClockHandler));

    // Increasing and decreasing the timer
    const timerDurationHandler = event => {
        const timerBody = event.target.closest('.timer-body');
        const clock = timerBody.querySelector('.timer-clock');
        const baseDuration = parseInt(clock.dataset.baseDuration, 10);
        const durationIncrease = parseInt(clock.dataset.durationIncrease, 10);
        const currentInfusion = parseInt(clock.dataset.currentInfusion, 10);

        let newInfusion = currentInfusion + (event.target.dataset.action === 'decrease' ? -1 : 1);
        let timer = baseDuration + ((newInfusion - 1) * durationIncrease);

        timerBody.querySelector('.timer-infusion').textContent = `${ordinal(newInfusion)} Infusion`;
        clock.dataset.currentInfusion = newInfusion;
        clock.dataset.currentDuration = timer;
        clock.textContent = formatSeconds(timer, true);

        timerBody.querySelector('[data-action="increase"]').disabled = (newInfusion === parseInt(clock.dataset.maxInfusions, 10));
        timerBody.querySelector('[data-action="decrease"]').disabled = (newInfusion === 1);
    };

    document.querySelectorAll('.timer-duration').forEach(el => el.addEventListener('click', timerDurationHandler));

    // Searching
    const cards = document.querySelectorAll('.card');
    document.querySelector('#search').addEventListener('keyup', event => {
        event.target.value = (event.key === 'Escape' ? '' : event.target.value);
        cards.forEach(el => el.classList[el.dataset.search.includes(event.target.value.toLowerCase()) ? 'remove' : 'add']('hide'));
    });

    // Collapse when only one column on mobile
    let lastWidth = 0;
    const resizeCheck = event => {
        // Ignore vertical resize
        if (window.innerWidth === lastWidth) {
            return;
        }

        lastWidth = window.innerWidth;

        if (lastWidth < 600) {
            cards.forEach(el => el.classList.add('collapsible', 'collapse'));
            return;
        }
        cards.forEach(el => el.classList.remove('collapsible', 'collapse'));
    };

    window.addEventListener('resize', resizeCheck);
    resizeCheck();

    // Clicking on card hears to collapse/show
    const collapseToggleHandler = event => {
        const card = event.target.closest('.card');
        if (card.classList.contains('collapsible')) {
            card.classList[card.classList.contains('collapse') ? 'remove' : 'add']('collapse');
        }
    };
    document.querySelectorAll('.card h1').forEach(el => el.addEventListener('click', collapseToggleHandler));

}());