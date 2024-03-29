import { fetchFile } from "@ffmpeg/util";
import { toast } from "react-toastify";

export const downloadAudio = async (
  data,
  selectedVideo,
  selectedOption = "mp3"
) => {
  if (!selectedVideo) return;

  try {
    const originalFileNameWithoutExtension = selectedVideo.name
      .split(".")
      .slice(0, -1)
      .join(".");
    const blob = new Blob([data.buffer], { type: `audio/${selectedOption}` }); // Use selected option here
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = `${originalFileNameWithoutExtension}.${selectedOption}`; // Use selected option here
    anchorElement.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("An error occured during audio download");
    // Handle the error here, e.g., show a user-friendly message or perform other actions
  }
};

function getFileExtension(fileName) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(fileName);
  if (match && match[1]) {
    return match[1];
  }
  return ""; // No file extension found
}

function removeFileExtension(fileName) {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return fileName.slice(0, lastDotIndex);
  }
  return fileName; // No file extension found
}

export const convertToAudio = async (
  selectedVideo,
  ffmpegRef,
  selectedOption = "mp3"
) => {
  let ffmpeg = ffmpegRef.current;
  //  ffmpeg.on("progress", ({ progress }) => {
  //   console.log(progress);
  // });

  let input = getFileExtension(selectedVideo.name);
  let output = removeFileExtension(selectedVideo.name) + "." + selectedOption;
  await ffmpeg.writeFile(input, await fetchFile(selectedVideo));

  // FFMEG COMMANDS
  let ffmpeg_cmd = [];
  if (input === "mp3" && selectedOption === "wav") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // This tells FFmpeg to ignore video stream
      "-ar",
      "441000a", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-ab",
      "128k", // Audio bitrate for MP3
      "-f",
      "mp3", // Output format
      output,
    ];
  } else if (input === "mp3" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for OGG
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for OGG (adjust as needed)
      "-f",
      "ogg", // Output format
      output,
    ];
  } else if (input === "mp3" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-f",
      "adts", // Output format for AAC (ADTS AAC)
      output,
    ];
  } else if (input === "mp3" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      "-f",
      "asf", // Output format for WMA (ASF)
      output,
    ];
  } else if (input === "mp3" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "mp3" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "mp3" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "wav" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "libvorbis", // Set the audio codec to Vorbis (OGG)
      "-q:a",
      "4", // Audio quality for OGG (adjust as needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "wav" && selectedOption === "wav") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "wav") {
    ffmpeg_cmd = ["-i", input, output];
  } else if (input === "ogg" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "ogg" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "aac" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "aac" && selectedOption === "wav") {
    ffmpeg_cmd = ["-i", input, output];
  } else if (input === "aac" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "libvorbis", // Set the audio codec to Vorbis (OGG)
      "-q:a",
      "4", // Audio quality for OGG (adjust as needed)
      output,
    ];
  } else if (input === "aac" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      output,
    ];
  } else if (input === "aac" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "aac" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "aac" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "wma" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "wma" && selectedOption === "wav") {
    ffmpeg_cmd = ["-i", input, output];
  } else if (input === "wma" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "libvorbis", // Set the audio codec to Vorbis (OGG)
      "-q:a",
      "4", // Audio quality for OGG (adjust as needed)
      output,
    ];
  } else if (input === "wma" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      output,
    ];
  } else if (input === "wma" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "wma" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "wma" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "flac" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "flac" && selectedOption === "wav") {
    ffmpeg_cmd = ["-i", input, output];
  } else if (input === "flac" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "libvorbis", // Set the audio codec to Vorbis (OGG)
      "-q:a",
      "4", // Audio quality for OGG (adjust as needed)
      output,
    ];
  } else if (input === "flac" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      output,
    ];
  } else if (input === "flac" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      output,
    ];
  } else if (input === "flac" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC (M4A typically contains AAC audio)
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      "-strict",
      "-2", // Use experimental AAC encoder (if needed)
      output,
    ];
  } else if (input === "flac" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "mp3") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-ar",
      "44100", // Sample rate for MP3
      "-ac",
      "2", // Number of audio channels (stereo)
      "-b:a",
      "128k", // Audio bitrate for MP3 (adjust as needed)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "wav") {
    ffmpeg_cmd = ["-i", input, output];
  } else if (input === "m4a" && selectedOption === "ogg") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "libvorbis", // Set the audio codec to Vorbis (OGG)
      "-q:a",
      "4", // Audio quality for OGG (adjust as needed)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "aac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "aac", // Set the audio codec to AAC
      "-b:a",
      "128k", // Audio bitrate for AAC (adjust as needed)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "wma") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "wmav2", // Set the audio codec to WMA v2
      "-b:a",
      "128k", // Audio bitrate for WMA (adjust as needed)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "flac") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "flac", // Set the audio codec to FLAC
      "-compression_level",
      "8", // Compression level for FLAC (adjust as needed)
      output,
    ];
  } else if (input === "m4a" && selectedOption === "m4a") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-vn", // Ignore video stream
      "-c:a",
      "copy", // Copy audio codec (no conversion)
      output,
    ];
  } else {
    ffmpeg_cmd = ["-i", input, output];
  }

  await ffmpeg.exec(ffmpeg_cmd);
  let data = await ffmpeg.readFile(output);
  return { data, selectedVideo };
};
