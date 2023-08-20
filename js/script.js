'use strict';

const cols = document.querySelectorAll('.col');

setColors( getColors() );

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        setColors();
    }
});

document.addEventListener('click', function(e) {
    const button = e.target.closest('button'); 

    if (button) {
        let lock = button.querySelector('.fa');
        if (!lock) return;

        lock.classList.toggle('fa-unlock');
        lock.classList.toggle('fa-lock');
    }

    if (e.target.dataset.type === 'copy') {
        const color = e.target.textContent;
        navigator.clipboard.writeText(color); // сохранить в буфер обмена
    }
});

function getColors() {
    let hash = document.location.hash;

    if (hash) {
        return hash.slice(1).split('-').map( str => '#' + str);
    }
}

function setColors( colors = [] ) {
    const isDefined = colors.length !== 0;

    cols.forEach((col, idx) => {
        const text = col.querySelector('[data-type="copy"]');
        const lock = col.querySelector('.fa');

        if (isDefined) {
            setColor( colors[idx] );
        } else {
            if (lock.classList.contains('fa-unlock')) setColor( getRandomColor() );
            colors.push(text.textContent);
        }

        function setColor(color) {     
            col.style.background = color;
            text.textContent = color;
        
            setItemsColors(text, lock);
        
            function setItemsColors(...items) {
                const luminance = chroma(color).luminance();
                const itemColor = luminance > 0.5 ? 'black' : 'white';
        
                items.forEach(item => item.style.color = itemColor);
            }
        }
    });

    if (!isDefined) updateHash(colors);

    function updateHash(colors) {
        const hash = colors.map(color => color.slice(1)).join('-');

        document.location.hash = hash;
    }
}

function getRandomColor() {
    let color = '#';

    for (let i = 0; i < 6; i++) {
        let random = Math.floor( 16 * Math.random() );
        color = color + random.toString(16);
    }

    return color;
}