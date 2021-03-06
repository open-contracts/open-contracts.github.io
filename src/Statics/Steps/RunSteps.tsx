import React, {FC, ReactElement} from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Steps, AllSteps, StepStatusT} from "./Steps";
import { simulateNetworkRequest } from './simulateNetworkRequest';
import { ethers } from 'ethers';

export const checkMetaMaskAvail =  async () : Promise<StepStatusT>=>{

    return new Promise((resolve, reject)=>{

        window.OpenContracts().then(async (data)=>{

            (data as any).provider.listAccounts().then((accounts : any[])=>{
                if(accounts.length > 0){
                    resolve({
                        wallet : "ready"
                    })
                    return;
                } 
                resolve({
                    wallet : "failed"
                })
            })

        }).catch(()=>{
            reject({
                wallet : "failed"
            })
        })
    })
}

export type RunStepsProps = {
    done ? : ()=>void,
    setStepStatus ? : (stepStatus : StepStatusT)=>void,
    stepStatus : StepStatusT
}

export const RunSteps : FC<RunStepsProps>  = ({
    done,
    setStepStatus,
    stepStatus
}) =>{

    const [stepIndex, setStepIndex] = useState(0);
    const [allDone, setAllDone] = useState(false);

    const handleDone = (which : string, success : boolean)=>{
        const index = AllSteps.indexOf(which);
        if((index !== undefined) && (index < AllSteps.length - 1) && success){
            setStepIndex(stepIndex + 1);
            return;
        }
        if((index !== undefined) && (index > AllSteps.length - 2) && success){
            setAllDone(true);
        }
    }

    useEffect(()=>{

       checkMetaMaskAvail().then((data)=>{
            setStepStatus && setStepStatus(data)
        }).catch((data)=>{
            setStepStatus && setStepStatus(data);
        })

    }, [])

    useEffect(()=>{
        if(allDone){
            done && done();
        }
    })

    return (

        <Steps 
        done={handleDone}
        which={AllSteps[stepIndex]}
        status={stepStatus}/>


    )

}