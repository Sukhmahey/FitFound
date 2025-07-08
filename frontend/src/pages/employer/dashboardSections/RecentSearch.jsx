import { useEffect, useState } from "react";
import { employerApi, candidateApi } from "../../../services/api";

const RecentSearch = ( props ) => {
    const [job, setJob] = useState({});
    const [candidates, setCandidates] = useState([]);
    
    const candidateslist = [];

    useEffect(() => {
        console.log(props.userProfile._id);
        if (props.userProfile._id) {
            employerApi.getLastJobSearch(props.userProfile._id) // employerId for testing: "6868603e0d6db40517c6f95b"
            .then( result => {
                const candidateIds = result.data.topMatchedCandidates;
                setJob(result.data);

                return Promise.all( candidateIds.map( id => (
                candidateApi.getProfileById(id)
                .then(result => {
                    // console.log(result.data);
                    return result.data;
                    })
                )));

            })
            .then ( result => {
            setCandidates(result);
            // console.log(result);
            })
            .catch( error => {
            // console.log(error);
            });
        }
        
        

    }, [props.userProfile]);


    return (
        <div>
            <h4>Recent Search {job.jobTitle}</h4>
            <div>
                {candidates.length > 0 && candidates.map(candidate => (
                    <div className="card" key={candidate._id}>
                        <div className="card-body">
                        <div>Logo</div>
                        <div>
                            <div>
                            <span>UserName: 
                                {` ${candidate?.personalInfo?.lastName || 'No info'} `}
                                {` ${candidate?.personalInfo?.firstName || 'No info'} `}

                            </span>
                            <span>Matching Filters: {/* puedes agregar lógica aquí */}</span>
                            </div>
                            <div>
                            <span>Location: {`${job.location}`}</span>
                            <span>
                                Salary: 
                                {` ${job.salaryRange.min}${job.salaryRange.perHour ? "CAD" : "K CAD" }
                                -
                                    ${job.salaryRange.max}${job.salaryRange.perHour ? "CAD" : "K CAD" }
                                    ${job.salaryRange.perHour ? "Per Hour" : "Per Year." }
                                `}
                            </span>
                            <span>Skills: {""}
                                Skills:{" "}
                                {candidate.skills && candidate.skills.length > 0
                                ? candidate.skills.map((s, i) => (
                                    <span key={s._id || i}>
                                        {s.skill}{i < candidate.skills.length - 1 ? ", " : ""}
                                    </span>
                                    ))
                                : "No skills"}
                            </span>
                            </div>
                        </div>
                        <div>
                            <button>Details</button>
                        </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );

};

export default RecentSearch;
