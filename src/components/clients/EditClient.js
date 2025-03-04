import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clientAxios, authHeader } from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const EditClient = () => {
  const [auth, setAuth] = useContext(CRMContext);

  const navigate = useNavigate();

  !auth.auth ? navigate("/login") : console.log();
  /**
   *  This function sets initial state
   *  editClient = state  setEditClient = setState
   */
  const [editClient, setEditClient] = useState({
    name: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
  });

  /**
   *  useEffect
   */
  useEffect(() => {
    APIcall();
  }, []);

  const { pathname } = useLocation();

  /**
   *  This function takes the id from the  URL
   */
  const getIdFromURL = () => {
    const pathSplit = pathname.split("/");
    return pathSplit[pathSplit.length - 1];
  };

  /**
   *  This function gets client from the api
   */
  const APIcall = async () => {
    const clientReq = await clientAxios.get(
      `/clients/${getIdFromURL()}`,
      authHeader(localStorage.getItem("token"))
    );
    setEditClient(clientReq.data);
  };

  /**
   *  This function handle input change
   */
  const handleChange = (e) => {
    setEditClient({
      //* actual state
      ...editClient,
      [e.target.name]: e.target.value,
    });
  };

  /**
   *  This function handle form submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    clientAxios
      .put(
        `/clients/${getIdFromURL()}`,
        editClient,
        authHeader(localStorage.getItem("token"))
      )
      .then((res) => {
        if (res.data.code === 11000) {
          Swal.fire("Something went wrong!", "Error in Database", "error");
        } else {
          Swal.fire("Client edited", res.data.message, "success");
        }
        navigate("/");
      });
  };

  /**
   *  This function validate that any input is empty
   */
  const validateForm = () => {
    const { name, lastName, company, email, phoneNumber } = editClient;
    //todo improve function
    let validate =
      !name.length ||
      !lastName.length ||
      !company.length ||
      !email.length ||
      !phoneNumber.length;

    return validate;
  };

  return (
    <div>
      <h2>Edit Client</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name client"
            name="name"
            value={editClient.name}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Last Name:</label>
          <input
            type="text"
            placeholder="Apellido client"
            name="lastName"
            value={editClient.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Company:</label>
          <input
            type="text"
            placeholder="company client"
            name="company"
            value={editClient.company}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email client"
            name="email"
            value={editClient.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Phone Number:</label>
          <input
            type="text"
            placeholder="Teléfono client"
            name="phoneNumber"
            value={editClient.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-blue"
            value="Add Client"
            disabled={validateForm()}
          />
        </div>
      </form>
    </div>
  );
};

export default EditClient;
