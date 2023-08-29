# Js Carousel

A pure Js customisable carousel, that snaps! uses CSS scroll snap on mobile.

## Props

### parent:
    A selector for an existing DOM element that wraps all the carousel elements/items. This is a required prop.

> Type: string
> Example: '.parent' || '#parent'

### child: 
     A selector for each carousel element sharing the same class, wrapped by the parent element. This is a required prop.

> Type: string
> Example: '.child'

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

### autoplay:
  Boolean that decides whether the carousel progresses automatically or not at a specified interval. 

> Type: Boolean
> Default: false

### autoplayTimeout:
    The interval between the automatic progression of each slide in the carousel. 

> Type: number (in ms)
> Default: 2000

### springConfig:
   The spring animation value is configurable using this prop. 

> Type: string
> Default: `spring(1,90,20,13)` which is `spring(mass, stiffness, damping, velocity)`

### selectedState:
    Boolean that decides whether a selected state exists - one slide is highlighted at a time, while scrolling of the carousel.

> Type: boolean
> Default: false

### selectedScrollClassName:
     The classname that would be added to the particular slide that is highlighted.

> Type: string
> Default: 'selected'

### selectedScrollSnapIndex:
   The index of the selected/ highlighted slide is decided by this prop.

> Type: number
> Default: 0 (starts from the 1st slide)


### breakpoints:
    This prop is helpful in altering props at different breakpoints. 

 eg: 
```
Carousel({
      dragActive: true, 
     breakpoints: {
    'max-width: 768px': { dragActive: false },
     },
    })
```    
### displayDots:

Boolean to decide whether or not to display the carousel indicators

> Type: boolean Default: false

### dotsHtml:

HTML element that would be displayed instead of each dot - Number of dots are
calculated based on the number of slides.

> Type: HTML element as a string Default:
 ```
<svg height="12" width="12" class="dots">
 <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />
</svg>
```


 ## Lifecycle methods

### whileScrolling:
  This callback function can be used to perform operations while scrolling the carousel.

> Type: function

eg: Carousel({
  whileScrolling: (scrollProgress, currentSlideIndex, currentSlidePos) => {
    // scrollProgress - returns progress value of the carousel from 0 to 1
    // currentSlideIndex - the index of current slide
    // currentSlidePos - position of current slide
  },
})

### whileDragging:
 This callback function can be used to perform operations while Dragging the carousel. 
 
> Type: function

eg: ``` 
Carousel({
  whileDragging: (scrollProgress, currentSlideIndex, currentSlidePos) => {
    // scrollProgress - returns progress value of the carousel from 0 to 1
    // currentSlideIndex - the index of current slide
    // currentSlidePos - position of current slide
  },
})
```

### onInit:
    This callback function can be used to perform operations during the
initialization of the carousel.


### onClicking:
     This callback function can be used to perform operations while clicking on each carousel. 


### watchResize:
     The callback function can be used to perform operations while resizing the window


### watchSlides:
     The callback function can be used to perform operations while the child list of the carousel is altered.



