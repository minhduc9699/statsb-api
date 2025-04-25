import os

# Try importing MoviePy with updated v2.0+ syntax
try:
    from moviepy import VideoFileClip, vfx
except ImportError as e:
    print("Failed to import MoviePy. Ensure it's installed with 'pip install moviepy' and FFmpeg is available.")
    print(f"Error: {e}")
    exit(1)

# Directory containing the videos
VIDEO_DIR = r"E:\DUC\work\AI-Basketball-Referee\test_data\Koi - Pike"
OUTPUT_DIR = r"E:\DUC\work\AI-Basketball-Referee\test_data\Koi - Pike\chunks"
CHUNK_DURATION = 20  # Maximum duration of each chunk in seconds
RESOLUTION = (854, 480)  # Downscale to 480p
BITRATE = "500k"  # Lower bitrate to reduce file size

# Create output directory if it doesn't exist
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Get all video files from the directory
video_files = [f for f in os.listdir(VIDEO_DIR) if f.endswith(('.mp4', '.avi', '.mov'))]

# Check if any videos were found
if not video_files:
    print(f"No video files found in {VIDEO_DIR}. Please check the directory and file extensions.")
    exit(1)

# Process each video
for video_file in video_files:
    video_path = os.path.join(VIDEO_DIR, video_file)
    video_name = os.path.splitext(video_file)[0]  # Get video name without extension

    try:
        # Load the video
        clip = VideoFileClip(video_path)
        duration = clip.duration  # Duration in seconds
        print(f"Processing {video_file} with duration {duration} seconds")

        # Downscale the video using v2.0+ with_effects method
        clip = clip.with_effects([vfx.Resize(new_size=RESOLUTION)])

        # Calculate number of chunks
        num_chunks = int(duration // CHUNK_DURATION) + (1 if duration % CHUNK_DURATION else 0)
        print(f"Will create {num_chunks} chunks for {video_file}")

        # Split video into chunks
        for i in range(num_chunks):
            start_time = i * CHUNK_DURATION
            end_time = min((i + 1) * CHUNK_DURATION, duration)

            try:
                # Extract the chunk
                chunk = clip.subclipped(start_time, end_time)
                print(f"Extracted chunk {i}: {start_time}s to {end_time}s")

                # Define output filename (e.g., video1_chunk_0.mp4)
                output_filename = f"{video_name}_chunk_{i}.mp4"
                output_path = os.path.join(OUTPUT_DIR, output_filename)

                # Save the chunk with lower quality settings
                chunk.write_videofile(
                    output_path,
                    codec="libx264",
                    audio_codec="aac",
                    bitrate=BITRATE,
                    ffmpeg_params=["-preset", "fast"]
                )
                print(f"Saved chunk: {output_filename}")

                # Close the chunk to free memory
                chunk.close()

            except Exception as e:
                print(f"Error extracting chunk {i} for {video_file}: {e}")

        # Close the video clip to free memory
        clip.close()

    except Exception as e:
        print(f"Error processing {video_file}: {e}")

print("All videos have been chunked.")