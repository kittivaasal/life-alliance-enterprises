import { useState } from "react";
import { User, Phone, FileText, Users, Shield } from "lucide-react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    plotNo: "",
    date: "",
    nameOfCustomer: "",
    gender: "",
    projectArea: "",
    nationality: "",
    dob: "",
    occupation: "",
    qualification: "",
    planNo: "",
    communicationAddress: "",
    pincode: "",
    mobileNo: "",
    landLineNo: "",
    email: "",
    fatherOrHusbandName: "",
    motherName: "",
    nomineeName: "",
    nomineeAge: "",
    nomineeRelationship: "",
    nameOfGuardian: "",
    so_wf_do: "",
    relationshipWithCustomer: "",
    address: "",
    introducerName: "",
    introducerMobileNo: "",
    immSupervisorName: "",
    cedName: "",
    diamountDirectorName: "",
    diamountDirectorPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/\D/g, "") : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "plotNo", "date", "nameOfCustomer", "gender", "projectArea",
      "nationality", "dob", "occupation", "qualification", "planNo",
      "communicationAddress", "pincode", "mobileNo", "email",
      "fatherOrHusbandName", "motherName", "nomineeName", "nomineeAge",
      "nomineeRelationship", "nameOfGuardian", "so_wf_do", "relationshipWithCustomer",
      "address", "introducerName", "introducerMobileNo", "immSupervisorName",
      "cedName", "diamountDirectorName", "diamountDirectorPhone"
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Basic validations
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";

    if (formData.introducerMobileNo && !/^\d{10}$/.test(formData.introducerMobileNo))
      newErrors.introducerMobileNo = "Enter a valid 10-digit mobile number";

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit PIN code";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (formData.diamountDirectorPhone && !/^\d{10}$/.test(formData.diamountDirectorPhone))
      newErrors.diamountDirectorPhone = "Enter a valid 10-digit phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://customer-form-8auo.onrender.com/api/plot/booking/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      console.log("Form Submitted:", result);
      alert("Plot booking submitted successfully!");
      setFormData({});
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <div className="company-logo">
            <Shield className="logo-icon" />
          </div>
          <h1 className="company-title">Life Housing & Properties</h1>
          <p className="form-subtitle">Plot Booking Form</p>
          <div className="title-underline"></div>
        </div>

        <div className="form-card">
          <div className="form-body">
            <h2 className="section-title">
              <FileText className="section-icon" /> Plot & Customer Details
            </h2>
            <div className="grid-2">
              <div className="input-field">
                <label>Plot Number</label>
                <input
                  type="text"
                  name="plotNo"
                  value={formData.plotNo || ""}
                  onChange={handleChange}
                />
                {errors.plotNo && <span className="error">{errors.plotNo}</span>}
              </div>
              <div className="input-field">
                <label>Booking Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>Customer Name</label>
              <input
                type="text"
                name="nameOfCustomer"
                value={formData.nameOfCustomer || ""}
                onChange={handleChange}
              />
              {errors.nameOfCustomer && <span className="error">{errors.nameOfCustomer}</span>}
            </div>

            <div className="input-field">
              <label>Gender</label>
              <div>
                {["Male", "Female", "Other"].map(g => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

            <div className="input-field">
              <label>Project Area</label>
              <input
                type="text"
                name="projectArea"
                value={formData.projectArea || ""}
                onChange={handleChange}
              />
              {errors.projectArea && <span className="error">{errors.projectArea}</span>}
            </div>

            {/* Personal Info Grid */}
            <div className="grid-2">
              <div className="input-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
                {errors.dob && <span className="error">{errors.dob}</span>}
              </div>
              <div className="input-field">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleChange}
                />
                {errors.nationality && <span className="error">{errors.nationality}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation || ""}
                  onChange={handleChange}
                />
                {errors.occupation && <span className="error">{errors.occupation}</span>}
              </div>
              <div className="input-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ""}
                  onChange={handleChange}
                />
                {errors.qualification && <span className="error">{errors.qualification}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>Plan Number</label>
              <input
                type="text"
                name="planNo"
                value={formData.planNo || ""}
                onChange={handleChange}
              />
              {errors.planNo && <span className="error">{errors.planNo}</span>}
            </div>

            {/* Contact Info */}
            <div className="input-field">
              <label>Communication Address</label>
              <textarea
                name="communicationAddress"
                value={formData.communicationAddress || ""}
                onChange={handleChange}
              />
              {errors.communicationAddress && <span className="error">{errors.communicationAddress}</span>}
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={handleChange}
                />
                {errors.pincode && <span className="error">{errors.pincode}</span>}
              </div>
              <div className="input-field">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo || ""}
                  onChange={handleChange}
                />
                {errors.mobileNo && <span className="error">{errors.mobileNo}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* Family & Nominee */}
            <div className="grid-2">
              <div className="input-field">
                <label>Father / Husband Name</label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName || ""}
                  onChange={handleChange}
                />
                {errors.fatherOrHusbandName && <span className="error">{errors.fatherOrHusbandName}</span>}
              </div>
              <div className="input-field">
                <label>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ""}
                  onChange={handleChange}
                />
                {errors.motherName && <span className="error">{errors.motherName}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Nominee Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName || ""}
                  onChange={handleChange}
                />
                {errors.nomineeName && <span className="error">{errors.nomineeName}</span>}
              </div>
              <div className="input-field">
                <label>Nominee Age</label>
                <input
                  type="number"
                  name="nomineeAge"
                  value={formData.nomineeAge || ""}
                  onChange={handleChange}
                />
                {errors.nomineeAge && <span className="error">{errors.nomineeAge}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Nominee Relationship</label>
                <input
                  type="text"
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship || ""}
                  onChange={handleChange}
                />
                {errors.nomineeRelationship && <span className="error">{errors.nomineeRelationship}</span>}
              </div>
              <div className="input-field">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="nameOfGuardian"
                  value={formData.nameOfGuardian || ""}
                  onChange={handleChange}
                />
                {errors.nameOfGuardian && <span className="error">{errors.nameOfGuardian}</span>}
              </div>
            </div>

            {/* Address & Relationships */}
            <div className="grid-2">
              <div className="input-field">
                <label>S/O, W/O, D/O</label>
                <input
                  type="text"
                  name="so_wf_do"
                  value={formData.so_wf_do || ""}
                  onChange={handleChange}
                />
                {errors.so_wf_do && <span className="error">{errors.so_wf_do}</span>}
              </div>
              <div className="input-field">
                <label>Relationship With Customer</label>
                <input
                  type="text"
                  name="relationshipWithCustomer"
                  value={formData.relationshipWithCustomer || ""}
                  onChange={handleChange}
                />
                {errors.relationshipWithCustomer && <span className="error">{errors.relationshipWithCustomer}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            {/* Introducer & Officers */}
            <div className="grid-2">
              <div className="input-field">
                <label>Introducer Name</label>
                <input
                  type="text"
                  name="introducerName"
                  value={formData.introducerName || ""}
                  onChange={handleChange}
                />
                {errors.introducerName && <span className="error">{errors.introducerName}</span>}
              </div>
              <div className="input-field">
                <label>Introducer Mobile</label>
                <input
                  type="tel"
                  name="introducerMobileNo"
                  value={formData.introducerMobileNo || ""}
                  onChange={handleChange}
                />
                {errors.introducerMobileNo && <span className="error">{errors.introducerMobileNo}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>IMM Supervisor Name</label>
              <input
                type="text"
                name="immSupervisorName"
                value={formData.immSupervisorName || ""}
                onChange={handleChange}
              />
              {errors.immSupervisorName && <span className="error">{errors.immSupervisorName}</span>}
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>CED Name</label>
                <input
                  type="text"
                  name="cedName"
                  value={formData.cedName || ""}
                  onChange={handleChange}
                />
                {errors.cedName && <span className="error">{errors.cedName}</span>}
              </div>
              <div className="input-field">
                <label>Director Name</label>
                <input
                  type="text"
                  name="diamountDirectorName"
                  value={formData.diamountDirectorName || ""}
                  onChange={handleChange}
                />
                {errors.diamountDirectorName && <span className="error">{errors.diamountDirectorName}</span>}
              </div>
            </div>

            <div className="input-field">
              <label>Director Phone</label>
              <input
                type="tel"
                name="diamountDirectorPhone"
                value={formData.diamountDirectorPhone || ""}
                onChange={handleChange}
              />
              {errors.diamountDirectorPhone && <span className="error">{errors.diamountDirectorPhone}</span>}
            </div>
          </div>

          {/* Submit */}
          <div className="form-footer">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? "Processing..." : "Submit Plot Booking"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="app-footer">
          <p>© {new Date().getFullYear()} Life Housing & Properties. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
