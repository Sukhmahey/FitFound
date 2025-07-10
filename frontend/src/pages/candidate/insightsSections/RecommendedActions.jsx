import axios from "axios";
import { use, useEffect, useState } from "react";
import { useAuth } from '../../../contexts/AuthContext';
import { candidateApi } from "../../../services/api";


const RecommendedActions = () => {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API;
    const GEMINI_API_URL =  process.env.REACT_APP_GEMINI_API_URL;
    const { user } = useAuth();
    const [userRole, setUserRole] = useState("");
    const [userSkills, setUserSkills] = useState(""); 
    const [prompt, setPrompt] = useState("");
    const [recommendations, setRecommendatios] = useState([]);

   
    useEffect(() => {
        setRecommendatios(["Docker", "MUI", "SignalR"]);

        candidateApi.getProfileById(user.profileId)
        .then( result => {
            let skillsString = "";
            console.log(result.data);
            
            
            
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
        console.log(userSkills);
        console.log(userRole);

        if (userSkills.length > 0 && userRole.length > 0) {
            setPrompt(`I am a/an ${userRole}. Based on the current job market requirements, give me exactly thre technologies or skills I should add to my profile to increase visibility on job platforms. Exclude the following technologies that I already know: ${userSkills}. Only return a simple list of names, with no extra explanation, in a single line, splitted by comma (,). Don't add anything else at the beginning or ending.`);
        }

    }, [userSkills, userRole]);

    // useEffect( () => {
    //     console.log(prompt);
    //     if (prompt.length > 10) {
    //         axios.post(
    //             `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    //             {
    //                 contents: [{ parts: [{ text: `${prompt}` }] }]
    //             },
    //             {
    //                 headers: {
    //                 "Content-Type": "application/json",
    //                 },
    //             }
    //         )
    //         .then( result => {
    //             console.log(result.data.candidates[0].content.parts[0].text);

    //             // TODO: save the response in an array. Then in a collection
    //         })
    //         .catch( error => {
    //             console.log(error);
    //         });
    //     }

    // }, [prompt]);

    return(
        <div>
            <p>Recommended Actions</p>
            <>{ recommendations.length > 0 && recommendations.map((recommendation) => (
                <div key={recommendation}>
                    <p>Add "{recommendation}" to your profile to appear in more searches as “role here”.</p>
                    <button>Add</button>
                </div>
            ))

            }
            </>
            
        </div>
    );
};

export default RecommendedActions;
