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

            setPrompt(`I am a/an ${userRole}. Based on the current job market requirements, give me exactly two suggestions that I can do to improve my profile. This is my profile ${cleanProfile}. Please give me the recommendations in terms of eductation, level, salary, job references, work achievements, and others. Please, don't give me suggestions about technologies or sikills I could add. Only return a simple list of short suggestions (no more than 15 words), with a short explanation of how to do it (in the same suggestions, before the semicolon), with simple words, in a single line, splitted by semmicolon (;). Don't add anything else at the beginning or ending neither a dot (.), please, thanks.
            Please use this example format: Quantify achievements using numbers: Use metrics to showcase the impact you made in past roles; Target a slightly higher salary range: Research salaries for your experience and location to negotiate better`);
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
                    <div><p>"Profile Improvements"</p></div>
                    <div><p>{suggestion}.</p></div>
                </div>
            ))

            }
            </>
                {/* <div style={{
                    border: '1px solid #ccc',
                    padding: '16px',
                    margin: '16px',
                    borderRadius: '8px'
                    }}>
                    <div><p>"Profile Updates"</p></div>
                    <div><p>Your profile hasn’t been updated in 3 weeks. Refresh your current role to stay on top of search results.</p></div>
                </div>

                <div style={{
                border: '1px solid #ccc',
                padding: '16px',
                margin: '16px',
                borderRadius: '8px'
                }}>
                    <div><p>"Profile Updates"</p></div>
                    <div><p>Your profile hasn’t been updated in 3 weeks. Refresh your current role to stay on top of search results.</p></div>
                </div> */}
            </div>
        </div>
    );
};

export default SuggestionBoard;