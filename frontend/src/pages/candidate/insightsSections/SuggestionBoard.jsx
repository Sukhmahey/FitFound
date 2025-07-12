import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../../../contexts/AuthContext';
import { candidateApi } from "../../../services/api";

const SuggestionBoard = () => {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_SINDY_API;
    const GEMINI_API_URL =  process.env.REACT_APP_GEMINI_SINDY_API_URL;
    const { user } = useAuth();
    const [userRole, setUserRole] = useState("");
    const [userProfile, setUserProfile] = useState({}); 
    const [prompt, setPrompt] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {

        candidateApi.getProfileById(user.profileId)
        .then( result => {
            setUserRole(result.data.basicInfo.bio);
            setUserProfile(result.data);
        })
        .catch( error => {
            // console.log(error); 
        });
    }, []);

    useEffect( () => {

        if (userProfile && userRole.length > 0) {
            const { personalInfo, basicInfo, portfolio, _id, userId, ...cleanProfile } = userProfile;

            // console.log(cleanProfile);

            setPrompt(`I am a/an ${userRole}. Based on the current job market requirements, give me exactly two suggestions to improve my profile. This is my profile: ${cleanProfile}. Focus only on recommendations related to education, level, salary, job references, work achievements, or other professional growth aspects — excluding technologies or skills I could add.
            Return a simple list of two suggestions in a single line, following these exact rules:
            Each suggestion must have a clear title (maximum 8 words).
            Use a colon (:) to separate the title from its explanation.
            Use a semicolon (;) to separate the two suggestions, but do not place a semicolon after the second suggestion.
            Do not use the colon (:) or semicolon (;) for anything else except separating titles form descriptions (:), and suggestions (;)
            Do not use any other special characters (* - "" # $)
            Do not add any introduction, closing sentence, or period (.) at the end
            Example format:
            Quantify achievements using numbers: Use metrics to showcase the impact you made in past roles; Target a slightly higher salary range: Research salaries for your experience and location to negotiate better`);
        }

    }, [userProfile, userRole]);

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
                let response = result.data.candidates[0].content.parts[0].text.replace(/\./g, "");
                setSuggestions(response.split(';').map(skill => skill.trim()));
            })
            .catch( error => {
                setSuggestions([]);
            });
        }
    }, [prompt]);

    return (
        <div>
            <p>AI Generated Suggestion Board</p>
            <div>
                <>{ suggestions.length > 0 && suggestions.map((suggestion, index) => (
                <div 
                style={{
                border: '1px solid #ccc',
                padding: '16px',
                margin: '16px',
                borderRadius: '8px'
                }}
                key={index}>
                    <div><p>{`"${suggestion.split(':')[0]}"`}</p></div>
                    <div><p>{suggestion.split(':')[1]}.</p></div>
                </div>
            ))

            }
            </>
            </div>
        </div>
    );
};

export default SuggestionBoard;