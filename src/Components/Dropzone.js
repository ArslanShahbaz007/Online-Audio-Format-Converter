import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import "./styledropzone.css";
import { IoCloudUpload } from "react-icons/io5";
import { MdAudiotrack } from "react-icons/md";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { CircleLoader } from "react-spinners";
import { convertToAudio, downloadAudio } from "./utilityfunctions/convert";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { toast } from "react-toastify";

function MyDropzone() {
  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const [actions, setActions] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [isConverting, setIsConverting] = useState({});
  const [data, setdata] = useState({});
  const [fileOptionsMap, setFileOptionsMap] = useState({});
  const [disabledButton, setDisabledButton] = useState({});
  const options = ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"];
  const defaultOption = options[0];
  const [ongoingConversions, setOngoingConversions] = useState(0);
 
  const handleConvert = async (selectedVideo) => {
    try {
      setIsConverting((prevStatus) => ({
        ...prevStatus,
        [selectedVideo.name]: true,
      }));
      setTaskStatus((prevStatus) => ({
        ...prevStatus,
        [selectedVideo.name]: false,
      }));
      setOngoingConversions((prevCount) => prevCount + 1);
      let result = await convertToAudio(
        selectedVideo,
        ffmpegRef,
        fileOptionsMap[selectedVideo.name]
      );
      if (result) {
        const { data, selectedVideo } = result;
        setdata((prevStatus) => ({
          ...prevStatus,
          [selectedVideo.name]: data,
        }));
      }
      setTaskStatus((prevStatus) => ({
        ...prevStatus,
        [selectedVideo.name]: true,
      }));
      setIsConverting((prevStatus) => ({
        ...prevStatus,
        [selectedVideo.name]: false,
      }));
      setOngoingConversions((prevCount) => prevCount - 1);
    } catch (error) {
      toast.error("Error Converting your file. Kindly refresh your page!");
    }
    
  };

  const handleSelectChange = (selectedOption, file) => {
    setFileOptionsMap((prevMap) => ({
      ...prevMap,
      [file.name]: selectedOption.value,
    }));
    setTaskStatus((prevStatus) => ({
      ...prevStatus,
      [file.name]: false,
    }));
    setDisabledButton((prevStatus) => ({
      ...prevStatus,
      [file.name]: false,
    }));
  };
 
  const handleclick = (file)=>{
                      if (taskStatus[file.name] && !isConverting[file.name]) {
                        // Call your download function here
                        downloadAudio(
                          data[file.name],
                          file,
                          fileOptionsMap[file.name]
                        );
                        setDisabledButton((prevStatus) => ({
                          ...prevStatus,
                          [file.name]: true,
                        }));
                      } else {
                        // Otherwise, proceed with the conversion
                        
                        if (ongoingConversions<2) {                         
                          handleConvert(file);
                        }else{
                          toast.warning('Maximum 2 conversions are allowed at a time. Kindly wait a bit!');

                        }
                      }
  }
  useEffect(() => {}, [fileOptionsMap]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const deleteAction = (fileToDelete) => {
    try {
      const updatedActions = actions.filter(
        (action) => action.file_name !== fileToDelete.name
      );

      const updatedFiles = files.filter(
        (file) => file.name !== fileToDelete.name
      );

      setActions(updatedActions);
      setFiles(updatedFiles);
      setTaskStatus((prevStatus) => ({
        ...prevStatus,
        [fileToDelete.name]: false,
      }));
      setDisabledButton((prevStatus) => ({
        ...prevStatus,
        [fileToDelete.name]: false,
      }));
    } catch (error) {
      toast.error("Error! Deleting file.");
    }
  };

  const { fileRejections, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".wma", ".flac", ".m4a", ".aiff", ".au", ".amr", ".midi", ".opus", ".pcm", ".alac", ".ape", ".dsd"],
        
      },
    });
  useEffect(() => {
    // Check if there are any file rejections
    if (fileRejections.length >0) {
      toast.error("Error! Only audios are allowed.");
      fileRejections.splice(0, fileRejections.length);
    }
  }, [fileRejections]);

  const load = async () => {
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setLoaded(true);
    } catch (error) {
      toast.error("Error! Please refresh the page and try again.");
    }
  };

  useEffect(() => {
    load()
      .then(() => {
        // Once data is loaded, set loaded to true
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []); // Empty dependency array means this effect runs only once after component mounts

  return loaded ? (
    <div className="dropzone-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <>
            <IoCloudUpload size={40} />
            <p id="dropboxtext">Drop the files here ...</p>
          </>
        ) : (
          <>
            <IoCloudUpload size={40} />
            <p id="dropboxtext">Click, or drop your Audios here</p>
          </>
        )}
      </div>

      {
        <div className="file-list">
         {files.length > 0 &&  <h4 style={{ color: "black", fontSize: "20px", fontWeight: "bold", marginLeft:'6px' }}>
            Accepted Files
          </h4>}
          <ul>
            {files.map((file, index) => (
              <li className="accepted-file" key={index} style={{ marginLeft:'6px', marginRight:'6px' }}>
                <div className="filenameandicon">
                  <MdAudiotrack className="videoicon" />
                  {file.name}
                </div>
                <div className="buttons">
                  {isConverting[file.name] ? (
                    <button type="button" id="rollingbutton" disabled>
                      <svg
                        className="animate-spin h-5 w-5 mr-3 ..."
                        viewBox="0 0 24 24"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              dur="0.75s"
                              values="0 12 12;360 12 12"
                              repeatCount="indefinite"
                            />
                          </path>
                        </svg>
                      </svg>
                    </button>
                  ) : (
                    ""
                  )}
                  
                  <button>
                    <Dropdown
                    // className="Dropdown-menu"
                      options={options}
                      value={defaultOption}
                      placeholder="Select an option"
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, file)
                      }
                    />
                  </button>

                  <button
                    onClick={() => handleclick(file)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2"
                    disabled={
                      isConverting[file.name] || disabledButton[file.name]
                    }
                  >
                    {!taskStatus[file.name] && isConverting[file.name]
                      ? // If taskStatus is false and isConverting is true, display "Processing"
                        "Processing"
                      : taskStatus[file.name] && !isConverting[file.name]
                      ? // If taskStatus is true and isConverting is false, display "Download"
                        "Download"
                      : // Otherwise, display "Convert"
                        "Convert"}
                  </button>

                  <button
                    onClick={() => deleteAction(file)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full m-2"
                    disabled={!taskStatus[file.name] && isConverting[file.name]}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircleLoader color="#050505" />
    </div>
  );
}

export default MyDropzone;
