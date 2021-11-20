import React, {FC, ReactElement, useState} from 'react';
import {generateNamedMember, getComponentMembers} from "rgfm";
import {AthenaButton} from "../../../Components/Buttons";
import {Colors} from "../../../Theme";
import {Grid3x3GapFill} from "react-bootstrap-icons";

const Members = ["Single", "Grid"]


export type ApolloRunDappContentProps = {
    grid ? : boolean,
    setGrid ? : (grid : boolean)=>void
    which ? : string
}

const ApolloRunDappContent : FC<ApolloRunDappContentProps> & {
    Single : FC,
    Grid : FC
}  = ({
    children,
    grid,
    setGrid,
    which
}) =>{

    const {
        Single,
        Grid
    } = getComponentMembers(Members, children);

    const handleGrid = ()=>{
        setGrid && setGrid(true);
    }
    const handleSingle = ()=>{
        setGrid && setGrid(false);
    }

    

    return (

        <div 
        style={{
            display : "flex",
            flexDirection : "column",
            flexGrow : 1
        }}>
            <div style={{
                display : "flex",
                alignContent : "center",
                alignItems : "center",
                position : "relative",
                overflow  : "visible"
            }}>
                <AthenaButton
                    onClick={handleGrid}
                    primaryColor={Colors.Maintheme}
                    secondaryColor={grid ? Colors.jonasGray : Colors.quartenaryTextColor}
                    style={{
                        height : "50px",
                        width : "60px",
                        zIndex : 1000,
                        position : "relative",
                        top : grid ? "1px" : 0,
                        borderBottomRightRadius : "0px",
                        borderBottomLeftRadius : "0px",
                        borderTop :  "none",
                        borderLeft : "none",
                        borderBottom : grid ? `1px solid ${Colors.jonasGray}` : "none",
                        borderRight :  "none"
                    }}
                >
                    <Grid3x3GapFill size={24}/>
                </AthenaButton>
                <AthenaButton
                    onClick={handleSingle}
                    primaryColor={Colors.Maintheme}
                    secondaryColor={!grid ? Colors.jonasGray : Colors.quartenaryTextColor}
                    style={{
                        zIndex : 100,
                        position : "relative",
                        top : !grid ? "1px" : 0,
                        borderBottomRightRadius : "0px",
                        borderBottomLeftRadius : "0px",
                        borderTop :  "none",
                        borderLeft : "none",
                        borderBottom : !grid ? `1px solid ${Colors.jonasGray}` : "none",
                        borderRight :  "none",
                        fontSize : "24px"
                    }}
                >
                    <b>ƒ<sub>𝑥</sub></b>&ensp;{which}
                </AthenaButton>
            </div>
            <div style={{
                paddingBottom : "40vh",
                flexGrow : 1,
                zIndex : 0,
                background : Colors.jonasGray,
            }}>
                {grid ? Grid : Single}
            </div>
        </div>

    )

}

ApolloRunDappContent.Grid = generateNamedMember("Grid");
ApolloRunDappContent.Single = generateNamedMember("Single");

export {ApolloRunDappContent}