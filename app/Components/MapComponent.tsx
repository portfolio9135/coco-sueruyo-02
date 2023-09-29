import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

const MapComponent = ({ address }: { address: string }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    // 住所を緯度と経度に変換するジオコーディングサービスの呼び出し
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyD8MPRZ3OcGJ8N40Zh5ieP3PRTf7BDAw2A`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setMapCenter({ lat: location.lat, lng: location.lng });
        }
      });
  }, [address]);

  return (
    <>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyD8MPRZ3OcGJ8N40Zh5ieP3PRTf7BDAw2A" }}
        center={mapCenter}
        zoom={15}
      >
        {/* マーカーを追加 */}
        <Marker lat={mapCenter.lat} lng={mapCenter.lng} />
      </GoogleMapReact>
    </>
  );
};

// マーカーコンポーネント
const Marker = ({ lat, lng }: { lat: number; lng: number }) => (
  <div style={{ width: "30px", height: "30px" }}>
    <img
      className="w-10 c-absolute-04"
      src="/img/PostDetails/map-point.jpg"
      alt="マップのポイントアイコン"
    />
    {/* ここにマーカーのデザインをカスタマイズできます */}
  </div>
);

export default MapComponent;
