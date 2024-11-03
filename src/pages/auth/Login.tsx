import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isAdmin, setCredentials } from "../../store/slice/authSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TextField, Button } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { login } from "../../api";
import React from "react";

const LoginBoxed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = async (data) => {
    try {
      const response = await login({
        email: data.Email.toLowerCase(),
        password: data.Password,
      });
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/");
      }
    } catch {
      toast.error(
        "Invalid Credentials Or You Haven't approved yet. Contact your Admin."
      );
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        backgroundImage: "url('/assets/images/auth/bg-gradient.png')",
        backgroundSize: "cover",
      }}
    >
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: "url('/assets/images/auth/map.png')",
          backgroundSize: "cover",
          opacity: 0.6,
        }}
      ></div>
      <Row
        className="w-100 max-w-870 position-relative"
        style={{
          backdropFilter: "blur(12px)",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
        }}
      >
        <Col md={12} className="text-center">
          <h1 className="display-6 font-weight-bold text-dark mb-3">Sign In</h1>
          <p className="text-dark mb-4">
            Enter your email and password to login
          </p>
        </Col>
        <Col md={12}>
          <form onSubmit={handleSubmit(submitForm)} className="p-3">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              placeholder="Enter Email"
              {...register("Email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.Email}
              helperText={errors.Email ? errors.Email.message : ""}
              className="mb-4"
              InputProps={{
                startAdornment: (
                  <Email style={{ color: "#000", marginRight: "10px" }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              placeholder="Enter Password"
              type="password"
              {...register("Password", { required: "Password is required" })}
              error={!!errors.Password}
              helperText={errors.Password ? errors.Password.message : ""}
              className="mb-4"
              InputProps={{
                startAdornment: (
                  <Lock style={{ color: "#000", marginRight: "10px" }} />
                ),
              }}
            />
            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/auth/forgot-password"
                className="text-decoration-none text-dark"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              fullWidth
              variant="contained"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px 0",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              type="submit"
              className="mb-4"
            >
              Sign In
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginBoxed;
