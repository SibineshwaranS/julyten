import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary inline
cloudinary.config({
  cloud_name: 'dyssdtvk5',
  api_key: '564315178677272',
  api_secret: '3EiI20tcI741KmpGbF1DRXhKP90'
});

// Sample image URL from Cloudinary demo domain
const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

async function run() {
  try {
    console.log("Uploading sample image...");
    // 2. Upload the image
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      public_id: 'cloudinary_test_sample'
    });
    console.log("Upload Success!");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    console.log("\nFetching image details...");
    // 3. Get image details
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log("Width:", details.width);
    console.log("Height:", details.height);
    console.log("Format:", details.format);
    console.log("File Size (bytes):", details.bytes);

    console.log("\nGenerating transformed image URL...");
    // 4. Transform the image
    // fetch_format: 'auto' (f_auto) -> Automatic format selection (delivers AVIF/WebP depending on browser support)
    // quality: 'auto' (q_auto) -> Automatic quality selection (optimizes compression without visible quality loss)
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      secure: true,
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
    console.log("Transformed URL:", transformedUrl);

  } catch (error) {
    console.error("Error running test script:", error);
  }
}

run();
