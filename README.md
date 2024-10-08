
# Intellect AI

Intellect AI is a comprehensive AI-driven solution designed to revolutionize the digital content landscape. This project aims to simplify the content creation process by integrating advanced AI tools for video and image enhancement, making high-quality content creation accessible to a broader audience.

# Key Features

## Video Tools:
* Convert images to videos
* Add subtitles for accessibility
* Upscale video quality

## Image Tools:
* Text to Image Generation
* Image Restoration
* Image Upscaling
* Avatar Generation
* Generative Fill

## Community Features:
* Public sharing of images and videos
* Social media integration
* User profiles
* Following each others
* Collections for organizing posts

## Tech Stack

**Client:** Next.js, TailwindCSS, Next.ui, Cloudinary.

**Server:** Next.js, MongoDB, JWT, Nodemailer, Replicate (for **AI Models**).


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`

`JWT_SECRET`

`REPLICATE_API_TOKEN`

`CLOUDINARY_CLOUD_NAME`

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_APIKEY`

`NEXT_PUBLIC_CLOUDINARY_API_KEY`

`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

`CLOUDINARY_API_SECRET`

`APP_PASSWORD`

`EMAIL`

`APP_URL`

`NEXT_PUBLIC_APP_URL`
## Installation:

* Clone this repository
* Install necessary packages

```bash
  npm install 
```
## Running the Project:
* Start the Development Server:
Run the command ```npm run dev``` to start the development server. This will start the application in development mode, and you can access it at http://localhost:3000 in your browser.
* Start the Production Server:
Run the command ```npm run ready``` to start the production server. This will start the application in production mode, and you can access it at http://localhost:3000 in your browser.
* Docker:
  Start the docker
  Run the command
```bash
  docker run -it -e MONGODB_URI="value" -e JWT_SECRET="value" -e REPLICATE_API_TOKEN="value" -e CLOUDINARY_CLOUD_NAME="value" -e NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="value" -e CLOUDINARY_APIKEY="value" -e NEXT_PUBLIC_CLOUDINARY_API_KEY="value" -e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="value" -e CLOUDINARY_API_SECRET="value" -e APP_PASSWORD="value" -e EMAIL="value" -e APP_URL="value" -e NEXT_PUBLIC_APP_URL="value" -p 3000:3000 shubhobera09/intellect-ai
```

