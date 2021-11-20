import React, {FC, ReactElement} from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { CollectionFill } from 'react-bootstrap-icons';
import { DappI } from '../Dapp';
import {ApolloDappFunction} from "./ApolloRunDappFunction";
import {LeftRightScrollAdorno} from "../../../Components/Scroll/LeftRightScroll";
import { DesktopSizes } from '../../../Theme';
import Masonry from "react-masonry-css";

export type ApolloDappFunctionsProps = {
    dapp : DappI,
    which ? : string,
    setWhich ? : (which : string)=>void
}

export const ApolloDappFunctions : FC<ApolloDappFunctionsProps>  = ({
    dapp,
    which,
    setWhich
}) =>{

    const onFunctionClick = (e : React.MouseEvent, name : string)=>{
        setWhich && setWhich(name);
    }


    const funcs = dapp.contract && dapp.contract ? dapp.contract.contractFunctions.map((func)=>{


        return (
            <div 
            key={func.name}
            style={{
                overflow : "visible",
                padding : DesktopSizes.Padding.standard,
                width : "100%"
            }}>
                <ApolloDappFunction 
                    style={{
                        width : "100%",
                        height : "auto",
                        borderRadius : DesktopSizes.BorderRadius.standard
                    }}
                    onClick={onFunctionClick}
                    selected={func.name === which} 
                    dapp={dapp} 
                    func={func}/>
            </div>
        )
    }) : <></>

    return (

        <Masonry 
            style={{
                overflow : "visible"
            }}
            className={"masonry"}
            breakpointCols={3}>
            {funcs}
        </Masonry>

    )

}