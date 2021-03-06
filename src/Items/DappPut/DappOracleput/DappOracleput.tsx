import React, {FC, ReactElement} from 'react';
import { DappOracleputI } from '../DappPutType';
import { DappPutLayout } from '../DappPutLayout';
import {Colors} from "../../../Theme/Colors";
import { DappOracleputHeader } from './DappOracleputHeader';
import { DappOracleputContent } from './DappOracleputContent';
import { reduceContractFunctionI } from '../../DappFunction/StateMethods';

export type DappPutOracleputProps = {
    style ? : React.CSSProperties
    dappOracleput : DappOracleputI,
    end ? : boolean
    contractFunction : OpenContractFunctionI,
    reduceContractFunction ? : (contractFunction : reduceContractFunctionI)=>void
}

export const DappOracleput : FC<DappPutOracleputProps>  = ({
    dappOracleput,
    style,
    end
}) =>{

    return (

        <DappPutLayout 
        end={end}
        style={{
            background : "white",
            ...style
        }}>
            <DappPutLayout.Header>
                <DappOracleputHeader dappOracleput={dappOracleput}/>
            </DappPutLayout.Header>
            <DappPutLayout.Content>
                <DappOracleputContent dappOracleput={dappOracleput}/>
            </DappPutLayout.Content>
        </DappPutLayout>

    )

}