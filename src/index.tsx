import { useCallback, useEffect, useRef, useState } from 'react'

const INITIAL_ORIGIN_SCALE = 0.2
const PADDING = 12
const SOFT_EDGE_MINIMUM_SIZE = 75
const SOFT_EDGE_CONTAINER_RATIO = 0.35
const ANIMATION_FILL = 'forwards'

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

/**
 * Interaction states for the ripple.
 *
 * On Touch:
 *  - `INACTIVE -> TOUCH_DELAY -> WAITING_FOR_CLICK -> INACTIVE`
 *  - `INACTIVE -> TOUCH_DELAY -> HOLDING -> WAITING_FOR_CLICK -> INACTIVE`
 *
 * On Mouse or Pen:
 *   - `INACTIVE -> WAITING_FOR_CLICK -> INACTIVE`
 */
enum State {
    /**
     * Initial state of the control, no touch in progress.
     *
     * Transitions:
     *   - on touch down: transition to `TOUCH_DELAY`.
     *   - on mouse down: transition to `WAITING_FOR_CLICK`.
     */
    INACTIVE,
    /**
     * Touch down has been received, waiting to determine if it's a swipe or
     * scroll.
     *
     * Transitions:
     *   - on touch up: begin press; transition to `WAITING_FOR_CLICK`.
     *   - on cancel: transition to `INACTIVE`.
     *   - after `TOUCH_DELAY_MS`: begin press; transition to `HOLDING`.
     */
    TOUCH_DELAY,
    /**
     * A touch has been deemed to be a press
     *
     * Transitions:
     *  - on up: transition to `WAITING_FOR_CLICK`.
     */
    HOLDING,
    /**
     * The user touch has finished, transition into rest state.
     *
     * Transitions:
     *   - on click end press; transition to `INACTIVE`.
     */
    WAITING_FOR_CLICK
}

/**
 * A ripple component.
 */
export const Ripple = ({
    hoverOpacity,
    pressedOpacity,
    disabled = false,
    className = '',
    style,
    easing,
    duration = 150,
    minimumPressDuration = 225,
    touchDelay = 150
}: RippleProps) => {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const elementRef = useRef<HTMLDivElement>(null)
    const surfaceRef = useRef<HTMLDivElement>(null)
    const rippleSizeRef = useRef('')
    const rippleScaleRef = useRef('')
    const initialSizeRef = useRef(0)
    const growAnimationRef = useRef<Animation | undefined>(undefined)
    const stateRef = useRef<State>(State.INACTIVE)
    const rippleStartEventRef = useRef<PointerEvent | undefined>(undefined)
    const checkBoundsAfterContextMenuRef = useRef(false)

    useEffect(() => {
        if (!surfaceRef.current) return

        const style = surfaceRef.current.style

        if (hoverOpacity !== undefined)
            style.setProperty('--ripple-hover-opacity', hoverOpacity + '')

        if (pressedOpacity !== undefined)
            style.setProperty('--ripple-pressed-opacity', pressedOpacity + '')

        if (duration !== undefined && duration !== 150)
            style.setProperty('--ripple-duration', duration + 'ms')
    }, [hoverOpacity, pressedOpacity, duration])

    useEffect(() => {
        const parent = elementRef.current?.parentElement
        if (!parent) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const add = (name: string, fn: (...a: any) => unknown) =>
            parent.addEventListener(name, fn, true)

        add('click', handleClick)
        add('contextmenu', handleContextMenu)
        add('pointercancel', handlePointerCancel)
        add('pointerdown', handlePointerDown)
        add('pointerenter', handlePointerEnter)
        add('pointerleave', handlePointerLeave)
        add('pointerup', handlePointerup)

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rm = (name: string, fn: (...a: any) => unknown) =>
                parent.removeEventListener(name, fn, true)

            rm('click', handleClick)
            rm('contextmenu', handleContextMenu)
            rm('pointercancel', handlePointerCancel)
            rm('pointerdown', handlePointerDown)
            rm('pointerenter', handlePointerEnter)
            rm('pointerleave', handlePointerLeave)
            rm('pointerup', handlePointerup)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, easing, duration, minimumPressDuration, touchDelay])

    const isTouch = useCallback(
        ({ pointerType }: PointerEvent) => pointerType === 'touch',
        []
    )

    const shouldReactToEvent = useCallback(
        (event: PointerEvent) => {
            if (
                disabled ||
                // @ts-ignore
                elementRef.current?.parentElement?.disabled ||
                !event.isPrimary
            )
                return false

            if (
                rippleStartEventRef.current &&
                rippleStartEventRef.current.pointerId !== event.pointerId
            )
                return false

            if (event.type === 'pointerenter' || event.type === 'pointerleave')
                return !isTouch(event)

            const isPrimaryButton = event.buttons === 1

            return isTouch(event) || isPrimaryButton
        },
        [disabled, isTouch]
    )

    const inBounds = useCallback(
        // @ts-ignore
        ({ x, y }: PointerEvent) => {
            const element = elementRef.current
            if (!element) return false

            const p = element.getBoundingClientRect()
            return x >= p.left && x <= p.right && y >= p.top && y <= p.bottom
        },
        [elementRef]
    )

    const handlePointerEnter = useCallback(
        (event: PointerEvent) => {
            if (!shouldReactToEvent(event)) return

            setHovered(true)
        },
        [shouldReactToEvent]
    )

    const determineRippleSize = useCallback(() => {
        const element = elementRef.current
        if (!element) return

        const { height, width } = element.getBoundingClientRect()
        const maxDim = Math.max(height, width)
        const softEdgeSize = Math.max(
            SOFT_EDGE_CONTAINER_RATIO * maxDim,
            SOFT_EDGE_MINIMUM_SIZE
        )

        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE)
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
        const maxRadius = hypotenuse + PADDING

        initialSizeRef.current = initialSize
        rippleScaleRef.current = (maxRadius + softEdgeSize) / initialSize + ''
        rippleSizeRef.current = initialSize + 'px'
    }, [elementRef])

    const getNormalizedPointerEventCoords = useCallback(
        (pointerEvent: PointerEvent) => {
            const element = elementRef.current
            if (!element) return { x: 0, y: 0 }

            const position = element.getBoundingClientRect()

            const documentX = window.scrollX + position.left
            const documentY = window.scrollY + position.top

            return {
                x: pointerEvent.pageX - documentX,
                y: pointerEvent.pageY - documentY
            }
        },
        [elementRef]
    )

    const getTranslationCoordinates = useCallback(
        (positionEvent?: PointerEvent) => {
            const element = elementRef.current?.parentElement
            if (!element)
                return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } }

            const size = element.getBoundingClientRect()
            // end in the center
            const endPoint = {
                x: (size.width - initialSizeRef.current) / 2,
                y: (size.height - initialSizeRef.current) / 2
            }

            return {
                // If using keyboard, start in the center
                startPoint: positionEvent
                    ? getNormalizedPointerEventCoords(positionEvent)
                    : endPoint,
                endPoint
            }
        },
        [elementRef, getNormalizedPointerEventCoords]
    )

    const startPressAnimation = useCallback(
        (positionEvent?: PointerEvent) => {
            const surface = surfaceRef.current
            if (!surface) return

            setPressed(true)
            growAnimationRef.current?.cancel()

            determineRippleSize()
            const { startPoint, endPoint } =
                getTranslationCoordinates(positionEvent)

            const translateStart = `${startPoint.x}px, ${startPoint.y}px`
            const translateEnd = `${endPoint.x}px, ${endPoint.y}px`

            growAnimationRef.current = surface.animate(
                {
                    height: [rippleSizeRef.current, rippleSizeRef.current],
                    width: [rippleSizeRef.current, rippleSizeRef.current],
                    transform: [
                        `translate(${translateStart}) scale(1)`,
                        `translate(${translateEnd}) scale(${rippleScaleRef.current})`
                    ]
                },
                {
                    pseudoElement: '::after',
                    duration,
                    easing,
                    fill: ANIMATION_FILL
                }
            )
        },
        [determineRippleSize, duration, easing, getTranslationCoordinates]
    )

    const endPressAnimation = useCallback(() => {
        rippleStartEventRef.current = undefined
        stateRef.current = State.INACTIVE

        const animation = growAnimationRef.current
        let pressAnimationPlayState = Infinity

        if (typeof animation?.currentTime === 'number')
            pressAnimationPlayState = animation.currentTime
        else if (animation?.currentTime)
            pressAnimationPlayState = animation.currentTime.to('ms').value

        if (pressAnimationPlayState >= minimumPressDuration)
            return void setPressed(false)

        setTimeout(() => {
            // A new press animation was started. The old animation was canceled and
            // should not finish the pressed state.
            if (growAnimationRef.current !== animation) return

            setPressed(false)
        }, minimumPressDuration - pressAnimationPlayState)
    }, [minimumPressDuration])

    const handlePointerLeave = useCallback(
        (event: PointerEvent) => {
            if (!shouldReactToEvent(event)) return

            setHovered(false)

            // release a held mouse or pen press that moves outside the element
            if (stateRef.current !== State.INACTIVE) endPressAnimation()
        },
        [endPressAnimation, shouldReactToEvent]
    )

    const handlePointerup = useCallback(
        (event: PointerEvent) => {
            if (!shouldReactToEvent(event)) return

            if (stateRef.current === State.HOLDING) {
                stateRef.current = State.WAITING_FOR_CLICK
                return
            }

            if (stateRef.current === State.TOUCH_DELAY) {
                stateRef.current = State.WAITING_FOR_CLICK
                startPressAnimation(rippleStartEventRef.current)
                return
            }
        },
        [shouldReactToEvent, startPressAnimation]
    )

    const handlePointerDown = useCallback(
        async (event: PointerEvent) => {
            if (!shouldReactToEvent(event)) return

            rippleStartEventRef.current = event
            if (!isTouch(event)) {
                stateRef.current = State.WAITING_FOR_CLICK
                startPressAnimation(event)
                return
            }

            // after a longpress contextmenu event, an extra `pointerdown` can be
            // dispatched to the pressed element. Check that the down is within
            // bounds of the element in this case.
            if (checkBoundsAfterContextMenuRef.current && !inBounds(event))
                return

            checkBoundsAfterContextMenuRef.current = false

            // Wait for a hold after touch delay
            stateRef.current = State.TOUCH_DELAY
            await new Promise((resolve) => {
                setTimeout(resolve, touchDelay)
            })

            if (stateRef.current !== State.TOUCH_DELAY) return

            stateRef.current = State.HOLDING
            startPressAnimation(event)
        },
        [shouldReactToEvent, isTouch, inBounds, startPressAnimation, touchDelay]
    )

    const handleClick = useCallback(() => {
        // Click is a MouseEvent in Firefox and Safari, so we cannot use
        // `shouldReactToEvent`
        if (disabled) return

        if (stateRef.current === State.WAITING_FOR_CLICK) {
            endPressAnimation()
            return
        }

        if (stateRef.current === State.INACTIVE) {
            // keyboard synthesized click event
            startPressAnimation()
            endPressAnimation()
        }
    }, [disabled, endPressAnimation, startPressAnimation])

    const handlePointerCancel = useCallback(
        (event: PointerEvent) => {
            if (!shouldReactToEvent(event)) return

            endPressAnimation()
        },
        [endPressAnimation, shouldReactToEvent]
    )

    const handleContextMenu = useCallback(() => {
        if (disabled) return

        checkBoundsAfterContextMenuRef.current = true

        endPressAnimation()
    }, [disabled, endPressAnimation])

    return (
        <div
            ref={elementRef}
            className={`salty-ripple${className ? ` ${className}` : ''}`}
            style={style}
            aria-hidden="true"
        >
            <div
                ref={surfaceRef}
                className={`salty-ripple-surface${hovered ? ' --hover' : ''}${pressed ? ' --press' : ''}`}
            />
        </div>
    )
}
