// MultiCharts.js
import React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const data1 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
];

const data2 = [
  { name: 'Group C', value: 200 },
  { name: 'Group D', value: 100 },
];

const data3 = [
  { name: 'Group E', value: 600 },
  { name: 'Group F', value: 150 },
];

const AppearanceIn = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
      {/* Cada gráfico debe tener un contenedor con altura definida */}
      <div style={{ width: 200, height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data1} dataKey="value" outerRadius={60} fill="#8884d8" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: 200, height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data2} dataKey="value" outerRadius={60} fill="#82ca9d" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: 200, height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data3} dataKey="value" outerRadius={60} fill="#ffc658" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AppearanceIn;