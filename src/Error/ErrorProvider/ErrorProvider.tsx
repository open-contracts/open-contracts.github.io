import React, {FC, ReactElement, createContext, useReducer, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../../Pages/ErrorPage';


export interface ErrorContextI {
    errorLoading : boolean,
    errorValidating : boolean,
    errorLoaded : boolean,
    error : undefined | Error,
    dispatch : (fn : (state : ErrorContextI)=>ErrorContextI)=>void
}

const DefaultErrorContext : ErrorContextI = {
    errorLoading : false,
    errorValidating : false,
    errorLoaded : false,
    error : undefined,
    dispatch : ()=>{}
}


export const ErrorContext = createContext(DefaultErrorContext);

export const ErrorReducer = (
    state : ErrorContextI, 
    action : (state : ErrorContextI)=>ErrorContextI
)=>{
    return action(state);
}

export type ErrorProviderProps = {
    initialerror? : {
        [key : string] : any
    } 
}

export const ErrorProvider : FC<ErrorProviderProps>  = ({
    initialerror,
    children
}) =>{

    const [state, dispatch] = useReducer(ErrorReducer, DefaultErrorContext);

    useEffect(()=>{

        if(!state.errorLoaded && !state.errorLoading && !state.errorValidating){

            dispatch(()=>{
                return {
                    ...state,
                    dispatch : dispatch,
                    errorValidating : true,
                }
            })

        }

    })

    useEffect(()=>{

        if(!state.errorLoaded && !state.errorLoading && state.errorValidating && state.dispatch){

            dispatch(()=>{
                return {
                    ...state,
                    errorValidating : false,
                    errorLoaded : true
                }
            })


        } 
    });

    

    return (

        <ErrorContext.Provider value={{
            ...state,
            dispatch : dispatch
        }}>
            {state.error ? <ErrorPage/> : children}
        </ErrorContext.Provider>

    )

}




export const useErrorContext = () : ErrorContextI=>{

    const context = useContext(ErrorContext);

    if(!context){
        throw new Error("useErrorContext must be called within a ErrorProvider.");
    }

    return context;

}