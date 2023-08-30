import "./style.css";
import "../src/carousel.css";
import Carousel from "../src/carousel";

let carouselValue = "";
let dotCarousel = "";
const loopCarousel = "";
let carouselValue1 = "";
let carouselValues1 = "";
const selectCarousel = "";
let yAxis = "";
document.querySelector(".new-slide")?.addEventListener("click", () => {});

function displayOrHideArrows(carousel, leftArrow, rightArrow) {
  if (!carousel.canScrollPrev()) {
    document.querySelector(leftArrow).style.display = "none";
  } else {
    document.querySelector(leftArrow).style.display = "block";
  }

  if (!carousel.canScrollNext()) {
    document.querySelector(rightArrow).style.display = "none";
  } else {
    document.querySelector(rightArrow).style.display = "block";
  }
}

document.querySelector(".left-arrow").style.display = "none";
document.querySelector(".left-arrow.dots").style.display = "none";
document.querySelector(".left-arrow-1").style.display = "none";

carouselValue = Carousel({
  parent: ".parent2 .inner",
  child: ".parent2 .slider",
  slidesToScroll: 2,
  dragFree: false,
  whileScrolling: () => {
    displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  },
  whileDragging: () => {
    displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  },
});

carouselValue1 = Carousel({
  parent: ".parent-1 .inner",
  child: ".parent-1 .slider",
  slidesToScroll: 1,
  whileScrolling: () => {
    displayOrHideArrows(carouselValue1, ".left-arrow-1", ".right-arrow-1");
  },
  whileDragging: () => {
    displayOrHideArrows(carouselValue1, ".left-arrow-1", ".right-arrow-1");
  },
});

carouselValues1 = Carousel({
  parent: ".scroll-1 .inner",
  child: ".scroll-1 .slider",
  slidesToScroll: 1,
  dragFree: true,
  whileScrolling: () => {
    displayOrHideArrows(carouselValues1, ".left-arrow-s1", ".right-arrow-s1");
  },
  whileDragging: () => {
    displayOrHideArrows(carouselValues1, ".left-arrow-s1", ".right-arrow-s1");
  },
});

Carousel({
  parent: ".parent-0 .inner",
  child: ".parent-0 .slider",
  slidesToScroll: 0,
  dragFree: true,
});

dotCarousel = Carousel({
  parent: ".dots-parent .inner",
  child: ".dots-parent .slider",
  displayDots: true,
  whileScrolling: () => {
    displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
  },
  whileDragging: () => {
    displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
  },
  selectedState: false,
});

Carousel({
  parent: ".start-index-div",
  child: ".start-index-div .slider",
  startIndex: 2,
  clickEvent: true,
  watchResize: () => {
    console.log("watch resize");
  },
  watchSlides: () => {
    console.log("watch slides");
  },
});
Carousel({
  parent: ".progress-inner",
  child: ".progress-inner .slider",
  whileScrolling: scrollProgress => {
    document.getElementById("progress-bar").value = scrollProgress * 100;
  },
  whileDragging: scrollProgress => {
    console.log(scrollProgress, "scrollprog");
    document.getElementById("progress-bar").value = scrollProgress * 100;
  },
  selectedState: false,
});

Carousel({
  parent: ".autoplay .inner",
  child: ".autoplay .slider",
  autoplay: true,
  selectedState: true,
});

Carousel({
  parent: ".direction-div",
  child: ".direction-div .slider",
  direction: "rtl",
});

Carousel({
  parent: ".align-c-div",
  child: ".align-c-div .slider",
  alignment: "center",
});

yAxis = Carousel({
  parent: ".axis",
  child: ".axis .slider",
  axis: "y",
  whileScrolling: () => {
    displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  whileDragging: () => {
    displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  selectedState: false,
});
document.querySelector(".left-arrow").addEventListener("click", () => {
  carouselValue.scrollPrev();
  displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");

  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
});
document.querySelector(".left-arrow-1").addEventListener("click", () => {
  carouselValue1.scrollPrev();
  displayOrHideArrows(carouselValue1, ".left-arrow-1", ".right-arrow-1");
});
document.querySelector(".left-arrow-s1").addEventListener("click", () => {
  carouselValues1.scrollPrev();
  displayOrHideArrows(carouselValues1, ".left-arrow-s1", ".right-arrow-s1");
});

document.querySelector(".right-arrow").addEventListener("click", () => {
  carouselValue.scrollNext();
  displayOrHideArrows(carouselValue, ".left-arrow", ".right-arrow");
  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
  console.log(carouselValue.slideNodes(), "slide nodes");
  console.log(carouselValue.rootNode(), "root node");
  console.log(carouselValue.containerNode(), "container node");
});
document.querySelector(".right-arrow-1").addEventListener("click", () => {
  carouselValue1.scrollNext();
  displayOrHideArrows(carouselValue1, ".left-arrow-1", ".right-arrow-1");
});

document.querySelector(".right-arrow-s1").addEventListener("click", () => {
  carouselValues1.scrollNext();
  displayOrHideArrows(carouselValues1, ".left-arrow-s1", ".right-arrow-s1");
});

document.querySelector(".left-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
});

document.querySelector(".right-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayOrHideArrows(dotCarousel, ".left-arrow.dots", ".right-arrow.dots");
});

document.querySelector(".left-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});
document.querySelector(".right-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});

document.querySelector("#next-button")?.addEventListener("click", () => {
  loopCarousel.scrollNext(true);
});

document.querySelector(".up-arrow").addEventListener("click", () => {
  yAxis.scrollPrev();
  displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});

document.querySelector(".down-arrow").addEventListener("click", () => {
  yAxis.scrollNext();
  displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});
