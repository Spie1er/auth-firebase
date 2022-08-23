import { useRef, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInput = useRef();
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredNewPassword = newPasswordInput.current.value;

    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBDdTrgW6XCOZLPFwlMF24UPdZki3MfRXI",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        setIsLoading(false);

        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Password Change Failed!";

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        setSuccess(true);
        setTimeout(() => {
          history.push("/");
          setSuccess(false);
        }, 2000);
      })
      .catch((err) => alert(err));
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {!success && (
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordInput} />
        </div>
      )}
      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <p>Loading...</p>}
        {success && (
          <h2
            className={classes.green}
          >{`Your Password Sucessfully Changed.`}</h2>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
