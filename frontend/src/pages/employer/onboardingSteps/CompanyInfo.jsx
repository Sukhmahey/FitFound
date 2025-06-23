import { useFormContext } from "react-hook-form";

const CompanyInfo = () => {
    const { register } = useFormContext();

    return (
        <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="companyLogo" className="form-label">Company Logo</label>
                            <input type="file" {...register("companyLogo")} className="form-control form-control-sm" name="companyLogo" id="companyLogo" />
                        </div>
                    </div>
                </div>

                <div className="row">

                    {/* LEFT COLUMN */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="companyName" className="form-label">Company Name</label>
                            <input type="text" {...register("companyName")} className="form-control form-control-sm" name="companyName" id="companyName" maxLength="60" minLength="5"  />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="establishedYear" className="form-label">Established In (Year)</label>
                            <input type="number" {...register("establishedYear")} className="form-control form-control-sm" name="establishedYear" id="establishedYear" min="1000" max={ new Date().getFullYear() }  />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="businessRegisteredNumber" className="form-label">Business Registered Number</label>
                            <input type="text" {...register("businessRegisteredNumber")} className="form-control form-control-sm" name="businessRegisteredNumber" id="businessRegisteredNumber" maxLength="60" minLength="5"  />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="industrySector" className="form-label">Industry Sector</label>
                                <select {...register("industrySector")} id="industrySector" name="industrySector" className="form-control form-control-sm" >
                                    <option value="">-- Select Industry Sector --</option>
                                    <option value="Information Technology">Information Technology</option>
                                </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="companySize" className="form-label">Company Size (number of employees)</label>
                            <select {...register("companySize")} name="companySize" id="companySize" className="form-control form-control-sm" >
                                <option value="">-- Select Company Size --</option>
                                <option value="1-10">1–10 employees</option>
                                <option value="11-50">11–50 employees</option>
                                <option value="51-200">51–200 employees</option>
                                <option value="201-500">201–500 employees</option>
                                <option value="501-1000">501–1,000 employees</option>
                                <option value="1001+">1,001+ employees</option>
                            </select>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="workLocation" className="form-label">Location</label>
                            <input type="text" {...register("workLocation")} className="form-control form-control-sm" name="workLocation" id="workLocation" />
                            
                        </div>
                        
                        
                        <div className="mb-3">
                            <label htmlFor="companyWebsite" className="form-label">Company Website</label>
                            <input type="text" {...register("companyWebsite")} className="form-control form-control-sm" name="companyWebsite" id="companyWebsite" maxLength="60" minLength="5" />
                            
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="companyDescription" className="form-label">Company Description</label>
                            <textarea {...register("companyDescription")} id="companyDescription" className="form-control" name="companyDescription" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                        </div>        
                        
                    </div>

                </div>

        </div>
    );
};

export default CompanyInfo;