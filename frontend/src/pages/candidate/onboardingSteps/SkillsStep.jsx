
import React, { useState } from 'react';

export default function SkillsStep({ data = [], onUpdate }) {
  const [skill, setSkill] = useState('');

  const addSkill = () => {
    if (skill.trim()) {
      onUpdate([...data, { skill: skill.trim() }]);
      setSkill('');
    }
  };

  const removeSkill = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <div>
      <h3>Skills</h3>
      <div>
        <input
          type="text"
          placeholder="Enter a skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button onClick={addSkill}>Add</button>
      </div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.skill}
            <button onClick={() => removeSkill(index)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

