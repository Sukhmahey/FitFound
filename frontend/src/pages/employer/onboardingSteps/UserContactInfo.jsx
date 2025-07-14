import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const UserContactInfo = ({ errors }) => {
  const { register, watch, setValue } = useFormContext();
  const [imageSrc, setImageSrc] = useState(null);
  const profilePicture = watch("profilePicture");

  useEffect(() => {
    if (profilePicture) {
      setImageSrc(`${profilePicture}?t=${Date.now()}`);
    }
  }, [profilePicture]);

  const styles = {
    wrapper: {
      display: "block",
      width: "120px",
      height: "120px",
      border: "2px dashed #999",
      borderRadius: "8px",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    input: {
      display: "none",
    },
    iconContainer: {
      width: "100%",
      height: "100%",
      display: "grid",
      placeContent: "center",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      opacity: 0.8,
    },
    arrow: {
      position: "absolute",
      bottom: "8px",
      right: "8px",
      fontSize: "20px",
      color: "#333",
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("profilePicture", file, { shouldValidate: true });
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
      <div>
        <label htmlFor="profilePicture">
          Profile Picture
          <div style={styles.wrapper}>
            <input
              type="file"
              accept="image/*"
              style={styles.input}
              name="profilePicture"
              id="profilePicture"
              onChange={(e) => {
                handleImageChange(e); // Set preview
              }}
            />
            <div style={styles.iconContainer}>
              <img src={imageSrc} style={styles.image} />
              <span style={styles.arrow}>⬆</span>
            </div>
          </div>
        </label>
      </div>

      {/* <div className="row">
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
            </div> */}

      <div className="row">
        {/* LEFT COLUMN */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName")}
              className="form-control form-control-sm"
              name="firstName"
              id="firstName"
              maxLength="60"
              minLength="3"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="middleName" className="form-label">
              Middle Name (Optional)
            </label>
            <input
              type="text"
              {...register("middleName")}
              className="form-control form-control-sm"
              name="middleName"
              id="middleName"
              maxLength="60"
              minLength="5"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName")}
              className="form-control form-control-sm"
              name="lastName"
              id="lastName"
              maxLength="60"
              minLength="3"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              {...register("phone")}
              className="form-control form-control-sm"
              name="phone"
              id="phone"
              maxLength="60"
              minLength="5"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Work Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="form-control form-control-sm"
              name="email"
              id="email"
              maxLength="60"
              minLength="5"
            />
          </div>
        </div>

        {/* RIGTH COLUMN */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">
              Designation / Job Title
            </label>
            <input
              type="text"
              {...register("designation")}
              className="form-control form-control-sm"
              name="designation"
              id="designation"
              maxLength="60"
              minLength="5"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="linkedInProfile" className="form-label">
              LinkedIn Profile
            </label>
            <input
              type="text"
              {...register("linkedInProfile")}
              className="form-control form-control-sm"
              name="linkedInProfile"
              id="linkedInProfile"
              maxLength="60"
              minLength="5"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="additionalDetails" className="form-label">
              Additional Details (optional)
            </label>
            <textarea
              {...register("additionalDetails")}
              className="form-control"
              id="additionalDetails"
              name="additionalDetails"
              rows="4"
              cols="50"
              maxLength="600"
              minLength="50"
            ></textarea>
          </div>
        </div>

        {/* ROW END */}
      </div>
    </div>
  );
};

export default UserContactInfo;
