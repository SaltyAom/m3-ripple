# m3-ripple

Material Design 3 ripple effect for React ([demo](https://m3-ripple.saltyaom.com))

## Installation

```bash
npm install m3-ripple
```

## Usage

Put `Ripple` component inside any element, and set `position: relative`.

The ripple effect will automatically be applied when the element is pressed.

```jsx
import { Ripple } from 'm3-ripple'
import 'm3-ripple/ripple.css'

function Demo() {
    return (
        <button
            style={{
                position: 'relative',
                color: 'white',
                padding: '1rem 2rem',
                backgroundColor: '#6200ee'
            }}
        >
            <Ripple />
            Click Me
        </button>
    )
}
```

## Customization
Ripple color will inherits the color of the parent element using `currentColor`. You can customize the ripple color by setting the `color` property on the parent element.

```jsx
import { Ripple } from 'm3-ripple'
import 'm3-ripple/ripple.css'

function Demo() {
	return (
		<button
			style={{
				position: 'relative',
				color: 'red'
			}}
		>
			<Ripple />
			Click Me
		</button>
	)
}
```

## CSS Variable
You can set global CSS variables to customize the ripple opacity for hover and pressed states.

```css
:root {
 	--ripple-hover-opacity: 0.08;
    --ripple-pressed-opacity: 0.12;
}
```

Otherwise, you can set the opacity using the `hoverOpacity` and `pressedOpacity` props.

```jsx
import { Ripple } from 'm3-ripple'
import 'm3-ripple/ripple.css'

function Demo() {
	return (
		<Ripple hoverOpacity={0.1} pressedOpacity={0.15} />
	)
}
```

## Props
Here's a type definition of the props you can use with the `Ripple` component:

```ts
export interface RippleProps {
    /**
     * Disables the ripple.
     */
    disabled?: boolean

    /**
     * hoverOpacity: The opacity of the ripple when hovered.
     *
     * @default 0.08
     */
    hoverOpacity?: number

    /**
     * pressedOpacity: The opacity of the ripple when pressed.
     *
     * @default 0.12
     */
    pressedOpacity?: number

    /**
     * Additional CSS classes to apply to the ripple container.
     */
    className?: string

    /**
     * Additional styles to apply to the ripple container.
     */
    style?: React.CSSProperties

    /**
     * Easing function for the ripple animation.
     */
    easing?: 'cubic-bezier(0.2, 0, 0, 1)'

    /**
     * The duration in milliseconds for the ripple to grow when pressed.
     *
     * @default 150
     */
    duration?: number

    /**
     * The minimum duration in milliseconds for the ripple to be considered a
     * valid press.
     *
     * @default 225
     */
    minimumPressDuration?: number

    /**
     * * The duration in milliseconds for the ripple to wait before starting the
     *
     * @default 150
     */
    touchDelay?: number
}
```
