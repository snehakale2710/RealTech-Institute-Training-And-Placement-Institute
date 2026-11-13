
import React, { useMemo, useRef, useState } from "react";

import {
  FileText,
  BookOpen,
  Users,
  Files,
  Search,
  Plus,
  RotateCcw,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./StudyMaterials.css";

const initialMaterials = [
  {
    id: 1,
    title: "Python Basic Notes",
    course: "Python",
    batch: "Batch 01",
    fileType: "PDF",
    uploadedOn: "10 Oct 2025",
    time: "10:24 AM",
  },
  {
    id: 2,
    title: "Web Development Slides",
    course: "Web Development",
    batch: "Batch 02",
    fileType: "PDF",
    uploadedOn: "08 Oct 2025",
    time: "02:15 PM",
  },
  {
    id: 3,
    title: "Database Notes",
    course: "SQL & My SQL",
    batch: "Batch 01",
    fileType: "PPT",
    uploadedOn: "06 Oct 2025",
    time: "11:40 AM",
  },
  {
    id: 4,
    title: "Python Practice Sheet",
    course: "Python",
    batch: "Batch 03",
    fileType: "Image",
    uploadedOn: "04 Oct 2025",
    time: "04:20 PM",
  },
  {
    id: 5,
    title: "Java Basics",
    course: "Java",
    batch: "Batch 02",
    fileType: "DOC",
    uploadedOn: "01 Oct 2025",
    time: "09:32 AM",
  },
  {
    id: 6,
    title: "DSA Notes",
    course: "DSA",
    batch: "Batch 03",
    fileType: "PDF",
    uploadedOn: "28 Sep 2025",
    time: "03:18 PM",
  },
  ...Array.from({ length: 18 }, (_, index) => ({
    id: index + 7,
    title: `Study Material ${index + 1}`,
    course: ["Python", "Java", "Web Development", "DSA", "SQL & My SQL", "AI & ML"][index % 6],
    batch: `Batch 0${(index % 3) + 1}`,
    fileType: ["PDF", "PPT", "DOC", "Image"][index % 4],
    uploadedOn: "25 Sep 2025",
    time: "10:00 AM",
  })),
];

function StudyMaterials() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [fileType, setFileType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef(null);

  const itemsPerPage = 6;

  // Filter Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const searchMatch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.course.toLowerCase().includes(search.toLowerCase()) ||
        item.batch.toLowerCase().includes(search.toLowerCase());

      return (
        searchMatch &&
        (!course || item.course === course) &&
        (!batch || item.batch === batch) &&
        (!fileType || item.fileType === fileType)
      );
    });
  }, [materials, search, course, batch, fileType]);

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  const currentMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueCourses = [...new Set(materials.map((item) => item.course))];
  const uniqueBatches = [...new Set(materials.map((item) => item.batch))];

  // Reset Filters
  const resetFilters = () => {
    setSearch("");
    setCourse("");
    setBatch("");
    setFileType("");
    setCurrentPage(1);
  };

  // Upload Material
  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    const typeMap = {
      pdf: "PDF",
      ppt: "PPT",
      pptx: "PPT",
      doc: "DOC",
      docx: "DOC",
      jpg: "Image",
      jpeg: "Image",
      png: "Image",
      webp: "Image",
    };

    const selectedType = typeMap[extension];

    if (!selectedType) {
      alert("Please select a PDF, PPT, DOC or Image file.");
      event.target.value = "";
      return;
    }

    const newMaterial = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      course: "Python",
      batch: "Batch 01",
      fileType: selectedType,
      uploadedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      file,
      fileUrl: URL.createObjectURL(file),
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    resetFilters();
    event.target.value = "";
  };

  // View Material
  const handleView = (item) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    } else {
      alert("This is demo data. No actual file is attached.");
    }
  };

  // Download Material
  const handleDownload = (item) => {
    if (!item.fileUrl) {
      alert("No actual file is attached to this demo material.");
      return;
    }

    const link = document.createElement("a");
    link.href = item.fileUrl;
    link.download = item.title;
    link.click();
  };

  // Delete Material
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setMaterials((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getFileClass = (type) => `file-badge ${type.toLowerCase()}`;

  return (
    <div className="study-materials-page">

      {/* Page Header */}
      <div className="materials-header">

        <div className="materials-heading">
          <div className="heading-icon">
            <FileText size={23} strokeWidth={1.8} />
          </div>

          <div>
            <h2>Study Materials</h2>
            <p>
              Upload and manage study resources for your batches and courses
            </p>
          </div>
        </div>

        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={17} />
          Upload Material
        </button>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={handleUpload}
        />

      </div>

      {/* Search and Filters */}
      <div className="materials-filter">

        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by title, course or batch..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={course}
          onChange={(e) => {
            setCourse(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Courses</option>
          {uniqueCourses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          value={batch}
          onChange={(e) => {
            setBatch(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Batches</option>
          {uniqueBatches.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          value={fileType}
          onChange={(e) => {
            setFileType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All File Types</option>
          <option value="PDF">PDF</option>
          <option value="PPT">PPT</option>
          <option value="DOC">DOC</option>
          <option value="Image">Image</option>
        </select>

        <button className="reset-btn" onClick={resetFilters}>
          <RotateCcw size={14} />
          Reset
        </button>

      </div>

      {/* Statistics */}
      <div className="materials-stats">

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={21} />
          </div>
          <div>
            <p>Total Materials</p>
            <h3>{materials.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={21} />
          </div>
          <div>
            <p>Courses</p>
            <h3>{uniqueCourses.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={21} />
          </div>
          <div>
            <p>Batches</p>
            <h3>{uniqueBatches.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Files size={21} />
          </div>
          <div>
            <p>File Types</p>
            <h3>{new Set(materials.map((item) => item.fileType)).size}</h3>
          </div>
        </div>

      </div>

      {/* Materials Table */}
      <div className="materials-table-container">

        <div className="table-scroll">
          <table className="materials-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Course</th>
                <th>Batch</th>
                <th>File Type</th>
                <th>Uploaded On</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentMaterials.length > 0 ? (
                currentMaterials.map((item, index) => (
                  <tr key={item.id}>

                    <td>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="material-title">
                      {item.title}
                    </td>

                    <td>
                      <span className="course-badge">
                        {item.course}
                      </span>
                    </td>

                    <td>
                      <span className="batch-badge">
                        {item.batch}
                      </span>
                    </td>

                    <td>
                      <span className={getFileClass(item.fileType)}>
                        {item.fileType}
                      </span>
                    </td>

                    <td className="uploaded-date">
                      {item.uploadedOn}
                      <br />
                      {item.time}
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="action-btn"
                          title="View"
                          onClick={() => handleView(item)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          className="action-btn"
                          title="Download"
                          onClick={() => handleDownload(item)}
                        >
                          <Download size={15} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-materials">
                    No study materials found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="materials-pagination">

          <p>
            Showing{" "}
            {filteredMaterials.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
            {" - "}
            {Math.min(currentPage * itemsPerPage, filteredMaterials.length)}
            {" "}of {filteredMaterials.length} Materials
          </p>

          <div className="pagination-buttons">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              title="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              title="Next page"
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudyMaterials;
