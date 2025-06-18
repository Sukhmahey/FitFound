import { useState } from "react";

const CompanyInfo = () => {

    return (
        <div class="container">
            <h4>Company Info</h4>
            <form>
                <div class="row">

                    {/* LEFT COLUMN */}
                    <div class="col">
                        <div class="mb-3">
                            <label for="company-name" class="form-label">Company Name</label>
                            <input type="text" class="form-control form-control-sm" name="company-name" id="company-name" maxLength="60" minLength="5"/>
                        </div>
                        
                        <div class="mb-3">
                            <label for="year-established" class="form-label">Established In (Year)</label>
                            <input type="number" class="form-control form-control-sm" name="year-established" id="year-established" min="1000" max={ new Date().getFullYear() }/>
                        </div>

                        <div class="mb-3">
                            <label for="registered-number" class="form-label">Business Registered Number</label>
                            <input type="text" class="form-control form-control-sm" name="registered-number" id="registered-number" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="industry-sector" class="form-label">Industry Sector</label>
                                <select id="industry-sector" name="industry-sector" class="form-control form-control-sm">
                                    <option value="">-- Select Industry Sector --</option>
                                    <option value="software_consulting">Software Consulting</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                </select>
                        </div>

                        <div class="mb-3">
                            <label for="company-size" class="form-label">Company Size (number of employees)</label>
                            <select name="company-size" id="company-size" class="form-control form-control-sm">
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
                    <div class="col">
                        <div class="mb-3">
                            <label for="location" class="form-label">Location</label>
                            <input type="text" class="form-control form-control-sm" name="location" id="location" />
                            
                        </div>
                        
                        
                        <div class="mb-3">
                            <label for="company-website" class="form-label">Company Website</label>
                            <input type="text" class="form-control form-control-sm" name="company-website" id="company-website" maxLength="60" minLength="5"/>
                            
                        </div>
                        
                        <div class="mb-3">
                            <label for="company-description" class="form-label">Company Description</label>
                            <textarea id="company-description" class="form-control" name="company-description" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                        </div>        
                        
                    </div>

                </div>
                
                <div class="d-flex justify-content-end gap-4">
                    <input type="reset" value="Cancel" class="btn btn-secondary btn-sm mb-3" />
                    <input type="submit" value="save" class="btn btn-primary btn-sm mb-3" />
                </div>
            </form>
        </div>
    );
};

export default CompanyInfo;