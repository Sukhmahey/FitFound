import { useFormContext } from "react-hook-form";

const UserContactInfo = () => {
    const { register, watch } = useFormContext();

    return (
        <div className="container">

            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                        <input type="file" {...register("profilePicture")} className="form-control form-control-sm" name="profilePicture" id="profilePicture" />
                        { watch('profilePicture') && (
                                <div>
                                <p></p>
                                <img src={ watch('profilePicture') } alt="Vista previa" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <div className="row">

                {/* LEFT COLUMN */}
                <div className="col-md-6">

                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" {...register("firstName")} className="form-control form-control-sm" name="firstName" id="firstName" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="middleName" className="form-label">Middle Name (Optional)</label>
                        <input type="text" {...register("middleName")} className="form-control form-control-sm" name="middleName" id="middleName" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" {...register("lastName")} className="form-control form-control-sm" name="lastName" id="lastName" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone  Number</label>
                        <input type="text" {...register("phone")} className="form-control form-control-sm" name="phone" id="phone" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Work Email Address</label>
                        <input type="email" {...register("email")} className="form-control form-control-sm" name="email" id="email" maxLength="60" minLength="5"/>
                    </div>

                </div>

                {/* RIGTH COLUMN */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Designation / Job Title</label>
                        <input type="text" {...register("designation")} className="form-control form-control-sm" name="designation" id="designation" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="linkedInProfile" className="form-label">LinkedIn Profile</label>
                        <input type="text" {...register("linkedInProfile")} className="form-control form-control-sm" name="linkedInProfile" id="linkedInProfile" maxLength="60" minLength="5"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="additionalDetails" className="form-label">Additional Details (optional)</label>
                        <textarea {...register("additionalDetails")} className="form-control" id="additionalDetails" name="additionalDetails" rows="4" cols="50" maxLength="600" minLength="50"></textarea>
                    </div>
                </div>

            {/* ROW END */}
            </div> 
        </div>
    );

};

export default UserContactInfo;