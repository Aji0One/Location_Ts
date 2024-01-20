import React from 'react';
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "../Styles/GeoLocation.css";
import L from "leaflet";

const GeoLocation = () => {
    const { state } = useLocation();


    console.log(state);
    // const resArr: any = [];
    // state.filter(function (item: any) {
    //     var i = resArr.findIndex((x: any) => item.suburb === x.suburb);
    //     if (i <= -1) {
    //         resArr.push([item.lat, item.lng]);
    //     }
    //     return null;
    // });

    // console.log(resArr);
    return (

        <MapContainer center={{ lat: state[0].lat, lng: state[0].lng }} zoom={13} scrollWheelZoom={false} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                state.map((ele: any, i: any) => {
                    const markerIcon = new L.Icon({
                        iconUrl: require("../assets/map-marker-icon_34392.png"),
                        iconSize: [35, 45],
                        popupAnchor: [3, -20]
                    })
                    console.log([ele.lat, ele.lng]);
                    return (
                        <Marker position={[parseFloat(ele.lat), parseFloat(ele.lng)]} key={i} icon={markerIcon}>

                            <Popup >
                                {ele.suburb}
                            </Popup>
                        </Marker>
                    )
                }
                )
            }
        </MapContainer>

    )
}

export default GeoLocation;
