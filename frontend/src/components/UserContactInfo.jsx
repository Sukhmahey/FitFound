const UserContactInfo = () => {
    return (
        <div>
            <h1>Contact Info</h1>
            <form>
                <label>
                    Full Name
                    <input type="text" name="full-name" id="full-name" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Designation / Job Title
                    <input type="text" name="job-title" id="job-title" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Work Email Address
                    <input type="email" name="email" id="email" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Phone  Number
                    <input type="text" name="phone" id="phone" maxLength="60" minLength="5"/>
                </label>

                <label>
                    LinkedIn Profile
                    <input type="text" name="linkedin-url" id="linkedin-url" maxLength="60" minLength="5"/>
                </label>

                <label>
                    Additional Details (optional)
                    <textarea id="additional-details" name="additional-details" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                </label>

                <div>
                    <input type="submit" value="save" />
                </div>
            </form>
        </div>
    );

};

export default UserContactInfo;