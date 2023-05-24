import { useState, useEffect } from 'react';

export default function DeviceStatus() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const res = await fetch('https://wjwfptgkc3.execute-api.us-east-1.amazonaws.com/v1/things');
    let devices = await res.json();
    setDevices(devices);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-2" style={{backgroundColor: '#25392B'}}>
      <div className="relative w-full max-w-6xl px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 mx-5">
        <div className="absolute top-8 right-8 cursor-pointer w-8" onClick={loadDevices} >
          <img  src="https://cdn.icon-icons.com/icons2/2368/PNG/512/reload_update_refresh_icon_143703.png" alt="Refresh Icon" />
        </div>
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">Device Statuses</h1>
        {devices.map((device) => (
          <div key={device.name} className="flex justify-between items-center mb-5">
            <div className="flex-1 bg-gray-100 px-6 py-4 m-2 shadow-md rounded-md text-gray-700 font-semibold text-xl border border-gray-200">
              {device.name}
            </div>
            <div className={`flex-1 px-6 py-4 m-2 rounded-md shadow-md text-white font-semibold text-xl`} style={{ backgroundColor: '#C4D93B' }}>
              {device.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}