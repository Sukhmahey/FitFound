import axios from "axios";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from '../../../contexts/AuthContext';
import { candidateApi } from "../../../services/api";

const RecommendedActions = () => {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_SINDY_API;
    const GEMINI_API_URL =  process.env.REACT_APP_GEMINI_SINDY_API_URL;
    const { user } = useAuth();
    const [userRole, setUserRole] = useState("");
    const [userSkills, setUserSkills] = useState(""); 
    const [prompt, setPrompt] = useState("");
    const [recommendations, setRecommendatios] = useState([]);
    const [message, setMessage] = useState("");
    const [messageClass, setMessageClass] = useState("");

   
    useEffect(() => {

        console.log(user);

        candidateApi.getProfileById(user.profileId)
        .then( result => {
            let skillsString = "";
            result.data.skills.forEach(skill => {
                skillsString = `${skillsString}, ${skill.skill}`;
            });

            setUserRole(result.data.basicInfo.bio);
            setUserSkills(skillsString);
        })
        .catch( error => {
            console.log(error); 
        });
    }, []);

    useEffect( () => {
        // console.log(userSkills);
        // console.log(userRole);

        if (userSkills.length > 0 && userRole.length > 0) {
            setPrompt(`I am a/an ${userRole}. Based on the current job market requirements, give me exactly three technologies or skills I should add to my profile to increase visibility on job platforms. Exclude the following technologies that I already know: ${userSkills}. Only return a simple list of names, with no extra explanation, in a single line, splitted by comma (,). Don't add anything else at the beginning or ending.`);
        }

    }, [userSkills, userRole]);

    useEffect( () => {
        // console.log(prompt);
        if (prompt.length > 10) {
            axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: `${prompt}` }] }]
                },
                {
                    headers: {
                    "Content-Type": "application/json",
                    },
                }
            )
            .then( result => {
                // console.log(result.data.candidates[0].content.parts[0].text);
                let response = result.data.candidates[0].content.parts[0].text;
                setRecommendatios(response.split(',').map(skill => skill.trim()));
            })
            .catch( error => {
                setRecommendatios([]);
            });
        }
    }, [prompt]);

    const handlerAddClick = (skill) => {
        console.log(skill);
        candidateApi.updateSkills(user.userId,  { skills: [{ skill: skill.trim() }]} )
        .then( result => { 
            console.log(result.data);
            setMessage( `The skill ${skill} has been added to your profile successfully.`);
            setMessageClass("alert alert-success"); 
            setTimeout(() => {
                setMessage("");
                setRecommendatios(recommendations.filter(item => item !== skill))
            }, 5000);
        })
        .catch( (err) => {
            setMessage(err.response?.data?.details || "An error occurred.");
            setMessageClass("alert alert-danger");
            setTimeout(() => setMessage(""), 5000);
        });
    };

    return(
        <div>
            <p>Recommended Actions</p>
            {message && (
                <Box className={messageClass} sx={{ mb: 2 }}>
                {message}
                </Box>
            )}
            <div>
                <>{ recommendations.length > 0 && recommendations.map((recommendation) => (
                    <div 
                    style={{
                    border: '1px solid #ccc',
                    padding: '16px',
                    margin: '16px',
                    borderRadius: '8px'
                    }}
                    key={recommendation}>
                        <p>Add "{recommendation}" to your profile to appear in more searches as “role here”.</p>
                        <button onClick={() => handlerAddClick(recommendation)}>Add</button>
                    </div>
                ))}
                </>
            </div>
        </div>
    );
};

export default RecommendedActions;
