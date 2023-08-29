# Js Carousel

A pure Js customisable carousel, that snaps! uses CSS scroll snap on mobile.

## features

### dragActive:

This prop decides whether the carousel is draggable or not.

> Type: boolean Default: true

### scrollActive:

This prop decides whether the carousel is scrollable or not.

> Type: boolean Default: true

### slidesToScroll:

Depicts the number of slides that would scroll together.

> Type: number Default: 1

### axis:

    Depicts the axis in which the carousel would scroll.

> Type: string Default: 'x'

### dragFree:

    This boolean is used to decide whether to stop at the snappoint or not. when true, this prop allows free dragging without stopping at snappoints.

> Type: boolean Default: false

### alignment:

Decides the alignment of each child of the carousel. Alignment: 'center' allows
the carousel to snap at the center of each child of the carousel.

> Type: string Options: 'start'||'center'||'end' Default: 'start'

### direction:

Decides the direction of the carousel's movement which would be from 'left to
right' or 'right to left'.

> Type: string Options: 'ltr' || 'rtl'

### startIndex:

The child index at which the carousel begins.

> Type: number Default: 1

### displayDots:

Boolean to decide whether or not to display the carousel indicators

> Type: boolean Default: false

### dotsHtml:

HTML element that would be displayed instead of each dot - Number of dots are
calculated based on the number of slides.

> Type: HTML element as a string Default:
> `<svg height="12" width="12" class="dots">

    <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />

</svg>`
