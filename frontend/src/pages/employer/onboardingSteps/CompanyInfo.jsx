import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const CompanyInfo = () => {
    const { register, watch, setValue } = useFormContext();
    const [imageSrc, setImageSrc] = useState(  );
    const companyLogo = watch('companyLogo');

    // console.log(watch('companyLogo'));

    useEffect( () => {
        if (companyLogo) {
            setImageSrc(`${companyLogo}?t=${Date.now()}`);
        }
    }, [companyLogo]);

    const styles = {
        wrapper: {
        display: "block",
        width: "120px",
        height: "120px",
        border: "2px dashed #999",
        borderRadius: "8px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden"
        },
        input: {
        display: "none"
        },
        iconContainer: {
        width: "100%",
        height: "100%",
        display: "grid",
        placeContent: "center",
        position: "relative"
        },
        image: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: 0.8
        },
        arrow: {
        position: "absolute",
        bottom: "8px",
        right: "8px",
        fontSize: "20px",
        color: "#333"
        }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
        setValue("companyLogo", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    //   console.log(file);
    }
  };

    return (
        <div className="container">


                {/* Test Element */}
                <div>
                    <label htmlFor="companyLogo">
                        Company logo
                        <div style={styles.wrapper}>
                            <input type="file" accept="image/*" style={styles.input}
                                // {...register("companyLogo")}
                                name="companyLogo"
                                id="companyLogo"
                                
                                onChange={(e) => {
                                    handleImageChange(e); // Set preview
                                }} 
                            />
                            <div style={styles.iconContainer}>
                                <img src= { imageSrc } style={styles.image} />
                                <span style={styles.arrow}>⬆</span>
                            </div>
                        </div>
                    </label>
                </div>

                <div className="row">

                    {/* LEFT COLUMN */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="companyName" className="form-label">Company Name</label>
                            <input type="text" {...register("companyName")} className="form-control form-control-sm" name="companyName" id="companyName" maxLength="60" minLength="5"
                            />
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