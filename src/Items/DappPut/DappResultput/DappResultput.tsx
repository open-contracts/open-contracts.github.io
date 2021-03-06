import React, {FC, ReactElement} from 'react';
import { DappResultputI } from '../DappPutType';
import { DappPutLayout } from '../DappPutLayout';
import {Colors} from "../../../Theme/Colors";
import { DappResultputHeader } from './DappResultputHeader';
import { DappResultputContent } from './DappResultputContent';
import { darkenStandard } from '../Methods';
import { DesktopSizes } from '../../../Theme';
import { reduceContractFunctionI } from '../../DappFunction/StateMethods';

export type DappPutResultputProps = {
    style ? : React.CSSProperties
    dappResultput : DappResultputI,
    contractFunction : OpenContractFunctionI,
    reduceContractFunction ? : (contractFunction : reduceContractFunctionI)=>void
}

export const DappResultput : FC<DappPutResultputProps>  = ({
    dappResultput,
    style,
}) =>{


    return (

       dappResultput.value ? <DappPutLayout style={{
            background : Colors.greenCeramic,
            color : Colors.forestEdge,
            ...style
        }}>
            <DappPutLayout.Header>
                <DappResultputHeader dappResultput={dappResultput} />
            </DappPutLayout.Header>
            <DappPutLayout.Content>
                <DappResultputContent dappResultput={dappResultput}/>
            </DappPutLayout.Content>
        </DappPutLayout> : <></>

    )

}