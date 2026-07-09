import type { Directive } from "vue";
const animationFrame = [
  {
    opacity: 0,
    transform: "translateY(100px)",
    offset: 0,
  },
  {
    opacity: 1,
    transform: "translateY(0)",
    offset: 1,
  },
];
// const animationElements = new WeakMap<Element, Animation>();
const ob = new IntersectionObserver(
  (entries) => {
    for (let i = 0; i < entries.length; i++) {
      // console.log(entries[i]);
      const ele = entries[i]?.target!;
      // if (!animationElements.has(ele)) {
      //   animationElements.set(
      //     ele,
      //     new Animation(
      //       new KeyframeEffect(ele, animationFrame, {
      //         delay: 50,
      //         duration: 500,
      //         easing: "ease-in",
      //         fill: "forwards",
      //       }),
      //     ),
      //   );
      // }
      // const ani = animationElements.get(ele)!;
      if (entries[i]?.isIntersecting && getPosition(entries[i]?.boundingClientRect!) === "bottom") {
        const ani = new Animation(
          new KeyframeEffect(ele, animationFrame, {
            duration: 700,
            easing: "ease-in",
            fill: "forwards",
          }),
        );
        ani.currentTime = 0;
        ani.play();
        ob.unobserve(ele);
      }
    }
  },
  {
    threshold: 0.05,
  },
);
function getPosition(pos: DOMRect): string {
  return pos.top < Math.abs(window.innerHeight - pos.bottom) ? "top" : "bottom";
}
function dfsElement(ele: HTMLElement, callback: (ele: HTMLElement) => any): void {
  callback(ele);
  if (ele.children.length === 0) return;
  for (let i = 0; i < ele.children.length; i++) {
    dfsElement(ele.children[i]! as HTMLElement, callback);
  }
}
export type slideDirective = Directive<HTMLElement, string>;
declare module "vue" {
  export interface ComponentCustomProperties {
    vSlide: slideDirective;
  }
}
export default {
  mounted: (el, binding) => {
    console.log("mounted");
    const type = binding.value;
    if (type === "deep") {
      dfsElement(el, (ele) => {
        ele.style.transform = "translateY(100px)";
        ele.style.opacity = "0";
        ob.observe(ele);
      });
    } else {
      el.style.transform = "translateY(100px)";
      el.style.opacity = "0";
      ob.observe(el);
    }
  },
  beforeUnmount: (el, binding) => {
    const type = binding.value;
    if (type === "deep") {
      dfsElement(el, (ele) => {
        ob.unobserve(ele);
      });
    } else {
      ob.unobserve(el);
    }
  },
} satisfies slideDirective;
