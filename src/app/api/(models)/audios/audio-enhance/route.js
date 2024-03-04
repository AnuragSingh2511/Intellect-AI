import { ConnectDB } from "@/database";
import { UploadAudio } from "@/lib/cloudinary";
import { generateAccessToken } from "@/lib/token";
import { Audios } from "@/models/audios.models";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, audio } = await req.json();
    //Check if user id is available
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

        //Safety check
        const isUserExists = await User.findById(id);
        if (!isUserExists) {
          return NextResponse.json(
            { success: false, error: "Unauthorized access" },
            { status: 404 }
          );
        }

    //Check if access token is available
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      const { accessToken } = generateAccessToken({ id }, "1h");
      cookies().set("accessToken", accessToken);
    }

    //Generate audio
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "grandlineai/resemble-enhance:f0e3f284d0b4d696bc8f93ba6c2e51f6272191aeddf10e224ea8b2b026e211ed",
      {
        input: {
          solver: "Midpoint",
          input_file: audio,
          denoise_flag: false,
          prior_temperature: 0.5,
          number_function_evaluations: 64,
        },
      }
    );

    //Model will generate two audio files: denoised [0] and enhanced [1]

    // Save audio to Cloudinary
    let allAudios = await Promise.all(
      output.map(async (element) => {
        const result = await UploadAudio(element);
        console.log(result);
        return result?.url;
      })
    );

    //Save all audios to database
    const newAudio = new Audios({
      userId: id,
      url: JSON.stringify(allAudios),
    });

    await newAudio.save();

    const library = await Library.findOne({ userId: id });
    library.audios.push(newAudio._id);
    await library.save();

    return NextResponse.json(
      { success: true, data: newAudio },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};