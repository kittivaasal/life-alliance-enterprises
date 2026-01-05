import { FileText, Phone, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    idNo: "",
    schemeNo: "", // ✅ Scheme number field
    scheme: "",
    nameOfCustomer: "",
    gender: "",
    dob: "",
    communicationAddress: "",
    mobileNo: "",
    email: "",
    nomineeName: "",
    nomineeAge: "",
    nomineeRelation: "", // ✅ Added Nominee Relationship
    introducedName: "",
    introducerMobileNo: "",
    cedName: "",
    cedMobile: "",
    ddName: "",
    ddMobile: "", // ✅ Added DD Mobile
  });
  // ✅ Popup state for reference ID only
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Old Scheme dropdown states
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [schemeSearchQuery, setSchemeSearchQuery] = useState("");
  const [isSchemeDropdownOpen, setIsSchemeDropdownOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // ✅ CED dropdown states
  const [cedList, setCedList] = useState([]);
  const [filteredCedList, setFilteredCedList] = useState([]);
  const [cedSearchQuery, setCedSearchQuery] = useState("");
  const [isCedDropdownOpen, setIsCedDropdownOpen] = useState(false);
  const [isLoadingCED, setIsLoadingCED] = useState(false);

  // ✅ DD dropdown states
  const [ddList, setDdList] = useState([]);
  const [filteredDdList, setFilteredDdList] = useState([]);
  const [ddSearchQuery, setDdSearchQuery] = useState("");
  const [isDdDropdownOpen, setIsDdDropdownOpen] = useState(false);
  const [isLoadingDD, setIsLoadingDD] = useState(false);

  // ✅ Auto-fill ID when page loads
  useEffect(() => {
    const uniqueId = `LIFE-${Date.now()}`;

    setFormData((prev) => ({
      ...prev,
      idNo: uniqueId,
    }));
  }, []);

  // ✅ Fetch all projects/schemes on component mount
  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5002";
    
    const fetchAllProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch(`${baseUrl}/api/project/get/all`);
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        const data = await response.json();
        const projects = Array.isArray(data) ? data : data.data || [];
        setAllProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("Failed to load schemes. Please refresh the page.");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    // ✅ Fetch CED List
    const fetchCEDList = async () => {
      setIsLoadingCED(true);
      try {
        const response = await fetch(`${baseUrl}/api/market/head/get/all?percentageName=C.E.D`);
        if (!response.ok) throw new Error(`Failed to fetch CED list: ${response.status}`);
        const data = await response.json();
        const cedData = Array.isArray(data) ? data : data.data || [];
        setCedList(cedData);
        setFilteredCedList(cedData);
      } catch (error) {
        console.error("Error fetching CED list:", error);
        alert("Failed to load CED names. Please refresh the page.");
      } finally {
        setIsLoadingCED(false);
      }
    };

    // ✅ Fetch DD List
    const fetchDDList = async () => {
      setIsLoadingDD(true);
      try {
        // ✅ Using 'DIAMOND DIRECTOR' based on user request (encoded as %20 for space)
        const response = await fetch(`${baseUrl}/api/market/head/get/all?percentageName=DIAMOND%20DIRECTOR`);
        if (!response.ok) throw new Error(`Failed to fetch DD list: ${response.status}`);
        const data = await response.json();
        const ddData = Array.isArray(data) ? data : data.data || [];
        setDdList(ddData);
        setFilteredDdList(ddData);
      } catch (error) {
        console.error("Error fetching DD list:", error);
        alert("Failed to load DD names. Please refresh the page.");
      } finally {
        setIsLoadingDD(false);
      }
    };

    fetchAllProjects();
    fetchCEDList();
    fetchDDList();
  }, []);

  // ✅ Filter projects based on search query (local search)
  useEffect(() => {
    if (!schemeSearchQuery.trim()) {
      setFilteredProjects(allProjects);
    } else {
      const query = schemeSearchQuery.toLowerCase();
      const filtered = allProjects.filter((project) => {
        const name = (project.name || project.projectName || project.schemeName || "").toLowerCase();
        const id = (project.id || project._id || "").toString().toLowerCase();
        return name.includes(query) || id.includes(query);
      });
      setFilteredProjects(filtered);
    }
  }, [schemeSearchQuery, allProjects]);

  // ✅ Filter CED list based on search query
  useEffect(() => {
    if (!cedSearchQuery.trim()) {
      setFilteredCedList(cedList);
    } else {
      const query = cedSearchQuery.toLowerCase();
      const filtered = cedList.filter((ced) => {
        const name = (ced.name || "").toLowerCase();
        const phone = (ced.phone || "").toString().toLowerCase();
        return name.includes(query) || phone.includes(query);
      });
      setFilteredCedList(filtered);
    }
  }, [cedSearchQuery, cedList]);

  // ✅ Filter DD list based on search query
  useEffect(() => {
    if (!ddSearchQuery.trim()) {
      setFilteredDdList(ddList);
    } else {
      const query = ddSearchQuery.toLowerCase();
      const filtered = ddList.filter((dd) => {
        const name = (dd.name || "").toLowerCase();
        const phone = (dd.phone || "").toString().toLowerCase();
        return name.includes(query) || phone.includes(query);
      });
      setFilteredDdList(filtered);
    }
  }, [ddSearchQuery, ddList]);

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
    if (!formData.nameOfCustomer) newErrors.nameOfCustomer = "Full name is required";
    if (!formData.schemeNo) newErrors.schemeNo = "Please select a scheme";
    if (!formData.nameOfCustomer) newErrors.nameOfCustomer = "Name is required";
    
    // Address validation commented out? If required uncomment
    if (!formData.communicationAddress) newErrors.communicationAddress = "Address is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    
    if (!formData.email) newErrors.email = "Email address is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address";
    
    if (!formData.introducerName) newErrors.introducerName = "Introducer name is required";
    
    // ✅ New Mandatory Fields
    if (!formData.introducerMobileNo) newErrors.introducerMobileNo = "Introducer mobile is required";
    if (!/^\d{10}$/.test(formData.introducerMobileNo)) newErrors.introducerMobileNo = "Enter a valid 10-digit mobile number";
    
    if (!formData.cedName) newErrors.cedName = "CED name is required";
    if (!formData.cedMobile) newErrors.cedMobile = "CED mobile is required";
    
    if (!formData.ddName) newErrors.ddName = "DD name is required";
    if (!formData.ddMobile) newErrors.ddMobile = "DD mobile is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form submission - go directly to reference popup
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before opening reference popup
    if (!validateForm()) {
      return;
    }
    
    // Open reference popup directly (no scheme popup needed)
    setShowReferencePopup(true);
  };

  // ✅ Final submission after reference ID is entered
  const handleFinalSubmit = async () => {
    if (!referenceId.trim()) {
      alert("Please enter a reference ID");
      return;
    }

    // construct the final payload - oldScheme is already in formData
    const payload = {
      ...formData,
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

      // reset form back to initial shape
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        ...Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: "" }),
          {}
        ),
        idNo: `LIFE-${Date.now()}`,
        date: today,
      });

      setReferenceId("");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowReferencePopup(false);
    }
  };

  // ✅ Reset popup when closing
  const handlePopupClose = () => {
    setReferenceId("");
    setShowReferencePopup(false);
  };
  
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

            {/* ✅ Scheme Dropdown - First Field */}
            <div className="input-field" style={{ position: "relative" }}>
              <label>Scheme <span style={{ color: "red" }}>*</span></label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder={isLoadingProjects ? "Loading schemes..." : "Search and select scheme"}
                  value={
                    formData.schemeNo
                      ? allProjects.find(p => (p.id || p._id) === formData.schemeNo)?.name ||
                        allProjects.find(p => (p.id || p._id) === formData.schemeNo)?.projectName ||
                        allProjects.find(p => (p.id || p._id) === formData.schemeNo)?.schemeName ||
                        formData.schemeNo
                      : schemeSearchQuery
                  }
                  onChange={(e) => {
                    setSchemeSearchQuery(e.target.value);
                    setIsSchemeDropdownOpen(true);
                  }}
                  onFocus={() => setIsSchemeDropdownOpen(true)}
                  disabled={isLoadingProjects}
                  style={{ paddingRight: "40px", width: "100%" }}
                />
                {formData.schemeNo && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, schemeNo: "" }));
                      setSchemeSearchQuery("");
                    }}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#e5e7eb",
                      border: "none",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: "1",
                      padding: "0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#d1d5db";
                      e.currentTarget.style.color = "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#e5e7eb";
                      e.currentTarget.style.color = "#6b7280";
                    }}
                  >
                    ✖
                  </button>
                )}
              </div>
              
              {/* Dropdown List */}
              {isSchemeDropdownOpen && !isLoadingProjects && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginTop: "4px",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id || project._id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, schemeNo: project.id || project._id }));
                          setSchemeSearchQuery("");
                          setIsSchemeDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f0f0f0",
                          backgroundColor: (formData.schemeNo === (project.id || project._id)) ? "#f0f8ff" : "white",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 
                            (formData.schemeNo === (project.id || project._id)) ? "#f0f8ff" : "white";
                        }}
                      >
                        {project.name || project.projectName || project.schemeName || "Unnamed Scheme"}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                      No schemes found
                    </div>
                  )}
                </div>
              )}
              
              {/* Click outside to close dropdown */}
              {isSchemeDropdownOpen && (
                <div
                  onClick={() => setIsSchemeDropdownOpen(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                />
              )}
            </div>

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
            </div>       

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
            <div className="grid-2">
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
                <label>Introducer Mobile <span style={{ color: "red" }}>*</span></label>
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
              {/* ✅ CED Name Dropdown */}
              <div className="input-field" style={{ position: "relative" }}>
                <label>CED Name <span style={{ color: "red" }}>*</span></label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder={isLoadingCED ? "Loading CED names..." : "Search and select CED"}
                    value={
                      formData.cedName
                        ? cedList.find(c => c._id === formData.cedName)?.name || formData.cedName
                        : cedSearchQuery
                    }
                    onChange={(e) => {
                      setCedSearchQuery(e.target.value);
                      setIsCedDropdownOpen(true);
                    }}
                    onFocus={() => setIsCedDropdownOpen(true)}
                    disabled={isLoadingCED}
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  {formData.cedName && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, cedName: "", cedMobile: "" }));
                        setCedSearchQuery("");
                      }}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                        padding: "0",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#d1d5db";
                        e.currentTarget.style.color = "#374151";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e5e7eb";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>
                
                {/* Dropdown List */}
                {isCedDropdownOpen && !isLoadingCED && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginTop: "4px",
                      zIndex: 1000,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {filteredCedList.length > 0 ? (
                      filteredCedList.map((ced) => (
                        <div
                          key={ced._id}
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              cedName: ced._id,
                              cedMobile: ced.phone || ""
                            }));
                            setCedSearchQuery("");
                            setIsCedDropdownOpen(false);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: (formData.cedName === ced._id) ? "#f0f8ff" : "white",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 
                              (formData.cedName === ced._id) ? "#f0f8ff" : "white";
                          }}
                        >
                          <div style={{ fontWeight: "500" }}>{ced.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>{ced.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                        No CED found
                      </div>
                    )}
                  </div>
                )}
                
                {/* Click outside to close dropdown */}
                {isCedDropdownOpen && (
                  <div
                    onClick={() => setIsCedDropdownOpen(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                )}
                {errors.cedName && (
                  <span className="error">{errors.cedName}</span>
                )}
              </div>
              
              {/* ✅ CED Mobile - Auto-filled and disabled */}
              <div className="input-field">
                <label>CED Mobile <span style={{ color: "red" }}>*</span></label>
                <input
                  type="tel"
                  name="cedMobile"
                  value={formData.cedMobile || ""}
                  disabled
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  placeholder="Auto-filled from CED selection"
                />
                {errors.cedMobile && (
                  <span className="error">{errors.cedMobile}</span>
                )}
              </div>
            </div>

            <div className="grid-2">
              {/* ✅ DD Name Dropdown */}
              <div className="input-field" style={{ position: "relative" }}>
                <label>DD Name <span style={{ color: "red" }}>*</span></label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder={isLoadingDD ? "Loading DD names..." : "Search and select DD"}
                    value={
                      formData.ddName
                        ? ddList.find(d => d._id === formData.ddName)?.name || formData.ddName
                        : ddSearchQuery
                    }
                    onChange={(e) => {
                      setDdSearchQuery(e.target.value);
                      setIsDdDropdownOpen(true);
                    }}
                    onFocus={() => setIsDdDropdownOpen(true)}
                    disabled={isLoadingDD}
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  {formData.ddName && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, ddName: "", ddMobile: "" }));
                        setDdSearchQuery("");
                      }}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                        padding: "0",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#d1d5db";
                        e.currentTarget.style.color = "#374151";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e5e7eb";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>
                
                {/* Dropdown List */}
                {isDdDropdownOpen && !isLoadingDD && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginTop: "4px",
                      zIndex: 1000,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {filteredDdList.length > 0 ? (
                      filteredDdList.map((dd) => (
                        <div
                          key={dd._id}
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              ddName: dd._id,
                              ddMobile: dd.phone || ""
                            }));
                            setDdSearchQuery("");
                            setIsDdDropdownOpen(false);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: (formData.ddName === dd._id) ? "#f0f8ff" : "white",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 
                              (formData.ddName === dd._id) ? "#f0f8ff" : "white";
                          }}
                        >
                          <div style={{ fontWeight: "500" }}>{dd.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>{dd.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                        No DD found
                      </div>
                    )}
                  </div>
                )}
                
                {/* Click outside to close dropdown */}
                {isDdDropdownOpen && (
                  <div
                    onClick={() => setIsDdDropdownOpen(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                )}
                {errors.ddName && <span className="error">{errors.ddName}</span>}
              </div>

              {/* ✅ DD Mobile - Auto-filled and disabled */}
              <div className="input-field">
                <label>DD Mobile <span style={{ color: "red" }}>*</span></label>
                <input
                  type="tel"
                  name="ddMobile"
                  value={formData.ddMobile || ""}
                  disabled
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  placeholder="Auto-filled from DD selection"
                />
                {errors.ddMobile && <span className="error">{errors.ddMobile}</span>}
              </div>
            </div>

            {/* Family & Nominee Info */}
            <h2 className="section-title">
              <Users className="section-icon" /> Nominee Details
            </h2>
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

            <div className="input-field">
              <label>Nominee Relationship</label>
              <input
                type="text"
                name="nomineeRelation"
                placeholder="e.g. Spouse, Son, Daughter"
                value={formData.nomineeRelation || ""}
                onChange={handleChange}
              />
              {errors.nomineeRelation && <span className="error">{errors.nomineeRelation}</span>}
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
