import React, {useEffect, useRef} from 'react';

const InfraEstateLogo = ({size = 180, color = "#3b82f6"}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const animation = svgRef.current.animate(
            [
                {transform: 'translateY(0px)'},
                {transform: 'translateY(-10px)'},
                {transform: 'translateY(0px)'}
            ],
            {
                duration: 6000,
                iterations: Infinity,
                easing: 'ease-in-out'
            }
        );

        return () => {
            if (animation) animation.cancel();
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}
        >
            {/* Subtle background elements */}
            <circle cx="100" cy="100" r="90" fill={`${color}05`}/>
            <circle cx="100" cy="100" r="70" fill={`${color}08`}/>

            {/* Base platform */}
            <rect x="30" y="160" width="140" height="6" rx="2" fill={`${color}40`}/>

            {/* Main building structure with gradient */}
            <g filter="url(#filter0_d)">
                <rect x="120" y="50" width="40" height="110" rx="2" fill="url(#grad1)"/>
                <rect x="80" y="75" width="30" height="85" rx="2" fill="url(#grad2)"/>
                <rect x="40" y="90" width="30" height="70" rx="2" fill="url(#grad3)"/>
            </g>

            {/* Window details with enhanced shine */}
            <g>
                <rect x="130" y="60" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="130" y="80" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="130" y="100" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="130" y="120" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="130" y="140" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>

                <rect x="85" y="85" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="85" y="105" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="85" y="125" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="85" y="145" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>

                <rect x="45" y="100" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="45" y="120" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
                <rect x="45" y="140" width="20" height="10" rx="1" fill="white" fillOpacity="0.9"/>
            </g>

            {/* Reflective highlight */}
            <path
                d="M160 50 L160 160 L158 160 L158 52 L160 50Z"
                fill="white"
                fillOpacity="0.4"
            />
            <path
                d="M110 75 L110 160 L108 160 L108 77 L110 75Z"
                fill="white"
                fillOpacity="0.4"
            />
            <path
                d="M70 90 L70 160 L68 160 L68 92 L70 90Z"
                fill="white"
                fillOpacity="0.3"
            />

            {/* Subtle shadow overlay */}
            <rect x="120" y="50" width="40" height="110" rx="2" fill="black" fillOpacity="0.05"/>
            <rect x="80" y="75" width="30" height="85" rx="2" fill="black" fillOpacity="0.05"/>
            <rect x="40" y="90" width="30" height="70" rx="2" fill="black" fillOpacity="0.05"/>

            {/* Gradients and filters definitions */}
            <defs>
                <linearGradient id="grad1" x1="120" y1="50" x2="170" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={color}/>
                    <stop offset="100%" stopColor={`${color}DD`}/>
                </linearGradient>

                <linearGradient id="grad2" x1="80" y1="75" x2="120" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={`${color}DD`}/>
                    <stop offset="100%" stopColor={`${color}BB`}/>
                </linearGradient>

                <linearGradient id="grad3" x1="40" y1="90" x2="75" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={`${color}BB`}/>
                    <stop offset="100%" stopColor={`${color}99`}/>
                </linearGradient>

                <filter id="filter0_d" x="36" y="46" width="128" height="118" filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
            </defs>
        </svg>
    );
};

export default InfraEstateLogo;