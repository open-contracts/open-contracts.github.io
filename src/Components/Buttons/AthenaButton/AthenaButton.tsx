import Color from "color";
import React, { FC, useEffect, useState } from 'react';
import {Button, ButtonProps, Spinner } from "react-bootstrap";
import { Colors, Shadows } from "../../../Theme";


/**
 * @initialAuthor
 * @contributors
 */

/**
 * @description
 */
export type AthenaButtonProps = ButtonProps & {
    className ? : string,
    label?: string,
    primaryColor: React.CSSProperties["color"],
    secondaryColor: React.CSSProperties["color"],
    invert? : boolean,
    disabled?: boolean,
    active?: boolean,
    hovered? : boolean,
    loading?: boolean,
    size?: "sm" | "lg" | undefined,
    action? : (e? : React.MouseEvent)=>Promise<void>,
    onClick? : (e : React.MouseEvent)=>void,
    onMouseEnter? : (e : React.MouseEvent)=>void,
    onMouseLeave? : (e : React.MouseEvent)=>void,
    style?: React.CSSProperties,
    innerStyle ? : React.CSSProperties
}

/**
 * @description 
 */
export const AthenaButton : FC<AthenaButtonProps>  = ({
    className,
    label, 
    primaryColor, 
    secondaryColor,
    children,
    invert=false,
    disabled=false,
    active=false,
    loading=false,
    size=undefined,
    hovered,
    action=async (e? : React.MouseEvent)=>{return},
    onClick=(e: React.MouseEvent)=>{},
    onMouseEnter=(e: React.MouseEvent)=>{},
    onMouseLeave=(e: React.MouseEvent)=>{},
    style,
    innerStyle
}) =>{

    const [isDisabled, setDisabled] = useState(disabled);
    const [isActive, setActive] = useState(active);
    const [isLoading, setLoading] = useState(loading);
    const [e, setE] = useState<React.MouseEvent|undefined>(undefined)

    useEffect(()=>{
        if(isLoading){
            action(e).then(()=>{
                setDisabled(false);
                setLoading(false);
                setActive(false);
            })
        }
    }, [isLoading])



    const invertedBackground = Color(primaryColor).lighten(1/(10 - Color(primaryColor).contrast(Color(secondaryColor)))).hex()

    const handleClick = (e : React.MouseEvent<HTMLElement>)=>{
        onClick(e);
        setE(e);
        setDisabled(true);
        setLoading(true);
        setActive(true);
        setHovered(false);
    }

    const [isHovered, setHovered] = useState(false); 
    const handleMouseEnter = (e : React.MouseEvent)=>{
        setHovered(true);
        onMouseEnter(e);
    }
    const handleMouseLeave = (e : React.MouseEvent)=>{
        setHovered(false);
        onMouseLeave(e);
    }

    const _isHovered = isHovered || hovered;

    return (

        <Button
            // className={className ? className : "shadow-sm"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variant={`outline`}
            disabled={isLoading||disabled}
            active={isActive||active}
            size={size}
            onClick={handleClick}
            style={{
                boxShadow : Shadows.defaultShadow,
                cursor: "pointer",
                transition: _isHovered? "all .1s ease-in-out" : "",
                display: "inline-block",
                color: _isHovered? secondaryColor : !invert ? primaryColor : secondaryColor,
                backgroundColor: _isHovered? primaryColor : invert ? invertedBackground : secondaryColor,
                ...style
            }}
        ><div style={{
            display : "flex",
            alignContent : "center",
            alignItems : "center",
            justifyContent : 'center',
            justifyItems : "center",
            ...innerStyle
        }}>{label||children}<span style={{display: isLoading||loading ? "inline-block" : "none"}}>&ensp;</span><Spinner
            animation="border"
            style={{
                display : isLoading||loading ? "inline-block" : "none", 
                height : "15px",
                width: "15px"
            }}
            ></Spinner></div>
        </Button>
    )

}