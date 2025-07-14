import React, { useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';

import { candidateApi } from '../../../services/api';


const AppearanceIn = () => {
    const { user } = useAuth();
    const [skillsData, setSkillsData] = useState([]);

    useEffect(() => {
        // console.log(user.profileId);
        candidateApi.getAppearanceInSkills(user.profileId)//("6867037fab263ff7903b8f21")
        .then(result => { 
            setSkillsData([...result.data]);
        })
        .catch( error => 
            console.log(error)
        );
    }, []);

    function capitalizeWords(text) {
        return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    const COLORS = ['#81C784', '#E57373'];


    return (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexDirection:'column' }}>
            <p>Appearance In</p>
            {skillsData.length > 0 ? ( skillsData.map((skill, index) => {
                const appearances = Math.trunc(((skill.candidateAppearances / skill.totalPlatformSearches) * 100) * 100) / 100;
                const chartData = [
                    { name: "Appearances", value:  appearances},
                    { name: 'No Appearances', value: Math.trunc((100 - appearances) * 100) / 100 }
                ];
                
            return (
                <div key={index}>
                    <p>{capitalizeWords(skill?.skill || "")}</p>
                    <div style={{ width: 250, height: 250 }}>
                        <ResponsiveContainer key={skill.skill}>
                            <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                outerRadius={60}
                                fill="#8884d8"
                                >
                                {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p>{`${skill?.candidateAppearances || 0}/${skill?.totalPlatformSearches || 0} Searches`}</p>
                </div>
            );
            })) : (<div style={{ width: 250, height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                        data={[{ name: "No Data", value: 100 }]}
                        dataKey="value"
                        outerRadius={60}
                        fill="#ccc"
                        >
                        <Cell fill="#ccc" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <p>No skills data available</p>
            </div>)}
        </div>
    );
};

export default AppearanceIn;