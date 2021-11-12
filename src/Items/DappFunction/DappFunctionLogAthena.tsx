import React, {FC, PureComponent, ReactElement, useReducer} from 'react';
import { Colors, DesktopSizes } from '../../Theme';
import { DappI, parseGitUrl } from '../Dapp/Dapp';
import { DappInput, DappPut } from '../DappPut';
import { DappDescputI, DappOracleInputI, DappErrputI, DappInputI, DappInteractputI, DappOracleputI, DappOutputI, DappPutI, DappResultputI } from '../DappPut/DappPutType';
import {to} from "await-to-js";
import { useEffect } from 'react';
import {DappFunctionLogRunButton} from "./DappFunctionLogRunButton";
import {DappFunctionSubmitState} from "./DappFunctionSubmitState";
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';
import {generate} from "shortid";
import * as log from "./StateMethods";

declare class ClientError extends Error{};

export type DappFunctionLogAthenaProps = {
    dapp : DappI,
    contractFunction : OpenContractFunctionI,
    setFunctionState ? : (func : OpenContractFunctionI)=>void
}



export const DappFunctionLogAthena : FC<DappFunctionLogAthenaProps>  = ({
    dapp,
    contractFunction,
    setFunctionState
}) =>{

    const [reducedFunctionState, reduceFunctionState] = useReducer(
        (state : OpenContractFunctionI, update : log.reduceContractFunctionI)=>{
            console.log("Attempting to reduce...", update(state));
            setFunctionState && setFunctionState(update(state));
            return update(state);
        },
        contractFunction
    )

    const resetArgs = (reduceFunctionState : (update : log.reduceContractFunctionI)=>void)=>{
        reduceFunctionState((oc : OpenContractFunctionI)=>{
            return {
                ...oc,
                inputs : log.resetInputs(oc.inputs)
            }
        })
    }
    const updatedPuts = log.produceUpdatedPuts(
        contractFunction.puts,
        contractFunction,
        reduceFunctionState
    );
    const puts = updatedPuts.reduce((agg, put, index)=>{
        return [
            ...agg,
            ...put.putType !== "input" ? [
                (
                    <><DappPut 
                        key={index}
                        contractFunction={contractFunction}
                        reduceContractFunction={reduceFunctionState}
                        end={index > (contractFunction.puts ? contractFunction.puts.length - 2 : -1)}
                        index={index} put={put}/><br/></>
                )
            ] : []
        ]
    }, [] as React.ReactNode[])


    const addOutput = (name : string, message : string)=>{
        const update = (contractFunction : OpenContractFunctionI)=>{
            const newOutput = {
                name : name,
                value : message
            };
            return {
                ...contractFunction,
                ...contractFunction.requiresOracle ? {
                    result : "Oracle output received! See below."
                } : {},
                prints : [...contractFunction.prints||[], newOutput],
                puts : [...contractFunction.puts||[], ...log.createOutputs(
                    [newOutput],
                    contractFunction,
                    reduceFunctionState
                )]
            }
        }
        reduceFunctionState(update);
    }
    contractFunction.printHandler = async (message : string)=>{
        addOutput("Output received!", message)
    }

    const addOracleInput = (
        data : string,
        resolve : (msg : string)=>void,
        reject : (msg : string)=>void
    )=>{
        const update = (contractFunction : OpenContractFunctionI)=>{
            console.log("Input update!: ", contractFunction);
            const newOracleInput = {
                prompt : data,
                response : undefined,
                id : generate()
            }
            return {
                ...contractFunction,
                oracleInputs : {
                    ...contractFunction.oracleInputs, 
                    [newOracleInput.id] : newOracleInput
                },
                puts : [...contractFunction.puts||[], ...log.createOracleInputs(
                    {[newOracleInput.id] : newOracleInput},
                    contractFunction,
                    resolve,
                    reject,
                    reduceFunctionState
                )]
            }
        }
        reduceFunctionState(update);
    };
    useEffect(()=>{
        setFunctionState && setFunctionState({
            ...contractFunction,
        })
    }, [contractFunction.puts])
    useEffect(()=>{
        contractFunction.inputHandler = async (message : string)=>{
            console.log(contractFunction);
            return new Promise((resolve, reject)=>{
                console.log("Input received!");
                addOracleInput(message, resolve, reject);
            })
        }
    })

    const addError = (e : Error)=>{
        const update = (contractFunction : OpenContractFunctionI)=>{
            const newError = {
                ...e,
                description : e.message
            }
            const _newFunctionState = {
                ...contractFunction,
                errors : [...contractFunction.errors||[], newError],
                puts : [...(contractFunction.puts||[]), ...log.createErrors(
                    [newError], 
                    resetArgs,
                    contractFunction,
                    reduceFunctionState
                )]
            }
            return _newFunctionState;
        }
        reduceFunctionState(update);
    }

    const handleError = async (e : Error)=>{

        addError(e);

    }
    contractFunction.errorHandler = handleError;

    const addOracleData = (
        data : OpenContractFunctionI["oracleData"], 
        resolve : OpenContractFunctionI["oraclePromiseResolve"],
        reject : OpenContractFunctionI["oraclePromiseReject"]
    )=>{
        
        reduceFunctionState((contractFunction)=>{
           return {
            ...contractFunction,
            oracleData : data,
            oraclePromiseResolve : resolve,
            oraclePromiseReject : reject
           }
        })

    }

    const addResult = (data : OpenContractFunctionI["result"])=>{

        const update = (contractFunction : OpenContractFunctionI)=>{
            const _newFunctionState = {
                ...contractFunction,
                result : data,
                puts : [...contractFunction.puts||[], log.createResult(
                    data,
                    contractFunction,
                    reduceFunctionState
                )]
            }
            return _newFunctionState;
        }
        reduceFunctionState(update);

    }

    const [oracleStates, setOracleStates] = useReducer<
        (
            state : OpenContractFunctionI["oracleData"], 
            data : OpenContractFunctionI["oracleData"]
        )=>OpenContractFunctionI["oracleData"]
    >(
        (state, data)=>{
            return {
                ...state,
                ...data
            }
        },
        (contractFunction.oracleData)
    );
    useEffect(()=>{
        if(
            oracleStates !== undefined
            && log.allPromisesResolved(oracleStates) 
            && contractFunction.oracleData !== oracleStates
        ){
            contractFunction.oraclePromiseResolve && contractFunction.oraclePromiseResolve(oracleStates as any);
            addOracleData(
                oracleStates,
                undefined,
                undefined
            );
        }
    }, [oracleStates])

    const loadOracleData = async () : Promise<{[key : string] : string}>=>{
        const {
            owner,
            repo,
            branch
        } = parseGitUrl(dapp.gitUrl)

        const [error, data]= await to<{[key : string] : Promise<string>}>(window.githubOracleDownloader(
            owner || "",
            repo || "",
            branch || "main",
            contractFunction.oracleFolder
        ));

        if(error){
            addError(
                new ClientError("Oracle data unavailable."),
            )
        }
        return new Promise((resolve, reject)=>{
            if(data){
                Object.keys(data).map((key)=>{
                    if((data[key] as Promise<string>).then){
                        (data[key] as Promise<string>).then((data)=>{
                            setOracleStates({
                                [key] : data
                            })
                        }).catch(()=>{
                            contractFunction.oraclePromiseReject && 
                            contractFunction.oraclePromiseReject(); 
                        })
                    }
                })
            }
            addOracleData(
                data||{} as any,
                resolve,
                reject
            );
            if(error){
                addError(new ClientError("GitHub download failed."));
                reject();
            }
        })

    }

    const addOracleCallput = (call : ()=>Promise<string>)=>{
        reduceFunctionState((contractFunction)=>{
            return {
                ...contractFunction,
                callOracle : call
            }
        })
    }

    const handleSubmit = async (call : ()=>Promise<string>)=>{
        console.log("Submission received!");
        addOracleCallput(call);
    }
    contractFunction.submitHandler = handleSubmit;

    const handleCall = async ()=>{

        

       return new Promise((resolve, reject)=>{

            /*addResult(<div style={{
                display : 'flex',
                alignContent : "center",
                alignItems : "center"
            }}>
                <Spinner style={{
                    height : "10px",
                    width : "10px"
                }} animation="border"/>
                &emsp;Pending...
            </div>)*/

            if(contractFunction.requiresOracle){

                if(!contractFunction.oracleData){
                    addError(new ClientError("Oracle data is required for this function."));
                    resolve({});
                }

                contractFunction.call(contractFunction).then((data)=>{
                    /*addOutput(data ? data : <div style={{
                        display : 'flex',
                        alignContent : "center",
                        alignItems : "center"
                    }}>
                        <Spinner style={{
                            height : "10px",
                            width : "10px"
                        }} animation="border"/>
                        &emsp;Attempting oracle connection...
                    </div>)*/;
                    resolve(data);
                }).catch((err)=>{
                    addError(err);
                    resolve({});
                })
                return;
            } 
            contractFunction.call(contractFunction).then((data)=>{
                addResult(data);
                
                resolve(data);
            }).catch((err)=>{
                
                addError(err);
                resolve({});
            })
       })

    }

    const addInteractput = (name : string, targetUrl : string, sessionUrl : string)=>{
      reduceFunctionState((contractFunction)=>{
        const newXpra =  {
            name : name,
            description : targetUrl,
            value : sessionUrl
        };
        return {
            ...contractFunction,
            ...contractFunction.requiresOracle ? {
                result : "Oracle output received! See below."
            } : {},
            xpras : [...contractFunction.xpras||[], newXpra],
            puts : [...contractFunction.puts||[], ...log.createXpras(
                [newXpra],
                contractFunction,
                reduceFunctionState
            )]
        }
      });

    }

    contractFunction.xpraHandler = async (targetUrl, sessionUrl, xpraExit)=>{

        addInteractput("Interactive session requested.", targetUrl, sessionUrl);

    }

    

    return (

        <>
            <div style={{
                width : "100%",
                paddingBottom : DesktopSizes.Padding.standard,
            }}>
                <DappFunctionLogRunButton
                    reduceContractFunction={reduceFunctionState}
                    contractFunction={contractFunction}
                />
                <br/>
                <DappFunctionSubmitState
                    reduceContractFunction={reduceFunctionState}
                    loadOracleData={loadOracleData}
                    call={handleCall}
                    contractFunction={contractFunction}
                />
                <br/>
                {puts}
                <br/>
            </div>
        </>

    )

}