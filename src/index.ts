import { animationFrameScheduler, fromEvent, merge, of } from "rxjs";
import { delay, map, subscribeOn, withLatestFrom } from "rxjs/operators";
import "./styles.css";

type Coords = [number, number];

function eventToCoords(event: MouseEvent): Coords {
  return [event.clientX, event.clientY];
}

const DELAY = 80;

const circles: HTMLElement[] = Array.from(document.querySelectorAll(".circle"));

const mousemove$ = fromEvent<MouseEvent>(document.body, "mousemove");
const position$ = mousemove$.pipe(map(eventToCoords));

const positionsCircle = circles.map((circle, i) =>
  position$.pipe(
    delay(DELAY * i),
    withLatestFrom(of(circle))
  )
);

merge(...positionsCircle)
  .pipe(subscribeOn(animationFrameScheduler))
  .subscribe(([position, el]) => moveCircle(position, el));

function moveCircle([x, y]: [number, number], el: HTMLElement) {
  el.style.transform = `translate(${x - 40}px, ${y - 40}px)`;
}
