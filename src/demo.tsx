/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type CSSProperties } from 'react'
import ReactDOM from 'react-dom/client'

import { Ripple } from '.'

import './ripple.css'

const buttonStyle = {
    position: 'relative',
    padding: '12px 24px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#6750a4',
    borderRadius: '24px',
    backgroundColor: '#6750a4',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    margin: '8px',
    minWidth: '120px',
    overflow: 'hidden',
    outline: 'none',
    transition: 'all 0.2s ease',
} as const satisfies CSSProperties

const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    borderColor: '#e0e0e0',
    cursor: 'not-allowed'
} as const satisfies CSSProperties

const outlinedButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#6750a4',
    borderColor: '#6750a4'
} as const satisfies CSSProperties

const cardStyle = {
    position: 'relative',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
} as const satisfies CSSProperties

const compactCardStyle = {
    ...cardStyle,
    padding: '0',
    width: '100%'
} as const satisfies CSSProperties

const containerStyle = {
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
} as const satisfies CSSProperties

const cardGroupStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '16px'
} as const satisfies CSSProperties

const cardImageStyle = {
    aspectRatio: '21/9',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    objectPosition: 'center'
} as const satisfies CSSProperties

const cardContentStyle = {
    padding: '8px 16px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
} as const satisfies CSSProperties

const cardHeaderStyle = {
    margin: '0',
    fontSize: '16px',
    fontWeight: '500'
} as const satisfies CSSProperties

const cardDetailStyle = {
    margin: '0',
    fontSize: '14px',
    color: '#666'
} as const satisfies CSSProperties

const sectionStyle = {
    marginBottom: '32px'
} as const satisfies CSSProperties

const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f1f1f'
} as const satisfies CSSProperties

const iconStyle = {
    width: '24px',
    height: '24px'
} satisfies CSSProperties

const subtitleStyle = {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '12px',
    color: '#333	'
} as const satisfies CSSProperties

const descriptionStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5'
} as const satisfies CSSProperties

const code = {
    backgroundColor: '#f5f5f5',
    padding: '12px 16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#333',
    display: 'inline-block',
    marginBottom: '16px',
    width: 'calc(100% - 32px)'
} as const satisfies CSSProperties

const Demo = () => {
    const [disabled, setDisabled] = useState(false)
    const [clickCount, setClickCount] = useState(0)

    const handleClick = () => {
        setClickCount((prev) => prev + 1)
    }

    return (
        <main style={containerStyle}>
            <h1 style={titleStyle}>
                m3-ripple
                <a
                    href="https://github.com/saltyaom/m3-ripple"
                    target="_blank"
                    style={iconStyle}
                >
                    <svg
                        width="1024"
                        height="1024"
                        viewBox="0 0 1024 1024"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={iconStyle}
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                            transform="scale(64)"
                            fill="#1B1F23"
                        />
                    </svg>
                </a>
            </h1>
            <p style={descriptionStyle}>
                Material Design 3 ripple effect for React
            </p>

            <code style={code}>{`bun install m3-ripple`}</code>

            <article style={sectionStyle}>
                <h2 style={subtitleStyle}>Basic Buttons</h2>
                <p style={descriptionStyle}>
                    Standard buttons with ripple effects. The ripple originates
                    from the point of interaction.
                </p>

                <button style={buttonStyle} onClick={handleClick}>
                    <Ripple />
                    Filled Button
                </button>

                <button style={outlinedButtonStyle} onClick={handleClick}>
                    <Ripple />
                    Outlined Button
                </button>

                <button style={buttonStyle} onClick={handleClick}>
                    <Ripple />
                    Click Count: {clickCount}
                </button>
            </article>

            <article style={sectionStyle}>
                <h2 style={subtitleStyle}>Disabled State</h2>
                <p style={descriptionStyle}>
                    When disabled, the ripple effect is not shown and the button
                    appears inactive.
                </p>

                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}
                >
                    <input
                        type="checkbox"
                        checked={disabled}
                        onChange={(e) => setDisabled(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Disable buttons
                </label>

                <button
                    style={disabled ? disabledButtonStyle : buttonStyle}
                    disabled={disabled}
                    onClick={!disabled ? handleClick : undefined}
                >
                    <Ripple disabled={disabled} />
                    {disabled ? 'Disabled' : 'Enabled'}
                </button>
            </article>

            <article style={sectionStyle}>
                <h2 style={subtitleStyle}>Card with Ripple</h2>
                <p style={descriptionStyle}>
                    Ripples can be applied to any interactive surface, not just
                    buttons.
                </p>

                <section id="group" style={cardGroupStyle}>
                    <style>
                        {`
                        button {
                        	-webkit-tap-highlight-color: rgba(0,0,0,0);
                        }

                        @media (max-width: 640px) {
		                    #group {
		                    	flex-direction: column;
							}
		                }`}
                    </style>

                    <div style={compactCardStyle}>
                        <Ripple style={{ color: 'seagreen' }} />
                        <img
                            src="/assets/miyabi.webp"
                            alt="miyabi"
                            style={cardImageStyle}
                        />

                        <div style={cardContentStyle}>
                            <h3 style={cardHeaderStyle}>Interactive Card</h3>
                            <p style={cardDetailStyle}>
                                Click this card to see the ripple effect. The
                                ripple will appear at the point where you click.
                            </p>
                        </div>
                    </div>

                    <div style={compactCardStyle}>
                        <Ripple
                            style={{ color: 'red' }}
                            hoverOpacity={0.04}
                            pressedOpacity={0.06}
                        />
                        <img
                            src="/assets/yanagi.webp"
                            alt="miyabi"
                            style={cardImageStyle}
                        />

                        <div style={cardContentStyle}>
                            <h3 style={cardHeaderStyle}>Interactive Card</h3>
                            <p style={cardDetailStyle}>
                                Click this card to see the ripple effect. The
                                ripple will appear at the point where you click.
                            </p>
                        </div>
                    </div>
                </section>
            </article>

            <article style={sectionStyle}>
                <h2 style={subtitleStyle}>Touch and Mouse Support</h2>
                <p style={descriptionStyle}>
                    The ripple component automatically handles different input
                    types (touch, mouse, pen) with appropriate timing and
                    behavior for each.
                </p>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}
                >
                    <div style={cardStyle}>
                        <Ripple />
                        <h4 style={{ margin: '0 0 8px 0' }}>Touch Device</h4>
                        <p
                            style={{
                                margin: '0',
                                fontSize: '12px',
                                color: '#666'
                            }}
                        >
                            Optimized for touch interactions
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <Ripple />
                        <h4 style={{ margin: '0 0 8px 0' }}>Mouse Device</h4>
                        <p
                            style={{
                                margin: '0',
                                fontSize: '12px',
                                color: '#666'
                            }}
                        >
                            Hover and click effects
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <Ripple />
                        <h4 style={{ margin: '0 0 8px 0' }}>Keyboard</h4>
                        <p
                            style={{
                                margin: '0',
                                fontSize: '12px',
                                color: '#666'
                            }}
                        >
                            Accessible via keyboard
                        </p>
                    </div>
                </div>
            </article>
        </main>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<Demo />)

export default Demo
