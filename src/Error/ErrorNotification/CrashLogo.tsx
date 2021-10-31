import React, {FC, ReactElement} from 'react';
import { Colors } from '../../Theme';

export type CrashLogoProps = {
    color? : React.CSSProperties["color"],
    style ? : React.CSSProperties
}

export const CrashLogo : FC<CrashLogoProps>  = ({
    color = Colors.primaryTextColor,style
}) =>{

    return (

        <div style={{
            height : "200px",
            width : "200px",
            ...style
        }}>
            <svg id="e7l4ir2eLhD1" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1295 1296" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                <g id="e7l4ir2eLhD2" clipPath="url(#e7l4ir2eLhD5)">
                    <g id="e7l4ir2eLhD3" transform="matrix(1 0 0 1 -1308 -55)">
                        <path id="e7l4ir2eLhD4"
                            d="M2281.32,449.263L2551.39,449.263L2552.12,450.769C2584.88,528.295,2603,613.53,2603,703C2603,792.47,2584.88,877.705,2552.12,955.231L2550.93,957.704L2280.6,957.704L2298.15,934.214C2342.71,868.213,2368.72,788.647,2368.72,703C2368.72,617.353,2342.71,537.787,2298.15,471.786ZM1955.5,55C2156.65,55,2336.38,146.796,2455.14,290.812L2455.18,290.863L1983.28,290.863L1955.5,289.459C1727.28,289.459,1542.28,474.608,1542.28,703C1542.28,931.392,1727.28,1116.54,1955.5,1116.54L1964.14,1116.1L2454.31,1116.1L2413.35,1161.21C2296.18,1278.47,2134.3,1351,1955.5,1351C1597.9,1351,1308,1060.88,1308,703C1308,345.119,1597.9,55,1955.5,55Z"
                            transform="matrix(0.103391 -0.251703 0.251703 0.103391 1297.463604 955.789861)"
                            fill={color} fillRule="evenodd" stroke="none" strokeWidth="1" />
                    </g>
                    <clipPath id="e7l4ir2eLhD5" transform="matrix(1 0 0 1 -1308 -55)">
                        <rect id="e7l4ir2eLhD6" width="1295" height="1296" rx="0" ry="0" transform="matrix(1 0 0 1 1308 55)"
                            fill={color} stroke="none" strokeWidth="1" />
                    </clipPath>
                </g>
                <path id="e7l4ir2eLhD7"
                    d="M811.27241,1085.63037L755.48824,1058.06402L880.4497,805.18796C880.42923,804.69885,880.41891,804.20759,880.41891,803.71433C880.41891,797.8312,881.88713,792.2333,884.53541,787.16032L770.96006,668.53597L631.91347,909.37173L576.15756,877.18104L724.58424,620.0985L691.31772,585.35311L550.79195,828.75088L495.03604,796.56019L644.94189,536.91564L639.59344,531.32943L584.21684,514.54791L599.70208,463.44887L651.53212,479.15564C655.22556,478.48418,660.01241,479.17178,664.73022,481.33136C671.28682,484.33265,675.77869,489.29288,676.39603,493.6522L933.50579,762.19179C959.69536,763.51273,980.44439,781.59804,980.44439,803.71435C980.44439,811.51833,977.86091,818.82042,973.36652,825.06115L1011.26733,1101.2539L949.62144,1109.71331L916.96606,871.74531L811.27241,1085.63037Z"
                    fill={color} stroke="none" strokeWidth="0" />
            </svg>
        </div>

    )

}