import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fieldImage from "./assets/soccer-yard.jpg";
import fieldImage2 from "./assets/coveredStadium.png";
import fieldImage3 from "./assets/Stadium.png";
import { getYards, getYardById } from "./YardApis/YardsCrud";
import { Post, GET } from "./ApisCall/ApiClient";
import { YardsBaseUrl } from "./ApisCall/Urls";
import { updateYard } from "./YardApis/YardsCrud";
import { DeleteYard } from "./YardApis/YardsCrud";
import { getCamera } from "./CamerasApis/GetCameras.js";
import { createCamera } from "./YardCamerasApis/CreateCamera.js";
import { DeleteYardCamera } from "./YardCamerasApis/DeleteCamera.js";
import { getCameraById } from "./YardCamerasApis/GetCamera.js";
import { DawnloadVideo } from "./VideosApi/DawnloadVideoApi.js";



import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation } from "swiper/modules";
import { Pagination } from "swiper/modules";



export default function OpenHomePage({ theme, setTheme }) {
  const [yards, setYards] = useState([]);
  const [selectedYard, setSelectedYard] = useState(null);
  const [showBar, setShowBar] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCameraSetting, setShowCameraSetting] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [mode, setMode] = useState("create");
  const [hover, setHover] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [yardToDelete, setYardToDelete] = useState(null);
  const [hoveredYardId, setHoveredYardId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cameraCount, setCameraCount] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [previewYard, setPreviewYard] = useState(null);
  const yardToDisplay = selectedYard || previewYard;
  const [menuOpenId, setMenuOpenId] = useState(null);
  const toggleMenu = id => setMenuOpenId(prev => (prev === id ? null : id));
  const [hoveredCameraId, setHoveredCameraId] = useState(null);
  const [showChannels, setShowChannels] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [yardSearch, setYardSearch] = useState("");
  const [activeCam, setActiveCam] = useState(null);
  const [showShimmer, setShowShimmer] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);


  useEffect(() => {
    try {
      const current = theme ?? localStorage.getItem("theme") ?? "light";
      document.documentElement.setAttribute("data-theme", current);
      localStorage.setItem("theme", current);
    } catch (e) {

    }
  }, [theme]);

  const handleToggleTheme = () => {
    if (typeof setTheme === "function") {
      setTheme(prev => {
        const next = prev === "light" ? "dark" : "light";
        try {
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("theme", next);
        } catch (e) { }
        return next;
      });
      return;
    }

    try {
      const cur = document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "light";
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    } catch (e) { }
  };


  const [yardName, setYardName] = useState("");
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(80);
  const [status, setStatus] = useState(0);
  const [description, setDescription] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorSize, setErrorSize] = useState("");

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("./loginPage", { replace: true });
  }

  //create settings form

  const openSettings = () => {
    if (!showSettings) {
      setShowSettings(true);
      setMode("create");
      setTimeout(() => setPanelVisible(true), 20);
    } else {
      setShowSettings(false);
    }
  };

  const openUpdateSettings = () => {
    if (!showSettings) {
      setShowSettings(true);
      setMode("update");
      if (selectedYard) {
        setYardName(selectedYard.name || "");
        setDescription(selectedYard.description || "");
        setWidth(selectedYard.width || 80);
        setHeight(selectedYard.height || 80);
        setCameraCount(Array.isArray(selectedYard.assignedCameras) ? selectedYard.assignedCameras.length : 0);
        setShowCameraSetting(false);
      }
      setTimeout(() => setPanelVisible(true), 20);
    } else {
      setShowSettings(false);
    }
  };

  const openCameraManagement = () => {
    if (!showSettings) {
      setShowSettings(true);
      setShowCameraSetting(true);
      setMode("update");
      setTimeout(() => setPanelVisible(true), 20);
    } else {
      // toggle camera setting visibility when settings already open
      setShowCameraSetting(prev => !prev);
    }
  };

  const closeSettings = () => {
    setPanelVisible(false);
    setTimeout(() => setShowSettings(false), 500);
  };


  useEffect(() => {
    async function fetchYards() {
      try {
        const data = await getYards();
        setYards(data);
        if (data.length > 0) setSelectedYard(data[0]);
      } catch (error) {
        console.log("Error loading yards:", error);
      }
    }
    fetchYards();
  }, []);


  const handleSaveYard = async () => {
    const validNameRegex = /^(?=.*\S).+$/;

    if (!validNameRegex.test(yardName)) {
      return setErrorName("Please enter a valid yard name (cannot be empty or just spaces)");
    }
    if (!yardName.trim()) return setErrorName("Please enter a yard name");

    const payload = {
      id: 0,
      name: yardName.trim(),
      description,
      width,
      height,
      status,
      cameraCount,
      image: fieldImage,
    };

    try {
      const created = await Post(YardsBaseUrl(), payload);
      setYards(prev => [...prev, created]);
      setSelectedYard(created);
      setErrorName("");
      setErrorSize("");
    } catch (err) {
      console.error("Failed to create yard:", err);
    }
  };




  const handleUpdateYard = async () => {
    if (!selectedYard) return alert("Select a yard first.");

    const payload = {
      id: selectedYard.id,
      name: yardName,
      description,
      width: Number(width),
      height: Number(height),
      status: selectedYard.status || 0,
      cameraCount: pickedCameras.length
    };

    try {
      const response = await updateYard(selectedYard.id, payload);
      console.log("Yard updated successfully:", response);

      // Update local yards array
      setYards(prevYards =>
        prevYards.map(y =>
          y.id === selectedYard.id
            ? {
              ...y,
              ...payload,
              assignedCameras: pickedCameras || [],
            }
            : y
        )
      );

      // Update selected yard
      setSelectedYard(prev => ({
        ...prev,
        ...payload,
        assignedCameras: pickedCameras || [],
      }));

      alert("Yard updated successfully!");
    } catch (error) {
      console.error("Failed to update yard:", error);
      alert("Failed to update yard. Check console for details.");
    }
  };


  function CloseButton({ onDeleteConfirm }) {
    const [hover, setHover] = useState(false);
    const [confirming, setConfirming] = useState(false);
  }


  const confirmDelete = (yard) => {
    setYardToDelete(yard);
    setConfirming(true);
  };


  const handleDelete = async () => {
    if (!yardToDelete) return;

    try {
      const response = await DeleteYard(yardToDelete.id, {});
      console.log("Yard deleted:", response);

      // Update frontend state
      setYards(prev => prev.filter(yard => yard.id !== yardToDelete.id));

      setConfirming(false);
      setYardToDelete(null);

    } catch (error) {
      console.error("Error deleting yard:", error);
    }
  };



  // Camera assignment states

  const [assignedCameras, setAssignedCameras] = useState([]);
  const [pickedCameras, setPickedCameras] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const containerRef = useRef(null);
  const [channelToDownload, setChannelToDownload] = useState(null);


  useEffect(() => {
    fetchAllCameras();
  }, []);

  // make it public in the component scope
  const fetchAllCameras = async () => {
    try {
      const data = await getCamera();
      const allCams = Array.isArray(data) ? data : data?.cameras || [];
      setCameras(allCams);
    } catch (err) {
      console.error("Failed to load cameras:", err);
    }
  };


  // ------------------------- LOAD YARD ASSIGNMENTS -------------------------
  useEffect(() => {
    if (!selectedYard?.id) {
      setPickedCameras([]);
      setAssignedCameras([]);
      return;
    }

    if (cameras.length === 0) return;




    const loadYardCameras = async () => {
      if (!selectedYard) return;

      const yardId = selectedYard.id;
      try {
        const res = await fetch(`${YardsBaseUrl()}/${yardId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        const yardData = text ? JSON.parse(text) : { assignedCameras: [] };

        const assignments = Array.isArray(yardData.yardCameras) ? yardData.yardCameras : [];
        const savedPositions = JSON.parse(localStorage.getItem("cameraPositions") || "{}");

        const mappedAssigned = assignments.map(a => {
          const cam = cameras.find(c => c.id === a.camera.id);
          const camId = a.camera?.id;
          const saved = savedPositions[camId];
          const [xStr, yStr] = (a.location || "50,50").split(",");
          const x = saved?.x ?? Number(xStr) ?? 50;
          const y = saved?.y ?? Number(yStr) ?? 50;

          return {
            id: Number(camId),
            name: cam ? cam.name : `Camera ${camId}`,
            x,
            y,
            channel640X360: cam?.channel640X360 || null,
            channel704X576: cam?.channel704X576 || null,
            channel2560X1440: cam?.channel2560X1440 || null,
            yardId: yardId,
          };
        });
        setAssignedCameras(prev => [
          ...prev.filter(a => a.yardId !== yardId),
          ...mappedAssigned
        ]);
        setPickedCameras(mappedAssigned);

        // 🔹 Update selectedYard so camera count shows correctly
        setSelectedYard(prev => ({
          ...prev,
          assignedCameras: mappedAssigned
        }));

      } catch (err) {
        console.error("Failed to load yard cameras:", err);
        setPickedCameras([]);
        setSelectedYard(prev => ({ ...prev, assignedCameras: [] }));
      }
    };

    loadYardCameras();

  }, [selectedYard?.id, cameras]);



  // ------------------------- ADD CAMERA -------------------------
  function handleAddCameraToYard(cam) {
    if (!selectedYard?.id) return alert("Select a yard first.");


    if (pickedCameras.some(c => String(c.id) === String(cam.id))) return;



    const newAssign = { cameraId: cam.id, x: 50, y: 50 };
    const newPicked = { ...cam, x: 50, y: 50 };

    if (!cam.id) {
      console.error("Camera id is missing", cam);
      return;
    }


    setAssignedCameras(prev => [...prev, newAssign]);
    setPickedCameras(prev => [...prev, newPicked]);
  }

  // ------------------------- REMOVE CAMERA -------------------------

  function handleRemovePickedCamera(cam) {
    setPickedCameras(prev => prev.filter(p => String(p.id) !== String(cam.id)));
  }

  // ------------------------- DRAGGING -------------------------
  // Start dragging
  function startPointerDrag(e, cam) {
    e.preventDefault();
    setDraggingId(cam.id);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  // Move camera
  function onPointerMove(e) {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;

    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    // Update picked cameras state
    setPickedCameras(prev =>
      prev.map(p => (String(p.id) === String(draggingId) ? { ...p, x, y } : p))
    );

    setAssignedCameras(prev =>
      prev.map(a => (String(a.id) === String(draggingId) ? { ...a, x, y } : a))
    );
  }

  function endPointerDrag() {
    if (!draggingId) return;

    const positions = {};
    pickedCameras.forEach(c => {
      positions[c.id] = { x: c.x, y: c.y };
    });
    localStorage.setItem("cameraPositions", JSON.stringify(positions));

    setDraggingId(null);
  }




  useEffect(() => {
    if (!draggingId) return;

    const handleMove = e => onPointerMove(e);
    const handleUp = () => endPointerDrag();

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [draggingId, assignedCameras, selectedYard]);



  const handleSelectYard = async (yard) => {
    const yardId = yard.id || yard._id;
    if (!yardId) return alert("Invalid yard");

    setShowShimmer(true);

    try {
      const yardDetails = await getYardById(yardId);

      if (!yardDetails?.id && !yardDetails?._id) throw new Error("Yard details missing ID");

      setSelectedYard(yardDetails);

      const yardCameras = await getCameraById(yardId);
      setCameras(yardCameras);

      setPickedCameras(yardCameras.map(cam => ({
        id: cam.cameraId || cam.id,
        name: cam.name,
        x: cam.location?.x || 0,
        y: cam.location?.y || 0
      })));
    } catch (err) {
      console.error(err);
      setCameras([]);
      setPickedCameras([]);
    } finally {
      // keep shimmer visible briefly then hide
      setTimeout(() => setShowShimmer(false), 700);
    }
  };


  // save cameras (x,y) and load it when refresh

  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem("cameraPositions") || "{}");

    if (Object.keys(savedPositions).length > 0) {
      setPickedCameras(prev =>
        prev.map(c => {
          const pos = savedPositions[c.id];
          return pos ? { ...c, x: pos.x, y: pos.y } : c;
        })
      );
    }
  }, []);


  useEffect(() => {
    if (mode === "update" && selectedYard) {
      setCameraCount(selectedYard.assignedCameras?.length || 0);
    }
  }, [mode, selectedYard]);



  useEffect(() => {
    const loadYardsAndCameras = async () => {
      try {
        // Fetch all yards
        const resYards = await fetch(YardsBaseUrl(), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!resYards.ok) throw new Error(`HTTP error! status: ${resYards.status}`);
        const yardsData = await resYards.json();
        setYards(yardsData);

        // Fetch all yard cameras
        const camerasPromises = yardsData.map(async (yard) => {
          const res = await fetch(`${YardsBaseUrl()}/${yard.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data.yardCameras) ? data.yardCameras.map(a => ({ ...a, yardId: yard.id })) : [];
        });

        const camerasPerYard = await Promise.all(camerasPromises);
        const allAssignedCameras = camerasPerYard.flat();
        setAssignedCameras(allAssignedCameras);

      } catch (err) {
        console.error("Failed to load yards or cameras:", err);
      }
    };

    loadYardsAndCameras();
  }, []);


  // clear channel selection when popup closes
  useEffect(() => {
    if (!(expanded && showChannels)) setChannelToDownload(null);
  }, [expanded, showChannels]);



  const [downloadForm, setDownloadForm] = useState({
    date: "",
    hour: "",
    minute: "",
    resolution: ""
  });



  {/* download vodeo logic */ }

  const handleDownload = async () => {
    const { date, hour, minute, channelName, durationInMinutes } = downloadForm;

    if (!date || hour === "" || minute === "" || !channelName || !durationInMinutes) {
      console.error("All fields are required");
      return;
    }

    const iso = `${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;

    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const response = await DawnloadVideo(
        { channelName, dayWithTime: iso, durationInMinutes: parseInt(durationInMinutes) },
        progressEvent => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDownloadProgress(percent);
        }
      );
      alert("Video has downloaded")

      // same download logic as before
      const blob = new Blob([response.data], { type: "video/mp4" });
      let fileName = "video.mp4";
      const header = response?.headers?.["content-disposition"];
      if (header) {
        const match = header.match(/filename="?([^"]+)"?/);
        if (match) fileName = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Downloaded:", activeCam.name);
    } catch (err) {
      alert("Download failed");
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };



  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", position: "relative", paddingTop: "25px" }}>
      {showShimmer && (
        <div className="shimmer-overlay" />
      )}

      <div style={{ position: "absolute", top: "15px", right: "15px" }}>


        {/* Yard Settings Popup */}


        {showSettings && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: panelVisible
                ? "translate(-50%, -50%)"
                : "translate(100%, -50%)",
              background: theme === "dark" ? "linear-gradient(90deg, #1d2023 0%, #1d2023 40%, #334941 100%)" : "linear-gradient(90deg, #f5f9fd 0%, #f2f7fe 40%,  #8cf2b3ff 350%)",
              color: "white",
              borderRadius: "12px",
              padding: "40px",
              width: "100%",
              maxWidth: "1400px",
              maxHeight: "1000px",
              height: "100vh",
              zIndex: 2000,
              boxShadow: "5px 5px 10px 10px rgba(0,0,0,0.3)",
              overflowY: "auto",
              overflowX: "hidden",
              transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

              {/* Left side: Title + Subtitle */}
              <div>
                <h2 style={{ margin: 0, fontWeight: "bold", color: " #0df6c0" }}>
                  {mode == "update" ? "Update Yard Settings" : "Create Yard Settings"}
                </h2>
                <p style={{ margin: "3px 0 0 0", color: "#858282ff", fontSize: "15px" }}>
                  {mode == "update" ? "Update your current yard settings" : "Create and customize yards"}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={closeSettings}
                style={{
                  background: "transparent",
                  color: "#5eef96ff",
                  border: "none",
                  fontSize: "27px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}

                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(0.85)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1.0)";
                }}
              >
                ✖
              </button>
            </div>


            {/* Top Divider */}
            <div
              style={{
                height: "2px",
                margin: "10px 0",
                borderRadius: "1px",
                background:
                  "linear-gradient(to right, rgba(68,68,68,0), #444, rgba(68,68,68,0))",
              }}
            ></div>

            {!showCameraSetting && mode === "create" && yards.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={15}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                style={{ padding: "30px 10px", width: "100%" }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                }}
              >
                {yards.map((yard, index) => {
                  const camerasForThisYard = assignedCameras.filter(a => a.yardId === yard.id);

                  return (
                    <SwiperSlide key={yard.id || index} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                      <div
                        onClick={() => {
                          setSelectedYard(yard)
                        }}

                        onMouseEnter={() => setHoveredYardId(yard.id)}
                        onMouseLeave={() => setHoveredYardId(null)}
                        style={{
                          width: "260px",
                          position: "relative",
                          background: selectedYard?.id === yard.id
                            ? "linear-gradient(135deg, #1e3c72, #2a5298)"
                            : "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: selectedYard?.id === yard.id
                            ? "2px solid #6ec1ff"
                            : "2px solid rgba(255,255,255,0.1)",
                          boxShadow: selectedYard?.id === yard.id
                            ? "0 10px 35px rgba(110, 193, 255, 0.7)"
                            : hoveredYardId === yard.id
                              ? "0 10px 35px rgba(79, 209, 254, 0.6)"
                              : "0 5px 20px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                          transform: hoveredYardId === yard.id
                            ? "scale(1.08)"
                            : selectedYard?.id === yard.id
                              ? "scale(1.05)"
                              : "scale(1)",
                          transition: "transform 0.4s ease, background 0.5s ease, box-shadow 0.4s ease, border 0.4s ease",
                          color: "#fff",
                        }}
                      >
                        <h3 style={{
                          margin: "5px",
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          background: "linear-gradient(90deg, #4fd1fe, #3b82f6)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {yard.name}
                        </h3>

                        {confirming && yardToDelete?.id === yard.id && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "rgba(0,0,0,0.65)",
                              backdropFilter: "blur(4px)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 9999,
                              borderRadius: "12px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: "210px",
                                background: "#1b1b1b",
                                padding: "16px",
                                borderRadius: "10px",
                                textAlign: "center",
                                boxShadow: "0 0 12px rgba(0,0,0,0.6)",
                                border: "1px solid #333",
                              }}
                            >
                              <div style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "8px" }}>
                                Delete Yard?
                              </div>

                              <div style={{ fontSize: "13px", marginBottom: "14px" }}>
                                Are you sure you want to remove<br />
                                <strong>{yardToDelete?.name}</strong>?
                              </div>

                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  onClick={handleDelete}
                                  style={{
                                    flex: 1,
                                    padding: "8px 0",
                                    background: "#ff4444",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => { setConfirming(false); setYardToDelete(null); }}
                                  style={{
                                    flex: 1,
                                    padding: "8px 0",
                                    background: "#444",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        <img
                          src={yard.image || fieldImage}
                          alt={yard.name}
                          style={{ width: "100%", height: "160px", borderRadius: "10px", objectFit: "cover" }}
                        />

                        {/* Yard info */}
                        <div style={{
                          position: "absolute",
                          bottom: "0",
                          width: "100%",
                          textAlign: "center",
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: "3px 0",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                          fontSize: "13px",
                        }}>
                          <strong> Cameras: {camerasForThisYard?.length || 0}
                          </strong> <br /> Width: {yard.width}%, Height: {yard.height}%
                        </div>

                        {/* 3-dots button */}
                        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                          <button
                            onClick={() => toggleMenu(yard.id)}
                            style={{
                              background: "rgba(0,0,0,0.5)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              padding: "6px 8px",
                              cursor: "pointer",
                              fontSize: "18px",
                              transition: "background 0.3s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#0df6c0"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                          >
                            ⋮
                          </button>

                          {menuOpenId === yard.id && (
                            <div style={{
                              position: "absolute",
                              top: "35px",
                              right: 0,
                              background: "#111",
                              borderRadius: "8px",
                              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                              zIndex: 1000,
                              display: "flex",
                              flexDirection: "column",
                            }}>
                              <button
                                onClick={() => confirmDelete(yard)}
                                style={{
                                  padding: "10px 15px",
                                  background: "none",
                                  border: "none",
                                  color: "#ff5555",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "background 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#333"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => {
                                  setMode("update");
                                  fetchAllCameras();
                                  setSelectedYard(yard);
                                  setYardName(yard.name || "");
                                  setDescription(yard.description || "");
                                  setWidth(yard.width || 80);
                                  setHeight(yard.height || 80);
                                  setCameraCount(Array.isArray(yard.assignedCameras) ? yard.assignedCameras.length : (yard.cameraCount || 0));
                                  setShowCameraSetting(false);
                                  setShowSettings(true);
                                  setTimeout(() => setPanelVisible(true), 20);
                                }}
                                style={{
                                  padding: "10px 15px",
                                  background: "none",
                                  border: "none",
                                  color: "#0df6c0",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "background 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#333"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}
                              >
                                Update
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}

              </Swiper>
            )}

            {/* Bottom Divider*/}
            <div
              style={{
                height: "2px",
                margin: "10px 0",
                borderRadius: "1px",
                background: "linear-gradient(to right, rgba(68,68,68,0), #444, rgba(68,68,68,0))",
              }}
            ></div>


            {/* SWITCH BETWEEN YARD FORM AND CAMERA FORM */}


            {!showCameraSetting ? (
              // ---------------- YARD FORM ----------------
              <div
                style={{
                  position: "relative",
                  width: "95.7%",
                  background: "#1e1e1e",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  boxShadow: "0 0 15px rgba(0,0,0,0.4)",
                }}
              >
                {mode === "create" ? (
                  <>
                    {/* Yard Name */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", color: "#90ee90", marginBottom: "5px", fontWeight: "bold" }}>
                        Yard Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter yard name"
                        pattern="/^(?=.*\S).+$/ "
                        value={yardName}
                        onChange={(e) => {
                          setYardName(e.target.value);
                          setPreviewYard((prev) => ({ ...prev, yardName: e.target.value }));
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#111",
                          color: "#fff",
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", color: "#90ee90", marginBottom: "5px", fontWeight: "bold" }}>
                        Description
                      </label>
                      <textarea
                        placeholder="Enter a short description of the yard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#111",
                          color: "#fff",
                        }}
                      />
                    </div>

                    {/* Width & Height */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", color: "#90ee90", marginBottom: "5px", fontWeight: "bold" }}>
                          Width (%)
                        </label>
                        <input
                          type="number"
                          min={60}
                          max={100}
                          placeholder="Width in %"
                          value={width}
                          onChange={(e) => {
                            setWidth(Number(e.target.value));
                            setPreviewYard((prev) => ({ ...prev, width: Number(e.target.value) }));
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#111",
                            color: "#fff",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", color: "#90ee90", marginBottom: "5px", fontWeight: "bold" }}>
                          Height (%)
                        </label>
                        <input
                          type="number"
                          min={60}
                          max={100}
                          placeholder="Height in %"
                          value={height}
                          onChange={(e) => {
                            setHeight(Number(e.target.value));
                            setPreviewYard((prev) => ({ ...prev, height: Number(e.target.value) }));
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#111",
                            color: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Camera Count */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", color: "#90ee90", marginBottom: "5px", fontWeight: "bold" }}>
                        Number of Cameras
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="Enter number of cameras"
                        value={assignedCameras.length}
                        onChange={(e) => setCameraCount(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#111",
                          color: "#fff",
                        }}
                      />
                    </div>

                    {/* Create Yard Button */}
                    <button
                      onClick={handleSaveYard}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "linear-gradient(90deg, #97f2fc 40%, #0df6c0 75%)",
                        color: "#111",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      Create Yard
                    </button>
                  </>

                ) : (
                  <>
                    {/* FULL YARD IMAGE */}
                    {selectedYard && (
                      <div
                        style={{
                          maxWidth: "600px",
                          width: "90%",
                          margin: "20px auto",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                          position: "relative",
                          background: "#111",
                        }}
                      >
                        {/* Back button */}
                        <button
                          onClick={() => setMode("create")}
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 10,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,246,192,0.8)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
                        >
                          ← Back
                        </button>

                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            background: "rgba(20, 20, 20, 0.8)",
                            padding: "6px 12px",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "35px",
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
                            backdropFilter: "blur(4px)",
                            fontSize: "13px",
                            color: "#fff",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontWeight: "700", color: "#0df6c0" }}>
                            {selectedYard?.name || "Unnamed Yard"}
                          </div>

                          <div style={{ color: "#ddd" }}>
                            Size: {selectedYard?.width}% × {selectedYard?.height}%
                          </div>

                          <div style={{ fontWeight: "600", color: "#f0dbad" }}>
                            Cameras: {selectedYard?.assignedCameras?.length || 0}
                          </div>

                          {selectedYard?.description && (
                            <div style={{ fontStyle: "italic", color: "#bbb", maxWidth: "100%" }}>
                              {selectedYard.description}
                            </div>
                          )}
                        </div>

                        <img
                          src={selectedYard?.image || fieldImage}
                          alt={selectedYard?.name || "Yard"}
                          style={{
                            width: "100%",
                            maxHeight: "470px",
                            height: "auto",
                            display: "block",
                            objectFit: "contain",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            margin: "0 auto",
                          }}
                        />
                      </div>
                    )}


                    {/* YARD TITLE */}
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        background: "#111",
                        color: "#f0dbadff",
                        textAlign: "center",
                        borderRadius: "10px",
                        padding: "12px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {selectedYard ? selectedYard.name : "Select a yard from above"}
                    </div>

                    {/* FORM FIELDS WITH HINTS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                      {/* Yard Name */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#f0dbad", fontSize: "14px", marginBottom: "5px" }}>
                          Yard Name
                        </span>
                        <input
                          type="text"
                          placeholder="Enter new yard name"
                          value={yardName}
                          onChange={(e) => setYardName(e.target.value)}
                          style={{
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#111",
                            color: "#fff",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>

                      {/* Description */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#f0dbad", fontSize: "14px", marginBottom: "5px" }}>
                          Description
                        </span>
                        <textarea
                          placeholder="Enter yard description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          style={{
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#111",
                            color: "#fff",
                            transition: "all 0.3s ease",
                            resize: "none",
                          }}
                        />
                      </div>

                      {/* Width & Height */}
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#f0dbad", fontSize: "14px", marginBottom: "5px" }}>
                            Width (%)
                          </span>
                          <input
                            type="number"
                            defaultValue={80}
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            style={{
                              padding: "12px",
                              borderRadius: "10px",
                              border: "none",
                              background: "#111",
                              color: "#fff",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#f0dbad", fontSize: "14px", marginBottom: "5px" }}>
                            Height (%)
                          </span>
                          <input
                            type="number"
                            defaultValue={80}
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            style={{
                              padding: "12px",
                              borderRadius: "10px",
                              border: "none",
                              background: "#111",
                              color: "#fff",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* Camera Count */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#f0dbad", fontSize: "14px", marginBottom: "5px" }}>
                          Number of Cameras
                        </span>
                        <input
                          type="number"
                          value={selectedYard?.assignedCameras?.length || 0}
                          onChange={(e) => setCameraCount(Number(e.target.value))}
                          style={{
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#111",
                            color: "#fff",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                      <button
                        onClick={() => setShowCameraSetting(true)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "linear-gradient(90deg, #fefbe9 50%, #f4d590ff 150%)",
                          color: "#111",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        Manage Cameras
                      </button>
                      <button
                        onClick={handleUpdateYard}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "linear-gradient(90deg, #6fb1fc 0%, #4364f7 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        Save Edits
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (


              // ---------------- CAMERA SETTINGS ----------------

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  width: "100%",
                  padding: "25px",
                  background: "#1e1e1e",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              >
                {/* Yard with picked cameras overlay */}
                <div
                  ref={containerRef}
                  style={{
                    flex: 2,
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "650px",
                    boxShadow: "0 0 25px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={selectedYard?.image || fieldImage3}
                    alt="Yard"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* Yard Info Tape */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                      background: "rgba(0,0,0,0.65)",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      color: "#fff",
                      zIndex: 1000,
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 0 12px rgba(0,0,0,0.4)"
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0df6c0" }}>
                      {selectedYard?.name}
                    </h2>

                    <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#ddd" }}>
                      Size: {selectedYard?.width}% × {selectedYard?.height}%
                    </p>

                    {selectedYard?.description && (
                      <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#bbb" }}>
                        Cameras : {cameraCount}
                      </p>
                    )}
                  </div>


                  {/* Picked Cameras overlay at the right */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "0px",
                      width: "266px",
                      maxHeight: "90%",
                      background: "rgba(17,17,17,0.95)",
                      padding: "15px",
                      borderRadius: "12px",
                      overflowY: "auto",
                      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                      zIndex: 1000,
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px", color: "#f0dbad" }}>Picked Cameras</h3>
                    {pickedCameras.length === 0 ? (
                      <p style={{ color: "#888" }}>No cameras picked yet.</p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        {pickedCameras.map(cam => (
                          <div
                            key={cam.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#222",
                              borderRadius: "12px",
                              padding: "10px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              border: "2px solid #444",
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = "#0df6c0";
                              e.currentTarget.style.boxShadow = "0 0 15px rgba(13,246,192,0.5)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = "#444";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{ fontSize: "24px", marginBottom: "5px" }}>📷</div>
                            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                              {cam.name}
                            </div>
                            <button
                              onClick={() => handleRemovePickedCamera(cam)}
                              style={{
                                marginTop: "5px",
                                background: "#0df6c0",
                                border: "none",
                                borderRadius: "6px",
                                padding: "2px 6px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                fontSize: "12px",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#f0dbad")}
                              onMouseLeave={e => (e.currentTarget.style.background = "#0df6c0")}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cameras on yard */}
                  {pickedCameras.map(cam => (
                    <div
                      key={cam.id}
                      onPointerDown={e => startPointerDrag(e, cam)}
                      style={{
                        position: "absolute",
                        top: `${cam.y}%`,
                        left: `${cam.x}%`,
                        transform: "translate(-50%, -50%)",
                        cursor: "grab",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "#0df6c0",
                        border: "2px solid #000",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        opacity: hoveredCameraId === cam.id ? 1 : 0.7,
                        transition: "opacity 0.2s ease",
                        zIndex: draggingId === cam.id ? 1000 : 500,
                        userSelect: "none",
                      }}
                      onMouseEnter={() => setHoveredCameraId(cam.id)}
                      onMouseLeave={() => setHoveredCameraId(null)}
                    >
                      {/* Camera Icon */}
                      <div style={{ fontSize: "20px", marginBottom: "2px" }}>🎥</div>

                      {/* Camera Name */}
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#000",
                          textAlign: "center",
                          lineHeight: "10px",
                        }}
                      >
                        {cam.name}
                      </div>
                    </div>
                  ))}

                </div>

                {/* ---------------- AVAILABLE CAMERAS (BELOW IMAGE) ---------------- */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  {cameras.length === 0 ? (
                    <p style={{ color: "#888" }}>No cameras available.</p>
                  ) : (
                    cameras.map(cam => {
                      const isPicked = pickedCameras.some(c => String(c.id) === String(cam.id));
                      const isAssignedToOtherYard = assignedCameras.some(
                        a => (a.camera?.id || a.cameraId || a.id) === cam.id && a.yardId !== selectedYard?.id
                      );

                      return (
                        <div
                          key={cam.id}
                          onClick={() => !isPicked && !isAssignedToOtherYard && handleAddCameraToYard(cam)}
                          style={{
                            position: "relative",
                            background: isPicked ? "#0df6c0" : isAssignedToOtherYard ? "#666" : "#222",
                            border: isPicked ? "2px solid #0df6c0" : isAssignedToOtherYard ? "2px solid #999" : "2px solid #444",
                            borderRadius: "12px",
                            padding: "15px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: isPicked || isAssignedToOtherYard ? "not-allowed" : "pointer",
                            transform: isPicked ? "scale(1.07)" : "scale(1)",
                            opacity: isPicked ? 1 : isAssignedToOtherYard ? 0.6 : 0.85,
                            transition: "all 0.25s ease",
                          }}
                          onMouseEnter={e => {
                            if (!isPicked && !isAssignedToOtherYard) {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.borderColor = "#0df6c0";
                              e.currentTarget.style.boxShadow =
                                "0 0 15px rgba(13,246,192,0.5)";
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = isPicked ? "scale(1.07)" : "scale(1)";
                            e.currentTarget.style.borderColor = isPicked ? "#0df6c0" : isAssignedToOtherYard ? "#999" : "#444";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {/* Assigned to This Yard Badge */}
                          {isPicked && (
                            <div
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                background: "#111",
                                color: "#0df6c0",
                                padding: "3px 6px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "700",
                              }}
                            >
                              ✓ Assigned
                            </div>
                          )}

                          {/* Assigned to Other Yard Badge */}
                          {isAssignedToOtherYard && (
                            <div
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                background: "#ff6b6b",
                                color: "#fff",
                                padding: "3px 6px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "700",
                              }}
                            >
                              ⚠ In Use
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: "32px",
                              color: isPicked ? "#111" : isAssignedToOtherYard ? "#999" : "#0df6c0",
                              marginBottom: "10px",
                            }}
                          >
                            📷
                          </div>

                          <div
                            style={{
                              fontWeight: "600",
                              color: isPicked ? "#111" : isAssignedToOtherYard ? "#999" : "#fff",
                              textAlign: "center",
                            }}
                          >
                            {cam.name}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: isPicked ? "#222" : isAssignedToOtherYard ? "#777" : "#888",
                              marginTop: "4px",
                            }}
                          >
                            {cam.id}
                          </div>
                        </div>
                      );
                    })
                  )}


                  {/* confirm manage button */}


                </div>

                <button
                  onClick={() => setShowCameraSetting(false)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                    cursor: "pointer",
                    border: "none",
                    alignSelf: "flex-start",
                    width: "35%",
                    fontWeight: "bold",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 0 12px rgba(0,0,0,0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0df6c0")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#333")}
                >
                  Back to update settings
                </button>

                <button
                  onClick={async () => {

                    const yardId = selectedYard?.id;
                    if (!yardId) {
                      alert("Select a yard first.");
                      return;
                    }

                    try {
                      // Extract camera IDs - handle both nested (camera.id) and flat (cameraId, id) structures
                      const existingIds = assignedCameras
                        .filter(a => a.yardId === selectedYard.id)
                        .map(a => String(a.camera?.id || a.cameraId || a.id));

                      for (const cam of pickedCameras) {
                        if (!existingIds.includes(String(cam.id))) {
                          // Check if camera is already assigned to ANY other yard
                          const assignedToOtherYard = assignedCameras.find(
                            a => (a.camera?.id || a.cameraId || a.id) === cam.id && a.yardId !== selectedYard.id
                          );

                          if (assignedToOtherYard) {
                            console.log("Camera already assigned to another yard, skipping:", cam);
                            alert(`Camera "${cam.name}" is already assigned to another yard. A camera can only be assigned to one yard at a time.`);
                          } else {
                            await createCamera({
                              yardId: yardId,
                              cameraId: cam.id,
                              location: { x: cam.x, y: cam.y }
                            });
                          }
                        } else {
                          console.log("Camera already assigned, skipping:", cam);
                        }
                      }

                      const pickedIds = pickedCameras.map(c => String(c.id));

                      const toUnassign = assignedCameras.filter(
                        a => a.yardId === selectedYard.id && !pickedIds.includes(String(a.camera?.id || a.cameraId || a.id))
                      );

                      for (const cam of toUnassign) {
                        await DeleteYardCamera(yardId, cam.camera?.id || cam.cameraId || cam.id);
                      }

                      alert("Cameras updated successfully!");

                      setAssignedCameras(prev =>
                        prev
                          .filter(a => a.yardId !== yardId) // keep cameras of other yards
                          .concat(
                            pickedCameras.map(c => ({
                              cameraId: c.id,
                              yardId: yardId,       // <-- make sure yardId is included
                              location: { x: c.x, y: c.y }
                            }))
                          )
                      );


                    } catch (err) {
                      console.error("Failed to update cameras:", err);
                      alert("Failed to update cameras. Check console for details.");
                    }
                  }}

                  style={{
                    padding: "12px",
                    background: "linear-gradient(90deg, #6fb1fc 0%, #4364f7 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "4px",
                    width: "100%",
                    fontWeight: "bold",
                  }}

                >
                  Confirm Manage
                </button>
              </div>

            )}

          </div>
        )}
      </div>



      {/*


                    ************************  MAIN PAGE ************************



*/}



      {/* Main Yard Display */}
      <div
        className="main-container"
        style={{ display: "flex", width: "100%", height: "100vh" }}>
        {/* Left Sidebar */}
        {!expanded && (
          <aside
            className="left-side"
            style={{
              width: "25%",
              minWidth: "288px",
              background: theme === "dark" ? " #141515 " : "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              borderRight: "1px solid #ccc",
              boxShadow: "0 0 25px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: expanded ? 0 : 1,
              transform: expanded ? "translateX(-20px)" : "translateX(0)",
            }}
          >
            {/* Header */}
            <div style={{ padding: "0.5rem 1.5rem", borderBottom: "1px solid #ccc", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    padding: "0.625rem",
                    borderRadius: "1rem",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={1.5}
                    style={{ width: "28px", height: "28px" }}
                  >
                    {/* Field Outline */}
                    <rect x="2" y="2" width="20" height="20" rx="1" ry="1" stroke="white" fill="rgba(0,0,0,0)" />

                    {/* Center Line */}
                    <line x1="12" y1="2" x2="12" y2="22" stroke="white" />

                    {/* Center Circle */}
                    <circle cx="12" cy="12" r="3" stroke="white" />

                    {/* Left Goal Box */}
                    <rect x="2" y="8" width="4" height="8" stroke="white" fill="rgba(0,0,0,0)" />

                    {/* Right Goal Box */}
                    <rect x="18" y="8" width="4" height="8" stroke="white" fill="rgba(0,0,0,0)" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: "bold", color: theme === "dark" ? "white" : "black", WebkitBackgroundClip: "text" }}>Yards</h2>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Manage Your Yards</p>
                </div>
              </div>

              {/* Gear Icon above the divider */}
              <div
                onClick={() => {
                  openSettings();
                  setShowCameraSetting(false);
                }}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "35px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#90ee90",
                  transition: "transform 0.3s ease, color 0.3s ease",
                  zIndex: 3000,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#006400";
                  e.currentTarget.style.transform = "rotate(45deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#90ee90";
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                ⚙️
              </div>

              {/* Search bar */}

              <div style={{
                paddingTop: "0.75rem",
                position: "sticky",
                paddingRight: "5%",
                paddingBottom: "0.5rem",
                top: 0,
                background: theme === "dark" ? "#141515" : "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                zIndex: 20,
              }}>
                <input
                  type="text"
                  placeholder="Search yards..."
                  value={yardSearch}
                  onChange={(e) => setYardSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem",
                    borderRadius: "0.75rem",
                    border: theme === "dark" ? "1px solid gray" : "1px solid #bbb",
                    fontSize: "0.875rem",
                    outline: "none",
                    background: theme === "dark" ? "#141515" : "rgba(255,255,255,0.6)",
                    transition: "all 0.25s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #3b82f6";
                    e.target.style.boxShadow = "0 0 10px rgba(59,130,246,0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid #bbb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  borderRadius: "1rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth={1.7}
                  style={{ width: "28px", height: "28px" }}
                >
                  <defs>
                    <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  <rect x="2" y="2" width="20" height="20" rx="1" ry="1" fill="white" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <rect x="2" y="8" width="4" height="8" fill="rgba(255,255,255,0.8)" />
                  <rect x="18" y="8" width="4" height="8" fill="rgba(255,255,255,0.8)" />
                </svg>

                <h3 style={{ color: theme === "dark" ? "#fff" : "black", margin: 0 }}>
                  Available Yards ({yards.length})
                </h3>

                <button
                  onClick={handleToggleTheme}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80px",
                    height: "36px",
                    padding: "0 5px",
                    marginLeft: "22%",
                    borderRadius: "20px",
                    border: "2px solid #2563eb",
                    background: theme === "light" ? "#e5e7eb" : "#1f2937",
                    color: theme === "light" ? "#000" : "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    transition: "background 0.25s, color 0.25s"
                  }}
                >
                  {/* Light icon */}
                  <span style={{ opacity: theme === "light" ? 1 : 0.4 }}>☀</span>

                  {/* Toggle circle */}
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: theme === "light" ? "3px" : "calc(100% - 3px - 26px)",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: theme === "light"
                        ? "linear-gradient(90deg, yellow 75%, darkblue 90%)"
                        : "linear-gradient(90deg, yellow 1%, darkblue 30%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "left 0.25s, background 0.25s",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: theme === "light" ? "#fff" : "#000"
                    }}
                  >
                    {theme === "light" ? "☀" : "࣪☾"}
                  </div>

                  {/* Dark icon */}
                  <span style={{ opacity: theme === "dark" ? 1 : 0.4 }}>࣪☾</span>
                </button>


              </div>

            </div>

            {/* Navigation / Yard List */}
            <nav style={{
              flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", scrollbarWidth: "thin",
              scrollbarColor: theme === "dark" ? "rgba(13,246,192,0.5) rgba(0,0,0,0.3)" : "white rgba(0,0,0,0.3)"
            }}>

              {yards
                ?.filter((yard) =>
                  yard?.name?.toLowerCase().includes(yardSearch.toLowerCase())
                )
                .map((yard) => (
                  <div
                    key={yard.id}
                    onClick={async () => {
                      setShowShimmer(true)
                      try {
                        const yardDetails = await getYardById(yard.id);
                        setSelectedYard(yardDetails);
                      } catch (err) {
                        console.error(err);
                        setCameras([]);
                      } finally {
                        setTimeout(() => setShowShimmer(false), 700);
                      }
                    }}

                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "0.75rem",
                      borderRadius: "1rem",
                      cursor: "pointer",
                      position: "relative",

                      /* GALAXY GRADIENT */
                      background:
                        selectedYard?.id === yard.id
                          ? "linear-gradient(135deg, #1e3a8a, #3b82f6, #6366f1)"
                          : "linear-gradient(135deg, #c8c8cbff, #acacaeff)",

                      backgroundSize: selectedYard?.id === yard.id ? "240% 240%" : "120% 120%",
                      backgroundPosition: selectedYard?.id === yard.id ? "100% 0%" : "0% 0%",

                      /* BORDER + GLOW */
                      border: "none",

                      boxShadow:
                        selectedYard?.id === yard.id
                          ? "0 0 25px rgba(120, 180, 255, 0.55)"
                          : "0 0 14px rgba(0, 0, 50, 0.35)",

                      transition:
                        "background-position 0.6s ease, transform 0.25s ease, box-shadow 0.35s ease, border 0.35s ease",

                      /* TEXT COLOR */
                      color: selectedYard?.id === yard.id ? "white" : "#272728ff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0 0 45px rgba(120, 180, 255, 0.75)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        selectedYard?.id === yard.id
                          ? "0 0 25px rgba(120, 180, 255, 0.55)"
                          : "0 0 14px rgba(0, 0, 50, 0.35)";
                    }}
                  >
                    <img
                      src={yard.image || fieldImage}
                      alt={yard.name}
                      style={{ width: "100%", height: "275px", borderRadius: "0.5rem", objectFit: "cover", marginBottom: "0.25rem" }}
                    />
                    <p style={{ fontWeight: "bold", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{yard.name} Yard</p>
                  </div>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div style={{ padding: "1rem", borderTop: "1px solid #ccc", justifyContent: "center" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.7rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#ef4444,#ec4899)",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  border: "none",
                  fontSize: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                }}
              >
                <span>Logout</span>
              </button>
            </div>
          </aside>

        )}








        {/* Right Section: Yard Image + Info (75%) */}






        <div
          className="right-side"
          style={{
            width: expanded ? "100%" : "75%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: expanded ? "hidden" : "auto",
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {selectedYard && (
            <div
              className="yard-image"
              style={{
                position: "relative",
                width: expanded ? "100%" : "100%",
                height: expanded ? "150%" : "auto",
                maxWidth: expanded ? "100%" : "1400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: expanded ? 0 : "0 20px",

                /* THE MAGIC */
                transform: expanded ? "scale(1.08)" : "scale(1)",
                opacity: expanded ? 1 : 0.95,
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",

                /* No forced jumps */
                overflow: "hidden",
                zIndex: expanded ? 9999 : 2,
                cursor: "pointer",
              }}
              onClick={() => {
                setExpanded(prev => !prev);
                setHovered(true);
                setShowChannels(false);
              }}
            >

              <div
                style={{
                  width: "100%",
                  height: expanded ? "100%" : "auto",
                  borderRadius: expanded ? 0 : "20px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "border-radius 0.6s cubic-bezier(0.22,1,0.36,1), height 0.6s ease-in-out",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => !expanded && setHovered(false)}
              >
                {!expanded && (
                  <div
                    style={{
                      position: "fixed",
                      top: "25%",
                      left: "25%",
                      width: "50%",
                      height: "50%",
                      border: "none",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 0) 60%)",
                      zIndex: 9999,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "35px"
                    }}
                  >
                    <p style={{ position: "relative", width: "2px", height: "25px", fontSize: "35px" }}>🔍</p>
                  </div>
                )}

                {/* Main image */}
                <img
                  src={expanded ? fieldImage3 : selectedYard.image || fieldImage2}
                  alt={selectedYard.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: hovered ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.5s ease, opacity 0.6s ease",
                  }}
                />

                {/* Hover overlay only in normal mode */}
                {!expanded && (
                  <img
                    src={selectedYard.hoverImage || fieldImage3}
                    alt={`${selectedYard.name} hover`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: hovered ? 1 : 0,
                      transition: "opacity 0.6s ease, transform 0.9s ease",
                    }}
                  />
                )}

                {/* Cameras overlay */}
                {expanded && hovered && cameras?.length > 0 &&
                  pickedCameras.map(cam => (
                    <div
                      key={cam.id}
                      style={{
                        position: "absolute",
                        top: `${cam.y}%`,
                        left: `${cam.x}%`,
                        transform: "translate(-50%, -50%)",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(13, 246, 192, 0.8)",
                        border: "0.5px solid #000",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: 0.8,
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#000",
                        textAlign: "center",
                        padding: "5px",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={e => (e.currentTarget.style.opacity = 0.7)}
                      onClick={e => {
                        e.stopPropagation();
                        if (activeCam?.id === cam.id) {
                          setShowChannels(prev => !prev);
                        } else {
                          setActiveCam(cam);
                          setShowChannels(true);
                        }
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>🎥</span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#000",
                          marginTop: "3px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <strong>{cam.name}</strong>
                      </span>
                    </div>
                  ))}

                {expanded && showChannels && activeCam && (() => {
                  const popupHeight = 260;
                  const popupWidth = 260;

                  const pointTop = (window.innerHeight * activeCam.y) / 100;
                  const pointLeft = (window.innerWidth * activeCam.x) / 100;

                  // centered position in px
                  let topPx = pointTop - popupHeight / 2;
                  let leftPx = pointLeft - popupWidth / 2;

                  // Try placing above if below doesn't fit
                  if (pointTop + popupHeight > window.innerHeight) {
                    topPx = pointTop - popupHeight - 90;  // moves above the camera
                  }


                  // clamp vertically
                  if (topPx < 0) topPx = 0;
                  if (topPx + popupHeight > window.innerHeight)
                    topPx = window.innerHeight - popupHeight;

                  // clamp horizontally
                  if (leftPx < 0) leftPx = 0;
                  if (leftPx + popupWidth > window.innerWidth)
                    leftPx = window.innerWidth - popupWidth;


                  return (
                    <div
                      style={{
                        position: "absolute",
                        top: `${topPx}px`,
                        left: `${leftPx}px`,
                        width: `${popupWidth}px`,

                        // THE FIX:
                        maxHeight: "80vh",
                        overflowY: "auto",

                        background: "rgba(0,0,0,0.9)",
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "15px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        zIndex: 3000,
                        fontFamily: "Arial, sans-serif"
                      }}

                      onClick={e => e.stopPropagation()}
                    >
                      {/* DATE */}
                      <h3 style={{ color: "#0df6c0", margin: "auto", justifyContent: "center" }}>{activeCam?.name}</h3>
                      <fieldset style={{ border: "1px solid #555", borderRadius: "8px", padding: "10px" }}>
                        <legend style={{ color: "#0df6c0", fontWeight: 300 }}>Select Date</legend>
                        <input
                          type="date"
                          value={downloadForm.date}
                          onChange={e => setDownloadForm(prev => ({ ...prev, date: e.target.value }))}
                          style={{ width: "95%", padding: "6px", borderRadius: "6px", border: "1px solid #444" }}
                        />
                      </fieldset>

                      {/* TIME */}
                      <fieldset style={{ border: "1px solid #555", borderRadius: "8px", padding: "10px" }}>
                        <legend style={{ color: "#0df6c0", fontWeight: 300 }}>Select Time</legend>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="number"
                            placeholder="Hour"
                            min="0"
                            max="23"
                            value={downloadForm.hour}
                            onChange={e => setDownloadForm(prev => ({ ...prev, hour: e.target.value }))}
                            style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #444" }}
                          />
                          <input
                            type="number"
                            placeholder="Minute"
                            min="0"
                            max="59"
                            value={downloadForm.minute}
                            onChange={e => setDownloadForm(prev => ({ ...prev, minute: e.target.value }))}
                            style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #444" }}
                          />
                        </div>
                      </fieldset>

                      {/* DURATION */}
                      <fieldset style={{ border: "1px solid #555", borderRadius: "8px", padding: "10px" }}>
                        <legend style={{ color: "#0df6c0", fontWeight: 300 }}>Duration (minutes)</legend>
                        <input
                          type="number"
                          placeholder="Minutes"
                          min="1"
                          value={downloadForm.durationInMinutes}
                          onChange={e => setDownloadForm(prev => ({ ...prev, durationInMinutes: e.target.value }))}
                          style={{ width: "95%", padding: "6px", borderRadius: "6px", border: "1px solid #444" }}
                        />
                      </fieldset>

                      {/* RESOLUTION */}
                      <fieldset style={{ border: "1px solid #555", borderRadius: "8px", padding: "10px" }}>
                        <legend style={{ color: "#0df6c0", fontWeight: 300 }}>Select Resolution</legend>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {[activeCam.channel640X360, activeCam.channel704X576, activeCam.channel2560X1440]
                            .filter(ch => ch && ch.name)
                            .map(ch => (
                              <label key={ch.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                  type="radio"
                                  name="resolution"
                                  value={ch.name}
                                  checked={downloadForm.channelName === parseInt(ch.name)}
                                  onChange={e => setDownloadForm(prev => ({
                                    ...prev,
                                    channelName: parseInt(e.target.value)
                                  }))}
                                  style={{ accentColor: "#0df6c0" }}
                                />
                                ({ch.resolution})
                              </label>
                            ))}
                        </div>
                      </fieldset>

                      {/* DOWNLOAD BUTTON */}
                      <button
                        style={{
                          background: "#0df6c0",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          color: "#000",
                          fontWeight: 700,
                          cursor: "pointer",
                          marginTop: "5px"
                        }}
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? "Downloading..." : "Download"}
                      </button>
                      {isDownloading && (
                        <div style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: "12px",
                          zIndex: 9999,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pointerEvents: "auto", // blocks clicks underneath
                        }}>
                          <svg viewBox="0 0 36 36" width="120" height="120">
                            <path
                              d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#555"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#0df6c0"
                              strokeWidth="3"
                              strokeDasharray={`${downloadProgress}, 100`}
                              strokeLinecap="round"
                            />
                            <text x="18" y="20.35" fill="#fff" fontSize="6" textAnchor="middle">
                              {downloadProgress}%
                            </text>
                          </svg>
                        </div>
                      )}

                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Info Panels below yard image */}
          {!expanded && selectedYard && (
            <div
              className="info-panels"
              style={{
                width: "95%",
                maxWidth: "900px",
                marginTop: "30px",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              {/* Yard Info */}
              <div
                style={{
                  flex: 1,
                  background: "rgba(28,28,28,0.9)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "15px",
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                  border: theme === "dark" ? "1px solid rgba(100,100,100,0.1)" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  height: "230px",
                  overflow: "hidden",
                }}
              >
                {/* Title Div */}
                <div style={{ flex: "0 0 auto" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontWeight: 900,
                      background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "25px",
                    }}
                  >
                    {selectedYard?.name}
                  </h2>
                </div>

                {/* Content Div */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1" }}>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}><strong style={{ fontWeight: 900 }}>Width : </strong> {selectedYard?.width}%</p>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}><strong style={{ fontWeight: 900 }}>Height : </strong> {selectedYard?.height}%</p>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}><strong style={{ fontWeight: 900 }}>Cameras : </strong> {pickedCameras.length || 0}</p>
                  <p style={{ margin: "4px 0", fontSize: "14px" }}><strong style={{ fontWeight: 900 }}>Description : </strong> {selectedYard?.description || "No description"}</p>
                </div>

                {/* Button Div */}
                <div style={{ flex: "0 0 auto" }}>
                  <button
                    onClick={openUpdateSettings}
                    style={{
                      padding: "10px 12px",
                      background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                      color: "#000",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                      transition: "all 0.3s ease",
                      width: "100%",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(255,106,0,0.4)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    ✏️ Update Yard
                  </button>
                </div>
              </div>

              {/* Assigned Cameras */}
              <div
                style={{
                  width: "250px",
                  background: "rgba(28,28,28,0.9)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "15px",
                  color: "#fff",
                  boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                  border: theme === "dark" ? "1px solid rgba(100,100,100,0.1)" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  height: "230px",
                  overflow: "hidden",
                }}
              >
                {/* Title Div */}
                <div style={{ flex: "0 0 auto" }}>
                  <h3
                    style={{
                      margin: 0,
                      background: "linear-gradient(90deg, #1ea711, #0df6c0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 900,
                    }}
                  >
                    Assigned Cameras
                  </h3>
                </div>

                {/* Content Div - Scrollable */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "5px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(13,246,192,0.5) rgba(0,0,0,0.3)",
                  }}
                >
                  {pickedCameras.length > 0 ? (
                    pickedCameras.map(cam => (
                      <div
                        key={cam.id}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          background: "rgba(0,0,0,0.3)",
                          display: "flex",
                          flexDirection: "column",
                          transition: "background 0.2s",
                          cursor: "pointer",
                          fontSize: "11px",
                          marginBottom: "4px",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,246,192,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
                      >
                        <strong>{cam.name}</strong>
                        <div style={{ fontSize: "10px", marginTop: "2px", color: "#aaa" }}>
                          ID: {cam.id}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>No cameras assigned.</p>
                  )}
                </div>

                {/* Button Div */}
                <div style={{ flex: "0 0 auto" }}>
                  <button
                    onClick={openCameraManagement}
                    style={{
                      padding: "10px 12px",
                      background: "linear-gradient(90deg, #1ea711, #0df6c0)",
                      color: "#000",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                      transition: "all 0.3s ease",
                      width: "100%",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(13,246,192,0.4)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    🎥 Manage Cameras
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}