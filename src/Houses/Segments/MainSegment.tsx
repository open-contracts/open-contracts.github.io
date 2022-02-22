import React, {FC, ReactElement} from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { generateRandomDappItems } from '../Demo';
import { useErrorContext } from '../../Error/ErrorProvider';
import { DappI, getDappName } from '../../Items';
import { MainRouter } from '../../Router';
import { getFeaturedDapps } from '../../Sytems/Featured';
import { Colors, DesktopSizes } from '../../Views/Theme';
import { ColorProvider } from '../../Views/Theme/ColorProvider';
import {DependencyProvider} from "../../Sytems/DependencyStatus";
import { RunPage } from '../Pages';

export type MainSegmentProps = {}

export const MainSegment : FC<MainSegmentProps>  = () =>{

    return (<MainRouter/>)

}