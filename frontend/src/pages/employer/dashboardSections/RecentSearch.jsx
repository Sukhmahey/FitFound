import { useEffect } from "react";
import { employerApi } from "../../../services/api";

const RecentSearch = () => {

    useEffect(() => {
        employerApi.getLastJobSearch("6868603e0d6db40517c6f95b")
        .then( result => {
            console.log(result);
        })
        .catch( error => {
            console.log(error);
        });
    }, []);

    return (
        <div>
            <h3>Top Candidates</h3>

            <div>
                <div className="card">
                    <div className="card-body">
                        <div>Logo</div>
                        <div >
                            <div>
                                <span>UserName: XYZ</span>
                                <span>Matching Filters: </span>
                            </div>
                            <div>
                                <span>Location : Canada</span>
                                <span>Salary : 50K - 85K</span>
                                <span>Skills : React, UI/UX, Leadership</span>
                            </div>
                        </div>
                        <div>
                            <button>Details</button>
                        </div>
                    </div>
                    
                </div>
                <div className="card">
                    <div className="card-body">
                        <div>Logo</div>
                        <div >
                            <div>
                                <span>UserName: XYZ</span>
                                <span>Matching Filters: </span>
                            </div>
                            <div>
                                <span>Location : Canada</span>
                                <span>Salary : 50K - 85K</span>
                                <span>Skills : React, UI/UX, Leadership</span>
                            </div>
                        </div>
                        <div>
                            <button>Details</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );

};

export default RecentSearch;