import React, { useState } from 'react';
import _ from 'lodash';
import { search } from './utils';

interface Places <P = {}>{
  html_attributions?: object;
  results?: Array<object>;
  status?: string;
}

interface Data <P = {}>{
  place_data?: Places<P>[];
  coordinates?: object;
  state?: string;
}

export function useSearch<T> (initParam: string, searchRadius: number, initData: Data): [ Data, React.Dispatch<T>] {
  const [ placeData, setPlaceData ] = useState<Data>(initData);
  const API_KEY = 'AIzaSyAroiUfOgYwg5TvFMH0SpmeAz_WWaoiUXk';


  const getLocationData = () => {
    
    navigator.geolocation.getCurrentPosition((position) => {
      
      const userCoordinates = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      }

      const query = initParam.replace(' ', '+')

      const URI = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${userCoordinates.longitude},${userCoordinates.latitude}&radius=${searchRadius*1000}type=hospital,health&key=${API_KEY}`;
      
      const prom = search(URI);

      prom.then((data) => {       
         
        setPlaceData({
          place_data: data,
          coordinates: userCoordinates,
          state: _.isEmpty(data) ? 'noData' : 'result',
        })
      })
    },
      (err) => {
        setPlaceData({
          place_data: [],
          coordinates: {},
          state: 'noLocation'
        })
    });
  }

  return [ placeData, getLocationData ];
}