import { ConnectDB } from "@/database";
import { generateAccessToken } from "@/lib/token";
import { Images } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, image, prompt } = await req.json();
    //Check if user id is available
    if (!id) {
      return NextResponse.json("Unauthorized access", { status: 404 });
    }

    //Check if access token is available
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      generateAccessToken({ id }, "1h");
    }

    //Generate image
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "tgohblio/instant-id-albedobase-xl:2a2afbff09996b53247b0714577d4ff82d2c9da8e8b00c5499b5b34510bb8b5e",
      {
        input: {
          image,
          width: 640,
          height: 640,
          prompt,
          guidance_scale: 0,
          safety_checker: true,
          negative_prompt: "",
          ip_adapter_scale: 0.2,
          num_inference_steps: 6,
          controlnet_conditioning_scale: 0.8,
        },
      }
    );

    const newImage = new Images({
      userId: id,
      url: output,
      prompt,
      miscData: {
        dimensions: "640 x 640",
        modelName: "Instant ID",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId: id });

    //Not possible still checking
    if (!library) {
      const newLibrary = new Library({
        userId: id,
        images: [newImage._id],
      });
      await newLibrary.save();
      return NextResponse.json("Image saved!", { status: 201 });
    }

    library.images.push(newImage._id);
    await library.save();

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
};
