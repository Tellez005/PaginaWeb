import React, { useEffect, useRef, useState }  from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import L, { icon, marker } from "leaflet"; 
var dogIcon = L.icon({
    iconUrl: '/icons/Perro.png',

    iconSize:     [85, 110], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var catIcon = L.icon({
    iconUrl: '/icons/gatos.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var otherIcon = L.icon({
    iconUrl: '/icons/Desaparecidos.png',
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


function MoverMapa({ mascotaSeleccionada }) {
    const map = useMap();

    useEffect(() => {
        if (mascotaSeleccionada) {
            map.setView([mascotaSeleccionada.lat, mascotaSeleccionada.lng], 16);
        }
    }, [mascotaSeleccionada, map]);

    return null;
}

const Map = ({mascotaSeleccionada}) => {

    const [geodata,setGeoData] = useState(null); 
    const mapRef = useRef(); 
    const position = [20.73822228680415, -103.4472214186193]; 

    useEffect(() => {
        fetch("/data/guadalajara_sublocs.geojson")
        .then((res) =>res.json())
        .then((data) => setGeoData(data)) 
        .catch((err) => console.error("Failed to load GeoJSON", err))
    })

    return(
        <>
        <div style={{height:"100%", width:"100%"}}>
  
            <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true}
            ref={mapRef}
            style={{height:"100%", width: "100%"}}
            
            >
                <Marker position={[20.73822228680415, -103.4472214186193]} icon={dogIcon}>
                    <Popup >Perro</Popup>
                </Marker>
                <Marker position={[20.73822228680415, -103.4569214186193]} icon={catIcon}>
                    <Popup>
                        <div>
                            <div>
                                <h3>Gato</h3>
                            </div> 
                        </div>
                        </Popup>
                </Marker>
                <Marker position={[20.73822228680415, -103.4679214186193]} icon={otherIcon}>
                    <Popup>Otro</Popup>
                </Marker>
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MoverMapa mascotaSeleccionada={mascotaSeleccionada} />
                {mascotaSeleccionada && (
                <Marker position={[mascotaSeleccionada.lat, mascotaSeleccionada.lng]}
                    icon={dogIcon}>; 
                    <Popup>{mascotaSeleccionada.nombre}</Popup>
                </Marker>
                )}
                {geodata && <GeoJSON data={geodata}/> }
            </MapContainer>
        </div>
        </>
    )
}

export default Map 



