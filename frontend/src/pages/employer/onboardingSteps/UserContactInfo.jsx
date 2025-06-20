const UserContactInfo = () => {
    return (
        <div class="container">

                <div class="row">

                    {/* LEFT COLUMN */}
                    <div class="col-md-6">

                        <div class="mb-3">
                            <label for="first-name" class="form-label">First Name</label>
                            <input type="text" class="form-control form-control-sm" name="first-name" id="first-name" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="middle-name" class="form-label">Middle Name (Optional)</label>
                            <input type="text" class="form-control form-control-sm" name="middle-name" id="middle-name" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="last-name" class="form-label">Last Name</label>
                            <input type="text" class="form-control form-control-sm" name="last-name" id="last-name" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone  Number</label>
                            <input type="text" class="form-control form-control-sm" name="phone" id="phone" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Work Email Address</label>
                            <input type="email" class="form-control form-control-sm" name="email" id="email" maxLength="60" minLength="5"/>
                        </div>

                    </div>

                    {/* RIGTH COLUMN */}
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="job-title" class="form-label">Designation / Job Title</label>
                            <input type="text" class="form-control form-control-sm" name="job-title" id="job-title" maxLength="60" minLength="5"/>
                        </div>

                        <div class="mb-3">
                            <label for="linkedin-url" class="form-label">LinkedIn Profile</label>
                            <input type="text" class="form-control form-control-sm" name="linkedin-url" id="linkedin-url" maxLength="60" minLength="5"/>
                        </div>

                        {/* <div class="mb-3">
                            <label for="additional-details" class="form-label">Additional Details (optional)</label>
                            <textarea class="form-control" id="additional-details" name="additional-details" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                        </div> */}
                    </div>

                {/* ROW END */}
                </div>

                
        </div>
    );

};

export default UserContactInfo;