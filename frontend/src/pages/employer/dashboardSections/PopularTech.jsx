import { useEffect, useState } from "react";
import { candidateApi } from "../../../services/api";

const PopularTech = () => {
    const [roles, setRoles] = useState([]);
    useEffect( () => {
        candidateApi.getDashboardMainRoleCounts()
        .then( result => {
            setRoles([...result.data].sort((a, b) => b.count - a.count));
            // console.log(roles);
            
        })
        .catch( error => {
            console.log(error);
            }
        );

    }, []);

    return (
        <div className="container">
            <h4>Popular Technologies (As per interested Candidates)</h4>
            <div className="d-flex justify-content-lg-around flex-wrap gap-6">
                {roles.map((role) => (
                        <div className="card">
                            <div className="card-body">
                                <div><span>{role.count}</span></div>
                                <div>
                                    <span>“{role.role}”</span>
                                    <span>Candidates</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PopularTech;