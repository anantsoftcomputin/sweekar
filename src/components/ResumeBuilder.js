import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Eye, EyeOff } from "lucide-react";

// Simple Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-text-editor">
      <div
        className="w-full p-2 border rounded min-h-[100px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={(e) => onChange(e.target.innerHTML)}
        placeholder={placeholder}
      />
    </div>
  );
};

const ResumeBuilder = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    jobTitle: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    profile: "",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState([
    { degree: "", institution: "", year: "", description: "" },
  ]);
  const [experience, setExperience] = useState([
    { position: "", company: "", year: "", description: "" },
  ]);
  const [languages, setLanguages] = useState([
    { language: "", proficiency: 0 },
  ]);
  const [certifications, setCertifications] = useState([
    { name: "", issuer: "", year: "" },
  ]);
  const [awards, setAwards] = useState([{ name: "", issuer: "", year: "" }]);
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef();

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleEducationChange = (index, e) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [e.target.name]: e.target.value };
      }
      return edu;
    });
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", institution: "", year: "", description: "" },
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setExperience(updatedExperience);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { position: "", company: "", year: "", description: "" },
    ]);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (index, e) => {
    const updatedLanguages = languages.map((lang, i) => {
      if (i === index) {
        return {
          ...lang,
          [e.target.name]:
            e.target.name === "proficiency"
              ? parseInt(e.target.value)
              : e.target.value,
        };
      }
      return lang;
    });
    setLanguages(updatedLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: 0 }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index, e) => {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [e.target.name]: e.target.value };
      }
      return cert;
    });
    setCertifications(updatedCertifications);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAwardChange = (index, e) => {
    const updatedAwards = awards.map((award, i) => {
      if (i === index) {
        return { ...award, [e.target.name]: e.target.value };
      }
      return award;
    });
    setAwards(updatedAwards);
  };

  const addAward = () => {
    setAwards([...awards, { name: "", issuer: "", year: "" }]);
  };

  const removeAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
  });

  const handleShare = async () => {
    const canvas = await html2canvas(resumeRef.current);
    const imgData = canvas.toDataURL("image/png");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: "Check out my resume!",
          files: [
            new File([await (await fetch(imgData)).blob()], "resume.png", {
              type: "image/png",
            }),
          ],
        });
        console.log("Resume shared successfully");
      } catch (error) {
        console.error("Error sharing resume:", error);
      }
    } else {
      console.log("Web Share API not supported");
      // Fallback: You could implement a modal to show a shareable link or QR code here
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let yPos = margin;

    // Set font to Times New Roman
    pdf.setFont("times", "normal");

    // Helper function to add text with line breaks
    const addText = (
      text,
      x,
      y,
      maxWidth,
      fontSize = 11,
      fontStyle = "normal"
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("times", fontStyle);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + lines.length * fontSize * 0.3528; // Approximate line height
    };

    // Add header
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.text(personalInfo.name.toUpperCase(), pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 16 * 0.3528; // Approximate line height

    pdf.setFontSize(14);
    pdf.setFont("times", "normal");
    pdf.text(personalInfo.jobTitle, pageWidth / 2, yPos, { align: "center" });
    yPos += 14 * 0.3528; // Approximate line height

    pdf.setFontSize(11);
    pdf.text(
      `${personalInfo.phone} |  ${personalInfo.email}  | `,
      pageWidth / 2,
      yPos,
      { align: "center" }
    );
    yPos += 11 * 0.3528; // Approximate line height

    pdf.setFontSize(11);
    pdf.text(`${personalInfo.address}`, pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 11 * 0.3528;

    if (personalInfo.website) {
      pdf.text(personalInfo.website, pageWidth / 2, yPos, { align: "center" });
      yPos += 11 * 0.3528; // Approximate line height
    }

    yPos += 5;
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // Profile
    yPos = addText("PROFILE", margin, yPos, pageWidth - 2 * margin, 12, "bold");
    yPos = addText(
      personalInfo.profile.replace(/<[^>]*>/g, ""),
      margin,
      yPos,
      pageWidth - 2 * margin
    );

    // Skills
    yPos += 5;
    yPos = addText("SKILLS", margin, yPos, pageWidth - 2 * margin, 12, "bold");
    yPos = addText(skills.join(", "), margin, yPos, pageWidth - 2 * margin);

    // Work Experience
    yPos += 5;
    yPos = addText(
      "WORK EXPERIENCE",
      margin,
      yPos,
      pageWidth - 2 * margin,
      12,
      "bold"
    );
    experience.forEach((exp) => {
      yPos = addText(
        exp.position,
        margin,
        yPos,
        pageWidth - 2 * margin,
        11,
        "bold"
      );
      yPos = addText(
        `${exp.company} | ${exp.year}`,
        margin,
        yPos,
        pageWidth - 2 * margin,
        10,
        "italic"
      );
      yPos = addText(
        exp.description.replace(/<[^>]*>/g, ""),
        margin,
        yPos,
        pageWidth - 2 * margin
      );
      yPos += 3;
    });

    // Education
    yPos += 5;
    yPos = addText(
      "EDUCATION",
      margin,
      yPos,
      pageWidth - 2 * margin,
      12,
      "bold"
    );
    education.forEach((edu) => {
      yPos = addText(
        edu.degree,
        margin,
        yPos,
        pageWidth - 2 * margin,
        11,
        "bold"
      );
      yPos = addText(
        `${edu.institution} | ${edu.year}`,
        margin,
        yPos,
        pageWidth - 2 * margin,
        10,
        "italic"
      );
      yPos = addText(edu.description, margin, yPos, pageWidth - 2 * margin);
      yPos += 3;
    });

    // Certifications
    if (certifications.length > 0) {
      yPos += 5;
      yPos = addText(
        "CERTIFICATIONS",
        margin,
        yPos,
        pageWidth - 2 * margin,
        12,
        "bold"
      );
      certifications.forEach((cert) => {
        yPos = addText(
          `${cert.name} - ${cert.issuer}, ${cert.year}`,
          margin,
          yPos,
          pageWidth - 2 * margin
        );
      });
    }

    // Awards
    if (awards.length > 0) {
      yPos += 5;
      yPos = addText(
        "AWARDS",
        margin,
        yPos,
        pageWidth - 2 * margin,
        12,
        "bold"
      );
      awards.forEach((award) => {
        yPos = addText(
          `${award.name} - ${award.issuer}, ${award.year}`,
          margin,
          yPos,
          pageWidth - 2 * margin
        );
      });
    }

    // Languages
    if (languages.length > 0) {
      yPos += 5;
      yPos = addText(
        "LANGUAGES",
        margin,
        yPos,
        pageWidth - 2 * margin,
        12,
        "bold"
      );
      languages.forEach((lang) => {
        yPos = addText(
          `${lang.language} - ${lang.proficiency}%`,
          margin,
          yPos,
          pageWidth - 2 * margin
        );
      });
    }

    pdf.save("resume.pdf");
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Resume Builder
          </h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Personal Information
                </h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={personalInfo.jobTitle}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded mt-2"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded mt-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded mt-2"
                />
                <input
                  type="url"
                  name="website"
                  placeholder="Website"
                  value={personalInfo.website}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded mt-2"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded mt-2"
                />
                <h3 className="text-lg font-semibold mt-4 mb-2">Profile</h3>
                <RichTextEditor
                  value={personalInfo.profile}
                  onChange={(value) =>
                    setPersonalInfo({ ...personalInfo, profile: value })
                  }
                  placeholder="Professional Profile"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={handleSkillChange}
                    placeholder="Add a skill"
                    className="flex-grow p-2 border rounded"
                  />
                  <button onClick={addSkill}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Work Experience
                  </h2>
                  <button onClick={addExperience}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                {experience.map((exp, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      name="position"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Year"
                      value={exp.year}
                      onChange={(e) =>
                        handleExperienceChange(index, "year", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <RichTextEditor
                      value={exp.description}
                      onChange={(value) =>
                        handleExperienceChange(index, "description", value)
                      }
                      placeholder="Job Description"
                    />
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-semibold mb-2">Education</h2>
                  <button onClick={addEducation}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                {education.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      name="degree"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="institution"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={edu.description}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                      rows="2"
                    ></textarea>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-semibold mb-2">Certifications</h2>
                  <button onClick={addCertification}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                {certifications.map((cert, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      name="name"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="issuer"
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Year"
                      value={cert.year}
                      onChange={(e) => handleCertificationChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-semibold mb-2">Awards</h2>
                  <button onClick={addAward}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                {awards.map((award, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      name="name"
                      placeholder="Award Name"
                      value={award.name}
                      onChange={(e) => handleAwardChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="issuer"
                      placeholder="Issuing Organization"
                      value={award.issuer}
                      onChange={(e) => handleAwardChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Year"
                      value={award.year}
                      onChange={(e) => handleAwardChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <button
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-semibold mb-2">Languages</h2>
                  <button onClick={addLanguage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                {languages.map((lang, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      name="language"
                      placeholder="Language"
                      value={lang.language}
                      onChange={(e) => handleLanguageChange(index, e)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="range"
                      name="proficiency"
                      min="0"
                      max="100"
                      value={lang.proficiency}
                      onChange={(e) => handleLanguageChange(index, e)}
                      className="w-full"
                    />
                    <button
                      onClick={() => removeLanguage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Resume Preview</h2>
              <div
                ref={resumeRef}
                className="bg-white p-8 shadow-lg rounded-lg"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
                    {personalInfo.name.toUpperCase()}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    {personalInfo.jobTitle}
                  </p>
                  <div className="flex flex-col items-center mt-4 text-sm text-gray-600">
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.address}</p>
                    {personalInfo.website && <p>{personalInfo.website}</p>}
                  </div>
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex">
                  {/* Left Column */}
                  <div className="w-1/3 pr-6 border-r border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 uppercase">
                      Skills
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                      {skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                    <h2 className="text-xl font-semibold mt-6 mb-4 uppercase">
                      Languages
                    </h2>
                    {languages.map((lang, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold">{lang.language}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-600 h-2 rounded-full"
                            style={{ width: `${lang.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <h2 className="text-xl font-semibold mt-6 mb-4 uppercase">
                      Certifications
                    </h2>
                    {certifications.map((cert, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-sm">
                          {cert.issuer}, {cert.year}
                        </p>
                      </div>
                    ))}
                    <h2 className="text-xl font-semibold mt-6 mb-4 uppercase">
                      Awards
                    </h2>
                    {awards.map((award, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold">{award.name}</p>
                        <p className="text-sm">
                          {award.issuer}, {award.year}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Right Column */}
                  <div className="w-2/3 pl-6">
                    <h2 className="text-xl font-semibold mb-4 uppercase">
                      Profile
                    </h2>
                    <div
                      className="mb-6 text-sm"
                      dangerouslySetInnerHTML={{ __html: personalInfo.profile }}
                    ></div>
                    <h2 className="text-xl font-semibold mb-4 uppercase">
                      Work Experience
                    </h2>
                    {experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {exp.company} | {exp.year}
                        </p>
                        <div
                          className="text-sm mt-2"
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        ></div>
                      </div>
                    ))}
                    <h2 className="text-xl font-semibold mt-6 mb-4 uppercase">
                      Education
                    </h2>
                    {education.map((edu, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">
                          {edu.institution} | {edu.year}
                        </p>
                        <p className="text-sm mt-1">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleShare}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Preview Toggle */}
      <button
        onClick={togglePreview}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg xl:hidden"
        aria-label="Toggle Preview"
      >
        {showPreview ? <EyeOff size={24} /> : <Eye size={24} />}
      </button>
    </div>
  );
};

export default ResumeBuilder;
