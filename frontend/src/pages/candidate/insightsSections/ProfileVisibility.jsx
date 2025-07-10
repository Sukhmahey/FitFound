import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

// const data = [
  
//     {
//         date: "2025-06-30",
//         appearances: 7
//     },
//     {
//         date: "2025-07-01",
//         cnt: 8
//     },
//     {
//         date: "2025-07-02",
//         cnt: 5
//     },
//     {
//         date: "2025-07-03",
//         cnt: 20
//     },
//     {
//         date: "2025-07-04",
//         cnt: 30
//     },
//     {
//         date: "2025-07-05",
//         cnt: 14
//     },
//     {
//         date: "2025-07-06",
//         cnt: 12
//     },
//     {
//         date: "2025-07-07",
//         cnt: 10
//     },
//     {
//         date: "2025-07-08",
//         cnt: 8
//     },
//     {
//         date: "2025-07-09",
//         cnt: 15
//     }
// ];


const ProfileVisibility = () => {
    const { user } = useAuth();
    const [visibilityData, setVisibilityData] = useState([]);

    useEffect(() => {
        candidateApi.getVisibilityTimeline(user.profileId)//("6867037fab263ff7903b8f21")
        .then(result => {
            setVisibilityData([...result.data]);
        })
        .catch();
    }, []);

    return (
        <div style={{ width: "60%", height: 300 }}>
            <p>Profile Visibility</p>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={visibilityData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="appearances" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfileVisibility;