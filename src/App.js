import { FileText, Phone, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    idNo: "",
    date: "",
    scheme: "",
    nameOfCustomer: "",
    gender: "",
    dob: "",
    nationality: "",
    occupation: "",
    qualification: "",
    panNo: "",
    communicationAddress: "",
    mobileNo: "",
    landLineNo: "",
    pincode: "",
    email: "",
    fatherOrHusbandName: "",
    motherName: "",
    nomineeName: "",
    nomineeAge: "",
    introducerName: "",
    introducerMobileNo: "",
    cedName: "",
    cedMobile: "",
    ddName: "",
  });
  // ✅ Add these states at the top of your component
  const [showSchemePopup, setShowSchemePopup] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(""); // ✅ Store selected scheme temporarily
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Auto-fill ID and Date when page loads
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // ✅ YYYY-MM-DD format
    const uniqueId = `LIFE-${Date.now()}`; // ✅ Simple unique ID based on timestamp

    setFormData((prev) => ({
      ...prev,
      idNo: uniqueId, // ✅ Sets auto-generated ID
      date: today, // ✅ Sets today's date
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/\D/g, "") : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
        // if (!formData.idNo) newErrors.idNo = "Application ID is required";
    // if (!formData.date) newErrors.date = "Application date is required";
    // if (!formData.scheme) newErrors.scheme = "Please select a scheme";
    if (!formData.nameOfCustomer) newErrors.nameOfCustomer = "Full name is required";
    // if (!formData.gender) newErrors.gender = "Please select your gender";
    // if (!formData.dob) newErrors.dob = "Date of birth is required";
    // if (!formData.nationality) newErrors.nationality = "Nationality is required";
    // if (!formData.occupation) newErrors.occupation = "Occupation is required";
    // if (!formData.qualification) newErrors.qualification = "Qualification is required";
    // if (!formData.panNo) newErrors.panNo = "PAN number is required";
    if (!formData.communicationAddress) newErrors.communicationAddress = "Address is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    // if (!formData.pincode) newErrors.pincode = "PIN code is required";
    // if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit PIN code";
    if (!formData.email) newErrors.email = "Email address is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address";
    // if (!formData.fatherOrHusbandName) newErrors.fatherOrHusbandName = "Father's / Husband's name is required";
    // if (!formData.motherName) newErrors.motherName = "Mother's name is required";
    // if (!formData.nomineeName) newErrors.nomineeName = "Nominee name is required";
    // if (!formData.nomineeAge) newErrors.nomineeAge = "Nominee age is required";
    if (!formData.introducerName) newErrors.introducerName = "Introducer name is required";
    // if (!formData.introducerMobileNo) newErrors.introducerMobileNo = "Introducer mobile is required";
    // if (!/^\d{10}$/.test(formData.introducerMobileNo)) newErrors.introducerMobileNo = "Enter a valid 10-digit mobile number";
    // if (!formData.cedName) newErrors.cedName = "CED name is required";
    // if (!formData.cedMobile) newErrors.cedMobile = "CED mobile is required";
    // if (!/^\d{10}$/.test(formData.cedMobile)) newErrors.cedMobile = "Enter a valid 10-digit mobile number";
    // if (!formData.ddName) newErrors.ddName = "DD name is required"; 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Modify your handleSubmit (instead of sending directly to backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before opening scheme popup
    if (!validateForm()) {
      return; // Don't open popup if validation fails
    }
    
    setShowSchemePopup(true); // ✅ Open popup only after validation passes
  };

  // ✅ After scheme is selected, open reference popup
  const handleSchemeSubmit = () => {
    if (!selectedScheme) {
      alert("Please select a scheme");
      return;
    }
    
    // Close scheme popup and open reference popup
    setShowSchemePopup(false);
    setShowReferencePopup(true);
  };

  // ✅ Final submission after reference ID is entered
  const handleFinalSubmit = async () => {
    if (!referenceId.trim()) {
      alert("Please enter a reference ID");
      return;
    }

    // construct the final payload here
    const payload = {
      ...formData,
      scheme: selectedScheme,
      referenceId: referenceId.trim(),
    };

    // Optional: set loading state
    setIsSubmitting(true);

    try {
      const baseUrl = process.env.REACT_APP_API_URL
      const res = await fetch(
        baseUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // send the payload directly
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Form Submitted:", data);
      alert("Application submitted successfully!");

      // reset form back to initial shape (not empty object)
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        ...Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: "" }),
          {}
        ),
        idNo: `LIFE-${Date.now()}`,
        date: today,
        scheme: "", // reset scheme too
      });

      setSelectedScheme("");
      setReferenceId("");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowReferencePopup(false);
    }
  };

  // ✅ Reset popup scheme selection when closing
  const handlePopupClose = () => {
    setSelectedScheme(""); // ✅ Clear previously chosen Scheme 1 / 2
    setReferenceId(""); // ✅ Clear reference ID
    setShowSchemePopup(false);
    setShowReferencePopup(false);
  };
  /*   const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://customer-form-8auo.onrender.com/api/life/saving/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      console.log("Form Submitted:", result);
      alert("Application submitted successfully!");
      setFormData({});
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }; */

  return (
    <div className="app-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <div className="company-logo">
            <img src="/log.jpg" alt="life logo" width={30} height={30} />
          </div>
          <h1 className="company-title">Life Alliance Enterprises</h1>
          <p className="form-subtitle">Life Savings Scheme Application Form</p>
          <div className="title-underline"></div>
        </div>

        <div className="form-card">
          <div className="form-body">
            {/* Application Details */}
            <h2 className="section-title">
              <FileText className="section-icon" /> Application Details
            </h2>
            <div className="grid-2">
              <div className="input-field">
                <label>Application ID</label>
                <input
                  type="text"
                  name="idNo"
                  placeholder="Enter application ID"
                  value={formData.idNo || ""}
                  onChange={handleChange}
                  disabled
                />
                {errors.idNo && <span className="error">{errors.idNo}</span>}
              </div>
              <div className="input-field">
                <label>Application Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleChange}
                  disabled
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
            </div>
            {/*  <div className="input-field">
              <label>Scheme Type</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="scheme"
                    value="schema1"
                    checked={formData.scheme === "schema1"}
                    onChange={handleChange}
                  />
                  schema1
                </label>
                <label>
                  <input
                    type="radio"
                    name="scheme"
                    value="schema2"
                    checked={formData.scheme === "schema2"}
                    onChange={handleChange}
                  />
                  schema2
                </label>
              </div>
              {errors.scheme && <span className="error">{errors.scheme}</span>}
            </div> */}

            {/* Personal Info */}
            <h2 className="section-title">
              <User className="section-icon" /> Personal Information
            </h2>
            <div className="input-field">
              <label>Full Name <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                name="nameOfCustomer"
                placeholder="Enter your full name"
                value={formData.nameOfCustomer || ""}
                onChange={handleChange}
              />
              {errors.nameOfCustomer && (
                <span className="error">{errors.nameOfCustomer}</span>
              )}
            </div>
            <div className="input-field">
              <label>Gender</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

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
                  placeholder="e.g., Indian"
                  value={formData.nationality || ""}
                  onChange={handleChange}
                />
                {errors.nationality && (
                  <span className="error">{errors.nationality}</span>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="Enter your occupation"
                  value={formData.occupation || ""}
                  onChange={handleChange}
                />
                {errors.occupation && (
                  <span className="error">{errors.occupation}</span>
                )}
              </div>
              <div className="input-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="Educational qualification"
                  value={formData.qualification || ""}
                  onChange={handleChange}
                />
                {errors.qualification && (
                  <span className="error">{errors.qualification}</span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label>PAN Number</label>
              <input
                type="text"
                name="panNo"
                placeholder="ABCDE1234F"
                value={formData.panNo || ""}
                onChange={handleChange}
              />
              {errors.panNo && <span className="error">{errors.panNo}</span>}
            </div>

            {/* Contact Info */}
            <h2 className="section-title">
              <Phone className="section-icon" /> Contact Information
            </h2>
            <div className="input-field">
              <label>Communication Address <span style={{ color: "red" }}>*</span></label>
              <textarea
                name="communicationAddress"
                placeholder="Enter your complete address"
                rows="3"
                value={formData.communicationAddress || ""}
                onChange={handleChange}
              />
              {errors.communicationAddress && (
                <span className="error">{errors.communicationAddress}</span>
              )}
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Mobile Number <span style={{ color: "red" }}>*</span></label>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="10-digit mobile number"
                  value={formData.mobileNo || ""}
                  onChange={handleChange}
                />
                {errors.mobileNo && (
                  <span className="error">{errors.mobileNo}</span>
                )}
              </div>
              <div className="input-field">
                <label>Landline Number</label>
                <input
                  type="tel"
                  name="landLineNo"
                  placeholder="Landline with STD code"
                  value={formData.landLineNo || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit PIN code"
                  value={formData.pincode || ""}
                  onChange={handleChange}
                />
                {errors.pincode && (
                  <span className="error">{errors.pincode}</span>
                )}
              </div>
              <div className="input-field">
                <label>Email Address <span style={{ color: "red" }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            {/* Introducer Info */}
            <h2 className="section-title">
              <Users className="section-icon" /> Introducer & Reference Details
            </h2>
            <div className="grid-2">
              <div className="input-field">
                <label>Introducer Name <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="introducerName"
                  value={formData.introducerName || ""}
                  onChange={handleChange}
                />
                {errors.introducerName && (
                  <span className="error">{errors.introducerName}</span>
                )}
              </div>
              <div className="input-field">
                <label>Introducer Mobile</label>
                <input
                  type="tel"
                  name="introducerMobileNo"
                  value={formData.introducerMobileNo || ""}
                  onChange={handleChange}
                />
                {errors.introducerMobileNo && (
                  <span className="error">{errors.introducerMobileNo}</span>
                )}
              </div>
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
                {errors.cedName && (
                  <span className="error">{errors.cedName}</span>
                )}
              </div>
              <div className="input-field">
                <label>CED Mobile</label>
                <input
                  type="tel"
                  name="cedMobile"
                  value={formData.cedMobile || ""}
                  onChange={handleChange}
                />
                {errors.cedMobile && (
                  <span className="error">{errors.cedMobile}</span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label>DD Name</label>
              <input
                type="text"
                name="ddName"
                value={formData.ddName || ""}
                onChange={handleChange}
              />
              {errors.ddName && <span className="error">{errors.ddName}</span>}
            </div>

            {/* Family Info */}
            <h2 className="section-title">
              <Users className="section-icon" /> Family & Nominee Details
            </h2>
            <div className="grid-2">
              <div className="input-field">
                <label>Father's / Husband's Name</label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName || ""}
                  onChange={handleChange}
                />
                {errors.fatherOrHusbandName && (
                  <span className="error">{errors.fatherOrHusbandName}</span>
                )}
              </div>
              <div className="input-field">
                <label>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ""}
                  onChange={handleChange}
                />
                {errors.motherName && (
                  <span className="error">{errors.motherName}</span>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Nominee's Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName || ""}
                  onChange={handleChange}
                />
                {errors.nomineeName && (
                  <span className="error">{errors.nomineeName}</span>
                )}
              </div>
              <div className="input-field">
                <label>Nominee's Age</label>
                <input
                  type="number"
                  name="nomineeAge"
                  value={formData.nomineeAge || ""}
                  onChange={handleChange}
                />
                {errors.nomineeAge && (
                  <span className="error">{errors.nomineeAge}</span>
                )}
              </div>
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
              {isSubmitting
                ? "Processing Application..."
                : "Submit Application"}
            </button>
            <p className="form-disclaimer">
              By submitting this form, you agree to our terms and conditions and
              privacy policy.
            </p>
          </div>
        </div>
        {/* ✅ Scheme Selection Popup - replace your existing popup JSX with this */}
        {showSchemePopup && (
          <div className="modal-overlay">
            <div
              className="modal-box"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <h2
                id="modal-title"
                style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}
              >
                Select Scheme Type
              </h2>

              <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                <button
                  type="button"
                  className={`modal-scheme-btn ${
                    selectedScheme === "Scheme 1" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedScheme("Scheme 1")}
                >
                  Scheme 1
                </button>

                <button
                  type="button"
                  className={`modal-scheme-btn ${
                    selectedScheme === "Scheme 2" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedScheme("Scheme 2")}
                >
                  Scheme 2
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-action-btn"
                  onClick={handlePopupClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-action-btn primary"
                  onClick={handleSchemeSubmit}
                  disabled={!selectedScheme}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Reference ID Popup */}
        {showReferencePopup && (
          <div className="modal-overlay">
            <div
              className="modal-box"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reference-modal-title"
            >
              <h2
                id="reference-modal-title"
                style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}
              >
                Enter Reference ID
              </h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14,}}>
                  Reference ID
                </label>
                <input
                  type="text"
                  placeholder="Enter reference ID"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-action-btn"
                  onClick={handlePopupClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-action-btn primary"
                  onClick={handleFinalSubmit}
                  disabled={!referenceId.trim() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="app-footer">
          <p>
            © {new Date().getFullYear()} Life Alliance Enterprises. All rights
            reserved.
          </p>
          <p>For assistance, contact our customer support team.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
