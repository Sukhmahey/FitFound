import { useState } from "react";

const CompanyInfo = () => {

    return (
        <div>
            <h1>Company Info</h1>
            <form action="">
                
                <label>
                    Company Name
                    <input type="text" name="company-name" id="company-name" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Established In (Year)
                    <input type="number" name="" id="" min="1000" max={ new Date().getFullYear() }/>
                </label>

                <label>
                    Business Registered Number
                    <input type="text" name="registered-number" id="registered-number" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Industry Sector
                    <select id="industry-sector" name="industry-sector">
                        <option value="">-- Select Industry Sector --</option>
                        <option value="software_consulting">Software Consulting</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                    </select>
                </label>

                <label>
                    Company Size (number of employees)
                    <select name="company-size" id="company-size">
                        <option value="">-- Select Company Size --</option>
                        <option value="1-10">1–10 employees</option>
                        <option value="11-50">11–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                        <option value="201-500">201–500 employees</option>
                        <option value="501-1000">501–1,000 employees</option>
                        <option value="1001+">1,001+ employees</option>
                    </select>
                </label>

                <label>
                    Headquarters Address (with optional branches)
                    <input type="text" name="" id="" />
                </label>
                
                <label>
                    Company Website
                    <input type="text" name="company-website" id="company-website" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Company Description
                    <textarea id="company-description" name="company-description" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                </label>

                <div>
                    <input type="reset" value="Cancel" />
                    <input type="submit" value="save" />
                </div>
            </form>
        </div>
    );
};

export default CompanyInfo;