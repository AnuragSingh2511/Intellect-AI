import { ConnectDB } from "@/database";
import { generateTokens } from "@/lib/token";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 }
      );
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const HashedPassword = await bcrypt.hash(password, 11);

    const username = email?.split("@")[0];

    const user = new User({
      name,
      email,
      username,
      password: HashedPassword,
    });

    await user.save();

    const { refreshToken } = generateTokens({ id: user._id }, "1h");
    user.refreshToken = refreshToken;
    await user.save();

    const library = new Library({ userId: user._id });
    user.library = library._id;
    await user.save();
    await library.save();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
