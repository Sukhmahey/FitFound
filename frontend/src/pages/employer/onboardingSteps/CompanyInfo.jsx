import { useState } from "react";

const CompanyInfo = () => {

    return (
        <div className="container">
                <div className="row">
                    <div lassName="col-md-6">
                        <div className="mb-3">
                            <label for="company-logo" className="form-label">Company Logo</label>
                            <input type="file" className="form-control form-control-sm" name="company-logo" id="company-logo" />
                        </div>
                    </div>
                </div>

                <div className="row">

                    {/* LEFT COLUMN */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label for="company-name" className="form-label">Company Name</label>
                            <input type="text" className="form-control form-control-sm" name="company-name" id="company-name" maxLength="60" minLength="5"/>
                        </div>
                        
                        <div className="mb-3">
                            <label for="year-established" className="form-label">Established In (Year)</label>
                            <input type="number" className="form-control form-control-sm" name="year-established" id="year-established" min="1000" max={ new Date().getFullYear() }/>
                        </div>

                        <div className="mb-3">
                            <label for="registered-number" className="form-label">Business Registered Number</label>
                            <input type="text" className="form-control form-control-sm" name="registered-number" id="registered-number" maxLength="60" minLength="5"/>
                        </div>

                        <div className="mb-3">
                            <label for="industry-sector" className="form-label">Industry Sector</label>
                                <select id="industry-sector" name="industry-sector" className="form-control form-control-sm">
                                    <option value="">-- Select Industry Sector --</option>
                                    <option value="Information Technology">Information Technology</option>
                                </select>
                        </div>

                        <div className="mb-3">
                            <label for="company-size" className="form-label">Company Size (number of employees)</label>
                            <select name="company-size" id="company-size" className="form-control form-control-sm">
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
                            <label for="location" className="form-label">Location</label>
                            <input type="text" className="form-control form-control-sm" name="location" id="location" />
                            
                        </div>
                        
                        
                        <div className="mb-3">
                            <label for="company-website" className="form-label">Company Website</label>
                            <input type="text" className="form-control form-control-sm" name="company-website" id="company-website" maxLength="60" minLength="5"/>
                            
                        </div>
                        
                        <div className="mb-3">
                            <label for="company-description" className="form-label">Company Description</label>
                            <textarea id="company-description" className="form-control" name="company-description" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                        </div>        
                        
                    </div>

                </div>

        </div>
    );
};

export default CompanyInfo;