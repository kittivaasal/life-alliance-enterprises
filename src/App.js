import { CreditCard, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // ✅ Helper to generate initial form data
  const getInitialFormData = () => {
    const uniqueId = `LIFE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return {
      idNo: uniqueId,
      schemeNo: "", // ID for backend
      schemeName: "", // Name for display
      projectId: "", // Backend expects this (same as schemeNo?)
      date: today, // Application date
      nameOfCustomer: "",
      gender: "",
      dob: "",
      communicationAddress: "",
      mobileNo: "",
      email: "",
      nomineeName: "",
      nomineeAge: "",
      nomineeRelation: "",
      introducerName: "",
      introducerMobileNo: "",
      cedName: "",
      cedMobile: "",
      ddName: "",
      ddMobile: "",
    };
  };

  // ✅ State for Multiple Forms
  const [numberOfForms, setNumberOfForms] = useState(1);
  const [formsData, setFormsData] = useState([getInitialFormData()]);
  const [copyAllChecked, setCopyAllChecked] = useState(false); // ✅ Checkbox state

  // ✅ Popup state for reference ID only
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [paymentMode, setPaymentMode] = useState(""); // cash, card, upi

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Old Scheme dropdown states
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [schemeSearchQuery, setSchemeSearchQuery] = useState("");
  const [activeSchemeDropdown, setActiveSchemeDropdown] = useState(null); // ✅ Index or null
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // ✅ CED dropdown states
  const [cedList, setCedList] = useState([]);
  const [filteredCedList, setFilteredCedList] = useState([]);
  const [cedSearchQuery, setCedSearchQuery] = useState("");
  const [activeCedDropdown, setActiveCedDropdown] = useState(null); // ✅ Index or null
  const [isLoadingCED, setIsLoadingCED] = useState(false);

  // ✅ DD dropdown states
  const [ddList, setDdList] = useState([]);
  const [filteredDdList, setFilteredDdList] = useState([]);
  const [ddSearchQuery, setDdSearchQuery] = useState("");
  const [activeDdDropdown, setActiveDdDropdown] = useState(null); // ✅ Index or null
  const [isLoadingDD, setIsLoadingDD] = useState(false);

  // ✅ Handle Number of Forms Change
  const handleNumberOfFormsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setNumberOfForms(value);

    setFormsData((prev) => {
      const currentLength = prev.length;
      if (value > currentLength) {
        // Add new forms
        const newForms = Array.from({ length: value - currentLength }, () => getInitialFormData());
        return [...prev, ...newForms];
      } else {
        // Remove forms (keep the first 'value' amount)
        return prev.slice(0, value);
      }
    });
  };

  // ✅ Handle Change for a specific form index
  const handleChange = (index, e) => {
    const { name, value, type } = e.target;
    setFormsData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [name]: type === "number" ? value.replace(/\D/g, "") : value };
      return newData;
    });
    setErrors((prev) => ({ ...prev, [`${name}-${index}`]: "" })); // clear error on change for specific field
  };

  // ✅ API Calls (Projects, CED, DD)
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

  // ✅ Validate All Forms
  const validateAllForms = () => {
    const newErrors = {};
    let isValid = true;

    formsData.forEach((formData, index) => {
      // Name
      if (!formData.nameOfCustomer) {
        newErrors[`nameOfCustomer-${index}`] = "Name is required";
        isValid = false;
      }
      
      // Scheme
      if (!formData.schemeNo) {
        newErrors[`schemeNo-${index}`] = "Please select a scheme";
        isValid = false;
      }

      // Address
      if (!formData.communicationAddress) {
        newErrors[`communicationAddress-${index}`] = "Address is required";
        isValid = false;
      }

      // Mobile
      if (!formData.mobileNo) {
        newErrors[`mobileNo-${index}`] = "Mobile number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.mobileNo)) {
        newErrors[`mobileNo-${index}`] = "Enter a valid 10-digit mobile number";
        isValid = false;
      }

      // Email
      if (!formData.email) {
        newErrors[`email-${index}`] = "Email address is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors[`email-${index}`] = "Enter a valid email address";
        isValid = false;
      }

      // Introducer Name - Optional
      // Introducer Mobile - Optional (but validate format if provided)
      if (formData.introducerMobileNo && !/^\d{10}$/.test(formData.introducerMobileNo)) {
        newErrors[`introducerMobileNo-${index}`] = "Enter a valid 10-digit mobile number";
        isValid = false;
      }

      // CED - Optional
      // No validation needed for CED fields

      // DD
      if (!formData.ddName) {
        newErrors[`ddName-${index}`] = "DD name is required";
        isValid = false;
      }
      if (!formData.ddMobile) {
        newErrors[`ddMobile-${index}`] = "DD mobile is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllForms()) {
      setShowReferencePopup(true);
    } else {
      alert("Please fill all required fields correctly for all applications.");
    }
  };

  const handleFinalSubmit = async () => {
    // ✅ Validate payment mode
    if (!paymentMode) {
      alert("Please select a payment mode.");
      return;
    }

    // ✅ Reference ID is required for card/upi, optional for cash
    if ((paymentMode === "card" || paymentMode === "upi") && !referenceId.trim()) {
      alert("Please enter a Reference ID for card/UPI payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Construct Array Payload for Bulk Submission
      const formsArray = formsData.map((form) => {
        const { schemeName, ...formDataToSend } = form; // Remove schemeName (display only)
        return {
          ...formDataToSend,
          projectId: formDataToSend.schemeNo, // Backend expects projectId (same as schemeNo)
          referenceId: paymentMode === "cash" ? "" : referenceId, // Empty for cash, value for card/upi
          paymentMode: paymentMode, // Include payment mode
        };
      });

      // ✅ Wrap in data object as backend expects { "data": [...] }
      const payload = {
        data: formsArray
      };

      // Sending array directly based on user request ("send all data as array")
      const response = await fetch(`${process.env.REACT_APP_API_URL || "https://customer-form-8auo.onrender.com/api/life/saving/create"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ data: payload }), // Usually structure is { data: [...] } or just [...]
        // User said "send all data as array". I'll try sending array directly first or standard {data: []}
        // Given previous context, let's try sending the array directly if backend expects array body.
        // Or if backend expects { data: [...] }. 
        // I will assume Array based on "send all data as array".
        body: JSON.stringify(payload), 
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      console.log("Form Submitted:", result);
      alert("All applications submitted successfully!");
      
      // Reset form
      setFormsData([getInitialFormData()]);
      setNumberOfForms(1);
      setReferenceId("");
      setShowReferencePopup(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Reset popup when closing
  const handlePopupClose = () => {
    setReferenceId("");
    setPaymentMode("");
    setShowReferencePopup(false);
  };
  
  return (
    <div className="app-container">
      <div className="form-wrapper">
        <header className="form-header">
          <div className="logo-section">
            <img src="/log.jpg" alt="Life Alliance Enterprises Logo" className="logo-icon" style={{ height: '48px', width: 'auto' }} />
            <h1>Life Alliance Enterprises</h1>
          </div>
          <p className="subtitle">Customer Application Form</p>
        </header>

        {/* ✅ Number of Applications Input */}
        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
          <div className="input-field" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: "1rem", fontWeight: "600", color: "#374151" }}>Number of Applications</label>
            <input
              type="number"
              min="1"
              max="50"
              value={numberOfForms}
              onChange={handleNumberOfFormsChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {formsData.map((formData, index) => (
            <React.Fragment key={formData.idNo}>
              <div className="application-card" style={{ marginBottom: "30px", borderBottom: "4px solid #4f46e5", paddingBottom: "20px" }}>
                
                <h3 className="section-title" style={{ margin: 0, marginBottom: "15px" }}>Application #{index + 1}</h3>

              {/* Application Details */}
              <h2 className="section-title">
                <CreditCard className="section-icon" /> Application Details
              </h2>
              
              {/* ✅ Scheme and Application ID side-by-side */}
              <div className="grid-2">
                {/* ✅ Scheme Dropdown */}
                <div className="input-field" style={{ position: "relative" }}>
                  <label>Scheme <span style={{ color: "red" }}>*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder={isLoadingProjects ? "Loading schemes..." : "Select Scheme"}
                      value={
                        formData.schemeName || (activeSchemeDropdown === index ? schemeSearchQuery : "")
                      }
                      onChange={(e) => {
                         setSchemeSearchQuery(e.target.value);
                         setActiveSchemeDropdown(index); 
                      }}
                      onFocus={() => {
                        setActiveSchemeDropdown(index);
                        setSchemeSearchQuery("");
                      }}
                      disabled={isLoadingProjects}
                      style={{ paddingRight: "40px", width: "100%" }}
                    />
                    {formData.schemeNo && (
                      <button
                        type="button"
                        onClick={() => {
                          const newData = [...formsData];
                          newData[index].schemeNo = "";
                          newData[index].schemeName = "";
                          setFormsData(newData);
                          setSchemeSearchQuery("");
                        }}
                        style={{
                          position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                          background: "#e5e7eb", border: "none", borderRadius: "50%", width: "22px", height: "22px",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >✖</button>
                    )}
                  </div>

                   {/* Scheme Dropdown List */}
                   {activeSchemeDropdown === index && !isLoadingProjects && (
                    <div className="dropdown-list" style={{
                        position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "200px", overflowY: "auto",
                        backgroundColor: "white", border: "1px solid #ddd", zIndex: 1000, marginTop: "4px"
                      }}>
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                          <div
                            key={project.id || project._id}
                            onClick={() => {
                              const newData = [...formsData];
                              newData[index].schemeNo = project.id || project._id; // Store ID
                              newData[index].schemeName = project.name || project.projectName || project.schemeName; // Store name
                              setFormsData(newData);
                              setSchemeSearchQuery("");
                              setActiveSchemeDropdown(null);
                            }}
                            className="dropdown-item"
                            style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                          >
                            {project.name || project.projectName || project.schemeName}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "10px", color: "#999" }}>No schemes found</div>
                      )}
                    </div>
                   )}
                   {activeSchemeDropdown === index && <div className="overlay" onClick={() => setActiveSchemeDropdown(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />}
                   {errors[`schemeNo-${index}`] && <span className="error">{errors[`schemeNo-${index}`]}</span>}
                </div>

                {/* Application ID */}
                <div className="input-field">
                  <label>Application ID</label>
                  <input
                    type="text"
                    name="idNo"
                    value={formData.idNo || ""}
                    disabled
                    style={{ backgroundColor: "#f9fafb", cursor: "not-allowed" }}
                  />
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
                  placeholder="Enter full name"
                  value={formData.nameOfCustomer || ""}
                  onChange={(e) => handleChange(index, e)}
                />
                {errors[`nameOfCustomer-${index}`] && <span className="error">{errors[`nameOfCustomer-${index}`]}</span>}
              </div>
              
              <div className="grid-2">
                <div className="input-field">
                  <label>Gender</label>
                  <div>
                    <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={(e) => handleChange(index, e)} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={(e) => handleChange(index, e)} /> Female</label>
                    <label><input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={(e) => handleChange(index, e)} /> Other</label>
                  </div>
                </div>

                <div className="input-field">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Communication Address</label>
                <textarea
                  name="communicationAddress"
                  placeholder="Enter full address"
                  value={formData.communicationAddress || ""}
                  onChange={(e) => handleChange(index, e)}
                ></textarea>
                {errors[`communicationAddress-${index}`] && <span className="error">{errors[`communicationAddress-${index}`]}</span>}
              </div>

              <div className="grid-2">
                <div className="input-field">
                  <label>Mobile Number <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="tel"
                    name="mobileNo"
                    placeholder="10-digit mobile number"
                    value={formData.mobileNo || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {errors[`mobileNo-${index}`] && <span className="error">{errors[`mobileNo-${index}`]}</span>}
                </div>
                <div className="input-field">
                  <label>Email Address <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {errors[`email-${index}`] && <span className="error">{errors[`email-${index}`]}</span>}
                </div>
              </div>

              {/* Introducer Info */}
              <h2 className="section-title">
                <Users className="section-icon" /> Introducer & Reference Details
              </h2>
              <div className="grid-2">
                <div className="input-field">
                  <label>Introducer Name</label>
                  <input
                    type="text"
                    name="introducerName"
                    value={formData.introducerName || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {errors[`introducerName-${index}`] && <span className="error">{errors[`introducerName-${index}`]}</span>}
                </div>
                <div className="input-field">
                  <label>Introducer Mobile</label>
                  <input
                    type="tel"
                    name="introducerMobileNo"
                    value={formData.introducerMobileNo || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {errors[`introducerMobileNo-${index}`] && <span className="error">{errors[`introducerMobileNo-${index}`]}</span>}
                </div>
              </div>

              <div className="grid-2">
                {/* ✅ CED Name Dropdown */}
                <div className="input-field" style={{ position: "relative" }}>
                  <label>CED Name</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder={isLoadingCED ? "Loading..." : "Search CED"}
                      value={
                        formData.cedName
                          ? (cedList.find(c => c._id === formData.cedName)?.name || formData.cedName)
                          : (activeCedDropdown === index ? cedSearchQuery : "")
                      }
                      onChange={(e) => {
                        setCedSearchQuery(e.target.value);
                        setActiveCedDropdown(index);
                      }}
                      onFocus={() => {
                        setActiveCedDropdown(index);
                        setCedSearchQuery("");
                      }}
                      disabled={isLoadingCED}
                      style={{ paddingRight: "40px", width: "100%" }}
                    />
                    {formData.cedName && (
                      <button
                        type="button"
                        onClick={() => {
                           const newData = [...formsData];
                           newData[index].cedName = "";
                           newData[index].cedMobile = "";
                           setFormsData(newData);
                           setCedSearchQuery("");
                        }}
                        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "#e5e7eb", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✖</button>
                    )}
                  </div>
                  
                  {/* Dropdown List */}
                  {activeCedDropdown === index && !isLoadingCED && (
                    <div className="dropdown-list" style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "200px", overflowY: "auto", backgroundColor: "white", border: "1px solid #ddd", zIndex: 1000 }}>
                      {filteredCedList.length > 0 ? (
                        filteredCedList.map((ced) => (
                          <div
                            key={ced._id}
                            onClick={() => {
                               const newData = [...formsData];
                               newData[index].cedName = ced._id;
                               newData[index].cedMobile = ced.phone || "";
                               setFormsData(newData);
                               setCedSearchQuery("");
                               setActiveCedDropdown(null);
                            }}
                            className="dropdown-item" style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                          >
                            <div style={{ fontWeight: "500" }}>{ced.name}</div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>{ced.phone}</div>
                          </div>
                        ))
                      ) : (<div style={{ padding: "10px", color: "#999" }}>No CED found</div>)}
                    </div>
                  )}
                  {activeCedDropdown === index && <div className="overlay" onClick={() => setActiveCedDropdown(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />}
                  {errors[`cedName-${index}`] && <span className="error">{errors[`cedName-${index}`]}</span>}
                </div>
                
                {/* ✅ CED Mobile */}
                <div className="input-field">
                  <label>CED Mobile</label>
                  <input
                    type="tel"
                    name="cedMobile"
                    value={formData.cedMobile || ""}
                    disabled
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                    placeholder="Auto-filled"
                  />
                  {errors[`cedMobile-${index}`] && <span className="error">{errors[`cedMobile-${index}`]}</span>}
                </div>
              </div>

              <div className="grid-2">
                {/* ✅ DD Name Dropdown */}
                <div className="input-field" style={{ position: "relative" }}>
                  <label>DD Name <span style={{ color: "red" }}>*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder={isLoadingDD ? "Loading..." : "Search DD"}
                      value={
                        formData.ddName
                          ? (ddList.find(d => d._id === formData.ddName)?.name || formData.ddName)
                          : (activeDdDropdown === index ? ddSearchQuery : "")
                      }
                      onChange={(e) => {
                        setDdSearchQuery(e.target.value);
                        setActiveDdDropdown(index);
                      }}
                      onFocus={() => {
                         setActiveDdDropdown(index);
                         setDdSearchQuery("");
                      }}
                      disabled={isLoadingDD}
                      style={{ paddingRight: "40px", width: "100%" }}
                    />
                    {formData.ddName && (
                      <button
                        type="button"
                        onClick={() => {
                           const newData = [...formsData];
                           newData[index].ddName = "";
                           newData[index].ddMobile = "";
                           setFormsData(newData);
                           setDdSearchQuery("");
                        }}
                        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "#e5e7eb", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✖</button>
                    )}
                  </div>
                  
                  {/* Dropdown List */}
                  {activeDdDropdown === index && !isLoadingDD && (
                    <div className="dropdown-list" style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "200px", overflowY: "auto", backgroundColor: "white", border: "1px solid #ddd", zIndex: 1000 }}>
                      {filteredDdList.length > 0 ? (
                        filteredDdList.map((dd) => (
                          <div
                            key={dd._id}
                            onClick={() => {
                               const newData = [...formsData];
                               newData[index].ddName = dd._id;
                               newData[index].ddMobile = dd.phone || "";
                               setFormsData(newData);
                               setDdSearchQuery("");
                               setActiveDdDropdown(null);
                            }}
                            className="dropdown-item" style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                          >
                            <div style={{ fontWeight: "500" }}>{dd.name}</div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>{dd.phone}</div>
                          </div>
                        ))
                      ) : (<div style={{ padding: "10px", color: "#999" }}>No DD found</div>)}
                    </div>
                  )}
                  {activeDdDropdown === index && <div className="overlay" onClick={() => setActiveDdDropdown(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />}
                  {errors[`ddName-${index}`] && <span className="error">{errors[`ddName-${index}`]}</span>}
                </div>

                {/* ✅ DD Mobile */}
                <div className="input-field">
                  <label>DD Mobile <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="tel"
                    name="ddMobile"
                    value={formData.ddMobile || ""}
                    disabled
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                    placeholder="Auto-filled"
                  />
                  {errors[`ddMobile-${index}`] && <span className="error">{errors[`ddMobile-${index}`]}</span>}
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
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div className="input-field">
                  <label>Nominee Age</label>
                  <input
                    type="number"
                    name="nomineeAge"
                    value={formData.nomineeAge || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Nominee Relationship</label>
                <input
                  type="text"
                  name="nomineeRelation"
                  placeholder="e.g. Spouse, Son, Daughter"
                  value={formData.nomineeRelation || ""}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              </div>

              {/* ✅ Copy to All Checkbox - Appears after Application #1 */}
              {index === 0 && numberOfForms > 1 && (
                <div style={{ marginTop: "20px", marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="copyToAll"
                      checked={copyAllChecked}
                      onChange={(e) => {
                        setCopyAllChecked(e.target.checked);
                        if (e.target.checked) {
                          // Copy Form #1 data to all other forms
                          setFormsData((prev) => {
                            const newData = [...prev];
                            const firstForm = newData[0];
                            for (let i = 1; i < newData.length; i++) {
                              newData[i] = {
                                ...firstForm,
                                idNo: newData[i].idNo, // Keep unique ID
                              };
                            }
                            return newData;
                          });
                        }
                      }}
                      disabled={
                        // Disable if Form #1 doesn't have all required fields
                        !formsData[0]?.schemeNo ||
                        !formsData[0]?.nameOfCustomer ||
                        !formsData[0]?.communicationAddress ||
                        !formsData[0]?.mobileNo ||
                        !formsData[0]?.email ||
                        !formsData[0]?.ddName ||
                        !formsData[0]?.ddMobile
                      }
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#4f46e5" }}
                    />
                    <label 
                      htmlFor="copyToAll" 
                      style={{ 
                        fontSize: "0.95rem", 
                        fontWeight: "500", 
                        color: (
                          !formsData[0]?.schemeNo ||
                          !formsData[0]?.nameOfCustomer ||
                          !formsData[0]?.communicationAddress ||
                          !formsData[0]?.mobileNo ||
                          !formsData[0]?.email ||
                          !formsData[0]?.ddName ||
                          !formsData[0]?.ddMobile
                        ) ? "#9ca3af" : "#4f46e5",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      ✨ Copy Application #1 to all remaining applications
                    </label>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="form-footer">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Applications"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Reference ID Popup */}
      {showReferencePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Payment Details</h3>
            <p>Please select payment mode and enter reference ID if applicable.</p>
            
            {/* Payment Mode Dropdown */}
            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
                Payment Mode <span style={{ color: "red" }}>*</span>
              </label>
              <select
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                  // Clear reference ID when switching to cash
                  if (e.target.value === "cash") {
                    setReferenceId("");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              >
                <option value="">Select payment mode</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {/* Reference ID Input - Conditional */}
            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: paymentMode === "cash" ? "#9ca3af" : "#374151" }}>
                Reference ID {(paymentMode === "card" || paymentMode === "upi") && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type="text"
                className="reference-input"
                placeholder={paymentMode === "cash" ? "Not required for cash" : "Enter reference ID"}
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                disabled={paymentMode === "cash"}
                style={{
                  backgroundColor: paymentMode === "cash" ? "#f3f4f6" : "white",
                  cursor: paymentMode === "cash" ? "not-allowed" : "text",
                  opacity: paymentMode === "cash" ? 0.6 : 1
                }}
              />
            </div>

            <div className="popup-actions">
              <button className="cancel-btn" onClick={handlePopupClose}>Cancel</button>
              <button className="confirm-btn" onClick={handleFinalSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
